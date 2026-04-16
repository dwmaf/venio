import { Link } from '@inertiajs/react';
import { Icon } from '@iconify/react';

export default function Breadcrumb({ items }) {
    return (
        <nav className="flex gap-2 items-center" aria-label="Breadcrumb">
            {items.map((item, idx) => (
                <span key={idx} className="flex items-center gap-2">
                    {item.href ? (
                        idx === 0 ? (
                            // Hanya icon untuk Home
                            <Link href={item.href} className="flex items-center gap-1">
                                <Icon icon="hugeicons:home-01" width="24" height="24" />
                            </Link>
                        ) : (
                            <Link href={item.href} className="flex items-center gap-1">
                                {item.label}
                            </Link>
                        )
                    ) : (
                        <span className="text-neutral-500 font-medium flex items-center gap-1">
                            {item.label}
                        </span>
                    )}
                    {idx < items.length - 1 && (
                        <Icon icon="hugeicons:arrow-right-01" width="24" height="24" />
                    )}
                </span>
            ))}
        </nav>
    );
}