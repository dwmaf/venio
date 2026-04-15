<?php

namespace App\Http\Controllers;

use App\Models\Participant;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $method = strtoupper((string) $request->query('metode', ''));

        $participantsQuery = Participant::query();

        if (in_array($method, ['OFFLINE', 'ONLINE'], true)) {
            $participantsQuery->where('metode_kehadiran', $method);
        }

        $participants = $participantsQuery
            ->orderByDesc('id')
            ->paginate(25)
            ->withQueryString();

        $offlineCount = Participant::where('metode_kehadiran', 'OFFLINE')->count();
        $checkedInCount = Participant::whereNotNull('checked_in_at')->count();

        $stats = [
            'total' => Participant::count(),
            'offline' => $offlineCount,
            'online' => Participant::where('metode_kehadiran', 'ONLINE')->count(),
            'checked_in' => $checkedInCount,
            'not_checked_in' => max(0, $offlineCount - $checkedInCount),
        ];

        return view('dashboard', compact('participants', 'stats', 'method'));
    }
}
