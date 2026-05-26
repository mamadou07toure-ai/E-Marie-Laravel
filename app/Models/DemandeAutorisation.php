<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemandeAutorisation extends Model
{
    protected $fillable = [
        'demande_id', 'raison_sociale', 'prenoms', 'nature_autorisation',
        'description_detaillee', 'adresse_activite', 'date_debut', 'date_fin',
        'nombre_personnes', 'observations'
    ];

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }
}
