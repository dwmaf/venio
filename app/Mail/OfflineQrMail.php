<?php

namespace App\Mail;

use App\Models\Participant;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OfflineQrMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Participant $participant,
    ) {
    }

    /**
     * Create a new message instance.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'QR Check-in Peserta Offline',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.offline_qr',
        );
    }
}
