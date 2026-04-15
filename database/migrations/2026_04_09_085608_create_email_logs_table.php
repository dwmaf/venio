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
        Schema::create('email_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('participant_id')->constrained('participants')->cascadeOnDelete();
            $table->enum('email_type', ['QR_OFFLINE', 'ZOOM_ONLINE']);
            $table->string('recipient_email');
            $table->string('subject');
            $table->enum('status', ['SENT', 'FAILED']);
            $table->timestamp('sent_at')->nullable();
            $table->text('error_message')->nullable();
            $table->string('triggered_by')->nullable();
            $table->timestamps();

            $table->index(['participant_id', 'email_type']);
            $table->index(['status', 'sent_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_logs');
    }
};
