<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Participant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_event'      => ['required', 'string', 'max:255'],
            'tanggal_mulai'   => ['required', 'date'],
            'tanggal_selesai' => ['required', 'date', 'after_or_equal:tanggal_mulai'],
            'status'          => ['required', 'in:BERLANGSUNG,RIWAYAT'],
        ]);

        Event::create($validated);

        return redirect()->back()->with('success', 'Event berhasil ditambahkan.');
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'nama_event'      => ['required', 'string', 'max:255'],
            'tanggal_mulai'   => ['required', 'date'],
            'tanggal_selesai' => ['required', 'date', 'after_or_equal:tanggal_mulai'],
            'status'          => ['required', 'in:BERLANGSUNG,RIWAYAT'],
        ]);

        $event->update($validated);

        return redirect()->back()->with('success', 'Event berhasil diperbarui.');
    }

    public function show(Request $request, Event $event)
    {
        $participants = $event->participants()
            ->orderByDesc('id')
            ->paginate(25)
            ->withQueryString();
        $totalCount = $event->participants()->count();
        $checkedInCount = $event->participants()->whereNotNull('checked_in_at')->count();

        $stats = [
            'total' => $totalCount,
            'checked_in' => $checkedInCount,
            'not_checked_in' => max(0, $totalCount - $checkedInCount),
        ];

        // Ubah dari view() menjadi Inertia::render()
        // 'Dashboard' merujuk pada nama komponen React di resources/js/Pages/Dashboard.jsx
        return Inertia::render('Event', [
            'event'        => $event,
            'participants' => $participants,
            'stats' => $stats,
        ]);
    }

    public function upcomingEvents(Request $request)
    {
        
    }
}