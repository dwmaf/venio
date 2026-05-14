import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { IconFluentSend24Filled } from "@/Components/Icons";

export default function SendZoomIndividual({ participant, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        zoom_link: "",
    });

    const [show, setShow] = useState(false);

    useEffect(() => {
        if (participant) {
            setData("zoom_link", participant.zoom_link || "");

            const timer = setTimeout(() => {
                setShow(true);
            }, 10);

            return () => clearTimeout(timer);
        } else {
            setShow(false);
            reset();
        }
    }, [participant]);

    if (!participant) return null;

    const handleClose = () => {
        setShow(false);

        setTimeout(() => {
            onClose();
        }, 300);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("peserta.send-zoom", participant.id), {
            onSuccess: () => {
                handleClose();
            },
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-default/50 fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className={`w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-500 ease-in-out ${
                    show
                        ? "translate-y-8 scale-100 opacity-100"
                        : "translate-y-0 scale-95 opacity-0"
                }`}
            >
                <div className="border-neutral/30 flex items-center justify-between border-b px-6 py-4">
                    <h4 className="font-body text-default text-xl leading-none font-medium">
                        Kirim Link Zoom
                    </h4>
                    <button
                        onClick={handleClose}
                        className="cursor-pointer rounded-sm px-2 py-1 text-xl leading-none hover:bg-neutral-50"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-6 p-6">
                    <p className="font-body text-sm leading-normal">
                        Kirim Link Zoom ke email{" "}
                        <span className="font-bold">
                            {participant.email_primary}
                        </span>{" "}
                        atas nama{" "}
                        <span className="font-bold">
                            {participant.nama_lengkap}
                        </span>
                        ?
                    </p>

                    <form onSubmit={submit}>
                        <div className="mb-4 space-y-2">
                            <label className="text-default font-body block text-sm font-medium">
                                Link Zoom
                            </label>
                            <input
                                type="url"
                                required
                                placeholder="https://zoom.us/j/..."
                                value={data.zoom_link}
                                onChange={(e) =>
                                    setData("zoom_link", e.target.value)
                                }
                                className="font-body border-neutral/30 placeholder:font-body w-full rounded-md border p-2 text-sm focus:border-blue-500 focus:outline-blue-500"
                            />
                            {errors.zoom_link && (
                                <span className="font-body text-xs text-red-600">
                                    {errors.zoom_link}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col-reverse justify-end gap-2 md:flex-row">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="border-neutral/30 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border p-3 hover:bg-neutral-50 md:w-fit"
                            >
                                <span className="font-body text-neutral text-base leading-none font-medium">
                                    Batal
                                </span>
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className="group flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-50 p-3 transition-colors duration-300 hover:bg-blue-100"
                            >
                                <IconFluentSend24Filled className="h-4 w-4 text-blue-700 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                                <span className="font-body text-base leading-none text-blue-700">
                                    {processing
                                        ? "Mengirim..."
                                        : participant.zoom_sent_at
                                          ? "Kirim Ulang Sekarang"
                                          : "Kirim Sekarang"}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
