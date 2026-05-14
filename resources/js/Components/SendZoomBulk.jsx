import { useForm } from "@inertiajs/react";
import { IconFluentSend24Filled } from "@/Components/Icons";
import { useState, useEffect } from "react";

export default function SendZoomBulk({
    isOpen,
    onClose,
    eventId,
    online,
    sentCount,
}) {
    const { data, setData, post, processing, errors } = useForm({
        zoom_link: "",
    });

    const [show, setShow] = useState(false);

    useEffect(() => {
        // Saat isOpen berubah, kita atur timeout kecil untuk memicu transisi
        if (isOpen) {
            const timer = setTimeout(() => setShow(true), 10); // Sedikit delay untuk memastikan elemen sudah di-render
            return () => clearTimeout(timer);
        } else {
            setShow(false);
        }
    }, [isOpen]);

    if (!isOpen && !show) return null;

    const handleClose = () => {
        setShow(false);
        // Tunggu animasi selesai sebelum memanggil onClose
        setTimeout(onClose, 300); // Durasi harus sama dengan durasi transisi
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("peserta.send-zoom-bulk", { event: eventId }), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const targetCount = data.resend_all ? online : online - sentCount;

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
                        Kirim Zoom Bulk
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
                        Kirim email Zoom ke <strong>{online} peserta</strong>{" "}
                        online di event ini sekarang?
                        <br />
                        <br />
                        Email hanya akan dikirim ke peserta yang belum menerima
                        Link Zoom.
                        <br />
                        <span className="text-xs font-semibold text-red-600">
                            Tindakan ini mungkin memakan waktu jika jumlah
                            peserta banyak!
                        </span>
                    </p>

                    <form onSubmit={submit}>
                        <div className="mb-4 space-y-2">
                            <label className="text-default font-body block text-sm font-medium">
                                Masukan Link Zoom untuk acara ini
                            </label>
                            <input
                                type="url"
                                required
                                placeholder="https://zoom.us/j/..."
                                value={data.zoom_link}
                                onChange={(e) =>
                                    setData("zoom_link", e.target.value)
                                }
                                className="font-body border-neutral/30 placeholder:font-body w-full rounded-md border px-4 py-2 text-sm focus:border-blue-500 focus:outline-blue-500"
                            />
                            {errors.zoom_link && (
                                <span className="font-body text-xs text-red-500">
                                    {errors.zoom_link}
                                </span>
                            )}
                        </div>
                        {sentCount > 0 && (
                            <div className="mb-4 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="resend_all"
                                    checked={data.resend_all}
                                    onChange={(e) =>
                                        setData("resend_all", e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor="resend_all"
                                    className="text-default font-body cursor-pointer text-sm"
                                >
                                    Kirim ulang juga ke peserta yang sudah
                                    menerima ({sentCount} peserta)
                                </label>
                            </div>
                        )}

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
                                        : "Kirim Zoom Bulk"}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
