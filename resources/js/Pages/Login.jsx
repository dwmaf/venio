import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
                <div className="w-full max-w-[330px] rounded-[20px] bg-white p-6 shadow-none border border-[#f0f0f0]">
                    <div className="mb-6">
                        <div className="mb-6 flex items-center gap-3">
                            <img
                                src="/venio-icon.png"
                                alt="Venio"
                                className="h-[60px] w-[60px] object-contain"
                            />
                            <span className="text-[40px] font-semibold text-[#111111]">
                                Venio
                            </span>
                        </div>

                        <h1 className="text-[26px] font-bold leading-tight text-[#111111]">
                            Selamat Datang!
                        </h1>
                        <p className="mt-2 text-[12px] text-[#9ca3af]">
                            Silahkan isi untuk masuk ke halaman admin
                        </p>
                    </div>

                    {(errors.username || errors.password) && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                            {errors.username || errors.password}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="username"
                                className="mb-2 block text-[12px] font-medium text-[#9ca3af]"
                            >
                                Username/Email
                            </label>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                placeholder="e.g. someone@gmail.com"
                                autoFocus
                                required
                                className="h-[42px] w-full rounded-[8px] border border-[#e5e7eb] bg-white px-3 text-[12px] text-[#111111] placeholder:text-[#c0c4cc] focus:border-[#3b82f6] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-[12px] font-medium text-[#9ca3af]"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••"
                                    required
                                    className="h-[42px] w-full rounded-[8px] border border-[#e5e7eb] bg-white px-3 pr-10 text-[12px] text-[#111111] placeholder:text-[#c0c4cc] focus:border-[#3b82f6] focus:outline-none"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 3l18 18"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M10.584 10.587A2 2 0 0012 14a2 2 0 001.414-.586"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9.363 5.365A9.466 9.466 0 0112 5c5.05 0 9.27 3.11 10 7-.238 1.272-.845 2.442-1.744 3.435M6.228 6.228C4.166 7.506 2.713 9.45 2 12c.73 3.89 4.95 7 10 7 2.06 0 3.98-.518 5.657-1.43"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="pt-1">
                            <label className="flex items-center gap-2 text-[12px] text-[#9ca3af]">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="h-3.5 w-3.5 rounded border border-[#d1d5db] text-blue-500 focus:ring-blue-500"
                                />
                                Ingat Saya
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 h-[42px] w-full rounded-[8px] bg-[#dbeafe] text-[12px] font-medium text-[#2563eb] transition hover:bg-[#cfe4ff] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {processing ? 'Loading...' : 'Masuk'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}