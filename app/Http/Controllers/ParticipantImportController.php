<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ParticipantImportController extends Controller
{
    public function store(Request $request)
    {
        // dd($request);
        $request->validate([
            'csv_file' => ['required', 'file', 'mimes:csv,txt', 'max:10240'],
            'event_id' => ['required', 'exists:events,id'],
        ]);

        $eventId = $request->input('event_id');
        $handle = fopen($request->file('csv_file')->getRealPath(), 'r');

        if (! $handle) {
            return redirect()->route('events.index', $eventId)->with('error', 'Gagal membaca file CSV.');
        }

        try {
            [$inserted, $updated, $skipped] = $this->importFromHandle($handle, $eventId);
        } catch (\Throwable $exception) {
            fclose($handle);

            return redirect()->route('events.index', $eventId)->with('error', 'Import gagal: ' . $exception->getMessage());
        }

        fclose($handle);

        $message = "Import selesai. Baru: {$inserted}, Diperbarui: {$updated}, Dilewati: {$skipped}.";

        return redirect()->route('events.index', $eventId)->with('success', $message);
    }

    public function storeFromSheet(Request $request)
    {
        $validated = $request->validate([
            'sheet_url' => ['nullable', 'url', 'max:2000'],
            'event_id'  => ['required', 'exists:events,id'],
        ]);

        $sourceUrl = trim((string) ($validated['sheet_url'] ?? config('services.google_sheet.url', '')));
        $eventId = $validated['event_id'];

        if ($sourceUrl === '') {
            return redirect()->route('events.index', $eventId)->with('error', 'Link Google Spreadsheet belum diisi.');
        }

        $csvUrl = $this->buildCsvUrl($sourceUrl);

        try {
            $response = Http::timeout((int) config('services.google_sheet.timeout', 20))->get($csvUrl);
        } catch (\Throwable $exception) {
            return redirect()->route('events.index', $eventId)->with('error', 'Gagal mengambil data spreadsheet: ' . $exception->getMessage());
        }

        if (! $response->successful()) {
            $status = $response->status();
            $errorMessage = "Gagal mengambil spreadsheet (Status: {$status}). ";

            if ($status === 401 || $status === 403) {
                $errorMessage .= "Akses ditolak. Pastikan Spreadsheet sudah diatur ke 'Anyone with the link' (Siapa saja yang memiliki link) dan bisa dilihat publik.";
            } elseif ($status === 404) {
                $errorMessage .= "File tidak ditemukan. Periksa kembali link spreadsheet Anda.";
            } elseif ($status === 429) {
                // Menangani limit dari Google
                $errorMessage .= "Terlalu banyak permintaan (Rate Limit). Silakan tunggu beberapa menit sebelum mencoba lagi.";
            } else {
                $errorMessage .= "Terjadi kesalahan pada server Google.";
            }
            return redirect()->route('events.index', $eventId)->with('error', $errorMessage);
        }

        $content = $response->body();
        if (trim($content) === '') {
            return redirect()->route('events.index', $eventId)->with('error', 'Spreadsheet kosong atau tidak dapat dibaca sebagai CSV.');
        }

        $handle = fopen('php://temp', 'r+');

        if (! $handle) {
            return redirect()->route('events.index', $eventId)->with('error', 'Gagal menyiapkan parser CSV untuk spreadsheet.');
        }

        fwrite($handle, $content);
        rewind($handle);

        try {
            [$inserted, $updated, $skipped] = $this->importFromHandle($handle, $eventId);
        } catch (\Throwable $exception) {
            fclose($handle);

            return redirect()->route('events.index', $eventId)->with('error', 'Import dari spreadsheet gagal: ' . $exception->getMessage());
        }

        fclose($handle);

        $message = "Import spreadsheet selesai. Baru: {$inserted}, Diperbarui: {$updated}, Dilewati: {$skipped}.";

        return redirect()->route('events.index', $eventId)->with('success', $message);
    }

    private function importFromHandle($handle, $eventId): array
    {
        // Deteksi pemisah (delimiter) CSV secara otomatis
        $firstLine = fgets($handle);
        if ($firstLine === false) {
            throw new \RuntimeException('File CSV kosong.');
        }
        rewind($handle);

        $delimiter = ',';
        $commaCount = substr_count($firstLine, ',');
        $semicolonCount = substr_count($firstLine, ';');
        $tabCount = substr_count($firstLine, "\t");

        if ($semicolonCount > $commaCount && $semicolonCount > $tabCount) {
            $delimiter = ';';
        } elseif ($tabCount > $commaCount && $tabCount > $semicolonCount) {
            $delimiter = "\t";
        }

        $headers = $this->readCsvRow($handle, $delimiter);

        if ($headers === false) {
            throw new \RuntimeException('Header CSV tidak ditemukan.');
        }

        $normalizedHeaders = array_map(fn($header) => $this->normalizeHeader((string) $header), $headers);

        $inserted = 0;
        $updated = 0;
        $skipped = 0;


        while (($row = $this->readCsvRow($handle, $delimiter)) !== false) {
            $rowData = [];
            foreach ($normalizedHeaders as $index => $normalizedHeader) {
                $rowData[$normalizedHeader] = $row[$index] ?? null;
            }

            $mapped = $this->mapRow($rowData, $eventId);

            if ($mapped === null) {
                $skipped++;
                continue;
            }

            $participant = Participant::where('dedupe_key_hash', $mapped['dedupe_key_hash'])->first();

            if ($participant) {
                $participant->fill($mapped)->save();
                $updated++;
            } else {
                Participant::create($mapped);
                $inserted++;
            }
        }

        return [$inserted, $updated, $skipped];
    }

    private function readCsvRow($handle, $delimiter = ','): array|false
    {
        return fgetcsv($handle, 0, $delimiter, '"', '\\');
    }

    private function buildCsvUrl(string $sourceUrl): string
    {
        if (Str::contains($sourceUrl, ['/export?format=csv', '/gviz/tq'])) {
            return $sourceUrl;
        }

        if (preg_match('#/spreadsheets/d/([a-zA-Z0-9-_]+)#', $sourceUrl, $matches) === 1) {
            return 'https://docs.google.com/spreadsheets/d/' . $matches[1] . '/export?format=csv';
        }

        return $sourceUrl;
    }

    private function mapRow(array $row, $eventId): ?array
    {
        $namaLengkap = trim((string) $this->value($row, ['nama lengkap']));
        $emailAddressRaw = trim((string) $this->value($row, ['email address']));
        $emailAktifRaw = trim((string) $this->value($row, ['email aktif']));

        $emailAddress = $this->cleanEmail($emailAddressRaw);
        $emailAktif = $this->cleanEmail($emailAktifRaw);
        $emailPrimary = $emailAktif ?: $emailAddress;

        if ($namaLengkap === '' || $emailPrimary === null) {
            return null;
        }

        $noHpRaw = trim((string) $this->value($row, ['no hp - whatsapp aktif']));
        $noHpNormalized = $this->normalizePhone($noHpRaw);

        $metodeRaw = Str::lower(trim((string) $this->value($row, ['metode kehadiran'])));
        $metodeKehadiran = 'OFFLINE'; // default
        if (Str::contains($metodeRaw, 'online')) {
            $metodeKehadiran = 'ONLINE';
        }

        $consentRaw = Str::lower(trim((string) $this->value($row, ['saya menyatakan data yang diisi sudah benar'])));
        $persetujuanData = Str::contains($consentRaw, 'ya');

        $dedupeKeyHash = hash('sha256', $eventId . '|' . Str::lower($namaLengkap) . '|' . $emailPrimary);

        return [
            'event_id' => $eventId,
            'form_timestamp' => $this->parseDate($this->value($row, ['timestamp'])),
            'email_address_raw' => $emailAddressRaw !== '' ? $emailAddressRaw : null,
            'email_active_raw' => $emailAktifRaw !== '' ? $emailAktifRaw : null,
            'email_primary' => $emailPrimary,
            'nama_lengkap' => $namaLengkap,
            'jenis_kelamin' => $this->nullableTrim($this->value($row, ['jenis kelamin'])),
            'no_hp_raw' => $noHpRaw !== '' ? $noHpRaw : null,
            'no_hp_normalized' => $noHpNormalized,
            'kategori_peserta' => $this->nullableTrim($this->value($row, ['kategori peserta'])),
            'spesialisasi' => $this->nullableTrim($this->value($row, ['spesialisasi (jika ada)'])),
            'instansi' => $this->nullableTrim($this->value($row, ['instansi / tempat kerja'])),
            'alamat_instansi' => $this->nullableTrim($this->value($row, ['alamat instansi'])),
            'kategori_biaya' => $this->nullableTrim($this->value($row, ['kategori biaya'])),
            'metode_kehadiran' => $metodeKehadiran,
            'payment_proof_url' => $this->nullableTrim($this->value($row, ['upload bukti pembayaran'])),
            'persetujuan_data' => $persetujuanData,
            'zoom_link' => null,
            'dedupe_key_hash' => $dedupeKeyHash,
            'raw_payload_json' => $row,
        ];
    }

    private function normalizeHeader(string $header): string
    {
        return trim(Str::of($header)
            ->replaceMatches('/\s+/', ' ')
            ->lower()
            ->trim()
            ->value(), " \t\n\r\0\x0B,");
    }

    private function value(array $row, array $keys): ?string
    {
        foreach ($keys as $key) {
            $normalizedKey = $this->normalizeHeader($key);
            if (array_key_exists($normalizedKey, $row)) {
                return $row[$normalizedKey] !== null ? (string) $row[$normalizedKey] : null;
            }
        }

        return null;
    }

    private function parseDate(?string $value): ?string
    {
        if ($value === null || trim($value) === '') {
            return null;
        }

        $value = trim($value);

        try {
            return Carbon::createFromFormat('d/m/Y G:i:s', $value)->toDateTimeString();
        } catch (\Throwable) {
            try {
                return Carbon::parse($value)->toDateTimeString();
            } catch (\Throwable) {
                return null;
            }
        }
    }

    private function cleanEmail(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $email = strtolower(trim($value));

        return filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : null;
    }

    private function normalizePhone(?string $phone): ?string
    {
        if ($phone === null) {
            return null;
        }

        $digitsOnly = preg_replace('/\D+/', '', $phone);

        if (! $digitsOnly) {
            return null;
        }

        if (Str::startsWith($digitsOnly, '0')) {
            return '62' . substr($digitsOnly, 1);
        }

        return $digitsOnly;
    }

    private function nullableTrim(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $trimmed = trim($value);

        return $trimmed === '' ? null : $trimmed;
    }

    public function downloadTemplate()
    {
        $headers = [
            'Timestamp',
            'Nama Lengkap',
            'Email Address',
            'No HP - Whatsapp aktif',
            'Metode Kehadiran',
            'Kategori Peserta',
            'Instansi / Tempat Kerja',
            'Jenis Kelamin',
        ];

        $exampleData1 = [
            '18/05/2026 10:00:00',      // Timestamp
            'Syariffullah',             // Nama Lengkap
            'd1041231018@student.untan.ac.id', // Email Address
            '081234567890',             // No HP
            'OFFLINE',                  // Metode Kehadiran (OFFLINE/ONLINE)
            'Mahasiswa',              // Kategori Peserta
            'Universitas Tanjungpura',     // Instansi
            'Laki-laki',                // Jenis Kelamin
        ];

        $exampleData2 = [
            '18/05/2026 11:30:00',
            'Abimanyu Ridho',
            'd1041231038@student.untan.ac.id',
            '08987654321',
            'ONLINE',
            'Mahasiswa',
            'Universitas Tanjungpura',
            'Perempuan',
        ];

        $exampleData3 = [
            '18/05/2026 11:30:00',
            'Rayhan Nuerjamman',
            'd1041231088@student.untan.ac.id',
            '08987654321',
            'ONLINE',
            'Mahasiswa',
            'Universitas Tanjungpura',
            'Laki-laki',
        ];

        $filename = "template_import_peserta.csv";
        $handle = fopen('php://output', 'w');

        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $filename . '"');

        fputcsv($handle, $headers);
        fputcsv($handle, $exampleData1);
        fputcsv($handle, $exampleData2);
        fputcsv($handle, $exampleData3);
        fclose($handle);

        return exit;
    }
}
