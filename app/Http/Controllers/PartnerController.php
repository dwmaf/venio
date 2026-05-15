<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PartnerController extends Controller
{
    public function index(Request $request)
    {
        $query = Partner::query();

        if ($request->has('search') && $request->search != '') {
            $query->where('nama', 'like', '%' . $request->search . '%');
        }

        $partners = $query->withCount('events')
                          ->orderBy('nama', 'asc')
                          ->paginate(10)
                          ->withQueryString();

        return Inertia::render('Partners/allPartners', [
            'partners' => $partners,
            'filters'  => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:partners,nama',
        ]);

        Partner::create($request->only('nama'));

        return back()->with('success', 'Partner berhasil ditambahkan.');
    }

    public function update(Request $request, Partner $partner)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:partners,nama,' . $partner->id,
        ]);

        $partner->update($request->only('nama'));

        return back()->with('success', 'Partner berhasil diperbarui.');
    }

    // CATATAN: Untuk destroy API ini hanya menghapus partner, tidak event-nya.
    public function destroy(Partner $partner)
    {
        // Karena ada relasi event_partner pivot, pivot akan aman jika onDelete('cascade') ditaruh, 
        // tapi Laravel otomatis melepas relasi pivot jika partner dihapus lewat sync/detach tergantung setup mu.
        $partner->events()->detach(); 
        $partner->delete();

        return back()->with('success', 'Partner berhasil dihapus.');
    }

    public function search(Request $request)
    {
        $query = $request->input('q');
        $partners = Partner::where('nama', 'LIKE', "%{$query}%")->limit(10)->pluck('nama');
        return response()->json($partners);
    }
}
