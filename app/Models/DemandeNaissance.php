<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemandeNaissance extends Model
{
    protected $fillable = [
        'demande_id', 'nom', 'prenoms', 'date_naissance', 'lieu_naissance', 'genre',
        'nom_pere', 'prenom_pere', 'date_naissance_pere', 'profession_pere',
        'nom_mere', 'prenom_mere', 'date_naissance_mere', 'profession_mere',
        'nombre_copies', 'motif', 'observations'
    ];

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }
}
