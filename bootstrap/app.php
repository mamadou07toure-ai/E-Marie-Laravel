<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);

        // Active EnsureFrontendRequestsAreStateful pour les routes /api/*
        // Cela partage la session web avec les requêtes API (cookie-based auth)
        $middleware->statefulApi();

        // Suppression d'AuthenticateSession sur TOUTES les stacks :
        // Ce middleware invalide la session si le hash du mot de passe a changé
        // en DB depuis la connexion, provoquant des déconnexions silencieuses
        // lors des appels API en arrière-plan (polling notifications/messages).
        $middleware->remove([
            \Illuminate\Session\Middleware\AuthenticateSession::class,
            \Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
