<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'demande_id',
        'contenu',
        'lu',
        'lu_at',
        'edited_at',
    ];

    protected function casts(): array
    {
        return [
            'lu'        => 'boolean',
            'lu_at'     => 'datetime',
            'edited_at' => 'datetime',
        ];
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function demande()
    {
        return $this->belongsTo(Demande::class);
    }
}
