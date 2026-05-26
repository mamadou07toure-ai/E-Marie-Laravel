<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemandeChangementAdresse extends Model
{
    protected $fillable = [
        'demande_id', 'nom', 'prenoms', 'date_naissance', 'ancienne_adresse',
        'nouvelle_adresse', 'quartier_commune_nouveau', 'date_installation',
        'motif_changement', 'observations'
    ];

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }
}
