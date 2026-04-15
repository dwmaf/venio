<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CheckinScan extends Model
{
    use HasFactory;

    protected $fillable = [
        'participant_id',
        'scanned_token',
        'result',
        'scanned_at',
        'scanner_info',
        'notes',
    ];

    protected $casts = [
        'scanned_at' => 'datetime',
    ];

    public function participant(): BelongsTo
    {
        return $this->belongsTo(Participant::class);
    }
}
