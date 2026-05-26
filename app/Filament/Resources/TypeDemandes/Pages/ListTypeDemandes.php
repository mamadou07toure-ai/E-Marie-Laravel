<?php

namespace App\Filament\Resources\TypeDemandes\Pages;

use App\Filament\Resources\TypeDemandes\TypeDemandeResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTypeDemandes extends ListRecords
{
    protected static string $resource = TypeDemandeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
