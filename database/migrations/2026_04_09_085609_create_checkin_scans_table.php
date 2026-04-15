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
        Schema::create('checkin_scans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participant_id')->nullable()->constrained('participants')->nullOnDelete();
            $table->string('scanned_token', 64);
            $table->enum('result', ['VALID', 'DUPLICATE', 'INVALID']);
            $table->timestamp('scanned_at');
            $table->string('scanner_info')->nullable();
            $table->string('notes')->nullable();
            $table->timestamps();

            $table->index('scanned_token');
            $table->index(['result', 'scanned_at']);
            $table->index(['participant_id', 'scanned_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('checkin_scans');
    }
};
