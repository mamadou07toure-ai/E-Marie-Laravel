<?php

namespace App\Enums;

enum RoleEnum: string
{
    case CITOYEN = 'citoyen';
    case AGENT = 'agent';
    case ADMINISTRATEUR = 'administrateur';

    public function label(): string
    {
        return match($this) {
            self::CITOYEN => 'Citoyen',
            self::AGENT => 'Agent Mairie',
            self::ADMINISTRATEUR => 'Administrateur',
        };
    }
}
