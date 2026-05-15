import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { route } from "ziggy-js";
import AdminLayout from "@/Layouts/AdminLayout";
import { formatTanggalSlash } from "@/utils/format";
import Breadcrumb from "@/Components/Breadcrumb";
import Pagination from "@/Components/Pagination";
import { NoEvent } from "@/Components/EventCard";
import { SearchInput } from "@/Components/Inputs";
import { BackButton, FilterTipeEventDropdown } from "@/Components/Buttons";
import { TableHead, TableData, TableRow } from "@/Components/Tables";

export default function PastEvents({ pastEvents, filters }) {
    const [search, setSearch] = useState(filters?.search || "");
    const [tipe, setTipe] = useState(filters?.tipe || "ALL");

    useEffect(() => {
        if (search === (filters?.search || "")) return;

        const delayDebounceFn = setTimeout(() => {
            router.get(
                route("past.events"),
                { search: search },
                { preserveState: true, replace: true },
            );
        }, 800);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const handleFilter = (val) => {
        setTipe(val);
        router.get(
            route("past.events"),
            { search: search, tipe: val },
            { preserveState: true, replace: true }
        );
    };

    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Events", href: route("all.events") },
        { label: "Past Events", href: route("past.events") },
    ];

    const eventTypeColors = {
        ONLINE: "bg-amber-100 text-amber-700",
        HYBRID: "bg-blue-100 text-blue-700",
        OFFLINE: "bg-lime-100 text-lime-700",
    };

    const shownCount = pastEvents.data.length;

    const tableDataClass =
        "font-body p-3 text-sm leading-none text-black lg:p-5 lg:text-base";

    return (
        <AdminLayout title="Daftar Acara">
            <Head title="Venio | Acara Sebelumnya" />

            <div className="flex flex-col gap-6 lg:gap-8">
                <div className="flex items-center justify-between">
                    <Breadcrumb items={breadcrumbs} />

                    <BackButton text="Kembali" />
                </div>
                <FilterTipeEventDropdown 
                                activeFilter={tipe} 
                                onFilter={handleFilter} 
                            />
                <div className="flex flex-col gap-4 lg:gap-6">
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                        <h1 className="font-body text-base leading-none font-medium lg:text-2xl">
                            Acara Sebelumnya
                        </h1>

                        <div className="w-full md:w-1/5">
                            <SearchInput
                                placeholder="Cari Acara..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        {pastEvents.data.length === 0 ? (
                            <div className="font-heading text-neutral flex h-full w-full grow items-center justify-center text-xl font-medium lg:text-2xl">
                                <p>Tidak ada acara!</p>
                            </div>
                        ) : (
                            <table className="w-full min-w-172 table-fixed border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-neutral-400">
                                        <TableHead text="Acara" />
                                        <TableHead text="Tanggal" />
                                        <TableHead text="Total Peserta" />
                                        <TableHead text="Tipe" />
                                        <TableHead text="Partner" />
                                    </tr>
                                </thead>

                                <tbody>
                                    {pastEvents.data.map((event) => (
                                        <tr
                                            key={event.id}
                                            className="cursor-pointer border-b border-neutral-400 transition-colors duration-300 hover:bg-neutral-50"
                                            onClick={() =>
                                                router.visit(
                                                    route(
                                                        "events.index",
                                                        event.id,
                                                    ),
                                                )
                                            }
                                        >
                                            <td
                                                className={`${tableDataClass} truncate`}
                                            >
                                                {event.nama_event}
                                            </td>

                                            <td className={tableDataClass}>
                                                {formatTanggalSlash(
                                                    event.tanggal_event,
                                                )}
                                            </td>

                                            <td className={tableDataClass}>
                                                {event.participants_count}{" "}
                                                Peserta
                                            </td>

                                            <td
                                                className={`${tableDataClass} capitalize`}
                                            >
                                                <div
                                                    className={`${eventTypeColors[event.tipe_event] || "bg-gray-100 text-gray-700"} inline-flex items-center justify-center rounded-xl px-3 py-1`}
                                                >
                                                    {event.tipe_event.toLowerCase()}
                                                </div>
                                            </td>
                                            <td
                                                className={`${tableDataClass} truncate`}
                                            >
                                                {event.partners &&
                                                event.partners.length > 0 ? (
                                                    event.partners
                                                        .map(
                                                            (partner) =>
                                                                partner.nama,
                                                        )
                                                        .join(", ")
                                                ) : (
                                                    <span className="text-gray-500">
                                                        Tidak ada
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {shownCount > 0 && (
                        <div className="mt-6 flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between lg:mt-8">
                            <span className="font-body text-sm leading-none font-normal text-gray-500 lg:text-base">
                                Menampilkan {shownCount} dari {pastEvents.total}{" "}
                                data
                            </span>

                            <Pagination links={pastEvents.links} />
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
