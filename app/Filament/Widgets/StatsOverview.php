<?php

namespace App\Filament\Widgets;

use App\Enums\StatutDemandeEnum;
use App\Models\Demande;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Citoyens', User::where('role', \App\Enums\RoleEnum::CITOYEN)->count())
                ->description('Utilisateurs inscrits')
                ->descriptionIcon('heroicon-m-users')
                ->color('success'),
            Stat::make('Dossiers en attente', Demande::where('statut', StatutDemandeEnum::EN_ATTENTE)->count())
                ->description('À assigner aux agents')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),
            Stat::make('Taux de validation', $this->getValidationRate() . '%')
                ->description('Dossiers validés vs total')
                ->descriptionIcon('heroicon-m-check-badge')
                ->color('info'),
        ];
    }

    protected function getValidationRate(): int
    {
        $total = Demande::count();
        if ($total === 0) return 0;
        
        $validated = Demande::where('statut', StatutDemandeEnum::VALIDEE)->count();
        return round(($validated / $total) * 100);
    }
}
