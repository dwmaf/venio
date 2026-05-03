import { useState, useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";
import {
    IconBasilArrowLeftOutline,
    IconEvaExternalLinkFill,
    IconMingcuteFileImportFill,
    IconRiWhatsappFill,
    IconLsiFilterOutline,
} from "@/Components/Icons";

export function RouteButton({ text, href }) {
    return (
        <Link
            href={href}
            className="font-body group mt-1 flex items-center gap-0.5 text-sm leading-none font-medium text-blue-700 hover:underline md:text-lg lg:gap-2"
        >
            <span>{text}</span>
            <IconBasilArrowLeftOutline className="group-hover:translate-x- aspect-square h-5 w-5 rotate-180 text-blue-700 transition-all duration-300 md:h-6 md:w-6" />
        </Link>
    );
}

export function Redirect({ href }) {
    return (
        <Link href={href}>
            <IconEvaExternalLinkFill className="aspect-square h-5 w-5 text-blue-700 lg:h-6 lg:w-6" />
        </Link>
    );
}

export function ImportButton({ text, onClick }) {
    return (
        <button
            onClick={onClick}
            className="flex h-fit cursor-pointer items-center gap-0.5 rounded-lg bg-blue-100 p-3 hover:bg-blue-200 active:bg-blue-300 sm:gap-2 lg:h-full"
        >
            <IconMingcuteFileImportFill className="h-5 w-5 text-blue-700" />
            <span className="font-body text-sm leading-none text-blue-700 lg:text-base">
                {text}
            </span>
        </button>
    );
}

export function WAButton({ text, href }) {
    return (
        <a
            href={href}
            className="flex h-fit cursor-pointer items-center gap-0.5 rounded-lg bg-lime-100 p-3 hover:bg-lime-200 active:bg-lime-300 sm:gap-2 lg:h-full"
        >
            <IconRiWhatsappFill className="h-5 w-5 text-lime-700" />
            <span className="font-body text-center text-sm leading-none text-lime-700 lg:text-base">
                {text}
            </span>
        </a>
    );
}

export function ActionButton({ icon: IconComponent, label, onClick, href }) {
    const baseClass =
        "flex items-center rounded-lg border border-neutral/30 p-3 gap-2";

    const content = (
        <>
            <IconComponent className="aspect-square h-5 w-5 text-blue-700" />
            <span className="font-body text-sm leading-none font-normal lg:text-base">
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

export function SendButton({
    buttonClass,
    textClass,
    text,
    onClick,
    icon: IconComponent,
}) {
    return (
        <button
            onClick={onClick}
            className={`flex cursor-pointer items-center gap-2 rounded-lg bg-teal-50 p-3 ${buttonClass}`}
        >
            <IconComponent className={`aspect-square h-5 w-5 ${textClass}`} />
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
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    let title = "Filter";
    let options = [];

    if (tipeEvent === "HYBRID") {
        title = "Filter Metode";
        options = [
            {
                value: "",
                label: "Semua Peserta",
                activeClass: "bg-neutral-100 text-neutral-800",
            },
            {
                value: "OFFLINE",
                label: "Hanya Offline",
                activeClass: "bg-lime-100 text-lime-700",
                textClass: "text-lime-700",
            },
            {
                value: "ONLINE",
                label: "Hanya Online",
                activeClass: "bg-yellow-100 text-yellow-700",
                textClass: "text-yellow-700",
            },
        ];
    } else if (tipeEvent === "OFFLINE") {
        title = "Filter Status QR";
        options = [
            {
                value: "",
                label: "Semua Peserta",
                activeClass: "bg-neutral-100 text-neutral-800",
            },
            {
                value: "QR_FILLED",
                label: "QR Sudah Terisi",
                activeClass: "bg-blue-100 text-blue-700",
                textClass: "text-blue-700",
            },
            {
                value: "QR_EMPTY",
                label: "QR Belum Terisi",
                activeClass: "bg-red-100 text-red-700",
                textClass: "text-red-700",
            },
        ];
    } else if (tipeEvent === "ONLINE") {
        title = "Filter Status Zoom";
        options = [
            {
                value: "",
                label: "Semua Peserta",
                activeClass: "bg-neutral-100 text-neutral-800",
            },
            {
                value: "ZOOM_FILLED",
                label: "Zoom Sudah Terisi",
                activeClass: "bg-blue-100 text-blue-700",
                textClass: "text-blue-700",
            },
            {
                value: "ZOOM_EMPTY",
                label: "Zoom Belum Terisi",
                activeClass: "bg-red-100 text-red-700",
                textClass: "text-red-700",
            },
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
                className="border-neutral/30 relative flex items-center gap-2 rounded-lg border p-3 transition hover:bg-neutral-50 lg:rounded-xl"
            >
                <IconLsiFilterOutline className="text-neutral aspect-square h-5 w-5" />
                <span className="font-body text-neutral hidden text-sm leading-none font-normal md:flex lg:text-base">
                    {title}
                </span>

                {activeFilter !== "" && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="border-neutral/20 absolute top-full left-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border bg-white shadow-lg">
                    {options.map((opt) => {
                        const isActive = activeFilter === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => handleSelect(opt.value)}
                                className={`border-neutral/10 w-full border-b px-4 py-3 text-left text-sm font-medium transition-colors ${isActive ? opt.activeClass : `hover:bg-neutral-50 ${opt.textClass || "text-neutral-800"}`}`}
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
