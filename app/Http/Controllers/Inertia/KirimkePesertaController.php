<?php

namespace App\Http\Controllers\Inertia;

use App\Http\Controllers\Controller;
use App\Mail\OfflineQrMail;
use App\Mail\OnlineZoomMail;
use App\Models\EmailLog;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class KirimkePesertaController extends Controller
{
    public function sendQr(Participant $participant)
    {
        if ($participant->metode_kehadiran !== 'OFFLINE') {
            return redirect()->route('inertia.dasbor')->with('error', 'QR hanya untuk peserta offline.');
        }

        if (! $participant->email_primary) {
            return redirect()->route('inertia.dasbor')->with('error', 'Peserta ini belum memiliki email utama yang valid.');
        }

        $actor = $this->actorName();

        try {
            $this->dispatchQrEmail($participant, $actor);
        } catch (\Throwable $exception) {
            $this->logEmailFailure($participant, 'QR_OFFLINE', 'QR Check-in Peserta Offline', $actor, $exception->getMessage());

            return redirect()->route('inertia.dasbor')->with('error', $this->buildMailErrorMessage($exception, 'QR'));
        }

        return redirect()->route('inertia.dasbor')->with('success', 'Email QR berhasil dikirim ke '.$participant->nama_lengkap.'.');
    }

    public function sendZoom(Request $request, Participant $participant)
    {
        if ($participant->metode_kehadiran !== 'ONLINE') {
            return redirect()->route('inertia.dasbor')->with('error', 'Link Zoom hanya untuk peserta online.');
        }

        $request->validate([
            'zoom_link' => ['nullable', 'url'],
        ]);

        $zoomLink = trim((string) $request->input('zoom_link', $participant->zoom_link ?? ''));

        if ($zoomLink === '') {
            return redirect()->route('inertia.dasbor')->with('error', 'Isi link Zoom terlebih dahulu sebelum mengirim.');
        }

        if (! $participant->email_primary) {
            return redirect()->route('inertia.dasbor')->with('error', 'Peserta ini belum memiliki email utama yang valid.');
        }

        $actor = $this->actorName();

        try {
            $this->dispatchZoomEmail($participant, $zoomLink, $actor);
        } catch (\Throwable $exception) {
            $this->logEmailFailure($participant, 'ZOOM_ONLINE', 'Link Zoom Peserta Online', $actor, $exception->getMessage());

            return redirect()->route('inertia.dasbor')->with('error', $this->buildMailErrorMessage($exception, 'Zoom'));
        }

        return redirect()->route('inertia.dasbor')->with('success', 'Email link Zoom berhasil dikirim ke '.$participant->nama_lengkap.'.');
    }

    public function sendQrBulk()
    {
        $actor = $this->actorName();
        $total = 0;
        $sent = 0;
        $failed = 0;
        $skipped = 0;

        Participant::where('metode_kehadiran', 'OFFLINE')
            ->orderBy('id')
            ->chunkById(100, function ($participants) use (&$total, &$sent, &$failed, &$skipped, $actor): void {
                foreach ($participants as $participant) {
                    $total++;

                    if (! $participant->email_primary) {
                        $skipped++;
                        $this->logEmailFailure($participant, 'QR_OFFLINE', 'QR Check-in Peserta Offline', $actor, 'Email utama tidak tersedia.');
                        continue;
                    }

                    try {
                        $this->dispatchQrEmail($participant, $actor);
                        $sent++;
                    } catch (\Throwable $exception) {
                        $failed++;
                        $this->logEmailFailure($participant, 'QR_OFFLINE', 'QR Check-in Peserta Offline', $actor, $exception->getMessage());
                    }
                }
            });

        return redirect()->route('inertia.dasbor')->with(
            'success',
            "Bulk kirim QR selesai. Target: {$total}, Berhasil: {$sent}, Gagal: {$failed}, Dilewati: {$skipped}."
        );
    }

    public function sendZoomBulk(Request $request)
    {
        $validated = $request->validate([
            'bulk_zoom_link' => ['required', 'url', 'max:2000'],
        ]);

        $zoomLink = trim($validated['bulk_zoom_link']);
        $actor = $this->actorName();
        $total = 0;
        $sent = 0;
        $failed = 0;
        $skipped = 0;

        Participant::where('metode_kehadiran', 'ONLINE')
            ->orderBy('id')
            ->chunkById(100, function ($participants) use (&$total, &$sent, &$failed, &$skipped, $zoomLink, $actor): void {
                foreach ($participants as $participant) {
                    $total++;

                    if (! $participant->email_primary) {
                        $skipped++;
                        $this->logEmailFailure($participant, 'ZOOM_ONLINE', 'Link Zoom Peserta Online', $actor, 'Email utama tidak tersedia.');
                        continue;
                    }

                    try {
                        $this->dispatchZoomEmail($participant, $zoomLink, $actor);
                        $sent++;
                    } catch (\Throwable $exception) {
                        $failed++;
                        $this->logEmailFailure($participant, 'ZOOM_ONLINE', 'Link Zoom Peserta Online', $actor, $exception->getMessage());
                    }
                }
            });

        return redirect()->route('inertia.dasbor')->with(
            'success',
            "Bulk kirim link Zoom selesai. Target: {$total}, Berhasil: {$sent}, Gagal: {$failed}, Dilewati: {$skipped}."
        );
    }

    private function dispatchQrEmail(Participant $participant, string $triggeredBy): void
    {
        DB::transaction(function () use ($participant, $triggeredBy): void {
            $participant->refresh();

            if (! $participant->qr_token) {
                $participant->qr_token = $this->generateUniqueQrToken();
                $participant->qr_generated_at = Carbon::now();
                $participant->save();
            }

            Mail::to($participant->email_primary)->send(new OfflineQrMail($participant->fresh()));

            $participant->qr_sent_at = Carbon::now();
            $participant->save();

            EmailLog::create([
                'participant_id' => $participant->id,
                'email_type' => 'QR_OFFLINE',
                'recipient_email' => $participant->email_primary,
                'subject' => 'QR Check-in Peserta Offline',
                'status' => 'SENT',
                'sent_at' => now(),
                'triggered_by' => $triggeredBy,
            ]);
        });
    }

    private function dispatchZoomEmail(Participant $participant, string $zoomLink, string $triggeredBy): void
    {
        DB::transaction(function () use ($participant, $zoomLink, $triggeredBy): void {
            $participant->zoom_link = $zoomLink;
            $participant->save();

            Mail::to($participant->email_primary)->send(new OnlineZoomMail($participant->fresh(), $zoomLink));

            $participant->zoom_sent_at = Carbon::now();
            $participant->save();

            EmailLog::create([
                'participant_id' => $participant->id,
                'email_type' => 'ZOOM_ONLINE',
                'recipient_email' => $participant->email_primary,
                'subject' => 'Link Zoom Peserta Online',
                'status' => 'SENT',
                'sent_at' => now(),
                'triggered_by' => $triggeredBy,
            ]);
        });
    }

    private function logEmailFailure(Participant $participant, string $emailType, string $subject, string $triggeredBy, string $errorMessage): void
    {
        EmailLog::create([
            'participant_id' => $participant->id,
            'email_type' => $emailType,
            'recipient_email' => $participant->email_primary ?: '-',
            'subject' => $subject,
            'status' => 'FAILED',
            'sent_at' => now(),
            'error_message' => $errorMessage,
            'triggered_by' => $triggeredBy,
        ]);
    }

    private function actorName(): string
    {
        return auth()->user()?->username ?? auth()->user()?->name ?? 'admin';
    }

    private function generateUniqueQrToken(): string
    {
        do {
            $token = 'OFF-'.Str::upper(Str::random(12));
        } while (Participant::where('qr_token', $token)->exists());

        return $token;
    }

    private function buildMailErrorMessage(\Throwable $exception, string $mailType): string
    {
        $raw = strtolower($exception->getMessage());

        if (str_contains($raw, '535') || str_contains($raw, 'username and password not accepted')) {
            return "Gagal mengirim email {$mailType}: autentikasi SMTP gagal. Pastikan MAIL_USERNAME dan MAIL_PASSWORD (App Password Gmail) benar.";
        }

        if (str_contains($raw, 'connection could not be established') || str_contains($raw, 'timed out')) {
            return "Gagal mengirim email {$mailType}: tidak bisa terhubung ke server SMTP. Cek MAIL_HOST, MAIL_PORT, dan koneksi internet server.";
        }

        return "Gagal mengirim email {$mailType}. Silakan cek konfigurasi SMTP dan log aplikasi.";
    }
}
