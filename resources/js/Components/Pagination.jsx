import { Link } from "@inertiajs/react";
import { IconChevronLeft, IconChevronRight } from "@/Components/Icons";
import React from "react";

// Helper untuk membersihkan label dari HTML entities
function cleanLabel(label = "") {
    return label
        .replace(/&laquo;|&raquo;/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/\u2026/g, "...")
        .replace(/<[^>]*>/g, "")
        .trim();
}

// Helper untuk mendapatkan nomor halaman dari link
function pageNumberFromLink(link) {
    if (!link || !link.label) return null;
    const parsed = Number(cleanLabel(link.label));
    return Number.isInteger(parsed) ? parsed : null;
}

// Komponen untuk tombol paginasi
function PageLink({ href, active, children, disabled }) {
    const baseClasses =
        "flex items-center justify-center px-3 py-2 text-sm font-semibold";
    const activeClasses = "bg-gray-100 text-indigo-700";
    const inactiveClasses = "text-gray-700 hover:bg-gray-100";
    const disabledClasses =
        "cursor-not-allowed text-gray-300 hover:bg-transparent";

    const className = `${baseClasses} ${
        active ? activeClasses : disabled ? disabledClasses : inactiveClasses
    }`;

    // Jika children adalah komponen ikon, kita tambahkan kelas warna padanya
    const renderedChildren = React.isValidElement(children)
        ? React.cloneElement(children, {
              className: `h-4 w-4 ${disabled ? "text-gray-300" : "text-gray-700"}`,
          })
        : children;

    if (href && !disabled) {
        return (
            <Link href={href} className={className}>
                {renderedChildren}
            </Link>
        );
    }

    return (
        <span className={className} aria-disabled={disabled}>
            {renderedChildren}
        </span>
    );
}

export default function Pagination({ links = [] }) {
    if (links.length <= 3) return null; // Sembunyikan jika hanya ada 1 halaman

    const prevLink = links[0];
    const nextLink = links[links.length - 1];
    const pageLinks = links.slice(1, -1);
    const totalPages = pageLinks.length;
    const activePageLink = pageLinks.find((link) => link.active);
    const currentPage = pageNumberFromLink(activePageLink) || 1;

    const getPageLinks = () => {
        // Jika total halaman kurang dari 6, tampilkan semua halaman
        if (totalPages < 6) {
            return pageLinks;
        }

        // Jika halaman aktif adalah salah satu dari 3 halaman pertama
        if (currentPage <= 3) {
            return [
                ...pageLinks.slice(0, 3), // Tampilkan halaman 1, 2, 3
                { url: null, label: "...", active: false }, // Elipsis
                pageLinks[totalPages - 1], // Halaman terakhir
            ];
        }

        // Jika halaman aktif mendekati akhir
        if (currentPage > totalPages - 3) {
            return [
                pageLinks[0], // Halaman pertama
                { url: null, label: "...", active: false }, // Elipsis
                ...pageLinks.slice(totalPages - 3), // 3 Halaman terakhir
            ];
        }

        // Jika halaman aktif ada di tengah
        return [
            pageLinks[0], // Halaman pertama
            { url: null, label: "...", active: false }, // Elipsis kiri
            pageLinks[currentPage - 2], // Halaman sebelum aktif
            pageLinks[currentPage - 1], // Halaman aktif
            pageLinks[currentPage], // Halaman setelah aktif
            { url: null, label: "...", active: false }, // Elipsis kanan
            pageLinks[totalPages - 1], // Halaman terakhir
        ];
    };

    const pagesToRender = getPageLinks();

    return (
        <nav className="inline-flex w-fit items-stretch overflow-hidden rounded-lg">
            <PageLink href={prevLink.url} disabled={!prevLink.url}>
                <IconChevronLeft />
            </PageLink>

            {pagesToRender.map((link, index) => {
                const label = cleanLabel(link.label);
                return (
                    <PageLink
                        key={index}
                        href={link.url}
                        active={link.active}
                        disabled={!link.url}
                    >
                        {label}
                    </PageLink>
                );
            })}

            <PageLink href={nextLink.url} disabled={!nextLink.url}>
                <IconChevronRight />
            </PageLink>
        </nav>
    );
}
