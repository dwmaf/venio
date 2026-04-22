<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>Link Zoom Peserta Online</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
    <h2 style="margin-bottom: 8px;">Informasi Link Zoom Peserta Online</h2>
    <p style="margin-top: 0;">Halo {{ $participant->nama_lengkap }},</p>

    <p>Anda terdaftar sebagai peserta online. Gunakan link berikut untuk mengikuti acara:</p>

    <p>
        <a href="{{ $zoomLink }}" style="display: inline-block; padding: 10px 14px; background: #2563eb; color: #fff; text-decoration: none; border-radius: 6px;">
            Buka Link Zoom
        </a>
    </p>

    <p>Jika tombol tidak dapat diklik, salin tautan berikut:</p>
    <p>{{ $zoomLink }}</p>

    <p>Terima kasih.</p>
</body>
</html>
