import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { route } from "ziggy-js";
import AdminLayout from "@/Layouts/AdminLayout";
import { formatTanggalSlash } from "@/utils/format";
import Breadcrumb from "@/Components/Breadcrumb";
import Pagination from "@/Components/Pagination";
import { NoEvent } from "@/Components/EventCard";
import { SearchInput } from "@/Components/Inputs";
import { BackButton } from "@/Components/Buttons";

export default function PastEvents({ pastEvents, filters }) {
    const [search, setSearch] = useState(filters?.search || "");
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

    return (
        <AdminLayout title="Daftar Acara">
            <Head title="Venio | Past Events" />

            <div className="flex flex-col gap-6 lg:gap-8">
                <div className="flex items-center justify-between">
                    <Breadcrumb items={breadcrumbs} />

                    <BackButton text="Kembali" />
                </div>

                <div className="flex flex-col gap-4 lg:gap-6">
                    <div className="flex items-center justify-between">
                        <h1 className="font-body text-base leading-none font-medium lg:text-2xl">
                            Acara Sebelumnya
                        </h1>

                        <div className="w-1/5">
                            <SearchInput
                                placeholder="Cari Acara..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="w-full overflow-x-auto">
                        {pastEvents.data.length === 0 ? (
                            <NoEvent />
                        ) : (
                            <table className="w-full min-w-172 table-fixed border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-neutral-400">
                                        <th className="font-body p-4 text-base leading-none font-normal text-black lg:p-5 lg:text-xl">
                                            Acara
                                        </th>
                                        <th className="font-body w-[15%] p-4 text-base leading-none font-normal text-black lg:p-5 lg:text-xl">
                                            Tanggal
                                        </th>
                                        <th className="font-body w-[15%] p-4 text-base leading-none font-normal text-black lg:p-5 lg:text-xl">
                                            Total Peserta
                                        </th>
                                        <th className="font-body w-[10%] p-4 text-base leading-none font-normal text-black lg:p-5 lg:text-xl">
                                            Tipe
                                        </th>
                                        <th className="font-body w-[15%] p-4 text-base leading-none font-normal text-black lg:p-5 lg:text-xl">
                                            Partner
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {pastEvents.data.map((event) => (
                                        <tr
                                            key={event.id}
                                            className="cursor-pointer border-b border-neutral-400 hover:bg-neutral-50"
                                            onClick={() =>
                                                router.visit(
                                                    route(
                                                        "events.index",
                                                        event.id,
                                                    ),
                                                )
                                            }
                                        >
                                            <td className="font-body truncate p-4 text-sm leading-none font-normal text-black lg:p-5 lg:text-base">
                                                {event.nama_event}
                                            </td>
                                            <td className="font-body p-4 text-sm leading-none font-normal text-black lg:p-5 lg:text-base">
                                                {formatTanggalSlash(
                                                    event.tanggal_event,
                                                )}
                                            </td>
                                            <td className="font-body p-4 text-sm leading-none font-normal text-black lg:p-5 lg:text-base">
                                                {event.participants_count}{" "}
                                                Peserta
                                            </td>
                                            <td className="font-body p-4 text-xs leading-none font-medium capitalize lg:p-5">
                                                <div
                                                    className={`${eventTypeColors[event.tipe_event] || "bg-gray-100 text-gray-700"} inline-flex min-w-15 items-center justify-center rounded-xl py-1`}
                                                >
                                                    {event.tipe_event.toLowerCase()}
                                                </div>
                                            </td>
                                            <td className="font-body truncate p-4 text-xs leading-none font-medium capitalize lg:p-5">
                                                <div
                                                    className={`${eventTypeColors[event.tipe_event] || "bg-gray-100 text-gray-700"} inline-flex min-w-15 items-center justify-center rounded-xl py-1`}
                                                >
                                                    {event.tipe_event.toLowerCase()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    {shownCount > 0 && (
                        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between lg:mt-8">
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
