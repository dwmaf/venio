import { Link } from '@inertiajs/react';
import { Icon } from '@iconify/react';

export default function Breadcrumb({ items }) {
    return (
        <nav className="flex gap-2 items-center" aria-label="Breadcrumb">
            {items.map((item, idx) => (
                <span key={idx} className="flex items-center gap-2">
                    {item.href ? (
                        idx === 0 ? (
                            <Link href={item.href} className="flex items-center gap-1">
                                <Icon icon="hugeicons:home-01" width="18" height="18" />
                            </Link>
                        ) : (
                            <Link href={item.href} className="font-['Plus_Jakarta_Sans'] leading-none text-neutral-500 text-[20px] font-normal">
                                {item.label}
                            </Link>
                        )
                    ) : (
                        <span className="font-['Plus_Jakarta_Sans'] leading-none text-neutral-500 text-[20px] font-normal ">
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
