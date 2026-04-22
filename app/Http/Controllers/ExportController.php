<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use App\Models\Event;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Illuminate\Support\Str;

class ExportController extends Controller
{
    public function download(Event $event)
    {
        $this->ensureQrTokens($event);

        $spreadsheet = new Spreadsheet();
        // Hapus sheet default yang kosong
        $spreadsheet->removeSheetByIndex(0);

        $participants = Participant::where('event_id', $event->id)
            ->orderBy('nama_lengkap')
            ->get(['nama_lengkap', 'no_hp_normalized', 'qr_token', 'zoom_link', 'metode_kehadiran']);

        

        // Jika event OFFLINE atau HYBRID, buat sheet Offline
        if (in_array($event->tipe_event, ['OFFLINE', 'HYBRID'])) {
            $offlineSheet = $spreadsheet->createSheet();
            $offlineSheet->setTitle('Peserta Offline');
            $offlineSheet->fromArray(['Nama Peserta', 'No WhatsApp', 'Link WhatsApp', 'Kode QR', 'Foto QR'], null, 'A1');

            $offlineParticipants = $participants->where('metode_kehadiran', 'OFFLINE');
            $row = 2;
            foreach ($offlineParticipants as $participant) {
                $waNumber = $this->formatWhatsAppNumber($participant->no_hp_normalized);
                $waLink = $this->buildWhatsAppLink($participant->no_hp_normalized);
                $qrImageUrl = $this->buildQrImageUrl($participant->qr_token);

                $offlineSheet->setCellValue("A{$row}", $participant->nama_lengkap);
                $offlineSheet->setCellValueExplicit("B{$row}", (string) $waNumber, DataType::TYPE_STRING);
                $offlineSheet->setCellValue("C{$row}", $waLink);
                $offlineSheet->setCellValue("D{$row}", $participant->qr_token);
                $offlineSheet->setCellValue("E{$row}", $qrImageUrl);
                $row++;
            }

            foreach (range('A', 'E') as $column) {
                $offlineSheet->getColumnDimension($column)->setAutoSize(true);
            }
        }

        // Jika event ONLINE atau HYBRID, buat sheet Online
        if (in_array($event->tipe_event, ['ONLINE', 'HYBRID'])) {
            // Jika ini sheet pertama yang dibuat (karena eventnya murni ONLINE), id indexnya 0
            $onlineSheet = $spreadsheet->createSheet();
            $onlineSheet->setTitle('Peserta Online');
            $onlineSheet->fromArray(['Nama Peserta', 'No WhatsApp', 'Link WhatsApp', 'Link Zoom'], null, 'A1');

            $onlineParticipants = $participants->where('metode_kehadiran', 'ONLINE');
            $row = 2;
            foreach ($onlineParticipants as $participant) {
                $waNumber = $this->formatWhatsAppNumber($participant->no_hp_normalized);
                $waLink = $this->buildWhatsAppLink($participant->no_hp_normalized);

                $onlineSheet->setCellValue("A{$row}", $participant->nama_lengkap);
                $onlineSheet->setCellValueExplicit("B{$row}", (string) $waNumber, DataType::TYPE_STRING);
                $onlineSheet->setCellValue("C{$row}", $waLink);
                $onlineSheet->setCellValue("D{$row}", $participant->zoom_link ?? '-');
                $row++;
            }

            foreach (range('A', 'D') as $column) {
                $onlineSheet->getColumnDimension($column)->setAutoSize(true);
            }
        }

        // Set sheet pertama menjadi aktif agar saat dibuka tidak di sheet kosong
        $spreadsheet->setActiveSheetIndex(0);

        // Format Nama File sesuai request
        $safeEventName = Str::slug($event->nama_event);
        $tipeEvent = strtolower($event->tipe_event);
        $date = now()->format('Ymd_His');
        $fileName = "export_wa_{$safeEventName}_{$tipeEvent}_{$date}.xlsx";
        $tempFile = tempnam(sys_get_temp_dir(), 'wa_export_');

        $writer = new Xlsx($spreadsheet);
        $writer->save($tempFile);

        return response()->download($tempFile, $fileName)->deleteFileAfterSend(true);
    }

