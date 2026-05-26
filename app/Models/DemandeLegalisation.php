<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemandeLegalisation extends Model
{
    protected $fillable = [
        'demande_id', 'nom', 'prenoms', 'type_document', 'description_document',
        'langue_document', 'pays_destination', 'usage_prevu', 'nombre_copies', 'observations'
    ];

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }
}
