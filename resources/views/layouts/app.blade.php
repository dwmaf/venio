<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', config('app.name', 'perdatin'))</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        :root {
            --app-bg-start: #f8fbff;
            --app-bg-mid: #eef8ff;
            --app-bg-end: #f3f8ef;
            --app-border: rgba(11, 39, 74, 0.1);
            --app-shadow: 0 14px 34px rgba(9, 33, 61, 0.1);
            --app-primary: #1f4a87;
            --app-primary-soft: #dbe9ff;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: radial-gradient(circle at 16% 10%, #ffffff 0%, var(--app-bg-mid) 34%, var(--app-bg-end) 100%);
            min-height: 100vh;
        }

        .glass-card {
            background: rgba(255, 255, 255, 0.92);
            border: 1px solid var(--app-border);
            border-radius: 16px;
            box-shadow: var(--app-shadow);
        }

        .brand-title {
            letter-spacing: 0.1px;
            font-weight: 800;
            font-family: 'Manrope', sans-serif;
        }

        .app-nav {
            backdrop-filter: blur(6px);
        }

        .navbar-brand small {
            display: block;
            font-size: 0.76rem;
            color: #637489;
            font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .navbar-nav .nav-link {
            font-weight: 600;
            color: #23384f;
            border-radius: 10px;
            padding: 0.45rem 0.85rem;
            transition: background-color 0.2s ease;
        }

        .navbar-nav .nav-link:hover,
        .navbar-nav .nav-link:focus {
            background: #eef4fb;
            color: #10253e;
        }

        .navbar-nav .nav-link.active {
            background: var(--app-primary-soft);
            color: var(--app-primary);
        }

        .user-meta {
            color: #546579;
            font-size: 0.84rem;
        }

        .filter-tabs {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem;
        }

        .zoom-send-form {
            min-width: 220px;
        }

        .password-helper {
            color: #667688;
            font-size: 0.85rem;
        }

        .desktop-nav-links {
            gap: 0.35rem;
        }

        .desktop-nav-actions {
            gap: 0.5rem;
        }

        .mobile-menu-button {
            width: 38px;
            height: 38px;
            padding: 0;
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 4px;
            border-color: #d2deea;
            background: #f8fbff;
        }

        .mobile-menu-button span {
            width: 16px;
            height: 2px;
            background: #344b65;
            border-radius: 99px;
            display: block;
        }

        .mobile-menu-panel {
            --bs-offcanvas-width: min(75vw, 320px);
            width: var(--bs-offcanvas-width);
            border-top-left-radius: 18px;
            border-bottom-left-radius: 18px;
            border-left: 1px solid #dce7f2;
            box-shadow: -14px 0 28px rgba(10, 27, 49, 0.16);
        }

        .mobile-menu-panel .offcanvas-header {
            padding: 0.85rem 0.95rem;
        }

        .mobile-menu-panel .offcanvas-body {
            padding: 0.85rem 0.95rem 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.7rem;
        }

        .mobile-profile-card {
            border: 1px solid #e0e8f2;
            border-radius: 12px;
            padding: 0.62rem 0.72rem;
            background: #f8fbff;
            display: flex;
            align-items: center;
            gap: 0.62rem;
        }

        .mobile-profile-avatar {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            border: 1px solid #c7d9ef;
            background: #e8f1ff;
            color: #1d467d;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.84rem;
            flex-shrink: 0;
        }

        .mobile-profile-meta {
            min-width: 0;
        }

        .mobile-profile-name {
            font-weight: 700;
            color: #203347;
            line-height: 1.15;
        }

        .mobile-profile-email {
            color: #7b8a99;
            font-size: 0.78rem;
            margin-top: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 170px;
        }

        .mobile-role-chip {
            border: 1px solid #d7e4f7;
            background: #eef5ff;
            color: #24508a;
            border-radius: 999px;
            font-size: 0.72rem;
            font-weight: 700;
            padding: 0.15rem 0.5rem;
            margin-left: auto;
        }

        .mobile-menu-list {
            display: flex;
            flex-direction: column;
            gap: 0.32rem;
        }

        .mobile-menu-list .list-group-item {
            border: 1px solid #e3ebf5;
            border-radius: 10px;
            padding: 0.62rem 0.78rem;
            font-weight: 600;
            color: #203347;
            background: #fff;
        }

        .mobile-menu-list .list-group-item.active {
            background: #e7f0ff;
            color: #1f4a87;
            border-color: #d6e6ff;
        }

        .mobile-logout-btn {
            border-radius: 12px;
            padding: 0.72rem 0.9rem;
            font-weight: 600;
            margin-top: auto;
        }

        @media (min-width: 576px) {
            .user-meta {
                text-align: right;
            }
        }

        @media (max-width: 991.98px) {
            .app-nav {
                backdrop-filter: none;
            }
        }

        @media (max-width: 575.98px) {
            .zoom-send-form {
                min-width: 0;
                width: 100%;
            }

            .navbar-brand {
                max-width: 78%;
                white-space: normal;
                line-height: 1.2;
            }
        }
    </style>
    @stack('styles')
</head>
<body>
    <div class="container py-4 py-md-5">
        @auth
            @php
                $isCheckinPage = request()->routeIs('checkin.*');
                $isDashboardPage = request()->routeIs('dashboard');
            @endphp
            <nav class="navbar glass-card app-nav px-3 py-2 mb-4">
                <div class="container-fluid px-0 gap-2">
                    <a class="navbar-brand" href="{{ route('dashboard') }}">
                        <span class="brand-title h5 mb-0 d-block">{{ config('app.name', 'perdatin') }}</span>
                        <small>Single Event MVP - Offline QR + Online Zoom</small>
                    </a>

                    <button
                        class="btn btn-outline-secondary btn-sm d-lg-none mobile-menu-button ms-auto"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#mobileMenuPanel"
                        aria-controls="mobileMenuPanel"
                        aria-label="Buka menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <div class="d-none d-lg-flex align-items-center justify-content-between grow gap-3">
                        <ul class="navbar-nav desktop-nav-links flex-row align-items-center mb-0">
                            <li class="nav-item">
                                <a class="nav-link {{ $isDashboardPage ? 'active' : '' }}" href="{{ route('dashboard') }}">Dashboard</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link {{ $isCheckinPage ? 'active' : '' }}" href="{{ route('checkin.index') }}">Halaman Scan</a>
                            </li>
                        </ul>

                        <div class="d-flex align-items-center desktop-nav-actions">
                            <span class="user-meta">Login sebagai <strong>{{ auth()->user()->username ?? auth()->user()->name }}</strong></span>
                            <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#changePasswordModal">Ganti Password</button>
                            <form action="{{ route('inertia.logout') }}" method="post" class="d-grid">
                                @csrf
                                <button type="submit" class="btn btn-outline-danger btn-sm">Logout</button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            <div class="offcanvas offcanvas-end mobile-menu-panel d-lg-none" tabindex="-1" id="mobileMenuPanel" aria-labelledby="mobileMenuPanelLabel">
                <div class="offcanvas-header border-bottom">
                    <h2 class="offcanvas-title h6 mb-0" id="mobileMenuPanelLabel">Menu Navigasi</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Tutup"></button>
                </div>
                <div class="offcanvas-body">
                    <div class="mobile-profile-card">
                        <span class="mobile-profile-avatar">{{ strtoupper(substr(auth()->user()->username ?? auth()->user()->name ?? 'A', 0, 1)) }}</span>
                        <div class="mobile-profile-meta">
                            <div class="mobile-profile-name">{{ auth()->user()->username ?? auth()->user()->name }}</div>
                            <div class="mobile-profile-email">{{ auth()->user()->email ?? 'Akun Admin' }}</div>
                        </div>
                        <span class="mobile-role-chip">Admin</span>
                    </div>

                    <div class="list-group list-group-flush mobile-menu-list">
                        <a href="{{ route('dashboard') }}" class="list-group-item list-group-item-action {{ $isDashboardPage ? 'active' : '' }}">Dashboard</a>
                        <a href="{{ route('checkin.index') }}" class="list-group-item list-group-item-action {{ $isCheckinPage ? 'active' : '' }}">Halaman Scan</a>
                        <button
                            type="button"
                            class="list-group-item list-group-item-action text-start"
                            data-bs-dismiss="offcanvas"
                            data-bs-toggle="modal"
                            data-bs-target="#changePasswordModal"
                        >
                            Ganti Password
                        </button>
                    </div>

                    <form action="{{ route('inertia.logout') }}" method="post" class="d-grid mt-auto pt-1">
                        @csrf
                        <button type="submit" class="btn btn-outline-danger mobile-logout-btn">Logout</button>
                    </form>
                </div>
            </div>
        @else
            <div class="mb-4">
                <h1 class="h3 brand-title mb-1">{{ config('app.name', 'perdatin') }}</h1>
                <p class="text-secondary mb-0">Single Event MVP - Offline QR + Online Zoom</p>
            </div>
        @endauth

        @if (session('success'))
            <div class="alert alert-success">{{ session('success') }}</div>
        @endif

        @if (session('error'))
            <div class="alert alert-danger">{{ session('error') }}</div>
        @endif

        @if ($errors->any())
            <div class="alert alert-danger mb-4">
                <strong>Validasi gagal:</strong>
                <ul class="mb-0 mt-2">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        @yield('content')

        @auth
            <div class="modal fade" id="changePasswordModal" tabindex="-1" aria-labelledby="changePasswordModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header">
                            <h2 class="modal-title fs-5" id="changePasswordModalLabel">Ganti Password</h2>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Tutup"></button>
                        </div>
                        <form action="{{ route('inertia.account.password.update') }}" method="post" class="d-grid gap-2">
                            @csrf
                            <div class="modal-body d-grid gap-3">
                                <div>
                                    <label class="form-label" for="current_password">Password saat ini</label>
                                    <input type="password" name="current_password" id="current_password" class="form-control" required>
                                </div>
                                <div>
                                    <label class="form-label" for="new_password">Password baru</label>
                                    <input type="password" name="password" id="new_password" class="form-control" minlength="8" required>
                                </div>
                                <div>
                                    <label class="form-label" for="password_confirmation">Konfirmasi password baru</label>
                                    <input type="password" name="password_confirmation" id="password_confirmation" class="form-control" minlength="8" required>
                                </div>
                                <p class="password-helper mb-0">Gunakan minimal 8 karakter agar keamanan akun lebih baik.</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Batal</button>
                                <button type="submit" class="btn btn-primary">Simpan Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        @endauth
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    @stack('scripts')
</body>
</html>
