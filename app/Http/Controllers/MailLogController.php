<?php

namespace App\Http\Controllers;

use App\Models\EmailLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MailLogController extends Controller
{
    public function index(Request $request)
    {
        $query = EmailLog::with(['participant', 'participant.event']);

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->whereHas('participant', function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', '%' . $search . '%')
                  ->orWhere('email_primary', 'like', '%' . $search . '%');
            });
        }

        $logs = $query->orderBy('created_at', 'desc')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('MailLogs', [
            'logs' => $logs,
            'filters' => $request->only(['search'])
        ]);
    }
}
