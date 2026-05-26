<?php

namespace App\Filament\Resources\Demandes\Pages;

use App\Filament\Resources\Demandes\DemandeResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditDemande extends EditRecord
{
    protected static string $resource = DemandeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
