<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'uuid' => Str::uuid(),
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'password' => Hash::make($request->password),
            'role' => RoleEnum::CITOYEN,
            'is_active' => true,
        ]);

        \App\Models\Notification::create([
            'user_id'    => $user->id,
            'demande_id' => null,
            'type'       => 'systeme',
            'message'    => "Bienvenue {$user->prenom} ! Votre compte citoyen e-Mairie a été créé avec succès. Vous pouvez dès maintenant soumettre vos demandes en ligne.",
            'lu'         => false,
            'created_at' => now(),
        ]);

        $admins = User::where('role', RoleEnum::ADMINISTRATEUR->value)->pluck('id');
        $now = now();
        $adminNotifs = $admins->map(fn($adminId) => [
            'user_id'    => $adminId,
            'demande_id' => null,
            'type'       => 'systeme',
            'message'    => "Nouveau citoyen inscrit : {$user->prenom} {$user->nom} ({$user->email}).",
            'lu'         => false,
            'created_at' => $now,
        ])->all();
        if (!empty($adminNotifs)) {
            \App\Models\Notification::insert($adminNotifs);
        }

        Auth::login($user);

        if ($request->header('X-Inertia')) {
            return redirect()->route('citoyen.dashboard');
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Utilisateur créé avec succès.',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function login(LoginRequest $request)
    {
        $request->ensureIsNotRateLimited();

        if (!Auth::attempt($request->only('email', 'password'), $request->remember)) {
            $request->incrementAttempts();
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        $request->clearAttempts();

        $user = Auth::user();

        if (!$user->is_active) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => 'Votre compte est désactivé. Contactez l\'administrateur.',
            ]);
        }

        // Régénérer la session après login (prévient la fixation de session)
        $request->session()->regenerate();

        $user->update(['last_login_at' => now()]);

        // CRITIQUE : forcer l'écriture immédiate de la session en base de données.
        // Sans cela, avec le driver "database", la session est seulement en mémoire
        // au moment où le navigateur reçoit la réponse. Si l'utilisateur clique
        // immédiatement sur un lien, la requête suivante ne trouve pas la session
        // en DB et provoque une déconnexion silencieuse (visible uniquement au
        // premier login après démarrage du serveur).
        $request->session()->save();

        // Rediriger si c'est une requête Inertia (Web)
        if ($request->header('X-Inertia')) {
            return match ($user->role) {
                RoleEnum::ADMINISTRATEUR => redirect()->intended('/admin/tableau-de-bord'),
                RoleEnum::AGENT         => redirect()->intended('/agent/tableau-de-bord'),
                default                 => redirect()->intended('/citoyen/tableau-de-bord'),
            };
        }

        // Réponse JSON pour les clients API purs
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie.',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        // Supprimer tous les tokens Sanctum de l'utilisateur
        if ($request->user()) {
            $request->user()->tokens()->delete();
        }

        // Déconnecter de la guard web (session)
        Auth::guard('web')->logout();

        // Invalider la session et régénérer le token CSRF
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->header('X-Inertia')) {
            return redirect('/');
        }

        return response()->json([
            'message' => 'Déconnexion réussie.',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
