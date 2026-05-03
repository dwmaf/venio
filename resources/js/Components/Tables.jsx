import { useState } from "react";
import {
    IconSolarCopyBold,
    IconSolarCopyLineDuotone,
} from "@/Components/Icons";

export function TableHead({ text }) {
    return (
        <th className="font-body p-2 text-base leading-none font-medium lg:p-5 lg:text-xl">
            {text}
        </th>
    );
}

export function TableRow({ id, children }) {
    return (
        <tr data-id={id} className="border-b border-neutral-400">
            {children}
        </tr>
    );
}

export function TableData({ text }) {
    return (
        <td className="font-body p-3 text-base leading-none whitespace-nowrap lg:p-5">
            {text}
        </td>
    );
}

export function CopyableText({ label, textToCopy }) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if (!textToCopy) return;

        // Cara modern jika koneksi secure (HTTPS/localhost)
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(textToCopy);
        } else {
            // Fallback (cara klasik) untuk koneksi unsecure seperti .test di environment dev
            let textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            // Buat textarea tidak kasat mata tapi tetap di body
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);

            // Pilih dan copy kontennya
            textArea.focus();
            textArea.select();
            try {
                document.execCommand("copy");
            } catch (err) {
                console.error("Fallback: Oops, unable to copy", err);
            }
            // Hapus textarea bekas
            document.body.removeChild(textArea);
        }

        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const hasContent = textToCopy && textToCopy !== "";

    return (
        <span className="font-body text-neutral flex items-center gap-2 text-xs leading-none whitespace-nowrap">
            {label}: {hasContent ? textToCopy : "Belum Terisi"}
            {/* Tombol Copy Hanya Muncul Jika Ada Isinya */}
            {hasContent && (
                <button
                    onClick={handleCopy}
                    title={`Copy ${label}`}
                    className="transition hover:text-neutral-800 focus:outline-none"
                >
                    {isCopied ? (
                        <IconSolarCopyBold className="h-4 w-4 text-gray-500 transition-colors duration-300 lg:h-5 lg:w-5" />
                    ) : (
                        <IconSolarCopyLineDuotone className="text-neutral h-4 w-4 transition-colors duration-300 lg:h-5 lg:w-5" />
                    )}
                </button>
            )}
        </span>
    );
}