    public function downloadRecap(Event $event)
    {
        $this->ensureQrTokens($event);

        $allParticipants = Participant::where('event_id', $event->id)
            ->orderBy('nama_lengkap')
            ->get([
                'nama_lengkap',
                'metode_kehadiran',
                'kategori_peserta',
                'email_primary',
                'no_hp_normalized',
                'checked_in_at',
                'qr_token',
            ]);

        $attendedParticipants = Participant::where('event_id', $event->id)
            ->whereNotNull('checked_in_at')
            ->orderBy('checked_in_at')
            ->get([
                'nama_lengkap',
                'email_primary',
                'no_hp_normalized',
                'checked_in_at',
                'qr_token',
            ]);

        $spreadsheet = new Spreadsheet();

        $recapSheet = $spreadsheet->getActiveSheet();
        $recapSheet->setTitle('Rekap Registrasi');
        $recapSheet->fromArray(['Nama Peserta', 'Metode', 'Kategori', 'Email', 'No WhatsApp', 'Status Kehadiran', 'Waktu Check-in (WIB)'], null, 'A1');

        $row = 2;
        foreach ($allParticipants as $participant) {
            $attendanceStatus = $participant->checked_in_at ? 'Hadir' : 'Belum Hadir';
            $checkedInAtWib = $participant->checked_in_at
                ? $participant->checked_in_at->timezone('Asia/Jakarta')->format('d-m-Y H:i:s')
                : '-';

            $recapSheet->setCellValue("A{$row}", $participant->nama_lengkap);
            $recapSheet->setCellValue("B{$row}", $participant->metode_kehadiran);
            $recapSheet->setCellValue("C{$row}", $participant->kategori_peserta);
            $recapSheet->setCellValue("D{$row}", $participant->email_primary);
            $recapSheet->setCellValueExplicit("E{$row}", (string) $this->formatWhatsAppNumber($participant->no_hp_normalized), DataType::TYPE_STRING);
            $recapSheet->setCellValue("F{$row}", $attendanceStatus);
            $recapSheet->setCellValue("G{$row}", $checkedInAtWib);
            $row++;
        }

        $attendedSheet = $spreadsheet->createSheet();
        $attendedSheet->setTitle('Hadir Offline');
        $attendedSheet->fromArray(['Nama Peserta', 'Email', 'No WhatsApp', 'Waktu Check-in (WIB)', 'Token QR'], null, 'A1');

        $row = 2;
        foreach ($attendedParticipants as $participant) {
            $checkedInAtWib = $participant->checked_in_at
                ? $participant->checked_in_at->timezone('Asia/Jakarta')->format('d-m-Y H:i:s')
                : '-';

            $attendedSheet->setCellValue("A{$row}", $participant->nama_lengkap);
            $attendedSheet->setCellValue("B{$row}", $participant->email_primary);
            $attendedSheet->setCellValueExplicit("C{$row}", (string) $this->formatWhatsAppNumber($participant->no_hp_normalized), DataType::TYPE_STRING);
            $attendedSheet->setCellValue("D{$row}", $checkedInAtWib);
            $attendedSheet->setCellValue("E{$row}", $participant->qr_token);
            $row++;
        }

        foreach (range('A', 'G') as $column) {
            $recapSheet->getColumnDimension($column)->setAutoSize(true);
        }

        foreach (range('A', 'E') as $column) {
            $attendedSheet->getColumnDimension($column)->setAutoSize(true);
        }

        $safeEventName = Str::slug($event->nama_event);
        $tipeEvent = strtolower($event->tipe_event);
        $date = now()->format('Ymd_His');
        $fileName = "rekap_registrasi_{$safeEventName}_{$tipeEvent}_{$date}.xlsx";
        $tempFile = tempnam(sys_get_temp_dir(), 'rekap_export_');

        $writer = new Xlsx($spreadsheet);
        $writer->save($tempFile);

        return response()->download($tempFile, $fileName)->deleteFileAfterSend(true);
    }

    private function ensureQrTokens(): void
    {
        Participant::whereNull('qr_token')
            ->orderBy('id')
            ->chunkById(100, function ($participants): void {
                foreach ($participants as $participant) {
                    $participant->qr_token = $this->generateUniqueQrToken();
                    $participant->qr_generated_at = $participant->qr_generated_at ?? now();
                    $participant->save();
                }
            });
    }

    private function generateUniqueQrToken(): string
    {
        do {
            $token = 'EVT-'.Str::upper(Str::random(12));
        } while (Participant::where('qr_token', $token)->exists());

        return $token;
    }

    private function formatWhatsAppNumber(?string $number): string
    {
        if (! $number) {
            return '-';
        }

        $digitsOnly = preg_replace('/\D+/', '', $number);
        if (! $digitsOnly) {
            return '-';
        }

        if (Str::startsWith($digitsOnly, '0')) {
            $digitsOnly = '62'.substr($digitsOnly, 1);
        }

        if (! Str::startsWith($digitsOnly, '62')) {
            $digitsOnly = '62'.$digitsOnly;
        }

        return '+'.$digitsOnly;
    }

    private function buildWhatsAppLink(?string $number): ?string
    {
        $formatted = $this->formatWhatsAppNumber($number);
        if ($formatted === '-') {
            return null;
        }

        return 'https://wa.me/'.ltrim($formatted, '+');
    }

    private function buildQrImageUrl(?string $token): ?string
    {
        if (! $token) {
            return null;
        }

        return 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data='.rawurlencode($token);
    }
}
