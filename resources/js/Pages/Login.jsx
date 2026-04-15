import { useForm, Head } from '@inertiajs/react';

export default function Login() {
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
            <Head title="Login Admin" />
            <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900">Login Admin</h2>
                    <p className="text-sm text-gray-500 mt-2">Masuk dengan username dan password.</p>
                </div>


                {errors.username && (
                    <div className="mb-6 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                        {errors.username}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    <div >
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            autoFocus
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors sm:text-sm"
                        />
                    </div>

                    <div >
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1" >Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors sm:text-sm"
                        />
                    </div>

                    <div className="flex items-center">
                        <label className="ml-2 block text-sm text-gray-700 cursor-pointer">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                            />
                            Ingat saya
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className={`w-full flex justify-center py-2.5 px-4 mt-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {processing ? 'Loading...' : 'Masuk'}
                    </button>
                </form>
            </div>
        </div>
    );
}