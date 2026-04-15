<?php

namespace App\Http\Controllers\Inertia;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class ImporPesertaController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'csv_file' => ['required', 'file', 'mimes:csv,txt', 'max:10240'],
        ]);

        $handle = fopen($request->file('csv_file')->getRealPath(), 'r');

        if (! $handle) {
            return redirect()->route('inertia.dasbor')->with('error', 'Gagal membaca file CSV.');
        }

        try {
            [$inserted, $updated, $skipped] = $this->importFromHandle($handle);
        } catch (\Throwable $exception) {
            fclose($handle);

            return redirect()->route('inertia.dasbor')->with('error', 'Import gagal: '.$exception->getMessage());
        }

        fclose($handle);

        $message = "Import selesai. Baru: {$inserted}, Diperbarui: {$updated}, Dilewati: {$skipped}.";

        return redirect()->route('inertia.dasbor')->with('success', $message);
    }

    public function storeFromSheet(Request $request)
    {
        $validated = $request->validate([
            'sheet_url' => ['nullable', 'url', 'max:2000'],
        ]);

        $sourceUrl = trim((string) ($validated['sheet_url'] ?? config('services.google_sheet.url', '')));

        if ($sourceUrl === '') {
            return redirect()->route('inertia.dasbor')->with('error', 'Link Google Spreadsheet belum diisi.');
        }

        $csvUrl = $this->buildCsvUrl($sourceUrl);

        try {
            $response = Http::timeout((int) config('services.google_sheet.timeout', 20))->get($csvUrl);
        } catch (\Throwable $exception) {
            return redirect()->route('inertia.dasbor')->with('error', 'Gagal mengambil data spreadsheet: '.$exception->getMessage());
        }

        if (! $response->successful()) {
            return redirect()->route('inertia.dasbor')->with('error', 'Gagal mengambil spreadsheet. Status HTTP: '.$response->status());
        }

        $content = $response->body();
        if (trim($content) === '') {
            return redirect()->route('inertia.dasbor')->with('error', 'Spreadsheet kosong atau tidak dapat dibaca sebagai CSV.');
        }

        $handle = fopen('php://temp', 'r+');

        if (! $handle) {
            return redirect()->route('inertia.dasbor')->with('error', 'Gagal menyiapkan parser CSV untuk spreadsheet.');
        }

        fwrite($handle, $content);
        rewind($handle);

        try {
            [$inserted, $updated, $skipped] = $this->importFromHandle($handle);
        } catch (\Throwable $exception) {
            fclose($handle);

            return redirect()->route('inertia.dasbor')->with('error', 'Import dari spreadsheet gagal: '.$exception->getMessage());
        }

        fclose($handle);

        $message = "Import spreadsheet selesai. Baru: {$inserted}, Diperbarui: {$updated}, Dilewati: {$skipped}.";

        return redirect()->route('inertia.dasbor')->with('success', $message);
    }

    private function importFromHandle($handle): array
    {
        $headers = $this->readCsvRow($handle);

        if ($headers === false) {
            throw new \RuntimeException('Header CSV tidak ditemukan.');
        }

        $normalizedHeaders = array_map(fn ($header) => $this->normalizeHeader((string) $header), $headers);

        $inserted = 0;
        $updated = 0;
        $skipped = 0;

        while (($row = $this->readCsvRow($handle)) !== false) {
            $rowData = [];
            foreach ($normalizedHeaders as $index => $normalizedHeader) {
                $rowData[$normalizedHeader] = $row[$index] ?? null;
            }

            $mapped = $this->mapRow($rowData);

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

    private function readCsvRow($handle): array|false
    {
        return fgetcsv($handle, 0, ',', '"', '\\');
    }

    private function buildCsvUrl(string $sourceUrl): string
    {
        if (Str::contains($sourceUrl, ['/export?format=csv', '/gviz/tq'])) {
            return $sourceUrl;
        }

        if (preg_match('#/spreadsheets/d/([a-zA-Z0-9-_]+)#', $sourceUrl, $matches) === 1) {
            return 'https://docs.google.com/spreadsheets/d/'.$matches[1].'/export?format=csv';
        }

        return $sourceUrl;
    }

    private function mapRow(array $row): ?array
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

        $metodeRaw = trim((string) $this->value($row, ['metode kehadiran']));
        $metodeKehadiran = Str::contains(Str::lower($metodeRaw), 'online') ? 'ONLINE' : 'OFFLINE';

        $noHpRaw = trim((string) $this->value($row, ['no hp - whatsapp aktif']));
        $noHpNormalized = $this->normalizePhone($noHpRaw);

        $consentRaw = Str::lower(trim((string) $this->value($row, ['saya menyatakan data yang diisi sudah benar'])));
        $persetujuanData = Str::contains($consentRaw, 'ya');

        $dedupeKeyHash = hash('sha256', Str::lower($namaLengkap).'|'.$emailPrimary.'|'.$metodeKehadiran);

        return [
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
            'metode_kehadiran' => $metodeKehadiran,
            'kategori_biaya' => $this->nullableTrim($this->value($row, ['kategori biaya'])),
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
            return '62'.substr($digitsOnly, 1);
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
}
