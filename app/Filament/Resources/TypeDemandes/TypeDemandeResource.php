<?php

namespace App\Filament\Resources\TypeDemandes;

use App\Filament\Resources\TypeDemandes\Pages\CreateTypeDemande;
use App\Filament\Resources\TypeDemandes\Pages\EditTypeDemande;
use App\Filament\Resources\TypeDemandes\Pages\ListTypeDemandes;
use App\Filament\Resources\TypeDemandes\Schemas\TypeDemandeForm;
use App\Filament\Resources\TypeDemandes\Tables\TypeDemandesTable;
use App\Models\TypeDemande;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class TypeDemandeResource extends Resource
{
    protected static ?string $model = TypeDemande::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'no';

    public static function form(Schema $schema): Schema
    {
        return TypeDemandeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return TypeDemandesTable::configure($table);
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
            'index' => ListTypeDemandes::route('/'),
            'create' => CreateTypeDemande::route('/create'),
            'edit' => EditTypeDemande::route('/{record}/edit'),
        ];
    }
}
