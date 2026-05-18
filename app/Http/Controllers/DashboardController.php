<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Participant;
use App\Models\Partner;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today()->format('Y-m-d');

        // 1. DATA UNTUK STATISTIK
        $totalEventsCount = Event::count();
        $totalPartners = Partner::count();
        $completedEventsCount = Event::where('tanggal_event', '<', $today)->count();
        
        // 2. FILTER EVENT BERDASARKAN WAKTU
        // Ongoing: Hari ini dan status belum selesai
        $ongoingEvents = Event::withCount('participants')->where('tanggal_event', $today)
        ->with('partners')
            ->orderBy('jam_mulai', 'asc')
            ->get();

        // Upcoming: Belum hari ini (masa depan) dan status belum selesai
        $upcomingEvents = Event::withCount('participants')->where('tanggal_event', '>', $today)
        ->with('partners')
            ->orderBy('tanggal_event', 'asc')
            // ->limit(2)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalEvents' => $totalEventsCount,
                'completedEvents' => $completedEventsCount,
                'partners' => $totalPartners,
            ],
            'ongoingEvents' => $ongoingEvents,
            'upcomingEvents' => $upcomingEvents,
        ]);
    }

    
}