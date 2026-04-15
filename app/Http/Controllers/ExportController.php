<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Illuminate\Support\Str;

class ExportController extends Controller
{
    public function download()
    {
        $this->ensureQrTokens();

        $participants = Participant::orderBy('nama_lengkap')
            ->get(['nama_lengkap', 'no_hp_normalized', 'qr_token']);

        $spreadsheet = new Spreadsheet();

        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Daftar Peserta');
        $sheet->fromArray(['Nama Peserta', 'No WhatsApp', 'Link WhatsApp', 'Kode QR', 'Foto QR'], null, 'A1');

        $row = 2;
        foreach ($participants as $participant) {
            $waNumber = $this->formatWhatsAppNumber($participant->no_hp_normalized);
            $waLink = $this->buildWhatsAppLink($participant->no_hp_normalized);
            $qrImageUrl = $this->buildQrImageUrl($participant->qr_token);

            $sheet->setCellValue("A{$row}", $participant->nama_lengkap);
            $sheet->setCellValueExplicit("B{$row}", (string) $waNumber, DataType::TYPE_STRING);
            $sheet->setCellValue("C{$row}", $waLink);
            $sheet->setCellValue("D{$row}", $participant->qr_token);
            $sheet->setCellValue("E{$row}", $qrImageUrl);
            $row++;
        }

        foreach (range('A', 'E') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        $fileName = 'export_wa_'.now()->format('Ymd_His').'.xlsx';
        $tempFile = tempnam(sys_get_temp_dir(), 'wa_export_');

        $writer = new Xlsx($spreadsheet);
        $writer->save($tempFile);

        return response()->download($tempFile, $fileName)->deleteFileAfterSend(true);
    }

    public function downloadRecap()
    {
        $this->ensureQrTokens();

        $allParticipants = Participant::query()
            ->orderBy('nama_lengkap')
            ->get([
                'nama_lengkap',
                'kategori_peserta',
                'email_primary',
                'no_hp_normalized',
                'checked_in_at',
                'qr_token',
            ]);

        $attendedParticipants = Participant::query()
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
        $recapSheet->fromArray(['Nama Peserta', 'Kategori', 'Email', 'No WhatsApp', 'Status Kehadiran', 'Waktu Check-in (WIB)'], null, 'A1');

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

        $fileName = 'rekap_registrasi_'.now()->format('Ymd_His').'.xlsx';
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
