<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoriqueStatut extends Model
{
    protected $table = 'historique_statuts';

    public $timestamps = true;
    const UPDATED_AT = null;

    protected $fillable = [
        'demande_id',
        'user_id',
        'ancien_statut',
        'nouveau_statut',
        'commentaire',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
