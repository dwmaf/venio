import { Link } from "@inertiajs/react";
import { IconChevronLeft, IconChevronRight } from "@/Components/Icons";

function cleanLabel(label = "") {
    return label
        .replace(/&laquo;|&raquo;/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/\u2026/g, "...")
        .replace(/<[^>]*>/g, "")
        .trim();
}

function pageNumberFromLabel(label = "") {
    const parsed = Number(cleanLabel(label));
    return Number.isInteger(parsed) ? parsed : null;
}

export default function Pagination({ links = [] }) {
    if (links.length === 0) return null;

    const MAX_VISIBLE_PAGES = 5;
    const prevLink = links[0];
    const nextLink = links[links.length - 1];
    const pageLinks = links.slice(1, -1).filter((link) => pageNumberFromLabel(link.label) !== null);

    if (pageLinks.length === 0) return null;

    const activePage =
        pageNumberFromLabel(pageLinks.find((link) => link.active)?.label) ?? 1;
    const totalPages =
        pageNumberFromLabel(pageLinks[pageLinks.length - 1]?.label) ?? pageLinks.length;

    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > MAX_VISIBLE_PAGES) {
        const halfWindow = Math.floor(MAX_VISIBLE_PAGES / 2);
        startPage = activePage - halfWindow;
        endPage = activePage + halfWindow;

        if (startPage < 1) {
            endPage += 1 - startPage;
            startPage = 1;
        }

        if (endPage > totalPages) {
            startPage -= endPage - totalPages;
            endPage = totalPages;
        }

        if (startPage < 1) {
            startPage = 1;
        }
    }

    const visiblePageLinks = pageLinks.filter((link) => {
        const pageNumber = pageNumberFromLabel(link.label);
        return pageNumber !== null && pageNumber >= startPage && pageNumber <= endPage;
    });

    return (
        <nav className="inline-flex items-stretch overflow-hidden rounded-lg border border-gray-300 divide-x-2 divide-gray-300">
            {prevLink?.url ? (
                <Link
                    href={prevLink.url}
                    className="flex items-center justify-center px-2 py-2 text-gray-700 hover:bg-gray-100"
                    aria-label="Previous page"
                >
                    <IconChevronLeft className="h-4 w-4"/>
                </Link>
            ) : (
                <span
                    className="flex items-center justify-center px-2 py-2 text-gray-300"
                    aria-hidden="true"
                >
                    <IconChevronLeft className="h-4 w-4"/>
                </span>
            )}

            {visiblePageLinks.map((link, index) => {
                const label = cleanLabel(link.label);

                if (!label) {
                    return null;
                }

                if (link.url === null) {
                    return (
                        <span
                            key={`${label}-${index}`}
                            className="px-3 py-2 text-sm font-semibold text-gray-400"
                            aria-current={link.active ? "page" : undefined}
                        >
                            {label}
                        </span>
                    );
                }

                return (
                    <Link
                        key={`${label}-${index}`}
                        href={link.url}
                        className={`px-3 py-2 text-sm font-semibold hover:bg-gray-100 ${
                            link.active ? "text-indigo-700" : "text-gray-700"
                        }`}
                        aria-current={link.active ? "page" : undefined}
                    >
                        {label}
                    </Link>
                );
            })}

            {nextLink?.url ? (
                <Link
                    href={nextLink.url}
                    className="flex items-center justify-center px-2 py-2 text-gray-700 hover:bg-gray-100"
                    aria-label="Next page"
                >
                    <IconChevronRight className="h-4 w-4"/>
                </Link>
            ) : (
                <span
                    className="flex items-center justify-center px-2 py-2 text-gray-300"
                    aria-hidden="true"
                >
                    <IconChevronRight className="h-4 w-4"/>
                </span>
            )}
        </nav>
    );
}