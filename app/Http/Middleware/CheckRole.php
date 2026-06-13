<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        // Utilisateur non authentifié
        if (!$request->user()) {
            // Pour les requêtes API pures (attendant du JSON), retourner 401
            if ($request->expectsJson() && !$request->header('X-Inertia')) {
                return response()->json(['message' => 'Non authentifié.'], 401);
            }
            // Pour les requêtes Inertia (navigation SPA) et web normales,
            // toujours rediriger → Inertia gère la redirection proprement
            return redirect()->route('login');
        }

        // Vérification du rôle
        $allowedRoles = explode(',', $role);

        if (!\in_array($request->user()->role->value, $allowedRoles)) {
            // Pour les requêtes API pures (attendant du JSON), retourner 403
            if ($request->expectsJson() && !$request->header('X-Inertia')) {
                return response()->json(['message' => 'Accès non autorisé.'], 403);
            }

            // Pour les requêtes Inertia et web, rediriger vers le bon espace
            return match($request->user()->role->value) {
                'administrateur' => redirect('/admin/tableau-de-bord'),
                'agent'          => redirect('/agent/tableau-de-bord'),
                default          => redirect('/citoyen/tableau-de-bord'),
            };
        }

        return $next($request);
    }
}
