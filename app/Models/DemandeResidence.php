<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemandeResidence extends Model
{
    protected $fillable = [
        'demande_id', 'nom', 'prenoms', 'date_naissance', 'lieu_naissance',
        'adresse_complete', 'profession', 'quartier_commune', 'duree_residence',
        'motif', 'nombre_copies', 'observations'
    ];

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }
}
