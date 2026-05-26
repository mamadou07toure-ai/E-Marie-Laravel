<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemandeMariage extends Model
{
    protected $fillable = [
        'demande_id', 'nom_epoux', 'prenom_epoux', 'date_naissance_epoux', 'lieu_naissance_epoux',
        'nom_epouse', 'prenom_epouse', 'date_naissance_epouse', 'lieu_naissance_epouse',
        'date_mariage', 'lieu_mariage', 'numero_acte_mariage', 'motif',
        'nombre_copies', 'observations'
    ];

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }
}
