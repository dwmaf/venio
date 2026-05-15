<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use App\Models\Event;
use Illuminate\Http\Request;

class ParticipantController extends Controller 
{

    public function storeParticipant(Request $request, Event $event)
        {
            $request->validate([
                'nama_lengkap' => 'required|string|max:255',
                'email_primary' => 'required|email|max:255',
                'no_hp_normalized' => 'nullable|string|max:32',
                'metode_kehadiran' => 'required|in:OFFLINE,ONLINE',
            ]);
    
            // Buat logic hash deduplikasi seperti yang dipakai Import Controller
            $dedupeKeyHash = hash('sha256', strtolower($request->nama_lengkap) . '|' . strtolower($request->email_primary) . '|' . $request->metode_kehadiran . '|' . $event->id);
    
            // Cek jika peserta duplikat
            $participantExists = Participant::where('dedupe_key_hash', $dedupeKeyHash)->first();
    
            if ($participantExists) {
                return back()->with('error', 'Peserta dengan nama, email, dan metode kehadiran yang sama sudah terdaftar!');
            }
    
            // Simpan peserta baru di database
            $event->participants()->create([
                'nama_lengkap' => $request->nama_lengkap,
                'email_primary' => strtolower($request->email_primary),
                'no_hp_normalized' => $request->no_hp_normalized,
                'instansi' => $request->instansi,
                'metode_kehadiran' => $request->metode_kehadiran,
                'dedupe_key_hash' => $dedupeKeyHash,
                'persetujuan_data' => true, // default setuju
            ]);
    
            return back()->with('success', 'Berhasil menambahkan peserta secara manual.');
        }
}
