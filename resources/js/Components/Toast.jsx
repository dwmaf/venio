import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

export default function Toast({ message, type = "success", onClose }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // Tunggu animasi keluar selesai
        }, 5000); // Otomatis hilang setelah 5 detik

        return () => clearTimeout(timer);
    }, [onClose]);

    const config = {
        success: {
            bg: "bg-green-50",
            border: "border-green-500",
            text: "text-green-800",
            icon: "solar:check-circle-bold",
            iconColor: "text-green-500",
        },
        error: {
            bg: "bg-red-50",
            border: "border-red-500",
            text: "text-red-800",
            icon: "solar:danger-bold",
            iconColor: "text-red-500",
        },
    };

    const current = config[type] || config.success;

    return (
        <div
            className={`fixed top-5 right-5 z-100 flex items-center p-4 min-w-75 rounded-lg border shadow-lg transition-all duration-300 transform ${
                visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            } ${current.bg} ${current.border}`}
            role="alert"
        >
            <Icon icon={current.icon} className={`w-6 h-6 mr-3 ${current.iconColor}`} />
            <div className={`text-sm font-medium ${current.text}`}>
                {message}
            </div>
            <button
                onClick={() => setVisible(false)}
                className="ml-auto -mx-1.5 -my-1.5 p-1.5 inline-flex h-8 w-8 text-gray-500 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
            >
                <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
            </button>
        </div>
    );
}