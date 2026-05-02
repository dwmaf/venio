<?php

namespace App\Mail;

use App\Models\Participant;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\Middleware\RateLimited;

class OnlineZoomMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Participant $participant,
        public string $zoomLink,
    ) {
    }

    /**
     * Create a new message instance.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Link Zoom Peserta Online',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.online_zoom',
        );
    }

    /**
     * Get the middleware the job should pass through.
     *
     * @return array<int, object>
     */
    public function middleware(): array
    {
        // Sebutkan nama rate limiter yang dibuat di AppServiceProvider
        return [new RateLimited('emails')];
    }
}
