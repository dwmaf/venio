import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";

export default function Breadcrumb({ items }) {
    return (
        <nav
            className="flex gap-1 lg:gap-2 items-center text-neutral font-body"
            aria-label="Breadcrumb"
        >
            {items.map((item, idx) => (
                <span key={idx} className="flex items-center gap-1 md:gap-2">
                    {item.href ? (
                        idx === 0 ? (
                            <Link
                                href={item.href}
                                className="flex items-center gap-1"
                            >
                                <Icon
                                    icon="hugeicons:home-01"
                                    className="w-5 h-5 lg:2-6 lg:h-6"
                                />
                            </Link>
                        ) : (
                            <Link
                                href={item.href}
                                className="leading-none text-neutral text-lg lg:text-xl"
                            >
                                {item.label}
                            </Link>
                        )
                    ) : (
                        <span className="leading-none text-neutral text-xl w-[30ch] truncate">
                            {item.label}
                        </span>
                    )}
                    {idx < items.length - 1 && (
                        <Icon
                            icon="hugeicons:arrow-right-01"
                            className="w-5 h-5 lg:2-6 lg:h-6"
                        />
                    )}
                </span>
            ))}
        </nav>
    );
}
