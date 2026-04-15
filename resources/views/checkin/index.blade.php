@extends('layouts.app')

@section('title', 'Scanner Check-in')

@push('styles')
    <style>
        .scan-hero {
            border: 1px solid rgba(16, 57, 102, 0.1);
        }

        .scan-panel {
            border: 1px solid rgba(16, 57, 102, 0.1);
        }

        .reader-shell {
            border-radius: 14px;
            border: 1px solid rgba(28, 68, 120, 0.2);
            background: linear-gradient(155deg, #f4f9ff 0%, #eef8f6 100%);
            padding: 0.75rem;
        }

        #reader {
            min-height: 320px;
            border-radius: 12px;
            overflow: hidden;
            background: #f8fbff;
        }

        .scan-status-pill {
            border-radius: 999px;
            padding: 0.35rem 0.75rem;
            font-size: 0.8rem;
            font-weight: 700;
            border: 1px solid transparent;
            display: inline-flex;
            align-items: center;
        }

        .scan-status-pill.status-loading {
            background: #f4f7fb;
            color: #516476;
            border-color: #d9e3ee;
        }

        .scan-status-pill.status-ready {
            background: #e9f8ee;
            color: #166533;
            border-color: #bfe8cc;
        }

        .scan-status-pill.status-warning {
            background: #fff5e8;
            color: #855400;
            border-color: #f3ddb5;
        }

        .scan-status-pill.status-error {
            background: #ffecee;
            color: #9c2131;
            border-color: #f3b9c0;
        }

        .scan-guide {
            line-height: 1.6;
        }

        @media (max-width: 575.98px) {
            #reader {
                min-height: 260px;
            }
        }
    </style>
@endpush

