<?php

namespace App\Filament\Resources\Demandes;

use App\Filament\Resources\Demandes\Pages\CreateDemande;
use App\Filament\Resources\Demandes\Pages\EditDemande;
use App\Filament\Resources\Demandes\Pages\ListDemandes;
use App\Filament\Resources\Demandes\Schemas\DemandeForm;
use App\Filament\Resources\Demandes\Tables\DemandesTable;
use App\Models\Demande;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class DemandeResource extends Resource
{
    protected static ?string $model = Demande::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'numero_dossier';

    public static function form(Schema $schema): Schema
    {
        return DemandeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return DemandesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListDemandes::route('/'),
            'create' => CreateDemande::route('/create'),
            'edit' => EditDemande::route('/{record}/edit'),
        ];
    }
}
