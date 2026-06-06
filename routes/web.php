<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use App\Models\Demande;
use App\Models\User;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\AdminController;

Route::get('/', function () {
    return Inertia::render('Welcome');
});

// Auth Routes
Route::get('/connexion', function () {
    return Inertia::render('Auth/Login');
})->name('login');
Route::post('/connexion', [AuthController::class, 'login'])->name('login.post');

Route::get('/mot-de-passe-oublie', function () {
    return Inertia::render('Auth/ForgotPassword');
})->name('password.request');

Route::post('/mot-de-passe-oublie/envoyer', function (Request $request) {
    $request->validate(['email' => 'required|email']);
    $status = Password::sendResetLink($request->only('email'));
    if ($status === Password::RESET_LINK_SENT) {
        return response()->json(['message' => 'Lien envoyé.']);
    }
    return response()->json(['message' => __($status)], 422);
})->name('password.email');

Route::get('/reset-password/{token}', function (string $token) {
    return Inertia::render('Auth/ResetPassword', [
        'token' => $token,
        'email' => request()->query('email', ''),
    ]);
})->name('password.reset');

Route::post('/reset-password', function (Request $request) {
    $request->validate([
        'token'                 => 'required',
        'email'                 => 'required|email',
        'password'              => 'required|min:8|confirmed',
        'password_confirmation' => 'required',
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function (User $user, string $password) {
            $user->forceFill(['password' => Hash::make($password)])->save();
            event(new PasswordReset($user));
        }
    );

    if ($status === Password::PASSWORD_RESET) {
        return response()->json(['message' => 'Mot de passe réinitialisé avec succès.']);
    }
    return response()->json(['message' => __($status)], 422);
})->name('password.update');

Route::get('/inscription', function () {
    return Inertia::render('Auth/Register');
})->name('register');
Route::post('/inscription', [AuthController::class, 'register'])->name('register.post');

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Citoyen Routes
Route::middleware(['auth', 'role:citoyen,administrateur'])->prefix('citoyen')->group(function () {
    Route::get('/tableau-de-bord', [App\Http\Controllers\Api\V1\CitoyenController::class, 'dashboard'])->name('citoyen.dashboard');

    Route::get('/mes-dossiers', function (Request $request) {
        $demandes = Demande::where('user_id', $request->user()->id)
            ->with(['typeDemande', 'agent'])
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('Citoyen/Demandes/Index', ['demandes' => $demandes]);
    })->name('citoyen.demandes.index');

    Route::get('/nouvelle-demande', function () {
        return Inertia::render('Citoyen/Demandes/Create');
    })->name('citoyen.demandes.create');

    Route::get('/mes-dossiers/{uuid}', function (Request $request, $uuid) {
        $demande = Demande::where('uuid', $uuid)
            ->where('user_id', $request->user()->id)
            ->with(['typeDemande', 'documents', 'agent', 'naissance', 'residence', 'mariage', 'legalisation', 'autorisation', 'changementAdresse', 'historiqueStatuts'])
            ->firstOrFail();
        return Inertia::render('Citoyen/Demandes/Show', ['demande' => $demande]);
    })->name('citoyen.demandes.show');

    Route::get('/notifications', function () {
        return Inertia::render('Citoyen/Notifications');
    })->name('citoyen.notifications');

    Route::get('/messages', function (Request $request) {
        return Inertia::render('Citoyen/Messages', [
            'initial_agent_id' => $request->integer('agent_id') ?: null,
        ]);
    })->name('citoyen.messages');

    Route::get('/parametres', function () {
        return Inertia::render('Citoyen/Settings');
    })->name('citoyen.settings');

    Route::post('/demandes', [App\Http\Controllers\Api\V1\DemandeController::class, 'store'])->name('citoyen.demandes.store');
    Route::get('/demandes/{uuid}/bon-retrait', [App\Http\Controllers\Api\V1\DemandeController::class, 'downloadBonRetrait'])->name('citoyen.demandes.bon-retrait');
    Route::get('/demandes/{uuid}/document-officiel', [App\Http\Controllers\Api\V1\DemandeController::class, 'downloadDocumentOfficiel'])->name('citoyen.demandes.document-officiel');
});

// Agent Routes
Route::middleware(['auth', 'role:agent,administrateur'])->prefix('agent')->group(function () {
    Route::get('/tableau-de-bord', [App\Http\Controllers\Api\V1\AgentController::class, 'dashboard'])->name('agent.dashboard');

    Route::get('/demandes', function () {
        return Inertia::render('Agent/Demandes/Index', ['title' => 'Tous les dossiers']);
    })->name('agent.demandes.index');

    Route::get('/mes-dossiers', function () {
        return Inertia::render('Agent/Demandes/Index', ['title' => 'Mes assignations', 'mine' => true]);
    })->name('agent.mes-dossiers');

    Route::get('/demandes/{uuid}', function ($uuid) {
        return Inertia::render('Agent/Demandes/Show', ['uuid' => $uuid]);
    })->name('agent.demandes.show');

    Route::get('/messages', function () {
        return Inertia::render('Agent/Messages');
    })->name('agent.messages');

    Route::get('/parametres', function () {
        return Inertia::render('Agent/Settings');
    })->name('agent.settings');

    Route::get('/notifications', function () {
        return Inertia::render('Agent/Notifications');
    })->name('agent.notifications');
});

// Admin Routes
Route::middleware(['auth', 'role:administrateur'])->prefix('admin')->group(function () {
    Route::get('/tableau-de-bord', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/utilisateurs', [AdminController::class, 'users'])->name('admin.users');
    Route::get('/dossiers', [AdminController::class, 'demandes'])->name('admin.demandes');
    Route::post('/utilisateurs', [AdminController::class, 'storeUser'])->name('admin.users.store');
    Route::post('/utilisateurs/{user}/toggle', [AdminController::class, 'toggleUserStatus'])->name('admin.users.toggle');
    Route::put('/utilisateurs/{user}', [AdminController::class, 'updateUser'])->name('admin.users.update');
    Route::delete('/utilisateurs/{user}', [AdminController::class, 'destroyUser'])->name('admin.users.destroy');
    
    Route::get('/systeme', [AdminController::class, 'system'])->name('admin.system');
    Route::get('/statistiques', [AdminController::class, 'stats'])->name('admin.stats');

    Route::get('/notifications', [AdminController::class, 'notifications'])->name('admin.notifications');

    // Exports
    Route::get('/dossiers/export/excel', [AdminController::class, 'exportDossiersExcel'])->name('admin.dossiers.export.excel');
    Route::get('/dossiers/export/pdf',   [AdminController::class, 'exportDossiersPdf'])->name('admin.dossiers.export.pdf');
    Route::get('/statistiques/export/excel', [AdminController::class, 'exportStatsExcel'])->name('admin.stats.export.excel');
    Route::get('/statistiques/export/pdf',   [AdminController::class, 'exportStatsPdf'])->name('admin.stats.export.pdf');
    Route::post('/dossiers/{uuid}/reassign', [AdminController::class, 'reassignDemande'])->name('admin.demandes.reassign');

    Route::get('/modeles-documents', function () {
        return Inertia::render('Admin/DocumentTemplates');
    })->name('admin.document-templates');

    Route::get('/parametres', function () {
        return Inertia::render('Admin/Settings');
    })->name('admin.settings');
});

// Public verification route
Route::get('/verify/demandes/{uuid}', [\App\Http\Controllers\Api\V1\DemandeController::class, 'verifyPublic'])->name('demandes.verify.public');