@section('content')
    <div class="glass-card scan-hero p-3 p-md-4 mb-3">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
                <h2 class="h5 mb-1">Scanner QR Check-in Offline</h2>
                <p class="text-secondary small mb-0">Arahkan kamera ke QR peserta atau gunakan input token manual jika kamera tidak tersedia.</p>
            </div>
            <span class="badge rounded-pill text-bg-light border">Mode Petugas Registrasi</span>
        </div>
    </div>

    <div class="row g-3">
        <div class="col-lg-8">
            <div class="glass-card scan-panel p-3 p-md-4">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                    <h2 class="h6 mb-0">Kamera Scanner</h2>
                    <span id="scan-status" class="scan-status-pill status-loading">Menyiapkan kamera...</span>
                </div>
                <div class="reader-shell mt-3">
                    <div id="reader"></div>
                </div>
                <p class="small text-secondary mt-3 mb-0">Jika kamera ditolak browser, gunakan form manual di sisi kanan.</p>
            </div>
        </div>

        <div class="col-lg-4">
            <div class="glass-card p-3 p-md-4 mb-3">
                <h2 class="h6 mb-3">Input Manual Token</h2>
                <form id="manual-form" class="d-grid gap-2">
                    <input type="text" id="manual-token" class="form-control" placeholder="Masukkan token QR" required>
                    <button type="submit" class="btn btn-outline-primary">Proses Token</button>
                </form>
            </div>

            <div class="glass-card p-3 p-md-4 mb-3" id="last-result-box">
                <h2 class="h6 mb-3">Hasil Terakhir</h2>
                <div class="text-secondary small" id="last-result-content">Belum ada scan.</div>
            </div>

            <div class="glass-card p-3 p-md-4">
                <h2 class="h6 mb-2">Panduan Cepat</h2>
                <ol class="small text-secondary ps-3 mb-0 scan-guide">
                    <li>Pastikan pencahayaan cukup agar QR mudah terbaca.</li>
                    <li>Arahkan QR tepat di area kamera sampai muncul notifikasi.</li>
                    <li>Jika QR tidak terbaca, minta token lalu gunakan input manual.</li>
                </ol>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        (() => {
            const scanEndpoint = @json(route('checkin.scan'));
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            const statusElement = document.getElementById('scan-status');
            const lastResultContent = document.getElementById('last-result-content');
            const secureContext = window.isSecureContext;
            const manualTokenInput = document.getElementById('manual-token');

            let scanLock = false;
            let lastToken = '';
            let lastHitMs = 0;

            const showStatus = (message, tone = 'loading') => {
                statusElement.textContent = message;
                statusElement.classList.remove('status-loading', 'status-ready', 'status-warning', 'status-error');
                statusElement.classList.add(`status-${tone}`);
            };

            const humanizeCameraError = (error) => {
                const raw = error && error.message ? error.message : '';
                const normalized = String(raw).toLowerCase();

                if (!secureContext) {
                    return 'Akses kamera butuh HTTPS atau localhost. Buka aplikasi melalui URL aman lalu coba lagi.';
                }

                if (normalized.includes('notallowederror') || normalized.includes('permission denied') || normalized.includes('permissiondismissederror')) {
                    return 'Izin kamera ditolak. Izinkan akses kamera pada browser, lalu refresh halaman.';
                }

                if (normalized.includes('notfounderror') || normalized.includes('devicesnotfounderror')) {
                    return 'Kamera tidak ditemukan. Pastikan perangkat memiliki kamera yang aktif.';
                }

                if (normalized.includes('notreadableerror') || normalized.includes('trackstarterror')) {
                    return 'Kamera sedang dipakai aplikasi lain. Tutup aplikasi kamera lain lalu coba lagi.';
                }

                return 'Gagal mengakses kamera. Cek izin browser dan koneksi HTTPS.';
            };

            const showResult = async (payload) => {
                const participantName = payload.participant_name || '-';
                const checkedInAt = payload.checked_in_at || '-';

                if (payload.status === 'VALID') {
                    showStatus('Scan valid dan berhasil dicatat.', 'ready');
                    await Swal.fire({
                        icon: 'success',
                        title: 'Check-in Berhasil',
                        html: `<strong>${participantName}</strong><br>${checkedInAt}`,
                        confirmButtonText: 'Lanjut Scan',
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });

                    lastResultContent.innerHTML = `<div class="text-success fw-semibold">SUKSES</div><div>${participantName}</div><div class="small text-secondary">${checkedInAt}</div>`;
                    showStatus('Siap scan berikutnya. Arahkan kamera ke QR.', 'ready');
                    return;
                }

                if (payload.status === 'DUPLICATE') {
                    showStatus('Peserta sudah check-in sebelumnya.', 'warning');
                    await Swal.fire({
                        icon: 'warning',
                        title: 'Sudah Check-in',
                        html: `<strong>${participantName}</strong><br>${checkedInAt}`,
                        confirmButtonText: 'Lanjut Scan',
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });

                    lastResultContent.innerHTML = `<div class="text-warning fw-semibold">DUPLIKAT</div><div>${participantName}</div><div class="small text-secondary">${checkedInAt}</div>`;
                    showStatus('Siap scan berikutnya. Arahkan kamera ke QR.', 'ready');
                    return;
                }

                showStatus('Token tidak valid. Cek kembali QR atau token.', 'error');

                await Swal.fire({
                    icon: 'error',
                    title: 'QR Tidak Valid',
                    text: payload.message || 'Token tidak ditemukan.',
                    confirmButtonText: 'Lanjut Scan',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });

                lastResultContent.innerHTML = `<div class="text-danger fw-semibold">INVALID</div><div class="small text-secondary">${payload.message || '-'}</div>`;
                showStatus('Siap scan berikutnya. Arahkan kamera ke QR.', 'ready');
            };

            const submitToken = async (token) => {
                const cleanToken = (token || '').trim();
                if (!cleanToken || scanLock) {
                    return;
                }

                showStatus('Memproses token...', 'loading');

                const nowMs = Date.now();
                if (cleanToken === lastToken && nowMs - lastHitMs < 1100) {
                    return;
                }

                scanLock = true;
                lastToken = cleanToken;
                lastHitMs = nowMs;

                try {
                    const response = await fetch(scanEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': csrfToken,
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            token: cleanToken,
                            scanner_info: navigator.userAgent
                        })
                    });

                    const payload = await response.json();
                    await showResult(payload);
                } catch (error) {
                    showStatus('Koneksi ke server check-in gagal.', 'error');
                    await Swal.fire({
                        icon: 'error',
                        title: 'Koneksi Gagal',
                        text: 'Tidak dapat menghubungi server check-in.',
                        confirmButtonText: 'Coba Lagi',
                        allowOutsideClick: false,
                        allowEscapeKey: false
                    });
                    showStatus('Siap scan berikutnya. Arahkan kamera ke QR.', 'ready');
                } finally {
                    scanLock = false;
                }
            };

            document.getElementById('manual-form').addEventListener('submit', (event) => {
                event.preventDefault();
                const token = manualTokenInput.value;
                submitToken(token);
                manualTokenInput.value = '';
                manualTokenInput.focus();
            });

            const startScanner = () => {
                if (typeof Html5Qrcode === 'undefined') {
                    showStatus('Library scanner tidak termuat.', 'error');
                    return;
                }

                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    showStatus('Browser tidak mendukung akses kamera. Gunakan input manual token.', 'warning');
                    return;
                }

                if (!secureContext) {
                    showStatus('Akses kamera diblokir karena koneksi belum HTTPS. Gunakan input manual token.', 'warning');
                    return;
                }

                const scanner = new Html5Qrcode('reader');
                const config = {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1
                };

                scanner.start(
                    { facingMode: 'environment' },
                    config,
                    (decodedText) => submitToken(decodedText),
                    () => {}
                ).then(() => {
                    showStatus('Scanner aktif. Arahkan kamera ke QR.', 'ready');
                }).catch((primaryError) => {
                    const primaryMsg = humanizeCameraError(primaryError);

                    Html5Qrcode.getCameras().then((cameras) => {
                        if (!cameras.length) {
                            showStatus('Kamera tidak ditemukan. Gunakan input manual token.', 'warning');
                            return;
                        }

                        const rearCamera = cameras.find((camera) =>
                            /back|rear|environment|belakang/i.test(camera.label || '')
                        );
                        const preferredCamera = rearCamera ?? cameras[0];

                        scanner.start(
                            preferredCamera.id,
                            config,
                            (decodedText) => submitToken(decodedText),
                            () => {}
                        ).then(() => {
                            showStatus('Scanner aktif. Arahkan kamera ke QR.', 'ready');
                        }).catch((fallbackStartError) => {
                            showStatus(`${humanizeCameraError(fallbackStartError)} Gunakan input manual token.`, 'error');
                        });
                    }).catch((listError) => {
                        const listMsg = humanizeCameraError(listError);
                        showStatus(`${primaryMsg} ${listMsg} Gunakan input manual token.`, 'error');
                    });
                });
            };

            startScanner();
        })();
    </script>
@endpush
