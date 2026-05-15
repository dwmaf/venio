import { IconRiDriveFill, IconEvaExternalLinkFill } from "@/Components/Icons";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export default function DocumentationModal({ isOpen, onClose, event }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        link_dokumentasi: event?.link_dokumentasi || "",
    });

    useEffect(() => {
        if (isOpen) {
            setData("link_dokumentasi", event?.link_dokumentasi || "");
        }
    }, [isOpen, event]);

    if (!isOpen) return null;

    const submit = (e) => {
        e.preventDefault();
        put(route("events.update-link-dokumentasi", event.id), {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral/30 flex justify-between items-center">
                    <h2 className="text-xl  font-body leading-none text-default font-medium">Link Dokumentasi</h2>
                    <button onClick={onClose} className="text-xl leading-none cursor-pointer hover:text-gray-600">✕</button>
                </div>

                <div className="p-6 flex flex-col gap-6">
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-neutral font-body">Tautan G-Drive / Folder</label>
                            <input
                                type="url"
                                placeholder="https://drive.google.com/..."
                                value={data.link_dokumentasi}
                                onChange={(e) => setData("link_dokumentasi", e.target.value)}
                                className="w-full font-body border border-neutral/30 rounded-lg p-2 text-sm"
                            />
                            {errors.link_dokumentasi && (
                                <span className="text-xs text-red-500">{errors.link_dokumentasi}</span>
                            )}
                        </div>

                        <div className="flex gap-2 w-full mt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center rounded-lg bg-blue-50 p-3 gap-2 cursor-pointer"
                            >
                                <span className="font-body font-normal text-base leading-none text-blue-700">
                                    {processing ? 'Menyimpan...' : 'Simpan Link'}
                                </span>
                            </button>
                        </div>
                    </form>

                    
                    {event?.link_dokumentasi && (
                        <a
                            href={event.link_dokumentasi}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full flex items-center justify-center rounded-lg border border-neutral/30 p-3 gap-2 cursor-pointer hover:bg-neutral-50"
                        >
                            <IconRiDriveFill className="h-5 w-5" />
                            <span className="font-body font-normal text-base leading-none text-neutral flex-1 text-center">Buka Dokumentasi Aktual</span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}