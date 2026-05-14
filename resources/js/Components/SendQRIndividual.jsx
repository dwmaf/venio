import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { IconFluentSend24Filled } from "@/Components/Icons";

export default function SendQRIndividual({ participant, onClose }) {
    const { post, processing, reset } = useForm();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (participant) {
            const timer = setTimeout(() => {
                setShow(true);
            }, 10);

            return () => clearTimeout(timer);
        } else {
            setShow(false);
            reset();
        }
    }, [participant]);

    if (!participant && !show) return null;

    const handleClose = () => {
        setShow(false);

        setTimeout(() => {
            onClose();
        }, 300);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("peserta.send-qr", participant.id), {
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
                        Kirim QR
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
                        {participant.qr_sent_at ? (
                            <>
                                Email QR sudah pernah dikirim pada{" "}
                                <span className="font-bold">
                                    {new Date(
                                        participant.qr_sent_at,
                                    ).toLocaleString("id-ID", {
                                        dateStyle: "long",
                                        timeStyle: "short",
                                    })}
                                </span>
                                .
                                <br />
                                Anda yakin untuk{" "}
                                <span className="font-bold text-blue-700">
                                    mengirim ulang
                                </span>{" "}
                                email QR ke{" "}
                                <span className="font-bold">
                                    {participant.email_primary}
                                </span>{" "}
                                atas nama{" "}
                                <span className="font-bold">
                                    {participant.nama_lengkap}
                                </span>
                                ?
                            </>
                        ) : (
                            <>
                                Kirim QR ke email{" "}
                                <span className="font-bold">
                                    {participant.email_primary}
                                </span>{" "}
                                atas nama{" "}
                                <span className="font-bold">
                                    {participant.nama_lengkap}
                                </span>
                                ?
                            </>
                        )}
                    </p>

                    <form onSubmit={submit}>
                        <div className="flex flex-col-reverse justify-end gap-2 md:flex-row">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="border-neutral/30 flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-3 transition-colors duration-300 hover:bg-neutral-50"
                            >
                                <span className="font-body text-neutral text-base leading-none">
                                    Batal
                                </span>
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                className="group flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-teal-50 p-3 transition-colors duration-300 hover:bg-teal-100"
                            >
                                <IconFluentSend24Filled className="h-4 w-4 text-teal-700 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                                <span className="font-body text-base leading-none text-teal-700">
                                    {processing
                                        ? "Mengirim..."
                                        : participant.qr_sent_at
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
