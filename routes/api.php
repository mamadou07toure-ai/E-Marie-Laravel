<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DemandeController;
use App\Http\Controllers\Api\V1\AgentController;
use App\Http\Controllers\Api\V1\DocumentController;
use App\Http\Controllers\Api\V1\DocumentTemplateController;
use App\Http\Controllers\Api\V1\MessageController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\RendezVousController;
use App\Models\Notification;
use App\Models\Setting;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
            Route::patch('/profile', [ProfileController::class, 'update']);
            Route::patch('/password', [ProfileController::class, 'updatePassword']);
            Route::post('/avatar', [ProfileController::class, 'updateAvatar']);
        });
    });

    // Citoyen routes
    Route::middleware(['auth:sanctum', 'role:citoyen'])->group(function () {
        Route::get('/demandes/stats', [DemandeController::class, 'stats']);
        Route::get('/demandes/types', [DemandeController::class, 'types']);
        Route::apiResource('demandes', DemandeController::class)->only(['index', 'store', 'show']);
        Route::post('/demandes/{uuid}/documents', [DemandeController::class, 'addDocument']);
    });

    // Notifications
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/notifications', function () {
            return response()->json(
                Notification::where('user_id', request()->user()->id)
                    ->orderByDesc('created_at')
                    ->limit(20)
                    ->get(['id', 'type', 'message', 'lu', 'created_at'])
            );
        });
        Route::patch('/notifications/{id}/lu', function ($id) {
            $notif = Notification::where('id', $id)
                ->where('user_id', request()->user()->id)
                ->firstOrFail();
            $notif->update(['lu' => true, 'lu_at' => now()]);
            return response()->json(['ok' => true]);
        });
        Route::post('/notifications/mark-all-read', function () {
            Notification::where('user_id', request()->user()->id)
                ->where('lu', false)
                ->update(['lu' => true, 'lu_at' => now()]);
            return response()->json(['ok' => true]);
        });
    });

    // Documents (accès authentifié tous rôles)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/documents/{id}/download', [DocumentController::class, 'download']);
        Route::post('/documents/upload', [DocumentController::class, 'upload']);
        Route::delete('/documents/{id}', [DocumentController::class, 'destroy']);
    });

    // Rendez-vous (retrait acte civil)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/demandes/{uuid}/rdv', [RendezVousController::class, 'getRdv']);
        Route::get('/demandes/{uuid}/slots', [RendezVousController::class, 'getSlots']);
        Route::post('/demandes/{uuid}/rdv', [RendezVousController::class, 'bookSlot']);
    });

    // Messages (citoyens ↔ agents)
    Route::middleware('auth:sanctum')->prefix('messages')->group(function () {
        Route::get('/conversations', [MessageController::class, 'conversations']);
        Route::get('/dossiers/{uuid}', [MessageController::class, 'getDossierMessages']);
        Route::post('/dossiers/{uuid}', [MessageController::class, 'sendDossierMessage']);
        Route::get('/{userId}', [MessageController::class, 'index']);
        Route::post('/', [MessageController::class, 'store']);
        Route::patch('/{id}', [MessageController::class, 'update']);
        Route::delete('/{id}', [MessageController::class, 'destroy']);
    });

    // Settings admin
    Route::middleware(['auth:sanctum', 'role:administrateur'])->group(function () {
        Route::get('/settings', function () {
            $keys = ['two_factor', 'cloud_backup', 'maintenance', 'mairie_nom', 'mairie_email'];
            $settings = [];
            foreach ($keys as $key) {
                $settings[$key] = Setting::get($key);
            }
            return response()->json($settings);
        });
        Route::post('/settings', function (\Illuminate\Http\Request $request) {
            foreach ($request->all() as $key => $value) {
                Setting::set($key, $value);
            }
            return response()->json(['message' => 'Paramètres sauvegardés.']);
        });
    });

    // Agent routes — accessibles aux agents ET aux admins
    Route::middleware(['auth:sanctum', 'role:agent,administrateur'])->prefix('agent')->group(function () {
        Route::get('/stats', [AgentController::class, 'stats']);
        Route::get('/demandes', [AgentController::class, 'index']);
        Route::get('/demandes/{uuid}', [AgentController::class, 'show']);
        Route::post('/demandes/{uuid}/assign', [AgentController::class, 'assign']);
        Route::patch('/demandes/{uuid}/statut', [AgentController::class, 'updateStatus']);
        Route::post('/demandes/{uuid}/notes', [AgentController::class, 'addNote']);
        Route::post('/demandes/{uuid}/close', [AgentController::class, 'closeDossier']);
    });

    // Document templates — admin uniquement pour la gestion, agent+citoyen pour la génération
    Route::middleware(['auth:sanctum', 'role:administrateur'])->prefix('document-templates')->group(function () {
        Route::get('/',            [DocumentTemplateController::class, 'index']);
        Route::post('/',           [DocumentTemplateController::class, 'store']);
        Route::put('/{id}/champs', [DocumentTemplateController::class, 'updateChamps']);
        Route::patch('/{id}/toggle', [DocumentTemplateController::class, 'toggle']);
        Route::delete('/{id}',     [DocumentTemplateController::class, 'destroy']);
    });

    // Génération PDF — accessible aux agents et citoyens authentifiés
    Route::middleware('auth:sanctum')->get('/demandes/{uuid}/generer-document', [DocumentTemplateController::class, 'generer']);
});
