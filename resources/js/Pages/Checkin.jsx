import { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Html5Qrcode } from 'html5-qrcode';

export default function Checkin({ event }) {
    const [manualToken, setManualToken] = useState('');
    const [statusText, setStatusText] = useState('Menyiapkan kamera...');
    const [statusTone, setStatusTone] = useState('loading'); // loading, ready, warning, error
    const [lastResult, setLastResult] = useState(null);

    const scanLockRef = useRef(false);
    const lastTokenRef = useRef('');
    const lastHitMsRef = useRef(0);

    const showStatus = (text, tone) => {
        setStatusText(text);
        setStatusTone(tone);
    };

    useEffect(() => {
        // Kode ini men-trigger inisialisasi Kamera dari html5-qrcode
        const scanner = new Html5Qrcode('reader');
        const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 };

        scanner.start(
            { facingMode: 'environment' },
            config,
            (decodedText) => processToken(decodedText),
            () => { }
        ).then(() => {
            showStatus('Siap scan berikutnya. Arahkan kamera ke QR.', 'ready');
        }).catch((err) => {
            showStatus('Gagal mengakses kamera. Cek izin browser dan koneksi HTTPS. Izin kamera ditolak. Izinkan akses kamera pada browser, lalu refresh halaman. Gunakan input manual token.', 'error');
        });

        return () => {
            if (scanner.isScanning) scanner.stop();
        };
    }, []);

    const processToken = async (token) => {
        const cleanToken = token?.trim();
        if (!cleanToken || scanLockRef.current) return;

        const nowMs = Date.now();
        if (cleanToken === lastTokenRef.current && nowMs - lastHitMsRef.current < 1100) return; // Mencegah scan ganda cepat

        scanLockRef.current = true;
        lastTokenRef.current = cleanToken;
        lastHitMsRef.current = nowMs;
        showStatus('Memproses token...', 'loading');

        try {
            // Gunakan Axios agar CSRF Token Laravel ditambahkan otomatis 
            const response = await axios.post(route('inertia.datang.scan'), {
                token: cleanToken,
                scanner_info: navigator.userAgent
            });

            const payload = response.data;
            setLastResult(payload);

            if (payload.status === 'VALID') {
                showStatus('Scan valid dan berhasil dicatat.', 'ready');
                // Ganti alert bawaan dengan UI/SweetAlert nanti di FE
                alert(`SUCCESS: ${payload.participant_name}`);
            } else if (payload.status === 'DUPLICATE') {
                showStatus('Peserta sudah check-in sebelumnya.', 'warning');
                alert(`DUPLIKAT: ${payload.participant_name}`);
            } else {
                showStatus('Token tidak valid.', 'error');
                alert(`INVALID: ${payload.message}`);
            }
        } catch (error) {
            showStatus('Koneksi ke server check-in gagal.', 'error');
            alert('Error koneksi.');
        } finally {
            setTimeout(() => {
                scanLockRef.current = false;
                showStatus('Siap scan berikutnya. Arahkan kamera ke QR.', 'ready');
            }, 1500);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        processToken(manualToken);
        setManualToken('');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <Head title={`Scan Page - ${event.nama_event}`} />
            {/* Header / Hero */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 flex justify-between items-center flex-wrap gap-4">
                <div>
                    {/* Jika props event ada, tampilkan nama_event, jika tidak tampilkan default fallback */}
                    <h1 className="text-2xl font-bold text-gray-800">
                        {event ? event.nama_event : 'Scanner QR Check-in Offline'}
                    </h1>
                    <p className="text-sm text-gray-500">Arahkan kamera ke QR peserta atau gunakan input manual.</p>
                </div>

                <div className="flex space-x-3">
                    {event ? (
                        <>
                            {/* Tombol kembali ke Daftar Peserta Event */}
                            <Link
                                href={route('inertia.events.index', event.id)}
                                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition text-sm shadow-sm"
                            >
                                Daftar Peserta
                            </Link>

                            {/* Indikator Active (Scanner) */}
                            <span className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg font-medium text-sm cursor-default">
                                Scanner Aktif
                            </span>
                        </>
                    ) : (
                        <span className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-full text-xs font-semibold text-gray-700">
                            Mode Petugas Registrasi
                        </span>
                    )}
                </div>
            </div>

            {/* Header / Hero */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Scanner QR Check-in Offline</h2>
                    <p className="text-sm text-gray-500">Arahkan kamera ke QR peserta atau gunakan input manual.</p>
                </div>
                <span className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-full text-xs font-semibold text-gray-700">
                    Mode Petugas Registrasi
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Kamera Section */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-gray-800">Area Scanner</h3>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusTone === 'ready' ? 'bg-green-100 text-green-800 border border-green-200' :
                                    statusTone === 'loading' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                        statusTone === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                            'bg-red-100 text-red-800 border border-red-200'
                                }`}>
                                {statusText}
                            </span>
                        </div>

                        <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-2xl">
                            <div id="reader" className="min-h-75 w-full rounded-xl overflow-hidden bg-white"></div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Manual & Result) */}
                <div className="space-y-6">
                    {/* Manual Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Input Manual Token</h3>
                        <form onSubmit={handleManualSubmit} className="flex flex-col gap-3">
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={manualToken}
                                onChange={(e) => setManualToken(e.target.value)}
                                placeholder="Masukkan kode manual..."
                                required
                            />
                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
                            >
                                Proses Manual
                            </button>
                        </form>
                    </div>

                    {/* Last Result Box */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Hasil Terakhir</h3>
                        {!lastResult ? (
                            <p className="text-sm text-gray-500">Belum ada scan diproses.</p>
                        ) : (
                            <div className="text-sm">
                                <div className={`font-bold mb-2 ${lastResult.status === 'VALID' ? 'text-green-600' : lastResult.status === 'DUPLICATE' ? 'text-yellow-600' : 'text-red-600'}`}>
                                    {lastResult.status}
                                </div>
                                {lastResult.participant_name && <p className="text-gray-700">Nama: <span className="font-medium">{lastResult.participant_name}</span></p>}
                                {lastResult.event_name && <p className="text-gray-700">Event: <span className="font-medium">{lastResult.event_name}</span></p>}
                                {lastResult.checked_in_at && <p className="text-gray-700">Waktu: <span className="font-medium">{lastResult.checked_in_at}</span></p>}
                                {lastResult.status === 'INVALID' && <p className="text-gray-700">Ket: {lastResult.message}</p>}
                            </div>
                        )}
                    </div>

                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 class="font-semibold text-gray-800 mb-4">Panduan Cepat</h2>
                        <ol class="text-sm text-gray-500">
                            <li>Pastikan pencahayaan cukup agar QR mudah terbaca.</li>
                            <li>Arahkan QR tepat di area kamera sampai muncul notifikasi.</li>
                            <li>Jika QR tidak terbaca, minta token lalu gunakan input manual.</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}