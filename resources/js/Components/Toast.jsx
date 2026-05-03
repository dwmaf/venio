import { useEffect, useState } from "react";
import { IconCloseCircleLinear, IconCheckCircleBold, IconSolarDangerBold } from "@/Components/Icons";

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
            icon: IconCheckCircleBold,
            iconColor: "text-green-500",
        },
        error: {
            bg: "bg-red-50",
            border: "border-red-500",
            text: "text-red-800",
            icon: IconSolarDangerBold,
            iconColor: "text-red-500",
        },
    };

    const current = config[type] || config.success;
    const IconComponent = current.icon;

    return (
        <div
            className={`fixed top-5 right-5 z-100 flex items-center p-4 min-w-75 rounded-lg border shadow-lg transition-all duration-300 transform ${
                visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            } ${current.bg} ${current.border}`}
            role="alert"
        >
            <IconComponent className={`w-6 h-6 mr-3 ${current.iconColor} shrink-0`} />
            <div className={`text-sm font-medium ${current.text}`}>
                {message}
            </div>
            <button
                onClick={() => setVisible(false)}
                className="ml-auto -mx-1.5 -my-1.5 p-1.5 inline-flex h-8 w-8 text-gray-500 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
            >
                <IconCloseCircleLinear className="w-5 h-5"/>
            </button>
        </div>
    );
}