<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'nama_event',
        'lokasi',
        'tanggal_event',
        'jam_mulai',
        'jam_selesai',
        'tipe_event',
        'quota',
    ];

    

    public function participants()
    {
        return $this->hasMany(Participant::class);
    }

    public function partners()
    {
        return $this->belongsToMany(Partner::class);
    }
}
