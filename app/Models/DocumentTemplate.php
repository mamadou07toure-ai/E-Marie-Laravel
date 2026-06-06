<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentTemplate extends Model
{
    protected $fillable = [
        'type_demande_id',
        'nom',
        'chemin_image',
        'champs',
        'actif',
    ];

    protected $casts = [
        'champs' => 'array',
        'actif'  => 'boolean',
    ];

    public function typeDemande()
    {
        return $this->belongsTo(TypeDemande::class, 'type_demande_id');
    }
}
