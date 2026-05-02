<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Participant;
use App\Models\Partner;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class EventController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_event'    => 'required|string',
            'tipe_event'    => 'required|in:OFFLINE,ONLINE,HYBRID',
            'lokasi'        => 'required_if:tipe_event,OFFLINE,HYBRID',
            'tanggal_event' => 'required|date',
            'jam_mulai'     => 'required',
            'jam_selesai'   => 'required',
            'quota'         => 'nullable|integer',
            'partners' => 'nullable|array',
            'partners.*' => 'string'
        ]);

        $event = Event::create([
            'nama_event'    => $validated['nama_event'],
            'tipe_event'    => $validated['tipe_event'],
            'lokasi'        => $validated['lokasi'] ?? null,
            'tanggal_event' => $validated['tanggal_event'],
            'jam_mulai'     => $validated['jam_mulai'],
            'jam_selesai'   => $validated['jam_selesai'],
            'quota'         => $validated['quota'],
        ]);

        if (!empty($validated['partners'])) {
            $partnerIds = [];
            foreach ($validated['partners'] as $partnerName) {
                // firstOrCreate akan mencari partner berdasarkan nama. 
                // Jika ada, kembalikan object. Jika belum, buat baru di tabel partners.
                $partner = Partner::firstOrCreate(['nama' => $partnerName]);
                $partnerIds[] = $partner->id;
            }

            // Simpan ke tabel pivot event_partner
            $event->partners()->sync($partnerIds);
        }

        return redirect()->route('all.events')->with('success', 'Event Berhasil Dibuat');
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'nama_event'    => 'required|string|max:255',
            'tipe_event'    => 'required|in:OFFLINE,ONLINE,HYBRID',
            'tanggal_event' => 'required|date',
            'jam_mulai'     => 'required',
            'jam_selesai'   => 'required',
            'lokasi'        => 'required_if:tipe_event,OFFLINE,HYBRID|nullable|string|max:255',
            'quota'         => 'nullable|integer|min:1',
            'partners'      => 'nullable|array',
            'partners.*'    => 'string',
        ]);

        $event->update([
            'nama_event'    => $validated['nama_event'],
            'tipe_event'    => $validated['tipe_event'],
            'tanggal_event' => $validated['tanggal_event'],
            'jam_mulai'     => $validated['jam_mulai'],
            'jam_selesai'   => $validated['jam_selesai'],
            'lokasi'        => $validated['lokasi'] ?? null,
            'quota'         => $validated['quota'] ?? null,
        ]);

        $partnerIds = [];

        if (!empty($validated['partners'])) {
            foreach ($validated['partners'] as $partnerName) {
                $partner = Partner::firstOrCreate([
                    'nama' => $partnerName,
                ]);

                $partnerIds[] = $partner->id;
            }
        }

        $event->partners()->sync($partnerIds);

        return redirect()
            ->route('events.index', $event->id)
            ->with('success', 'Event berhasil diperbarui.');
    }

    public function allEvents(Request $request, Event $event)
    {
        $today = Carbon::today()->format('Y-m-d');
        // 2. FILTER EVENT BERDASARKAN WAKTU
        // Ongoing: Hari ini dan status belum selesai
        $ongoingEvents = Event::where('tanggal_event', $today)
            ->orderBy('jam_mulai', 'asc')
            ->limit(2)
            ->get();

        // Upcoming: Belum hari ini (masa depan) dan status belum selesai
        $upcomingEvents = Event::where('tanggal_event', '>', $today)
            ->orderBy('tanggal_event', 'asc')
            ->limit(2)
            ->get();

        $pastEvents = Event::where('tanggal_event', '<', $today)
            ->orderBy('tanggal_event', 'desc')
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
            ->orderBy('tanggal_event', 'asc')
            ->get();
        return Inertia::render('Events/UpcomingEvents', [
            'upcomingEvents' => $upcomingEvents,
        ]);
    }

    public function ongoingEvents(Request $request)
    {
        $today = Carbon::today()->format('Y-m-d');
        $ongoingEvents = Event::where('tanggal_event', $today)
            ->orderBy('jam_mulai', 'asc')
            ->get();
        return Inertia::render('Events/OnGoingEvents', [
            'ongoingEvents' => $ongoingEvents,
        ]);
    }

    public function pastEvents(Request $request)
    {
        $today = Carbon::today()->format('Y-m-d');
        $query = Event::where('tanggal_event', '<', $today);

        // Tambahkan filter search jika ada
        if ($request->has('search') && $request->search != '') {
            $query->where('nama_event', 'like', '%' . $request->search . '%');
        }
        $pastEvents = $query->withCount('participants')
            ->orderBy('tanggal_event', 'desc')
            ->paginate(5)
            ->withQueryString();
        return Inertia::render('Events/PastEvents', [
            'pastEvents' => $pastEvents,
            'filters'    => $request->only(['search']),
        ]);
    }

    public function detailEvent(Request $request, Event $event)
    {
        $event->load('partners');
        $participantsQuery = $event->participants()->orderByDesc('id');

        if ($request->has('filter') && $request->filter != '') {
            $filter = $request->filter;

            switch ($filter) {
                case 'ONLINE':
                case 'OFFLINE':
                    $participantsQuery->where('metode_kehadiran', $filter);
                    break;
                case 'QR_FILLED':
                    $participantsQuery->whereNotNull('qr_token');
                    break;
                case 'QR_EMPTY':
                    $participantsQuery->whereNull('qr_token');
                    break;
                case 'ZOOM_FILLED':
                    $participantsQuery->whereNotNull('zoom_link');
                    break;
                case 'ZOOM_EMPTY':
                    $participantsQuery->whereNull('zoom_link');
                    break;
            }
        }

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $participantsQuery->where(function ($query) use ($search) {
                $query->where('nama_lengkap', 'like', '%' . $search . '%')
                      ->orWhere('email_primary', 'like', '%' . $search . '%')
                      ->orWhere('no_hp_normalized', 'like', '%' . $search . '%');
            });
        }

        // 2. Paginate query yang sudah difilter
        $participants = $participantsQuery->paginate(25)->withQueryString();
        $totalCount = $event->participants()->count();
        $checkedInCount = $event->participants()->whereNotNull('checked_in_at')->count();
        // Statistik Offline/Online
        $offlineCount = $event->participants()->where('metode_kehadiran', 'OFFLINE')->count();
        $onlineCount = $event->participants()->where('metode_kehadiran', 'ONLINE')->count();

        // Statistik Tambahan
        $offlineCheckedIn = $event->participants()
            ->where('metode_kehadiran', 'OFFLINE')
            ->whereNotNull('checked_in_at')
            ->count();

        $onlineZoomFilled = $event->participants()
            ->where('metode_kehadiran', 'ONLINE')
            ->whereNotNull('zoom_link')
            ->count();
        $stats = [
            'total' => $totalCount,
            'checked_in' => $checkedInCount,
            'not_checked_in' => max(0, $totalCount - $checkedInCount),
            'offline' => $offlineCount,
            'online' => $onlineCount,
            'offline_checked_in' => $offlineCheckedIn,
            'offline_not_checked_in' => max(0, $offlineCount - $offlineCheckedIn),
            'online_zoom_filled' => $onlineZoomFilled,
            'online_zoom_empty' => max(0, $onlineCount - $onlineZoomFilled),
        ];

        return Inertia::render('Events/DetailEvent', [
            'event'        => $event,
            'participants' => $participants,
            'stats' => $stats,
        ]);
    }

    public function create()
    {
        return Inertia::render('Events/AddEvents');
    }

    public function edit(Event $event)
    {
        $event->load('partners');

        return Inertia::render('Events/EditEvent', [
            'event' => $event,
        ]);
    }
}
