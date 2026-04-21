<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->nullable()->constrained('events')->cascadeOnUpdate();
            $table->timestamp('form_timestamp')->nullable();
            $table->string('email_address_raw')->nullable();
            $table->string('email_active_raw')->nullable();
            $table->string('email_primary');
            $table->string('nama_lengkap');
            $table->string('jenis_kelamin')->nullable();
            $table->string('no_hp_raw')->nullable();
            $table->string('no_hp_normalized', 32)->nullable();
            $table->string('kategori_peserta')->nullable();
            $table->string('spesialisasi')->nullable();
            $table->string('instansi')->nullable();
            $table->text('alamat_instansi')->nullable();            
            $table->string('kategori_biaya')->nullable();
            $table->enum('metode_kehadiran', ['OFFLINE', 'ONLINE'])->default('OFFLINE'); 
            $table->text('payment_proof_url')->nullable();
            $table->boolean('persetujuan_data')->default(false);
            $table->text('zoom_link')->nullable();
            $table->string('qr_token', 64)->nullable();
            $table->timestamp('qr_generated_at')->nullable();
            $table->timestamp('qr_sent_at')->nullable();
            $table->timestamp('zoom_sent_at')->nullable();
            $table->timestamp('checked_in_at')->nullable();
            $table->char('dedupe_key_hash', 64)->unique();
            $table->json('raw_payload_json')->nullable();
            $table->timestamps();

            $table->unique('qr_token');
            $table->index(['checked_in_at']);
            $table->index('email_primary');
            $table->index('no_hp_normalized');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participants');
    }
};
