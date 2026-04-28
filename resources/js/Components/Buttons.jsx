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
