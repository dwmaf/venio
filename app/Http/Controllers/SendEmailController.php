<?php

namespace App\Http\Controllers;

use App\Mail\QrMail;
use App\Mail\OnlineZoomMail;
use App\Models\EmailLog;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class SendEmailController extends Controller
{
    public function sendQr(Participant $participant)
    {
        if ($participant->metode_kehadiran !== 'OFFLINE') {
            return redirect()->route('events.index', $participant->event_id)
                ->with('error', 'Gagal mengirim QR. Peserta ini mendaftar dengan metode kehadiran ' . $participant->metode_kehadiran . ' (Bukan OFFLINE).');
        }

        if (! $participant->email_primary) {
            return redirect()->route('events.index', $participant->event->id)->with('error', 'Peserta ini belum memiliki email utama yang valid.');
        }

        $actor = $this->actorName();

        try {
            $this->dispatchQrEmail($participant, $actor);
        } catch (\Throwable $exception) {
            $this->logEmailFailure($participant, 'QR_EVENT', 'QR Check-in Peserta', $actor, $exception->getMessage());

            return redirect()->route('events.index', $participant->event->id)->with('error', $this->buildMailErrorMessage($exception, 'QR'));
        }

        return redirect()->route('events.index', $participant->event->id)->with('success', 'Email QR berhasil dikirim ke '.$participant->nama_lengkap.'.');
    }

    public function sendQrBulk(Request $request, Event $event)
    {
        $actor = $this->actorName();
        $total = 0;
        $sent = 0;
        $failed = 0;
        $skipped = 0;

        Participant::where('event_id', $event->id)
            ->where('metode_kehadiran', 'OFFLINE')
            ->orderBy('id')
            ->chunkById(100, function ($participants) use (&$total, &$sent, &$failed, &$skipped, $actor): void {
                foreach ($participants as $participant) {
                    $total++;

                    if (! $participant->email_primary) {
                        $skipped++;
                        $this->logEmailFailure($participant, 'QR_EVENT', 'QR Check-in Peserta Event', $actor, 'Email utama tidak tersedia.');
                        continue;
                    }

                    try {
                        $this->dispatchQrEmail($participant, $actor);
                        $sent++;
                    } catch (\Throwable $exception) {
                        $failed++;
                        $this->logEmailFailure($participant, 'QR_EVENT', 'QR Check-in Peserta Event', $actor, $exception->getMessage());
                    }
                }
            });

        return redirect()->route('events.index', $event->id)->with(
            'success',
            "Bulk kirim QR selesai. Target: {$total}, Berhasil: {$sent}, Gagal: {$failed}, Dilewati: {$skipped}."
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

            Mail::to($participant->email_primary)->queue(new QrMail($participant->fresh()));

            $participant->qr_sent_at = Carbon::now();
            $participant->save();

            EmailLog::create([
                'participant_id' => $participant->id,
                'email_type' => 'QR_EVENT',
                'recipient_email' => $participant->email_primary,
                'subject' => 'QR Check-in Peserta',
                'status' => 'SENT',
                'sent_at' => now(),
                'triggered_by' => $triggeredBy,
            ]);
        });
    }

    public function sendZoom(Request $request, Participant $participant)
    {
        $request->validate([
            'zoom_link' => 'required|url'
        ]);
        $zoomLink = $request->input('zoom_link');
        if ($participant->metode_kehadiran !== 'ONLINE') {
            return redirect()->route('events.index', $participant->event_id)
                ->with('error', 'Gagal mengirim Link Zoom. Peserta ini mendaftar dengan metode kehadiran ' . $participant->metode_kehadiran . ' (Bukan ONLINE).');
        }

        if (! $participant->email_primary) {
            return redirect()->route('events.index', $participant->event_id)->with('error', 'Peserta ini belum memiliki email utama yang valid.');
        }

        $participant->update([
            'zoom_link' => $zoomLink
        ]);

        $actor = $this->actorName();

        try {
            $this->dispatchZoomEmail($participant, $actor);
        } catch (\Throwable $exception) {
            $this->logEmailFailure($participant, 'ZOOM_EVENT', 'Link Zoom Peserta', $actor, $exception->getMessage());

            return redirect()->route('events.index', $participant->event_id)->with('error', $this->buildMailErrorMessage($exception, 'Zoom'));
        }

        return redirect()->route('events.index', $participant->event_id)->with('success', 'Email Link Zoom berhasil dikirim ke '.$participant->nama_lengkap.'.');
    }

    public function sendZoomBulk(Request $request, Event $event)
    {
        $request->validate([
            'zoom_link' => 'required|url'
        ]);

        $zoomLink = $request->input('zoom_link');
        $actor = $this->actorName();
        $total = 0;
        $sent = 0;
        $failed = 0;
        $skipped = 0;

        Participant::where('event_id', $event->id)
            ->where('metode_kehadiran', 'ONLINE')
            ->orderBy('id')
            ->chunkById(100, function ($participants) use (&$total, &$sent, &$failed, &$skipped, $actor, $zoomLink): void {
                foreach ($participants as $participant) {
                    $total++;

                    if (! $participant->email_primary) {
                        $skipped++;
                        $this->logEmailFailure($participant, 'ZOOM_EVENT', 'Link Zoom Peserta Event', $actor, 'Email utama tidak tersedia.');
                        continue;
                    }

                    $participant->update(['zoom_link' => $zoomLink]);

                    try {
                        $this->dispatchZoomEmail($participant, $actor);
                        $sent++;
                    } catch (\Throwable $exception) {
                        $failed++;
                        $this->logEmailFailure($participant, 'ZOOM_EVENT', 'Link Zoom Peserta Event', $actor, $exception->getMessage());
                    }
                }
            });

        return redirect()->route('events.index', $event->id)->with(
            'success',
            "Bulk kirim Zoom selesai. Target: {$total}, Berhasil: {$sent}, Gagal: {$failed}, Dilewati: {$skipped}."
        );
    }

    private function dispatchZoomEmail(Participant $participant, string $triggeredBy): void
    {
        DB::transaction(function () use ($participant, $triggeredBy): void {
            $participant->refresh();

            // Kirim email Zoom (Meneruskan participant dan string zoom_link ke konstruktor)
            Mail::to($participant->email_primary)->queue(new OnlineZoomMail($participant, $participant->zoom_link));

            // Perbarui waktu pengiriman
            $participant->zoom_sent_at = Carbon::now();
            $participant->save();

            // Catat ke email_logs
            EmailLog::create([
                'participant_id' => $participant->id,
                'email_type' => 'ZOOM_EVENT',
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
        return Auth::user()?->username ?? Auth::user()?->name ?? 'admin';
    }

    private function generateUniqueQrToken(): string
    {
        do {
            $token = 'EVT-'.Str::upper(Str::random(12));
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
