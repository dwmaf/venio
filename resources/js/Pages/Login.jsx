import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { TextInput, PasswordInput, Checkbox } from "@/Components/Inputs";
import { IconCiWarning } from "@/Components/Icons";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen bg-bg flex items-center justify-center px-4 font-body">
                <div className="w-full sm:max-w-2/3 md:max-w-1/2 lg:max-w-1/3 xl:max-w-1/4 rounded-2xl bg-white p-6 shadow-2xl space-y-8">
                    <div className="mb-6 flex items-center justify-center gap-2">
                        <img
                            src="/venio-icon.png"
                            alt="Venio"
                            className="h-15 w-15 object-contain"
                        />
                        <span className="text-[40px] font-semibold font-heading">
                            Venio
                        </span>
                    </div>

                    <div className="flex flex-col gap-2 items-center">
                        <h1 className="text-2xl sm:text-[32px] font-semibold leading-none font-heading">
                            Selamat Datang!
                        </h1>
                        <p className="text-sm text-center lg:text-base text-neutral">
                            Silahkan isi untuk melanjutkan
                        </p>
                    </div>

                    {(errors.username || errors.password) && (
                        <div className="mb-4 flex gap-1 rounded-lg border border-red-700/30 bg-red-50 px-3 py-2 text-sm text-red-600">
                            <IconCiWarning className="w-4.5 h-4.5"/>
                            <span>{errors.username || errors.password}</span>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <TextInput
                            htmlFor="username"
                            id="username"
                            name="username"
                            value={data.username}
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                            placeholder="e.g. someone@gmail.com"
                            text="Username/Email"
                        />

                        <PasswordInput
                            htmlFor="password"
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="•••••"
                            required
                            text="Password"
                        />

                        <div className="pt-1">
                            <label
                                htmlFor="remember"
                                className="flex items-center gap-1.5 text-sm lg:text-base text-neutral"
                            >
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                <p>Ingat Saya</p>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-2 p-3 w-full rounded-lg bg-blue-50 text-base font-medium text-blue-700 transition-all duration-200 ease-in-out hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                        >
                            {processing ? "Loading..." : "Masuk"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
