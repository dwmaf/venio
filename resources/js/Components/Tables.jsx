import { useState } from "react";
import { IconSolarCopyBold, IconSolarCopyLineDuotone } from "@/Components/Icons";

export function TableHead({ text }) {
    return (
        <th className="p-2 lg:p-5 font-medium font-body text-base lg:text-xl leading-none">
            {text}
        </th>
    );
}

export function TableRow({ key, children }) {
    return (
        <tr key={key} className="border-b border-neutral-400">
            {children}
        </tr>
    );
}

export function TableData({ text }) {
    return (
        <td className="p-5 font-body text-base leading-none whitespace-nowrap">
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
                console.error('Fallback: Oops, unable to copy', err);
            }
            // Hapus textarea bekas
            document.body.removeChild(textArea);
        }

        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const hasContent = textToCopy && textToCopy !== "";

    return (
        <span className="font-body flex gap-2 items-center text-xs leading-none text-neutral whitespace-nowrap">
            {label}: {hasContent ? textToCopy : "Belum Terisi"}
            
            {/* Tombol Copy Hanya Muncul Jika Ada Isinya */}
            {hasContent && (
                <button 
                    onClick={handleCopy} 
                    title={`Copy ${label}`}
                    className="focus:outline-none hover:text-neutral-800 transition"
                >
                    {isCopied ? (
                        <IconSolarCopyBold 
                            className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500 transition-colors duration-300" 
                        />
                    ) : (
                        <IconSolarCopyLineDuotone 
                            className="w-4 h-4 lg:w-5 lg:h-5 text-neutral transition-colors duration-300" 
                        />
                    )}
                </button>
            )}
        </span>
    );
}