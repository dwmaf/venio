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

            <div className="bg-bg font-body flex min-h-screen items-center justify-center px-4">
                <div className="flex w-full justify-center gap-10 rounded-2xl bg-white p-6 shadow-2xl sm:w-fit">
                    <div className="flex w-full flex-col gap-4 sm:w-fit">
                        <div className="mb-6 flex items-center gap-1">
                            <img
                                src="/venio-icon.png"
                                alt="Venio"
                                className="h-8 w-8 object-contain"
                            />
                            <span className="font-heading text-lg font-semibold">
                                Venio
                            </span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h1 className="font-heading text-2xl leading-none font-semibold sm:text-[32px]">
                                Selamat Datang!
                            </h1>
                            <p className="text-neutral text-sm lg:text-base">
                                Silahkan isi untuk melanjutkan
                            </p>
                        </div>

                        {(errors.username || errors.password) && (
                            <div className="mb-4 flex gap-1 rounded-lg border border-red-700/30 bg-red-50 px-3 py-2 text-sm text-red-600">
                                <IconCiWarning
                                    className="h-4.5 w-4.5"
                                />
                                <span>
                                    {errors.username || errors.password}
                                </span>
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

                            <div className="flex justify-between pt-1">
                                <label
                                    htmlFor="remember"
                                    className="flex items-center gap-1.5 text-xs font-medium md:text-sm"
                                >
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    <p>Ingat Saya</p>
                                </label>

                                <a
                                    href="#"
                                    className="text-xs font-semibold text-blue-500 md:text-sm"
                                >
                                    Lupa password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-2 w-full cursor-pointer rounded-lg bg-blue-50 p-3 text-base font-medium text-blue-700 transition-all duration-200 ease-in-out hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {processing ? "Loading..." : "Masuk"}
                            </button>
                        </form>
                    </div>

                    <div className="hidden flex-col justify-between rounded-xl bg-blue-600 p-6 text-white md:flex">
                        <h1 className="max-w-[16ch] text-center text-2xl font-medium text-pretty">
                            Silahkan masuk dengan akun Venio Anda
                        </h1>
                        <img src="/login-img.svg" alt="" className="w-72" />
                    </div>
                </div>
            </div>
        </>
    );
}
