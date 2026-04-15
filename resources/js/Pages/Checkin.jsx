import { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';

// Ingatkan FE Anda untuk "npm install html5-qrcode", atau uncomment jika dia pakai library lain
// import { Html5Qrcode } from 'html5-qrcode';

export default function Checkin() {
    const [manualToken, setManualToken] = useState('');
    const [status, setStatus] = useState('Menyiapkan kamera...');
    const [lastResult, setLastResult] = useState(null);
    const scanLockRef = useRef(false);

    useEffect(() => {
        // Kode ini men-trigger inisialisasi Kamera dari html5-qrcode
        const scanner = new Html5Qrcode('reader');
        const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 };

        scanner.start(
            { facingMode: 'environment' },
            config,
            (decodedText) => processToken(decodedText),
            () => {} // onError callback dibiarkan kosong agar tidak spam log
        ).then(() => {
            setStatus('Scanner aktif. Arahkan kamera ke QR.');
        }).catch((err) => {
            setStatus('Gagal mengakses kamera. Gunakan input manual token.');
        });

        return () => {
            if (scanner.isScanning) {
                scanner.stop();
            }
        };
    }, []);

    const processToken = async (token) => {
        const cleanToken = token?.trim();
        if (!cleanToken || scanLockRef.current) return;

        scanLockRef.current = true;
        setStatus('Memproses token...');

        try {
            // Gunakan Axios agar CSRF Token Laravel ditambahkan otomatis 
            const response = await axios.post(route('inertia.datang.scan'), {
                token: cleanToken,
                scanner_info: navigator.userAgent
            });

            const payload = response.data;
            setLastResult(payload);

            if (payload.status === 'VALID') {
                setStatus('Scan valid dan berhasil dicatat.');
                // Ganti alert bawaan dengan UI/SweetAlert nanti di FE
                alert(`SUCCESS: ${payload.participant_name}`); 
            } else if (payload.status === 'DUPLICATE') {
                setStatus('Peserta sudah check-in sebelumnya.');
                alert(`DUPLIKAT: ${payload.participant_name}`);
            } else {
                setStatus('Token tidak valid.');
                alert(`INVALID: ${payload.message}`);
            }
        } catch (error) {
            setStatus('Koneksi ke server check-in gagal.');
            alert('Error koneksi.');
        } finally {
            scanLockRef.current = false;
            setTimeout(() => {
                setStatus('Siap scan berikutnya. Arahkan kamera ke QR.');
            }, 1000);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        processToken(manualToken);
        setManualToken('');
    };

    return (
        <div>
            <Head title="Scanner Check-in" />
            
            <h2>Scanner QR Check-in Offline</h2>
            <p>Mode Petugas Registrasi</p>

            <div style={{ display: 'flex', gap: '20px' }}>
                {/* Area Kamera */}
                <div style={{ flex: 2 }}>
                    <h3>Kamera Scanner</h3>
                    <p>Status: <strong>{status}</strong></p>
                    
                    {/* Kotak tempat UI kamera digambar oleh library QrCode */}
                    <div id="reader" style={{ minHeight: '300px', border: '1px solid #ccc' }}></div>
                </div>

                {/* Area Manual & Hasil */}
                <div style={{ flex: 1 }}>
                    <h3>Input Manual Token</h3>
                    <form onSubmit={handleManualSubmit}>
                        <input
                            type="text"
                            value={manualToken}
                            onChange={(e) => setManualToken(e.target.value)}
                            placeholder="Masukkan token QR"
                            required
                        />
                        <button type="submit">Proses Token</button>
                    </form>

                    <br/>
                    
                    <h3>Hasil Terakhir</h3>
                    <div>
                        {!lastResult ? (
                            <p>Belum ada scan.</p>
                        ) : (
                            <div>
                                <p>Status: <strong>{lastResult.status}</strong></p>
                                {lastResult.participant_name && <p>Nama: {lastResult.participant_name}</p>}
                                {lastResult.checked_in_at && <p>Waktu: {lastResult.checked_in_at}</p>}
                                {lastResult.status === 'INVALID' && <p>Catatan: {lastResult.message}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}