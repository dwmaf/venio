<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PartnerController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('q');
        $partners = Partner::where('nama', 'LIKE', "%{$query}%")->limit(10)->pluck('nama');
        return response()->json($partners);
    }
}
