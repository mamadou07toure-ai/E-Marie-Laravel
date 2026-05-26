<?php

namespace App\Filament\Resources\Demandes\Schemas;

use App\Enums\PrioriteEnum;
use App\Enums\StatutDemandeEnum;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class DemandeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('uuid')
                    ->label('UUID')
                    ->required(),
                TextInput::make('numero_dossier')
                    ->required(),
                TextInput::make('user_id')
                    ->required()
                    ->numeric(),
                TextInput::make('agent_id')
                    ->numeric(),
                TextInput::make('type_demande_id')
                    ->required()
                    ->numeric(),
                Select::make('statut')
                    ->options(StatutDemandeEnum::class)
                    ->default('en_attente')
                    ->required(),
                Select::make('priorite')
                    ->options(PrioriteEnum::class)
                    ->default('normale')
                    ->required(),
                Textarea::make('description')
                    ->columnSpanFull(),
                Textarea::make('motif_rejet')
                    ->columnSpanFull(),
                Textarea::make('notes_internes')
                    ->columnSpanFull(),
                DatePicker::make('date_echeance'),
                DateTimePicker::make('date_cloture'),
            ]);
    }
}
