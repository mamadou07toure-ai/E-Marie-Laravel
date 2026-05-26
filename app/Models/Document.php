<?php

namespace App\Models;

use App\Enums\TypeDocumentEnum;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'demande_id',
        'uploaded_by',
        'nom_original',
        'chemin_stockage',
        'type_mime',
        'taille_octets',
        'type_document',
        'is_validated',
        'created_at',
    ];

    protected $casts = [
        'type_document' => TypeDocumentEnum::class,
        'is_validated' => 'boolean',
        'created_at' => 'datetime',
        'taille_octets' => 'integer',
    ];

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
