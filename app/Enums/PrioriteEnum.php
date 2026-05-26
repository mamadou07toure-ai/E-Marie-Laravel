<?php

namespace App\Enums;

enum PrioriteEnum: string
{
    case NORMALE = 'normale';
    case HAUTE = 'haute';
    case URGENTE = 'urgente';

    public function label(): string
    {
        return match($this) {
            self::NORMALE => 'Normale',
            self::HAUTE => 'Haute',
            self::URGENTE => 'Urgente',
        };
    }
}
