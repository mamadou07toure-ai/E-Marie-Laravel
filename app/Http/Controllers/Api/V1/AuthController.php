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
        $request->session()->regenerate();

        $user = User::where('email', $request->email)->firstOrFail();

        if (!$user->is_active) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => 'Votre compte est désactivé. Contactez l\'administrateur.',
            ]);
        }

        $user->update(['last_login_at' => now()]);

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
        $request->user()->tokens()->delete();
        Auth::guard('web')->logout();

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
