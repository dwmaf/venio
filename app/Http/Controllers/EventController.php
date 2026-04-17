<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Participant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

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

    public function allEvents(Request $request, Event $event)
    {
        $today = Carbon::today()->format('Y-m-d');
        // 2. FILTER EVENT BERDASARKAN WAKTU
        // Ongoing: Hari ini dan status belum selesai
        $ongoingEvents = Event::where('tanggal_event', $today)
            ->where('status', 'BELUM_SELESAI')
            ->orderBy('jam_mulai', 'asc')
            ->limit(2)
            ->get();

        // Upcoming: Belum hari ini (masa depan) dan status belum selesai
        $upcomingEvents = Event::where('tanggal_event', '>', $today)
            ->where('status', 'BELUM_SELESAI')
            ->orderBy('tanggal_event', 'asc')
            ->limit(2)
            ->get();

        $pastEvents = Event::where('tanggal_event', '>', $today)
            ->where('status', 'SELESAI')
            ->orderBy('tanggal_event', 'asc')
            ->limit(2)
            ->get();

        // Ubah dari view() menjadi Inertia::render()
        // 'Dashboard' merujuk pada nama komponen React di resources/js/Pages/Dashboard.jsx
        return Inertia::render('Events/AllEvents', [
            'ongoingEvents' => $ongoingEvents,
            'upcomingEvents' => $upcomingEvents,
            'pastEvents' => $pastEvents,
        ]);
    }

    public function upcomingEvents(Request $request)
    {
        $today = Carbon::today()->format('Y-m-d');
        $upcomingEvents = Event::where('tanggal_event', '>', $today)
            ->where('status', 'BELUM_SELESAI')
            ->orderBy('tanggal_event', 'asc')
            ->limit(2)
            ->get();
        return Inertia::render('Events/UpcomingEvents', [
            'upcomingEvents' => $upcomingEvents,
        ]);
    }

    public function ongoingEvents(Request $request)
    {
        $today = Carbon::today()->format('Y-m-d');
        // 2. FILTER EVENT BERDASARKAN WAKTU
        // Ongoing: Hari ini dan status belum selesai
        $ongoingEvents = Event::where('tanggal_event', $today)
            ->where('status', 'BELUM_SELESAI')
            ->orderBy('jam_mulai', 'asc')
            ->limit(2)
            ->get();
        return Inertia::render('Events/OngoingEvents', [
            'ongoingEvents' => $ongoingEvents,
        ]);
    }

    public function pastEvents(Request $request)
    {
        $today = Carbon::today()->format('Y-m-d');

        $pastEvents = Event::where('tanggal_event', '>', $today)
            ->where('status', 'SELESAI')
            ->orderBy('tanggal_event', 'asc')
            ->limit(2)
            ->get();
        return Inertia::render('Events/PastEvents', [
            'pastEvents' => $pastEvents,
        ]);
    }

    public function detailEvents(Request $request, Event $event)
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

        return Inertia::render('Events/DetailEvent', [
            'event'        => $event,
            'participants' => $participants,
            'stats' => $stats,
        ]);

    }
}