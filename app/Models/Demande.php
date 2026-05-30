<?php

namespace App\Models;

use App\Enums\PrioriteEnum;
use App\Enums\StatutDemandeEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Demande extends Model
{
    protected $fillable = [
        'uuid',
        'numero_dossier',
        'user_id',
        'agent_id',
        'type_demande_id',
        'statut',
        'priorite',
        'description',
        'donnees_formulaire',
        'is_physical_pickup',
        'motif_rejet',
        'piece_manquante',
        'notes_internes',
        'date_echeance',
        'date_cloture',
    ];

    protected $casts = [
        'statut' => StatutDemandeEnum::class,
        'priorite' => PrioriteEnum::class,
        'donnees_formulaire' => 'array',
        'date_echeance' => 'date',
        'date_cloture' => 'datetime',
    ];

    protected static function booted()
    {
        static::creating(function ($demande) {
            if (empty($demande->uuid)) {
                $demande->uuid = (string) Str::uuid();
            }

            if (empty($demande->numero_dossier)) {
                $year = date('Y');
                // Lock the table for accurate counting if needed, but for local use this is fine
                $count = static::whereYear('created_at', $year)->count() + 1;
                $demande->numero_dossier = "MAI-{$year}-" . str_pad($count, 5, '0', STR_PAD_LEFT);
            }

            if (empty($demande->date_echeance) && $demande->type_demande_id) {
                $type = TypeDemande::find($demande->type_demande_id);
                if ($type) {
                    $demande->date_echeance = now()->addDays($type->delai_jours_ouvrables);
                }
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function typeDemande()
    {
        return $this->belongsTo(TypeDemande::class, 'type_demande_id');
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function historiqueStatuts()
    {
        return $this->hasMany(HistoriqueStatut::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function naissance()
    {
        return $this->hasOne(DemandeNaissance::class);
    }

    public function residence()
    {
        return $this->hasOne(DemandeResidence::class);
    }

    public function mariage()
    {
        return $this->hasOne(DemandeMariage::class);
    }

    public function legalisation()
    {
        return $this->hasOne(DemandeLegalisation::class);
    }

    public function autorisation()
    {
        return $this->hasOne(DemandeAutorisation::class);
    }

    public function changementAdresse()
    {
        return $this->hasOne(DemandeChangementAdresse::class);
    }
}
