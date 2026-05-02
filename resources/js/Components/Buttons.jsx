import { useState, useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";

export function RouteButton({ text, href }) {
    return (
        <Link
            href={href}
            className="flex gap-0.5 lg:gap-2 items-center font-body font-medium text-blue-700 text-sm lg:text-lg leading-none hover:underline mt-1"
        >
            <span>{text}</span>
            <Icon
                icon="basil:arrow-left-outline"
                rotate={2}
                className="text-blue-700 w-5 h-5 lg:w-6 lg:h-6 aspect-square"
            />
        </Link>
    );
}

export function Redirect({ href }) {
    return (
        <Link href={href}>
            <Icon
                icon="eva:external-link-fill"
                className="text-blue-700 w-5 h-5 lg:w-6 lg:h-6 aspect-square"
            />
        </Link>
    );
}

export function ImportButton({ text, onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center rounded-lg bg-blue-100 p-3 gap-2 cursor-pointer hover:bg-blue-200 active:bg-blue-300"
        >
            <Icon
                icon="mingcute:file-import-fill"
                className="w-4 h-4 lg:w-5 lg:h-5 text-blue-700"
            />
            <span className="font-body text-sm lg:text-base leading-none text-blue-700">
                {text}
            </span>
        </button>
    );
}

export function WAButton({ text, href }) {
    return (
        <a
            href={href}
            className="flex items-center rounded-lg bg-lime-100 p-3 gap-2 cursor-pointer hover:bg-lime-200 active:bg-lime-300"
        >
            <Icon
                icon="ri:whatsapp-fill"
                className="w-4 h-4 lg:w-5 lg:h-5 text-lime-700"
            />
            <span className="font-body text-sm lg:text-base leading-none text-lime-700">
                {text}
            </span>
        </a>
    );
}

export function ActionButton({ icon, label, onClick, href }) {
    const baseClass =
        "flex items-center rounded-lg border border-neutral/30 p-3 gap-2";

    const content = (
        <>
            <Icon icon={icon} className="text-blue-700 w-5 h-5 aspect-square" />
            <span className="hidden lg:flex font-body font-normal text-base leading-none">
                {label}
            </span>
        </>
    );

    if (href) {
        return (
            <a href={href} className={baseClass}>
                {content}
            </a>
        );
    }

    return (
        <button onClick={onClick} className={`${baseClass} cursor-pointer`}>
            {content}
        </button>
    );
}

export function SendButton({ buttonClass, textClass, text, onClick, icon }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center rounded-lg bg-teal-50 p-3 gap-2 cursor-pointer ${buttonClass}`}
        >
            <Icon
                icon={icon}
                className={`w-5 h-5 aspect-square ${textClass}`}
            />
            <span
                className={`font-body text-base leading-none whitespace-nowrap ${textClass}`}
            >
                {text}
            </span>
        </button>
    );
}

export function FilterDropdownButton({ tipeEvent, activeFilter, onFilter }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    let title = "Filter";
    let options = [];

    if (tipeEvent === "HYBRID") {
        title = "Filter Metode";
        options = [
            { value: "", label: "Semua Peserta", activeClass: "bg-neutral-100 text-neutral-800" },
            { value: "OFFLINE", label: "Hanya Offline", activeClass: "bg-lime-100 text-lime-700", textClass: "text-lime-700" },
            { value: "ONLINE", label: "Hanya Online", activeClass: "bg-yellow-100 text-yellow-700", textClass: "text-yellow-700" },
        ];
    } else if (tipeEvent === "OFFLINE") {
        title = "Filter Status QR";
        options = [
            { value: "", label: "Semua Peserta", activeClass: "bg-neutral-100 text-neutral-800" },
            { value: "QR_FILLED", label: "QR Sudah Terisi", activeClass: "bg-teal-100 text-teal-700", textClass: "text-teal-700" },
            { value: "QR_EMPTY", label: "QR Belum Terisi", activeClass: "bg-red-100 text-red-700", textClass: "text-red-700" },
        ];
    } else if (tipeEvent === "ONLINE") {
        title = "Filter Status Zoom";
        options = [
            { value: "", label: "Semua Peserta", activeClass: "bg-neutral-100 text-neutral-800" },
            { value: "ZOOM_FILLED", label: "Zoom Sudah Terisi", activeClass: "bg-blue-100 text-blue-700", textClass: "text-blue-700" },
            { value: "ZOOM_EMPTY", label: "Zoom Belum Terisi", activeClass: "bg-red-100 text-red-700", textClass: "text-red-700" },
        ];
    }

    const handleSelect = (val) => {
        onFilter(val);
        setIsOpen(false); 
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex gap-2 items-center border border-neutral/30 rounded-lg lg:rounded-xl p-3 hover:bg-neutral-50 transition relative"
            >
                <Icon icon="lsicon:filter-outline" className="text-neutral w-5 h-5 aspect-square" />
                <span className="hidden lg:flex font-body font-normal text-sm lg:text-base leading-none text-neutral">
                    {title}
                </span>

                {activeFilter !== '' && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-neutral/20 shadow-lg rounded-xl overflow-hidden z-20">
                    {options.map((opt) => {
                        const isActive = activeFilter === opt.value;
                        return (
                            <button 
                                key={opt.value}
                                onClick={() => handleSelect(opt.value)}
                                className={`w-full text-left px-4 py-3 text-sm font-medium border-b border-neutral/10 transition-colors 
                                ${isActive ? opt.activeClass : `hover:bg-neutral-50 ${opt.textClass || 'text-neutral-800'}`}`}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}