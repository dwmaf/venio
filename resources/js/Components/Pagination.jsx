import { Link } from '@inertiajs/react';
import { Icon } from '@iconify/react';

export default function Pagination({ links }) {
    if (links.length <= 3) {
        return (
            <div className="flex justify-between w-full">
                {links[0].url ? (
                    <Link
                        href={links[0].url}
                        className="px-4 py-2 text-sm font-bold flex items-center dark:text-gray-100 text-gray-700 justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <span>Previous</span>
                    </Link>
                ) : (
                    <div />
                )}
                
                {links[links.length - 1].url ? (
                    <Link
                        href={links[links.length - 1].url}
                        className="px-4 py-2 text-sm font-bold flex items-center dark:text-gray-100 text-gray-700 justify-center border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <span>Next</span>
                    </Link>
                ) : (
                    <div />
                )}
            </div>
        );
    }

    return (
        <div className="inline-flex items-stretch border border-gray-300 dark:border-gray-600 divide-x-2 divide-gray-300 dark:divide-gray-600 rounded-lg overflow-hidden">
            {links.map((link, key) => {
                // Tombol First (Previous Arrow)
                if (key === 0 && link.url) {
                    return (
                        <Link
                            key={key}
                            href={link.url ?? '#'}
                            className="px-2 py-2 text-sm font-bold flex items-center dark:text-gray-100 text-gray-700 justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Icon icon="lucide:chevron-left" className="w-4 h-4" />
                        </Link>
                    );
                }

                // Tombol Last (Next Arrow)
                if (key === links.length - 1 && link.url) {
                    return (
                        <Link
                            key={key}
                            href={link.url ?? '#'}
                            className="px-2 py-2 text-sm font-bold flex items-center dark:text-gray-100 text-gray-700 justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <Icon icon="lucide:chevron-right" className="w-4 h-4" />
                        </Link>
                    );
                }

                // Angka Halaman
                if (key !== 0 && key !== links.length - 1) {
                    return link.url === null ? (
                        <div
                            key={key}
                            className="px-3 py-2 text-sm text-gray-500"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <Link
                            key={key}
                            className={`px-3 py-2 text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                link.active
                                    ? 'text-indigo-700 dark:text-indigo-400'
                                    : 'dark:text-white text-gray-700'
                            }`}
                            href={link.url}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return null;
            })}
        </div>
    );
}