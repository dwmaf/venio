import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { route } from "ziggy-js";
import AdminLayout from "@/Layouts/AdminLayout";
import { formatTanggalSlash } from "@/utils/format";
import Breadcrumb from "@/Components/Breadcrumb";
import Pagination from "@/Components/Pagination";
import { NoEvent } from "@/Components/EventCard";
import { SearchInput } from "@/Components/Inputs";

export default function PastEvents({ pastEvents, filters }) {
    const [search, setSearch] = useState(filters?.search || "");
    useEffect(() => {
        if (search === (filters?.search || "")) return;

        const delayDebounceFn = setTimeout(() => {
            router.get(
                route("past.events"),
                { search: search },
                { preserveState: true, replace: true }
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
        <AdminLayout title="Events">
            <Head title="Venio | Past Events" />

            <div className="flex flex-col gap-6 lg:gap-8">
                <Breadcrumb items={breadcrumbs} />

                <div className="flex flex-col gap-4 lg:gap-6">
                    <span className="font-body font-medium text-base lg:text-2xl leading-none">
                        Past Events
                    </span>
                    <div className="w-full lg:w-1/3">
                        <SearchInput
                            placeholder="Cari Nama Event..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="w-full overflow-x-auto">
                        {pastEvents.data.length === 0 ? (
                            <NoEvent />
                        ) : (
                            <table className="w-full min-w-172 text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-400">
                                        <th className="p-4 lg:p-5 font-normal font-body text-base lg:text-xl leading-none text-black">
                                            Nama Event
                                        </th>
                                        <th className="p-4 lg:p-5 font-normal font-body text-base lg:text-xl leading-none text-black">
                                            Tanggal
                                        </th>
                                        <th className="p-4 lg:p-5 font-normal font-body text-base lg:text-xl leading-none text-black">
                                            Total Peserta
                                        </th>
                                        <th className="p-4 lg:p-5 font-normal font-body text-base lg:text-xl leading-none text-black">
                                            Tipe
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pastEvents.data.map((event) => (
                                        <tr key={event.id} className="border-b border-neutral-400 cursor-pointer"
                                            onClick={() => router.visit(route("events.index", event.id))}>
                                            <td className="p-4 lg:p-5 font-normal font-body text-sm lg:text-base leading-none text-black">
                                                {event.nama_event}
                                            </td>
                                            <td className="p-4 lg:p-5 font-normal font-body text-sm lg:text-base leading-none text-black">
                                                {formatTanggalSlash(event.tanggal_event)}
                                            </td>
                                            <td className="p-4 lg:p-5 font-normal font-body text-sm lg:text-base leading-none text-black">
                                                {event.participants_count} Peserta
                                            </td>
                                            <td className="p-4 lg:p-5 font-medium font-body text-xs leading-none capitalize">
                                                <div
                                                    className={`${eventTypeColors[event.tipe_event] || "bg-gray-100 text-gray-700"} inline-flex items-center justify-center min-w-15 py-1 rounded-xl`}
                                                >
                                                    {event.tipe_event.toLowerCase()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {shownCount > 0 && (
                            <div className="mt-6 lg:mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <span className="font-normal font-body text-sm lg:text-base leading-none text-gray-500">
                                    Menampilkan {shownCount} dari {pastEvents.total} data
                                </span>
                                <Pagination links={pastEvents.links} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}