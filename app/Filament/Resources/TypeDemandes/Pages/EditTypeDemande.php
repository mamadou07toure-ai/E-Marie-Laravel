<?php

namespace App\Filament\Resources\TypeDemandes\Pages;

use App\Filament\Resources\TypeDemandes\TypeDemandeResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditTypeDemande extends EditRecord
{
    protected static string $resource = TypeDemandeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
