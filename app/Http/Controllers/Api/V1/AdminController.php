<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\RoleEnum;
use App\Enums\StatutDemandeEnum;
use App\Exports\DossiersExport;
use App\Exports\StatsExport;
use App\Http\Controllers\Controller;
use App\Models\Demande;
use App\Models\User;
use App\Models\AuditLog;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function dashboard(Request $request)
    {
        // 1. Filtrage temporel (Aujourd'hui, Semaine, Mois)
        $period = $request->input('period', 'all');
        $query = Demande::query();

        if ($period === 'today') {
            $query->whereDate('created_at', Carbon::today());
        } elseif ($period === 'week') {
            $query->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
        } elseif ($period === 'month') {
            $query->whereMonth('created_at', Carbon::now()->month);
        }

        $totalUsers = User::where('role', RoleEnum::CITOYEN->value)->count();
        $totalAgents = User::where('role', RoleEnum::AGENT->value)->count();
        $totalDemandes = $query->count();
        
        $statsByStatus = $query->select('statut', DB::raw('count(*) as count'))
            ->groupBy('statut')
            ->get()
            ->mapWithKeys(function ($item) {
                $key = is_object($item->statut) ? $item->statut->value : (string)$item->statut;
                return [$key => $item->count];
            });

        $recentUsers = User::where('role', RoleEnum::CITOYEN->value)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // 2. Performances agents optimisées (une seule requête au lieu de N+1)
        $performances = DB::table('demandes')
            ->whereNotNull('agent_id')
            ->whereNotNull('date_cloture')
            ->select('agent_id', DB::raw('AVG(TIMESTAMPDIFF(HOUR, created_at, date_cloture)) as avg_hours'))
            ->groupBy('agent_id')
            ->get()
            ->pluck('avg_hours', 'agent_id');

        $agentPerformance = User::where('role', RoleEnum::AGENT->value)
            ->withCount(['demandesAssignees as total' => function($q) {
                $q->where('statut', StatutDemandeEnum::VALIDEE->value);
            }])
            ->get()
            ->map(function($agent) use ($performances) {
                $avgHours = $performances[$agent->id] ?? null;
                $agent->avg_delay = $avgHours ? round($avgHours / 24, 1) . 'j' : '---';
                return $agent;
            })
            ->sortByDesc('total')
            ->values();

        $validees = $statsByStatus[StatutDemandeEnum::VALIDEE->value] ?? 0;
        $successRate = $totalDemandes > 0 ? round(($validees / $totalDemandes) * 100, 1) : 0;

        $monthlyStatsRaw = Demande::select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month_key"),
                DB::raw("COUNT(*) as count")
            )
            ->groupBy('month_key')
            ->orderBy('month_key', 'asc')
            ->get();

        $monthlyStats = $monthlyStatsRaw->map(function ($item) {
            $date = Carbon::createFromFormat('Y-m', $item->month_key);
            return [
                'name'  => $date->translatedFormat('M Y'),
                'count' => $item->count
            ];
        })->toArray();

        $typeStatsRaw = Demande::join('types_demandes', 'demandes.type_demande_id', '=', 'types_demandes.id')
            ->select('types_demandes.libelle', DB::raw('COUNT(*) as count'))
            ->groupBy('types_demandes.libelle')
            ->get();

        $typeStats = $typeStatsRaw->map(function ($item) {
            return [
                'name'  => $item->libelle,
                'value' => $item->count
            ];
        })->toArray();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_citoyens' => $totalUsers,
                'total_agents' => $totalAgents,
                'total_demandes' => $totalDemandes,
                'validees'    => $validees,
                'en_cours'    => $statsByStatus[StatutDemandeEnum::EN_COURS->value]   ?? 0,
                'rejetees'    => $statsByStatus[StatutDemandeEnum::REJETEE->value]    ?? 0,
                'en_attente'  => $statsByStatus[StatutDemandeEnum::EN_ATTENTE->value] ?? 0,
                'success_rate' => $successRate . '%',
            ],
            'recent_users' => $recentUsers,
            'agent_performance' => $agentPerformance,
            'monthly_stats' => $monthlyStats,
            'type_stats' => $typeStats,
            'filters' => ['period' => $period]
        ]);
    }

    public function users(Request $request)
    {
        $tab = $request->input('tab', 'personnel');

        if ($tab === 'citoyens') {
            $query = User::where('role', RoleEnum::CITOYEN->value);
        } else {
            $query = User::whereIn('role', [RoleEnum::AGENT->value, RoleEnum::ADMINISTRATEUR->value]);
        }

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('nom', 'like', "%{$request->search}%")
                  ->orWhere('prenom', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        $users = $query->orderBy('nom')->get();

        $counts = [
            'personnel' => User::whereIn('role', [RoleEnum::AGENT->value, RoleEnum::ADMINISTRATEUR->value])->count(),
            'citoyens'  => User::where('role', RoleEnum::CITOYEN->value)->count(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users'   => $users,
            'filters' => $request->only(['search', 'tab']),
            'counts'  => $counts,
        ]);
    }

    public function stats()
    {
        $monthlyDemandes = Demande::select(
            DB::raw('count(*) as count'),
            DB::raw("DATE_FORMAT(created_at, '%b') as month")
        )
        ->groupBy('month')
        ->orderByRaw('MIN(created_at)')
        ->get();

        $byType = Demande::select('type_demande_id', DB::raw('count(*) as count'))
            ->with('typeDemande')
            ->groupBy('type_demande_id')
            ->get();

        // 3. Calcul réel du délai moyen global
        $avgHours = DB::table('demandes')
            ->whereNotNull('date_cloture')
            ->avg(DB::raw('TIMESTAMPDIFF(HOUR, created_at, date_cloture)'));
        
        // 4. Dossiers en retard (SLA dépassé) - Optimisé
        $lateRequests = Demande::whereNotIn('statut', [StatutDemandeEnum::VALIDEE->value, StatutDemandeEnum::REJETEE->value])
            ->join('types_demandes', 'demandes.type_demande_id', '=', 'types_demandes.id')
            ->whereRaw('TIMESTAMPDIFF(DAY, demandes.created_at, NOW()) > types_demandes.delai_jours_ouvrables')
            ->count();

        return Inertia::render('Admin/Stats', [
            'monthly' => $monthlyDemandes,
            'byType' => $byType,
            'extra_metrics' => [
                'avg_time' => $avgHours ? round($avgHours / 24, 1) . 'j' : '---',
                'late_count' => $lateRequests,
                'audit_count' => DB::table('audit_logs')->count(),
                'load_factor' => $lateRequests > 5 ? 'Critique' : 'Normal'
            ]
        ]);
    }

    public function notifications()
    {
        $logs = DB::table('audit_logs')
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(function($log) {
                $details = $log->details ? json_decode($log->details, true) : [];
                $description = isset($details['email'])
                    ? ($details['email'] . (isset($details['statut']) ? ' → ' . $details['statut'] : ''))
                    : $log->action;
                return [
                    'id'          => $log->id,
                    'title'       => $log->action,
                    'description' => $description,
                    'time'        => Carbon::parse($log->created_at)->diffForHumans(),
                    'type'        => str_contains(strtolower($log->action), 'création') ? 'user' : 'system',
                    'read'        => false,
                ];
            });

        return Inertia::render('Admin/Notifications', [
            'db_notifications' => $logs
        ]);
    }

    public function demandes(Request $request)
    {
        $query = Demande::with([
            'user', 
            'typeDemande', 
            'agent',
            'naissance',
            'residence',
            'mariage',
            'legalisation',
            'autorisation',
            'changementAdresse'
        ]);

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('numero_dossier', 'like', "%{$request->search}%")
                  ->orWhereHas('user', function($sq) use ($request) {
                      $sq->where('nom', 'like', "%{$request->search}%")
                        ->orWhere('prenom', 'like', "%{$request->search}%");
                  });
            });
        }

        if ($request->statut) {
            $query->where('statut', $request->statut);
        }

        if ($request->priorite) {
            $query->where('priorite', $request->priorite);
        }

        if ($request->type_demande_id) {
            $query->where('type_demande_id', $request->type_demande_id);
        }

        if ($request->period) {
            if ($request->period === 'today') {
                $query->whereDate('created_at', \Carbon\Carbon::today());
            } elseif ($request->period === 'week') {
                $query->whereBetween('created_at', [\Carbon\Carbon::now()->startOfWeek(), \Carbon\Carbon::now()->endOfWeek()]);
            } elseif ($request->period === 'month') {
                $query->whereMonth('created_at', \Carbon\Carbon::now()->month);
            }
        }

        $demandes = $query->orderBy('created_at', 'desc')->paginate(15)->withQueryString();

        $agents = User::where('role', RoleEnum::AGENT->value)->get();
        $typeDemandes = \App\Models\TypeDemande::all();

        return Inertia::render('Admin/Demandes/Index', [
            'demandes' => $demandes,
            'agents' => $agents,
            'type_demandes' => $typeDemandes,
            'filters' => $request->only(['search', 'statut', 'priorite', 'type_demande_id', 'period'])
        ]);
    }

    public function storeUser(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role' => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'uuid' => (string) Str::uuid(),
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
            'is_active' => true,
        ]);

        DB::table('audit_logs')->insert([
            'user_id'    => auth()->id(),
            'action'     => 'Création Utilisateur',
            'entite'     => 'users',
            'entite_id'  => $user->id,
            'details'    => json_encode(['email' => $user->email, 'role' => $user->role->value ?? $user->role]),
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Utilisateur créé avec succès.');
    }

    public function toggleUserStatus(User $user, Request $request)
    {
        $user->update(['is_active' => !$user->is_active]);
        
        DB::table('audit_logs')->insert([
            'user_id'    => auth()->id(),
            'action'     => 'Modification Statut',
            'entite'     => 'users',
            'entite_id'  => $user->id,
            'details'    => json_encode(['email' => $user->email, 'statut' => $user->is_active ? 'Actif' : 'Inactif']),
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Statut mis à jour.');
    }

    public function updateUser(User $user, Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|string',
            'password' => 'nullable|string|min:8',
        ]);

        $data = [
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'role' => $request->role,
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        DB::table('audit_logs')->insert([
            'user_id'    => auth()->id(),
            'action'     => 'Modification Utilisateur',
            'entite'     => 'users',
            'entite_id'  => $user->id,
            'details'    => json_encode(['email' => $user->email, 'role' => $user->role->value ?? $user->role]),
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Utilisateur modifié avec succès.');
    }

    public function destroyUser(User $user, Request $request)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->withErrors(['error' => 'Vous ne pouvez pas supprimer votre propre compte.']);
        }

        $email = $user->email;
        $role = $user->role;

        $user->delete();

        DB::table('audit_logs')->insert([
            'user_id'    => auth()->id(),
            'action'     => 'Suppression Utilisateur',
            'entite'     => 'users',
            'entite_id'  => $user->id,
            'details'    => json_encode(['email' => $email, 'role' => $role->value ?? $role]),
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Utilisateur supprimé avec succès.');
    }

    public function system()
    {
        $systemInfo = [
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'os' => PHP_OS,
            'db_connection' => config('database.default'),
            'env' => app()->environment(),
        ];

        $logs = DB::table('audit_logs')
            ->leftJoin('users', 'audit_logs.user_id', '=', 'users.id')
            ->select('audit_logs.*', 'users.nom as user_nom', 'users.prenom as user_prenom', 'users.email as user_email')
            ->orderBy('audit_logs.created_at', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($log) {
                // Decode details JSON if present
                $details = $log->details ? json_decode($log->details, true) : null;
                
                // Construct a beautiful dynamic description
                $desc = $log->action;
                if ($details) {
                    if (isset($details['numero_dossier'])) {
                        $desc .= " (Dossier : " . $details['numero_dossier'] . ")";
                    }
                    if (isset($details['email'])) {
                        $desc .= " pour " . $details['email'];
                    }
                    if (isset($details['nouveau_statut'])) {
                        $desc .= " → " . str_replace('_', ' ', $details['nouveau_statut']);
                    }
                    if (isset($details['role'])) {
                        $desc .= " [Rôle : " . $details['role'] . "]";
                    }
                    if (isset($details['statut']) && !isset($details['nouveau_statut'])) {
                        $desc .= " (" . $details['statut'] . ")";
                    }
                }
                
                $log->description = $desc;
                $log->operator = $log->user_prenom ? ($log->user_prenom . ' ' . $log->user_nom) : 'Système';
                return $log;
            });

        return Inertia::render('Admin/System', [
            'info' => $systemInfo,
            'logs' => $logs
        ]);
    }

    public function reassignDemande(Request $request, $uuid)
    {
        $request->validate([
            'agent_id' => 'required|exists:users,id'
        ]);

        $demande = Demande::where('uuid', $uuid)->firstOrFail();
        $ancienAgentId = $demande->agent_id;
        
        $demande->update([
            'agent_id' => $request->agent_id,
            'statut'   => 'en_cours'
        ]);

        $agent = User::findOrFail($request->agent_id);

        \App\Models\HistoriqueStatut::create([
            'demande_id'    => $demande->id,
            'user_id'       => $request->user()->id,
            'ancien_statut' => is_object($demande->statut) ? $demande->statut->value : $demande->statut,
            'nouveau_statut'=> 'en_cours',
            'commentaire'   => "Dossier réassigné à l'agent {$agent->prenom} {$agent->nom} par l'administrateur.",
        ]);

        \App\Models\Notification::create([
            'user_id'    => $request->agent_id,
            'demande_id' => $demande->id,
            'type'       => 'dossier',
            'message'    => "Le dossier {$demande->numero_dossier} vous a été réassigné par l'administrateur.",
            'lu'         => false,
            'created_at' => now(),
        ]);

        \Illuminate\Support\Facades\DB::table('audit_logs')->insert([
            'user_id'    => $request->user()->id,
            'action'     => 'Réassignation Dossier',
            'entite'     => 'demandes',
            'entite_id'  => $demande->id,
            'details'    => json_encode([
                'numero_dossier' => $demande->numero_dossier,
                'agent_nom'      => $agent->prenom . ' ' . $agent->nom,
                'ancien_agent_id'=> $ancienAgentId
            ]),
            'ip_address' => $request->ip(),
            'created_at' => now(),
        ]);

        return response()->json(['message' => 'Dossier réassigné avec succès.']);
    }

    public function exportDossiersExcel(Request $request)
    {
        $filters = $request->only(['statut', 'search']);
        return Excel::download(new DossiersExport($filters), 'dossiers_' . date('Ymd_His') . '.xlsx');
    }

    public function exportDossiersPdf(Request $request)
    {
        $filters = $request->only(['statut', 'search']);
        $demandes = (new DossiersExport($filters))->collection();
        
        $generatedBy = auth()->user()->prenom . ' ' . auth()->user()->nom . ' (' . auth()->user()->email . ')';
        
        $pdf = Pdf::loadView('pdf.dossiers', [
            'demandes'    => $demandes,
            'generatedBy' => $generatedBy,
        ]);
        
        return $pdf->download('dossiers_' . date('Ymd_His') . '.pdf');
    }

    public function exportStatsExcel(Request $request)
    {
        return Excel::download(new StatsExport(), 'statistiques_' . date('Ymd_His') . '.xlsx');
    }

    public function exportStatsPdf(Request $request)
    {
        $generatedBy = auth()->user()->prenom . ' ' . auth()->user()->nom . ' (' . auth()->user()->email . ')';
        
        $totalDemandes = Demande::count();
        $validees = Demande::where('statut', 'validee')->count();
        $en_cours = Demande::where('statut', 'en_cours')->count();
        $successRate = $totalDemandes > 0 ? round(($validees / $totalDemandes) * 100, 1) : 0;
        
        $extra = [
            'total_demandes' => $totalDemandes,
            'validees'       => $validees,
            'en_cours'       => $en_cours,
            'success_rate'   => $successRate . '%',
        ];

        $monthlyRaw = Demande::select(
                DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month_key"),
                DB::raw("COUNT(*) as count")
            )
            ->groupBy('month_key')
            ->orderBy('month_key', 'desc')
            ->get();
        
        $monthly = $monthlyRaw->map(function ($item) {
            $date = Carbon::createFromFormat('Y-m', $item->month_key);
            $monthName = $date->translatedFormat('F Y');
            return [
                'month' => ucfirst($monthName),
                'count' => $item->count
            ];
        })->toArray();

        $byTypeRaw = Demande::join('types_demandes', 'demandes.type_demande_id', '=', 'types_demandes.id')
            ->select('types_demandes.libelle', DB::raw('COUNT(*) as count'))
            ->groupBy('types_demandes.libelle')
            ->orderBy('count', 'desc')
            ->get();

        $byType = $byTypeRaw->map(function ($item) {
            return [
                'libelle' => $item->libelle,
                'count' => $item->count
            ];
        })->toArray();

        $pdf = Pdf::loadView('pdf.stats', [
            'generatedBy' => $generatedBy,
            'extra'       => $extra,
            'monthly'     => $monthly,
            'byType'      => $byType
        ]);
        
        return $pdf->download('statistiques_' . date('Ymd_His') . '.pdf');
    }
}
