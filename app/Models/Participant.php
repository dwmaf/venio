<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Participant extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_timestamp',
        'email_address_raw',
        'email_active_raw',
        'email_primary',
        'nama_lengkap',
        'jenis_kelamin',
        'no_hp_raw',
        'no_hp_normalized',
        'kategori_peserta',
        'spesialisasi',
        'instansi',
        'alamat_instansi',
        'metode_kehadiran',
        'kategori_biaya',
        'payment_proof_url',
        'persetujuan_data',
        'zoom_link',
        'qr_token',
        'qr_generated_at',
        'qr_sent_at',
        'zoom_sent_at',
        'checked_in_at',
        'dedupe_key_hash',
        'raw_payload_json',
    ];

    protected $casts = [
        'form_timestamp' => 'datetime',
        'persetujuan_data' => 'boolean',
        'qr_generated_at' => 'datetime',
        'qr_sent_at' => 'datetime',
        'zoom_sent_at' => 'datetime',
        'checked_in_at' => 'datetime',
        'raw_payload_json' => 'array',
    ];

    public function emailLogs(): HasMany
    {
        return $this->hasMany(EmailLog::class);
    }

    public function checkinScans(): HasMany
    {
        return $this->hasMany(CheckinScan::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
