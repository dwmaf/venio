<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <title>QR Check-in Peserta Offline</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937;">
    @php
        $qrImageUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data='.rawurlencode((string) $participant->qr_token);
    @endphp

    <h2 style="margin-bottom: 8px;">Konfirmasi Registrasi Peserta Offline</h2>
    <p style="margin-top: 0;">Halo {{ $participant->nama_lengkap }},</p>

    <p>Berikut adalah QR untuk check-in pada hari acara. Mohon tunjukkan QR ini kepada petugas saat registrasi ulang.</p>

    <div style="margin: 16px 0; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; display: inline-block;">
        <img src="{{ $qrImageUrl }}" alt="QR Check-in {{ $participant->nama_lengkap }}" width="280" height="280" style="display:block; border:0; outline:none; text-decoration:none;">
    </div>

    <p style="margin-top: 0;">Jika gambar QR tidak terlihat, buka link ini: <a href="{{ $qrImageUrl }}" target="_blank" rel="noopener noreferrer">Lihat QR Check-in</a></p>

    <p><strong>Token QR:</strong> {{ $participant->qr_token }}</p>
    <p>Terima kasih.</p>
</body>
</html>
