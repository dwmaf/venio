<?php

namespace App\Http\Controllers;

use App\Models\CheckinScan;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckinController extends Controller
{
    public function index(Request $request)
    {
        $event = null;
        
        // Jika ada query ?event_id=... di URL, ambil data event-nya
        if ($request->has('event_id')) {
            $event = \App\Models\Event::find($request->event_id);
        }

        return Inertia::render('Checkin', [
            'event' => $event
        ]);
    }

    public function scan(Request $request)
    {
        $validated = $request->validate([
            'token' => ['required', 'string', 'max:120'],
            'scanner_info' => ['nullable', 'string', 'max:255'],
        ]);

        $token = trim($validated['token']);

        $participant = Participant::with('event')->where('qr_token', $token)->first();

        if (! $participant) {
            CheckinScan::create([
                'participant_id' => null,
                'scanned_token' => $token,
                'result' => 'INVALID',
                'scanned_at' => now(),
                'scanner_info' => $validated['scanner_info'] ?? null,
                'notes' => 'Token tidak ditemukan',
            ]);

            return response()->json([
                'status' => 'INVALID',
                'message' => 'QR tidak dikenal.',
            ]);
        }

        $eventName = $participant->event ? $participant->event->nama_event : 'Event Tidak Diketahui';

        if ($participant->checked_in_at) {
            CheckinScan::create([
                'participant_id' => $participant->id,
                'scanned_token' => $token,
                'result' => 'DUPLICATE',
                'scanned_at' => now(),
                'scanner_info' => $validated['scanner_info'] ?? null,
                'notes' => 'Scan duplikat',
            ]);

            return response()->json([
                'status' => 'DUPLICATE',
                'message' => 'Peserta sudah check-in sebelumnya.',
                'participant_name' => $participant->nama_lengkap,
                'eventName' => $eventName,
                'checked_in_at' => $participant->checked_in_at->format('d-m-Y H:i:s'),
            ]);
        }

        $updated = DB::transaction(function () use ($participant, $token, $validated) {
            $affectedRows = Participant::whereKey($participant->id)
                ->whereNull('checked_in_at')
                ->update(['checked_in_at' => now()]);

            if ($affectedRows === 1) {
                CheckinScan::create([
                    'participant_id' => $participant->id,
                    'scanned_token' => $token,
                    'result' => 'VALID',
                    'scanned_at' => now(),
                    'scanner_info' => $validated['scanner_info'] ?? null,
                ]);
            }

            return $affectedRows;
        });

        if ($updated === 0) {
            $freshParticipant = Participant::find($participant->id);

            CheckinScan::create([
                'participant_id' => $participant->id,
                'scanned_token' => $token,
                'result' => 'DUPLICATE',
                'scanned_at' => now(),
                'scanner_info' => $validated['scanner_info'] ?? null,
                'notes' => 'Race condition duplikat',
            ]);

            return response()->json([
                'status' => 'DUPLICATE',
                'message' => 'Peserta sudah check-in sebelumnya.',
                'participant_name' => $participant->nama_lengkap,
                'eventName' => $eventName,
                'checked_in_at' => $freshParticipant?->checked_in_at?->format('d-m-Y H:i:s'),
            ]);
        }

        return response()->json([
            'status' => 'VALID',
            'message' => 'Check-in berhasil.',
            'participant_name' => $participant->nama_lengkap,
            'eventName' => $eventName,
            'checked_in_at' => now()->format('d-m-Y H:i:s'),
        ]);
    }
}
