<?php

namespace App\Http\Controllers\Inertia;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DasborController extends Controller
{
    public function index()
    {
        $ongoingEvents = Event::where('status', 'BERLANGSUNG')
            ->orderBy('tanggal_mulai', 'asc')
            ->get();

        $historyEvents = Event::where('status', 'RIWAYAT')
            ->orderBy('tanggal_selesai', 'desc')
            ->get();

        // Render ke file: resources/js/Pages/Dasbor/Index.jsx
        return Inertia::render('Dashboard', [
            'ongoingEvents' => $ongoingEvents,
            'historyEvents' => $historyEvents,
        ]);
    }

    
}