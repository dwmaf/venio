import { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import { Html5Qrcode } from 'html5-qrcode';
import { IconDuoCalendar, IconDuoClock, IconDuoLocation, IconPhCameraSlashDuotone } from '@/Components/Icons';
import { formatTanggalSlash, formatJamMenit } from "@/utils/format";

export default function Checkin({ event }) {
    const today = new Date().toISOString().split('T')[0];
    let eventCategoryLabel = '';
    let eventCategoryRoute = '';

    if (event.status === 'SELESAI') {
        eventCategoryLabel = 'Past Events';
        eventCategoryRoute = route('past.events');
    } else {
        if (event.tanggal_event === today) {
            eventCategoryLabel = 'Ongoing Events';
            eventCategoryRoute = route('ongoing.events');
        } else {
            eventCategoryLabel = 'Upcoming Events';
            eventCategoryRoute = route('upcoming.events');
        }
    }
    const breadcrumbs = [
        { label: 'Home', href: route('dashboard') },
        { label: 'Events', href: route('all.events') },
        { label: eventCategoryLabel, href: eventCategoryRoute },
        { label: event.nama_event || 'Detail Event', href: route('events.index', event.id) },
        { label: 'Scan QR', href: route('datang.index', event.id) },
    ];

    const [manualToken, setManualToken] = useState('');
    const [statusText, setStatusText] = useState('Menyiapkan kamera...');
    const [statusTone, setStatusTone] = useState('loading'); // loading, ready, warning, error
    const [lastResult, setLastResult] = useState(null);
    const [isCameraBlocked, setIsCameraBlocked] = useState(false);

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
            setIsCameraBlocked(false);
            showStatus('Scanner aktif. Arahkan kamera ke QR.', 'ready');
        }).catch((err) => {
            setIsCameraBlocked(true);
            showStatus('Izin kamera ditolak. Izinkan akses kamera pada browser, lalu refresh halaman. Atau gunakan input manual token.', 'error');
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
            const response = await axios.post(route('datang.scan', event.id), {
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
                if (!isCameraBlocked) { 
                    showStatus('Siap scan berikutnya. Arahkan kamera ke QR.', 'ready');
                } else {
                    showStatus('Izin kamera ditolak. Izinkan akses kamera pada browser, lalu refresh halaman. Gunakan input manual token.', 'error');
                }
            }, 1500);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        processToken(manualToken);
        setManualToken('');
    };

    return (
        <AdminLayout title="Events">
            <div className="flex flex-col gap-4">
                <Head title={`Scan Page - ${event.nama_event}`} />
                <Breadcrumb items={breadcrumbs} />

                <h2 className="font-['Plus_Jakarta_Sans'] font-medium text-2xl leading-none">{event.nama_event}</h2>

                <div className="flex gap-8">
                    <div className="flex gap-2.5 items-center">
                        <IconDuoCalendar className='w-6 h-6 text-neutral'/>
                        
                        <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none text-neutral">{formatTanggalSlash(event.tanggal_event)}</span>
                    </div>
                    <div className="flex gap-2.5 items-center">
                        <IconDuoClock className='w-6 h-6 text-neutral'/>
                        <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none text-neutral">{formatJamMenit(event.jam_mulai)} - {formatJamMenit(event.jam_selesai)}</span>
                    </div>
                    <div className="flex gap-2.5 items-center">
                        <IconDuoLocation className='w-6 h-6 text-neutral'/>
                        <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none text-neutral">{event.lokasi}</span>
                    </div>
                    {event.partners && event.partners.length > 0 && (
                        <div className="flex gap-2.5 items-center">
                            <IconPepHandshakePrint className='w-6 h-6 text-neutral'/>
                            <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none text-neutral">
                                {event.partners.map(partner => partner.nama).join(', ')}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-12">
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-2">
                            <h2 className="font-['Poppins'] font-medium text-2xl leading-none">Scanner QR Check-in Offline</h2>
                            <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none text-neutral">Arahkan kamera ke QR peserta atau gunakan input token manual jika kamera tidak tersedia.</span>
                        </div>
                        {/* status kamera */}
                        {statusTone !== 'error' && (
                            <span className={`self-start px-2 py-1 text-xs leading-none font-medium font-['Plus_Jakarta_Sans'] rounded-2xl ${statusTone === 'ready' ? 'bg-lime-50 text-lime-700' :
                                statusTone === 'loading' ? 'bg-blue-50 text-blue-700 ' :
                                    statusTone === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800 border border-red-200'
                                }`}>
                                {statusText}
                            </span>
                        )}

                    </div>
                    <div className="flex gap-12 lg:pr-12 lg:pl-8">
                        {/* kamera */}
                        <div className="w-full relative flex items-center justify-center bg-gray-100 min-h-75 overflow-hidden">
                            {(statusTone === 'loading' || statusTone === 'error') && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2 p-4">
                                    <IconPhCameraSlashDuotone className='w-12.5 h-12.5 text-neutral'/>
                                    {statusTone === 'error' && (
                                        <span className="font-['Plus_Jakarta_Sans'] text-sm text-red-600 font-medium mx-auto text-center leading-5">
                                            {statusText}
                                        </span>
                                    )}
                                </div>
                            )}
                            <div
                                id="reader"
                                className="w-full h-full"
                            ></div>
                        </div>
                        {/* bagian kanan */}
                        <div className="flex flex-col gap-4">
                            {/* panduan */}
                            <div className="flex flex-col border border-neutral/30 rounded-xl p-4 gap-3">
                                <span className="font-['Plus_Jakarta_Sans'] font-medium text-xl leading-none">Panduan Cepat</span>
                                <ol className="font-['Plus_Jakarta_Sans'] font-normal text-base text-neutral gap-2">
                                    <li>1. Pastikan pencahayaan cukup agar QR mudah terbaca.</li>
                                    <li>2. Arahkan QR tepat di area kamera sampai muncul notifikasi.</li>
                                    <li>3. Jika QR tidak terbaca, minta token lalu gunakan input manual.</li>
                                </ol>
                            </div>
                            {/* input */}
                            <div className="flex flex-col border border-neutral/30 p-4 gap-3 rounded-xl">
                                <h3 className="font-['Plus_Jakarta_Sans'] font-medium text-xl leading-none">Input Manual Token</h3>
                                <form onSubmit={handleManualSubmit} className="flex flex-col gap-3">
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-neutral/30 rounded-lg font-['Plus_Jakarta_Sans'] text-base placeholder:text-neutral leading-none"
                                        value={manualToken}
                                        onChange={(e) => setManualToken(e.target.value)}
                                        placeholder="Masukkan token QR"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-50 text-blue-700 font-medium p-3 border border-blue-700/30 rounded-lg transition cursor-pointer"
                                    >
                                        Proses Token
                                    </button>
                                </form>
                            </div>
                            {/* hasil terakhir */}
                            <div className="flex flex-col border border-neutral/30 p-4 gap-3 rounded-xl">
                                <h3 className="font-['Plus_Jakarta_Sans'] font-medium text-xl leading-none">Hasil Terakhir</h3>
                                {!lastResult ? (
                                    <p className="font-['Plus_Jakarta_Sans'] font-normal text-base text-neutral leading-none">Belum ada scan</p>
                                ) : (
                                    <div className="font-['Plus_Jakarta_Sans'] text-base">
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
                        </div>
                    </div>
                </div>


            </div>
        </AdminLayout>
    );
}