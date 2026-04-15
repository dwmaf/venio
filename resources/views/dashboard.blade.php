@extends('layouts.app')

@section('title', 'Dashboard Registrasi')

@push('styles')
    <style>
        .dashboard-action-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.45rem;
            width: 100%;
        }

        .dashboard-action-btn {
            width: 100%;
            min-height: 38px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            line-height: 1.2;
            white-space: normal;
            padding-inline: 0.55rem;
        }

        .dashboard-action-btn-wide {
            grid-column: 1 / -1;
        }

        @media (min-width: 768px) {
            .dashboard-action-grid {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-end;
                width: auto;
                gap: 0.5rem;
            }

            .dashboard-action-btn,
            .dashboard-action-btn-wide {
                width: auto;
                grid-column: auto;
                white-space: nowrap;
            }
        }
    </style>
@endpush

@section('content')
    <div class="row g-3 mb-4">
        <div class="col-6 col-lg-3">
            <div class="glass-card p-3 h-100">
                <p class="text-secondary mb-1">Total Peserta</p>
                <h2 class="h4 mb-0">{{ $stats['total'] }}</h2>
            </div>
        </div>
        <div class="col-6 col-lg-3">
            <div class="glass-card p-3 h-100">
                <p class="text-secondary mb-1">Offline</p>
                <h2 class="h4 mb-0">{{ $stats['offline'] }}</h2>
            </div>
        </div>
        <div class="col-6 col-lg-3">
            <div class="glass-card p-3 h-100">
                <p class="text-secondary mb-1">Online</p>
                <h2 class="h4 mb-0">{{ $stats['online'] }}</h2>
            </div>
        </div>
        <div class="col-6 col-lg-3">
            <div class="glass-card p-3 h-100">
                <p class="text-secondary mb-1">Offline Sudah Check-in</p>
                <h2 class="h4 mb-0">{{ $stats['checked_in'] }}</h2>
            </div>
        </div>
    </div>

    <div class="glass-card p-3 p-md-4">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
            <div>
                <h3 class="h5 mb-1">Daftar Peserta</h3>
                <p class="text-secondary small mb-0">Kelola peserta, impor data, dan kirim informasi dalam satu area.</p>
            </div>
            <div class="dashboard-action-grid">
                <button type="button" class="btn btn-sm btn-primary dashboard-action-btn" data-bs-toggle="modal" data-bs-target="#importParticipantsModal">Import Peserta</button>
                <a href="{{ route('export.wa') }}" class="btn btn-sm btn-success dashboard-action-btn">Export WA</a>
                <button type="button" class="btn btn-sm btn-outline-success dashboard-action-btn" data-bs-toggle="modal" data-bs-target="#sendZoomBulkModal">Kirim Zoom Bulk</button>
                <button type="button" class="btn btn-sm btn-outline-primary dashboard-action-btn" data-bs-toggle="modal" data-bs-target="#sendQrBulkModal">Kirim QR Bulk</button>
                <a href="{{ route('export.recap') }}" class="btn btn-sm btn-outline-dark dashboard-action-btn dashboard-action-btn-wide">Export Rekap Hadir</a>
            </div>
        </div>

        <div class="row g-2 align-items-end mb-3">
            <div class="col-12 col-md-4 col-lg-3">
                <label for="methodFilter" class="form-label form-label-sm mb-1">Filter Metode Kehadiran</label>
                <form action="{{ route('dashboard') }}" method="get" class="d-grid">
                    <select class="form-select form-select-sm method-filter-select" name="metode" id="methodFilter" aria-label="Filter metode kehadiran">
                        <option value="" {{ $method === '' ? 'selected' : '' }}>Semua Metode</option>
                        <option value="OFFLINE" {{ $method === 'OFFLINE' ? 'selected' : '' }}>Offline</option>
                        <option value="ONLINE" {{ $method === 'ONLINE' ? 'selected' : '' }}>Online</option>
                    </select>
                </form>
            </div>
            <div class="col-12 col-md-8 col-lg-9">
                <div class="small text-secondary">Menampilkan {{ $participants->count() }} dari total {{ $participants->total() }} peserta.</div>
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-hover align-middle">
                <thead>
                    <tr>
                        <th>Nama</th>
                        <th>Metode</th>
                        <th class="d-none d-xl-table-cell">Email</th>
                        <th class="d-none d-xl-table-cell">No HP</th>
                        <th class="d-none d-xl-table-cell">Status</th>
                        <th class="d-none d-xl-table-cell">Aksi</th>
                        <th class="d-xl-none text-end">Detail</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($participants as $participant)
                        <tr>
                            <td>
                                <div class="fw-semibold">{{ $participant->nama_lengkap }}</div>
                                <div class="text-secondary small">{{ $participant->kategori_peserta }}</div>
                            </td>
                            <td>
                                @if ($participant->metode_kehadiran === 'OFFLINE')
                                    <span class="badge bg-primary-subtle text-primary">Offline</span>
                                @else
                                    <span class="badge bg-warning-subtle text-warning-emphasis">Online</span>
                                @endif
                            </td>
                            <td class="d-none d-xl-table-cell">
                                <span class="small">{{ $participant->email_primary }}</span>
                            </td>
                            <td class="d-none d-xl-table-cell">
                                <span class="small">{{ $participant->no_hp_normalized }}</span>
                            </td>
                            <td class="d-none d-xl-table-cell">
                                @if ($participant->metode_kehadiran === 'OFFLINE')
                                    @if ($participant->checked_in_at)
                                        <span class="badge bg-success">Hadir</span>
                                        <div class="small text-secondary mt-1">{{ $participant->checked_in_at->format('d-m-Y H:i:s') }}</div>
                                    @else
                                        <span class="badge bg-secondary">Belum Hadir</span>
                                    @endif
                                    <div class="small text-secondary mt-1">QR: {{ $participant->qr_token ?? '-' }}</div>
                                @else
                                    <span class="badge bg-info text-dark">Peserta Online</span>
                                    <div class="small text-secondary mt-1">Zoom: {{ $participant->zoom_link ? 'Terisi' : 'Belum terisi' }}</div>
                                @endif
                            </td>
                            <td class="d-none d-xl-table-cell">
                                @if ($participant->metode_kehadiran === 'OFFLINE')
                                    <div class="d-grid gap-1">
                                        <button
                                            type="button"
                                            class="btn btn-sm btn-outline-primary open-qr-modal"
                                            data-bs-toggle="modal"
                                            data-bs-target="#sendQrModal"
                                            data-form-action="{{ route('participants.send-qr', $participant) }}"
                                            data-participant-name="{{ $participant->nama_lengkap }}"
                                        >
                                            Kirim Email QR
                                        </button>
                                        @if ($participant->qr_sent_at)
                                            <small class="text-secondary">Terkirim {{ $participant->qr_sent_at->format('d-m H:i') }}</small>
                                        @endif
                                    </div>
                                @else
                                    <div class="zoom-send-form d-grid gap-1">
                                        <button
                                            type="button"
                                            class="btn btn-sm btn-outline-success open-zoom-modal"
                                            data-bs-toggle="modal"
                                            data-bs-target="#sendZoomModal"
                                            data-form-action="{{ route('participants.send-zoom', $participant) }}"
                                            data-participant-name="{{ $participant->nama_lengkap }}"
                                            data-current-link="{{ $participant->zoom_link }}"
                                        >
                                            Kirim Link Zoom
                                        </button>
                                        @if ($participant->zoom_sent_at)
                                            <small class="text-secondary">Terkirim {{ $participant->zoom_sent_at->format('d-m H:i') }}</small>
                                        @endif
                                    </div>
                                @endif
                            </td>
                            <td class="d-xl-none text-end">
                                <button
                                    type="button"
                                    class="btn btn-sm btn-outline-secondary"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#participant-detail-{{ $participant->id }}"
                                    aria-expanded="false"
                                    aria-controls="participant-detail-{{ $participant->id }}"
                                >
                                    Detail
                                </button>
                            </td>
                        </tr>
                        <tr class="d-xl-none">
                            <td colspan="3" class="pt-0 border-top-0">
                                <div class="collapse" id="participant-detail-{{ $participant->id }}">
                                    <div class="border rounded p-3 bg-body-tertiary mt-1">
                                        <div class="small mb-1"><strong>Email:</strong> {{ $participant->email_primary }}</div>
                                        <div class="small mb-2"><strong>No HP:</strong> {{ $participant->no_hp_normalized ?: '-' }}</div>

                                        <div class="small fw-semibold mb-1">Status</div>
                                        @if ($participant->metode_kehadiran === 'OFFLINE')
                                            @if ($participant->checked_in_at)
                                                <span class="badge bg-success">Hadir</span>
                                                <div class="small text-secondary mt-1">{{ $participant->checked_in_at->format('d-m-Y H:i:s') }}</div>
                                            @else
                                                <span class="badge bg-secondary">Belum Hadir</span>
                                            @endif
                                            <div class="small text-secondary mt-1 mb-3">QR: {{ $participant->qr_token ?? '-' }}</div>
                                        @else
                                            <span class="badge bg-info text-dark">Peserta Online</span>
                                            <div class="small text-secondary mt-1 mb-3">Zoom: {{ $participant->zoom_link ? 'Terisi' : 'Belum terisi' }}</div>
                                        @endif

                                        <div class="small fw-semibold mb-1">Aksi</div>
                                        @if ($participant->metode_kehadiran === 'OFFLINE')
                                            <div class="d-grid gap-1">
                                                <button
                                                    type="button"
                                                    class="btn btn-sm btn-outline-primary open-qr-modal"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#sendQrModal"
                                                    data-form-action="{{ route('participants.send-qr', $participant) }}"
                                                    data-participant-name="{{ $participant->nama_lengkap }}"
                                                >
                                                    Kirim Email QR
                                                </button>
                                                @if ($participant->qr_sent_at)
                                                    <small class="text-secondary">Terkirim {{ $participant->qr_sent_at->format('d-m H:i') }}</small>
                                                @endif
                                            </div>
                                        @else
                                            <div class="d-grid gap-1">
                                                <button
                                                    type="button"
                                                    class="btn btn-sm btn-outline-success open-zoom-modal"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#sendZoomModal"
                                                    data-form-action="{{ route('participants.send-zoom', $participant) }}"
                                                    data-participant-name="{{ $participant->nama_lengkap }}"
                                                    data-current-link="{{ $participant->zoom_link }}"
                                                >
                                                    Kirim Link Zoom
                                                </button>
                                                @if ($participant->zoom_sent_at)
                                                    <small class="text-secondary">Terkirim {{ $participant->zoom_sent_at->format('d-m H:i') }}</small>
                                                @endif
                                            </div>
                                        @endif
                                    </div>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="7" class="text-center py-4 text-secondary">Belum ada data peserta. Gunakan tombol Import Peserta untuk mulai.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <div class="mt-3">
            {{ $participants->links('pagination::bootstrap-5') }}
        </div>
    </div>

    <div class="modal fade" id="importParticipantsModal" tabindex="-1" aria-labelledby="importParticipantsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-header">
                    <h2 class="modal-title fs-5" id="importParticipantsModalLabel">Import Data Peserta</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
                </div>
                <div class="modal-body">
                    <div class="row g-3">
                        <div class="col-lg-6">
                            <h3 class="h6 mb-2">Upload CSV</h3>
                            <form action="{{ route('participants.import') }}" method="post" enctype="multipart/form-data" class="d-grid gap-2">
                                @csrf
                                <input type="file" name="csv_file" accept=".csv,text/csv" class="form-control" required>
                                <button class="btn btn-primary" type="submit">Import CSV</button>
                            </form>
                            <p class="small text-secondary mb-0 mt-2">Gunakan CSV hasil ekspor dari tab Form Responses.</p>
                        </div>
                        <div class="col-lg-6">
                            <h3 class="h6 mb-2">Import dari Spreadsheet</h3>
                            <form action="{{ route('participants.import-sheet') }}" method="post" class="d-grid gap-2">
                                @csrf
                                <input
                                    type="url"
                                    name="sheet_url"
                                    class="form-control"
                                    placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                                    value="{{ old('sheet_url', config('services.google_sheet.url')) }}"
                                >
                                <button class="btn btn-outline-primary" type="submit">Import Link Spreadsheet</button>
                            </form>
                            <p class="small text-secondary mb-0 mt-2">Jika kosong, sistem memakai GOOGLE_SHEET_URL dari file .env.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="sendQrBulkModal" tabindex="-1" aria-labelledby="sendQrBulkModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-header">
                    <h2 class="modal-title fs-5" id="sendQrBulkModalLabel">Kirim QR Bulk</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
                </div>
                <form action="{{ route('participants.send-qr-bulk') }}" method="post">
                    @csrf
                    <div class="modal-body">
                        <p class="mb-0">Kirim email QR ke semua peserta offline sekarang?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary">Kirim QR Bulk</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal fade" id="sendZoomBulkModal" tabindex="-1" aria-labelledby="sendZoomBulkModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-header">
                    <h2 class="modal-title fs-5" id="sendZoomBulkModalLabel">Kirim Zoom Bulk</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
                </div>
                <form action="{{ route('participants.send-zoom-bulk') }}" method="post">
                    @csrf
                    <div class="modal-body d-grid gap-2">
                        <label for="bulk_zoom_link" class="form-label mb-0">Link Zoom untuk semua peserta online</label>
                        <input
                            type="url"
                            name="bulk_zoom_link"
                            id="bulk_zoom_link"
                            class="form-control"
                            placeholder="https://zoom.us/..."
                            value="{{ old('bulk_zoom_link') }}"
                            required
                        >
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-success">Kirim Zoom Bulk</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal fade" id="sendQrModal" tabindex="-1" aria-labelledby="sendQrModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-header">
                    <h2 class="modal-title fs-5" id="sendQrModalLabel">Kirim Email QR</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
                </div>
                <form id="singleQrForm" action="#" method="post">
                    @csrf
                    <div class="modal-body">
                        <p class="mb-0">Kirim QR check-in untuk <strong id="singleQrName">peserta</strong>?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-primary">Kirim Email QR</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal fade" id="sendZoomModal" tabindex="-1" aria-labelledby="sendZoomModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow">
                <div class="modal-header">
                    <h2 class="modal-title fs-5" id="sendZoomModalLabel">Kirim Link Zoom</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
                </div>
                <form id="singleZoomForm" action="#" method="post">
                    @csrf
                    <div class="modal-body d-grid gap-2">
                        <p class="mb-0">Masukkan link Zoom untuk <strong id="singleZoomName">peserta</strong>.</p>
                        <input type="url" name="zoom_link" id="singleZoomLink" class="form-control" placeholder="https://zoom.us/..." required>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="submit" class="btn btn-success">Kirim Link Zoom</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script>
        (() => {
            document.querySelectorAll('.method-filter-select').forEach((selectElement) => {
                selectElement.addEventListener('change', () => {
                    selectElement.form.submit();
                });
            });

            const qrModal = document.getElementById('sendQrModal');
            const qrForm = document.getElementById('singleQrForm');
            const qrName = document.getElementById('singleQrName');

            if (qrModal && qrForm && qrName) {
                qrModal.addEventListener('show.bs.modal', (event) => {
                    const triggerButton = event.relatedTarget;
                    if (!triggerButton) {
                        return;
                    }

                    qrForm.setAttribute('action', triggerButton.getAttribute('data-form-action') || '#');
                    qrName.textContent = triggerButton.getAttribute('data-participant-name') || 'peserta';
                });
            }

            const zoomModal = document.getElementById('sendZoomModal');
            const zoomForm = document.getElementById('singleZoomForm');
            const zoomName = document.getElementById('singleZoomName');
            const zoomLink = document.getElementById('singleZoomLink');

            if (zoomModal && zoomForm && zoomName && zoomLink) {
                zoomModal.addEventListener('show.bs.modal', (event) => {
                    const triggerButton = event.relatedTarget;
                    if (!triggerButton) {
                        return;
                    }

                    zoomForm.setAttribute('action', triggerButton.getAttribute('data-form-action') || '#');
                    zoomName.textContent = triggerButton.getAttribute('data-participant-name') || 'peserta';
                    zoomLink.value = triggerButton.getAttribute('data-current-link') || '';
                });
            }
        })();
    </script>
@endpush
