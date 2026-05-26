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
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $allowedRoles = [];
        foreach ($roles as $role) {
            foreach (explode(',', $role) as $r) {
                $allowedRoles[] = trim($r);
            }
        }

        if (!$request->user()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Non authentifié.'], 401);
            }
            return redirect()->route('login');
        }

        if (!\in_array($request->user()->role->value, $allowedRoles)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Accès non autorisé. Rôle insuffisant.'], 403);
            }
            // Rediriger vers le bon espace selon le rôle réel
            return match($request->user()->role->value) {
                'administrateur' => redirect('/admin/tableau-de-bord'),
                'agent'          => redirect('/agent/tableau-de-bord'),
                default          => redirect('/citoyen/tableau-de-bord'),
            };
        }

        return $next($request);
    }
}
