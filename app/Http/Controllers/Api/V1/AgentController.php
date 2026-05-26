<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Demande;
use App\Models\HistoriqueStatut;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AgentController extends Controller
{
    public function index(Request $request)
    {
        $query = Demande::with(['user', 'typeDemande', 'agent']);

        if ($request->has('mine')) {
            $query->where('agent_id', $request->user()->id);
        }

        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        return $query->latest()->paginate(20);
    }

    public function dashboard(Request $request)
    {
        $agentId = $request->user()->id;

        $stats = [
            'total_assignes' => Demande::where('agent_id', $agentId)->count(),
            'en_cours' => Demande::where('agent_id', $agentId)->where('statut', 'en_cours')->count(),
            'traites' => Demande::where('agent_id', $agentId)->whereIn('statut', ['validee', 'rejetee'])->count(),
            'en_attente_global' => Demande::where('statut', 'en_attente')->count(),
        ];

        $recentes = Demande::with(['user', 'typeDemande', 'agent'])
            ->latest()
            ->take(10)
            ->get();

        $monthlyStatsRaw = Demande::where('agent_id', $agentId)
            ->select(
                \Illuminate\Support\Facades\DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month_key"),
                \Illuminate\Support\Facades\DB::raw("COUNT(*) as count")
            )
            ->groupBy('month_key')
            ->orderBy('month_key', 'asc')
            ->get();

        $monthlyStats = $monthlyStatsRaw->map(function ($item) {
            $date = \Carbon\Carbon::createFromFormat('Y-m', $item->month_key);
            return [
                'name'  => $date->translatedFormat('M Y'),
                'count' => $item->count
            ];
        })->toArray();

        $typeStatsRaw = Demande::where('agent_id', $agentId)
            ->join('types_demandes', 'demandes.type_demande_id', '=', 'types_demandes.id')
            ->select('types_demandes.libelle', \Illuminate\Support\Facades\DB::raw('COUNT(*) as count'))
            ->groupBy('types_demandes.libelle')
            ->get();

        $typeStats = $typeStatsRaw->map(function ($item) {
            return [
                'name'  => $item->libelle,
                'value' => $item->count
            ];
        })->toArray();

        return \Inertia\Inertia::render('Agent/Dashboard', [
            'stats' => $stats,
            'recentes' => $recentes,
            'monthly_stats' => $monthlyStats,
            'type_stats' => $typeStats
        ]);
    }

    public function stats(Request $request)
    {
        return response()->json([
            'total' => Demande::count(),
            'en_attente' => Demande::where('statut', 'en_attente')->count(),
            'mes_dossiers' => Demande::where('agent_id', $request->user()->id)
                ->whereNotIn('statut', ['validee', 'rejetee'])
                ->count(),
            'urgents' => Demande::where('priorite', 'urgente')
                ->whereNotIn('statut', ['validee', 'rejetee'])
                ->count(),
        ]);
    }

    public function show($uuid)
    {
        // Ajout de toutes les relations spécifiques aux formulaires pour éviter les champs vides
        $demande = Demande::with([
            'user', 
            'typeDemande', 
            'documents', 
            'historiqueStatuts.user', 
            'agent',
            'naissance',
            'residence',
            'mariage',
            'legalisation',
            'autorisation',
            'changementAdresse'
        ])
        ->where('uuid', $uuid)
        ->firstOrFail();

        return response()->json($demande);
    }

    public function assign(Request $request, $uuid)
    {
        $demande = Demande::where('uuid', $uuid)->firstOrFail();

        if ($demande->agent_id) {
            return response()->json(['message' => 'Ce dossier est déjà assigné.'], 422);
        }

        $demande->update([
            'agent_id' => $request->user()->id,
            'statut' => 'en_cours'
        ]);

        HistoriqueStatut::create([
            'demande_id' => $demande->id,
            'user_id' => $request->user()->id,
            'ancien_statut' => 'en_attente',
            'nouveau_statut' => 'en_cours',
            'commentaire' => 'Prise en charge par l\'agent.'
        ]);

        \Illuminate\Support\Facades\DB::table('audit_logs')->insert([
            'user_id'    => $request->user()->id,
            'action'     => 'Assignation Dossier',
            'entite'     => 'demandes',
            'entite_id'  => $demande->id,
            'details'    => json_encode(['numero_dossier' => $demande->numero_dossier, 'agent' => $request->user()->email]),
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json(['message' => 'Dossier assigné avec succès.']);
    }

    public function updateStatus(Request $request, $uuid)
    {
        $request->validate([
            'statut'          => 'required|in:en_cours,document_manquant,validee,rejetee',
            'commentaire'     => 'nullable|string|max:1000',
            'motif_rejet'     => 'required_if:statut,rejetee|nullable|string|max:1000',
            'piece_manquante' => 'required_if:statut,document_manquant|nullable|string|max:500',
        ]);

        $demande = Demande::where('uuid', $uuid)->firstOrFail();
        $ancienStatut = is_object($demande->statut) ? $demande->statut->value : $demande->statut;

        $update = ['statut' => $request->statut];

        if ($request->statut === 'rejetee') {
            $update['motif_rejet']    = $request->motif_rejet;
            $update['piece_manquante'] = null;
            $update['date_cloture']   = now();
        }

        if ($request->statut === 'validee') {
            $update['piece_manquante'] = null;
            $update['date_cloture']   = now();
        }

        if ($request->statut === 'document_manquant') {
            $update['piece_manquante'] = $request->piece_manquante;
        }

        if ($request->statut === 'en_cours') {
            $update['piece_manquante'] = null;
        }

        $demande->update($update);

        $commentaire = $request->commentaire;
        if ($request->statut === 'document_manquant' && $request->piece_manquante) {
            $commentaire = 'Pièce requise : ' . $request->piece_manquante . ($commentaire ? ' — ' . $commentaire : '');
        }

        HistoriqueStatut::create([
            'demande_id'    => $demande->id,
            'user_id'       => $request->user()->id,
            'ancien_statut' => $ancienStatut,
            'nouveau_statut'=> $request->statut,
            'commentaire'   => $commentaire ?? 'Mise à jour du statut.',
        ]);

        $notifMessage = "Le statut de votre dossier {$demande->numero_dossier} a été mis à jour : " . str_replace('_', ' ', $request->statut) . ".";
        if ($request->statut === 'document_manquant' && $request->piece_manquante) {
            $notifMessage = "Action requise : Pièce manquante pour votre dossier {$demande->numero_dossier}. Veuillez fournir : {$request->piece_manquante}.";
        } elseif ($request->statut === 'validee') {
            $notifMessage = "Félicitations, votre demande {$demande->numero_dossier} a été validée avec succès.";
        } elseif ($request->statut === 'rejetee') {
            $notifMessage = "Votre demande {$demande->numero_dossier} a été rejetée. Motif : {$request->motif_rejet}.";
        }

        \App\Models\Notification::create([
            'user_id'    => $demande->user_id,
            'demande_id' => $demande->id,
            'type'       => 'dossier',
            'message'    => $notifMessage,
            'lu'         => false,
            'created_at' => now(),
        ]);

        \Illuminate\Support\Facades\DB::table('audit_logs')->insert([
            'user_id'    => $request->user()->id,
            'action'     => 'Mise à jour Dossier',
            'entite'     => 'demandes',
            'entite_id'  => $demande->id,
            'details'    => json_encode([
                'numero_dossier' => $demande->numero_dossier,
                'nouveau_statut' => $request->statut,
                'commentaire'    => $commentaire
            ]),
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json(['message' => 'Statut mis à jour avec succès.', 'demande' => $demande->fresh()]);
    }

    public function addNote(Request $request, $uuid)
    {
        $request->validate(['note' => 'required|string|max:2000']);

        $demande = Demande::where('uuid', $uuid)->firstOrFail();

        $existing = $demande->notes_internes ? $demande->notes_internes . "\n\n" : '';
        $line     = '[' . now()->format('d/m/Y H:i') . ' — ' . $request->user()->prenom . '] ' . $request->note;

        $demande->update(['notes_internes' => $existing . $line]);

        return response()->json(['message' => 'Note ajoutée.', 'notes_internes' => $demande->notes_internes]);
    }
}
