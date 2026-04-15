<!doctype html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Login - {{ config('app.name', 'perdatin') }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            min-height: 100vh;
            background: linear-gradient(135deg, #f8fcff 0%, #eaf4ff 50%, #f5fbf2 100%);
        }

        .login-card {
            max-width: 420px;
            margin: 0 auto;
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-radius: 16px;
            box-shadow: 0 14px 36px rgba(13, 42, 73, 0.12);
            background: #fff;
        }
    </style>
</head>
<body class="d-flex align-items-center py-4">
    <main class="container">
        <div class="login-card p-4 p-md-5">
            <h1 class="h4 mb-1">Login Admin</h1>
            <p class="text-secondary mb-4">Masuk dengan username dan password.</p>

            @if ($errors->any())
                <div class="alert alert-danger">
                    {{ $errors->first() }}
                </div>
            @endif

            <form action="{{ route('login.attempt') }}" method="post" class="d-grid gap-3">
                @csrf
                <div>
                    <label class="form-label" for="username">Username</label>
                    <input
                        type="text"
                        class="form-control"
                        id="username"
                        name="username"
                        value="{{ old('username') }}"
                        required
                        autofocus
                    >
                </div>

                <div>
                    <label class="form-label" for="password">Password</label>
                    <input type="password" class="form-control" id="password" name="password" required>
                </div>

                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="1" id="remember" name="remember">
                    <label class="form-check-label" for="remember">Ingat saya</label>
                </div>

                <button type="submit" class="btn btn-primary">Masuk</button>
            </form>
        </div>
    </main>
</body>
</html>
