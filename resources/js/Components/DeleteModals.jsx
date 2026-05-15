import { useState, useEffect } from "react";
import { IconDuoTrash } from "@/Components/Icons";

export function DeleteSelectedModal({ isOpen, onClose, onConfirm, count, processing }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setShow(true), 10);
            return () => clearTimeout(timer);
        } else {
            setShow(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="bg-default/50 fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className={`w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-500 ease-in-out ${show ? "translate-y-8 scale-100 opacity-100" : "translate-y-0 scale-95 opacity-0"}`}>
                <div className="border-neutral/30 flex items-center justify-between border-b px-6 py-4">
                    <h4 className="font-body text-default text-xl leading-none font-medium">Hapus Peserta Terpilih</h4>
                    <button onClick={onClose} className="cursor-pointer rounded-sm px-2 py-1 text-xl leading-none hover:bg-neutral-50">✕</button>
                </div>
                <div className="space-y-6 p-6">
                    <p className="font-body text-sm leading-normal">
                        Apakah Anda yakin ingin menghapus <span className="font-bold">{count} peserta</span> yang dipilih?
                        Aksi ini juga akan menghapus log email
                        dan riwayat scan peserta untuk event ini.
                        <br /><br />
                        <span className="text-red-500 font-semibold italic">Aksi ini tidak dapat dibatalkan.</span>
                    </p>
                    <div className="flex flex-col-reverse justify-end gap-2 md:flex-row">
                        <button onClick={onClose} className="border-neutral/30 font-body flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border p-3 hover:bg-neutral-50 md:w-fit">
                            Batal
                        </button>
                        <button onClick={onConfirm} disabled={processing} className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 p-3 text-white transition-colors duration-300 hover:bg-red-700 disabled:bg-red-300">
                            <IconDuoTrash className="h-4 w-4 text-white" />
                            <span className="font-body text-base leading-none">{processing ? "Menghapus..." : "Ya, Hapus Terpilih"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function DeleteAllDataModal({ isOpen, onClose, onConfirm, processing }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setShow(true), 10);
            return () => clearTimeout(timer);
        } else {
            setShow(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="bg-default/50 fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg">
                <div className="border-neutral/30 flex items-center justify-between border-b px-6 py-4">
                    <h4 className="font-body text-default text-xl leading-none font-medium">Hapus Semua Data Peserta?</h4>
                    <button onClick={onClose} className="cursor-pointer rounded-sm px-2 py-1 text-xl leading-none hover:bg-neutral-50">✕</button>
                </div>
                <div className="space-y-6 p-6">
                    <p className="font-body text-sm leading-relaxed text-neutral-600">
                        Aksi ini akan menghapus{" "}
                        <strong>semua data peserta</strong> beserta log email
                        dan riwayat scan untuk event ini.
                        <br /><br />
                        <span className="font-semibold text-red-600">Data yang sudah dihapus tidak bisa dikembalikan!</span>
                    </p>
                    <div className="flex flex-col-reverse justify-end gap-2 md:flex-row">
                        <button type="button" onClick={onClose} className="font-body cursor-pointer rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                            Batal
                        </button>
                        <button type="button" onClick={onConfirm} disabled={processing} className="font-body cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300">
                            {processing ? "Menghapus..." : "Hapus Data"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}