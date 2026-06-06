<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeDemande extends Model
{
    protected $table = 'types_demandes';

    protected $fillable = [
        'code',
        'libelle',
        'description',
        'delai_jours_ouvrables',
        'is_active',
    ];

    protected $casts = [
        'delai_jours_ouvrables' => 'integer',
        'is_active' => 'boolean',
    ];

    public function demandes()
    {
        return $this->hasMany(Demande::class);
    }

    public function documentTemplate()
    {
        return $this->hasOne(DocumentTemplate::class);
    }
}
