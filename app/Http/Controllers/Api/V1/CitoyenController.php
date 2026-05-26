<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Demande;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CitoyenController extends Controller
{
    public function dashboard(Request $request)
    {
        $userId = $request->user()->id;

        $stats = [
            'total' => Demande::where('user_id', $userId)->count(),
            'en_cours' => Demande::where('user_id', $userId)->whereIn('statut', ['en_attente', 'en_cours'])->count(),
            'validees' => Demande::where('user_id', $userId)->where('statut', 'validee')->count(),
            'rejetees' => Demande::where('user_id', $userId)->where('statut', 'rejetee')->count(),
        ];

        $recentes = Demande::with(['typeDemande', 'agent'])
            ->where('user_id', $userId)
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('Citoyen/Dashboard', [
            'stats' => $stats,
            'recentes' => $recentes
        ]);
    }
}
