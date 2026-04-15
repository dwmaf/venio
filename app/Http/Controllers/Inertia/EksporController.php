<?php

namespace App\Http\Controllers\Inertia;

use App\Http\Controllers\Controller;
use App\Models\Participant;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Illuminate\Support\Str;

class EksporController extends Controller
{
    public function download()
    {
        $this->ensureOfflineQrTokens();

        $offlineParticipants = Participant::where('metode_kehadiran', 'OFFLINE')
            ->orderBy('nama_lengkap')
            ->get(['nama_lengkap', 'no_hp_normalized', 'qr_token']);

        $onlineParticipants = Participant::where('metode_kehadiran', 'ONLINE')
            ->orderBy('nama_lengkap')
            ->get(['nama_lengkap', 'no_hp_normalized', 'zoom_link']);

        $spreadsheet = new Spreadsheet();

        $offlineSheet = $spreadsheet->getActiveSheet();
        $offlineSheet->setTitle('Offline');
        $offlineSheet->fromArray(['Nama Peserta', 'No WhatsApp', 'Link WhatsApp', 'Kode QR', 'Foto QR'], null, 'A1');

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

        $onlineSheet = $spreadsheet->createSheet();
        $onlineSheet->setTitle('Online');
        $onlineSheet->fromArray(['Nama Peserta', 'No WhatsApp', 'Link WhatsApp', 'Link Zoom'], null, 'A1');

        $row = 2;
        foreach ($onlineParticipants as $participant) {
            $waNumber = $this->formatWhatsAppNumber($participant->no_hp_normalized);
            $waLink = $this->buildWhatsAppLink($participant->no_hp_normalized);

            $onlineSheet->setCellValue("A{$row}", $participant->nama_lengkap);
            $onlineSheet->setCellValueExplicit("B{$row}", (string) $waNumber, DataType::TYPE_STRING);
            $onlineSheet->setCellValue("C{$row}", $waLink);
            $onlineSheet->setCellValue("D{$row}", $participant->zoom_link);
            $row++;
        }

        foreach (range('A', 'E') as $column) {
            $offlineSheet->getColumnDimension($column)->setAutoSize(true);
        }

        foreach (range('A', 'D') as $column) {
            $onlineSheet->getColumnDimension($column)->setAutoSize(true);
        }

        $fileName = 'export_wa_'.now()->format('Ymd_His').'.xlsx';
        $tempFile = tempnam(sys_get_temp_dir(), 'wa_export_');

        $writer = new Xlsx($spreadsheet);
        $writer->save($tempFile);

        return response()->download($tempFile, $fileName)->deleteFileAfterSend(true);
    }

    public function downloadRecap()
    {
        $this->ensureOfflineQrTokens();

        $allParticipants = Participant::query()
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

        $attendedOffline = Participant::query()
            ->where('metode_kehadiran', 'OFFLINE')
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
            $isOffline = $participant->metode_kehadiran === 'OFFLINE';
            $attendanceStatus = $isOffline
                ? ($participant->checked_in_at ? 'Hadir' : 'Belum Hadir')
                : 'Peserta Online';
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
        foreach ($attendedOffline as $participant) {
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

        $fileName = 'rekap_registrasi_'.now()->format('Ymd_His').'.xlsx';
        $tempFile = tempnam(sys_get_temp_dir(), 'rekap_export_');

        $writer = new Xlsx($spreadsheet);
        $writer->save($tempFile);

        return response()->download($tempFile, $fileName)->deleteFileAfterSend(true);
    }

    private function ensureOfflineQrTokens(): void
    {
        Participant::where('metode_kehadiran', 'OFFLINE')
            ->whereNull('qr_token')
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
            $token = 'OFF-'.Str::upper(Str::random(12));
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
