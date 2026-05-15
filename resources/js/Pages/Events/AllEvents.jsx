import { useState } from "react";
import { Head, router, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AdminLayout from "@/Layouts/AdminLayout";
import { formatTanggalSlash, formatJamMenit } from "@/utils/format";
import Breadcrumb from "@/Components/Breadcrumb";
import { NoEvent, EventCard } from "@/Components/EventCard";
import { RouteButton, BackButton, FilterTipeEventDropdown } from "@/Components/Buttons";

export default function AllEvents({
    ongoingEvents,
    upcomingEvents,
    pastEvents,
    currentFilter,
}) {
    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Events", href: route("all.events") },
    ];

    const handleFilter = (val) => {
        router.get(
            route("all.events"), 
            { tipe: val }, // parameter query: /all-events?tipe=ONLINE
            { preserveState: true, replace: true } // agar scroll tak reset
        );
    };

    return (
        <AdminLayout title="Daftar Acara">
            <Head title="Venio | Daftar Acara" />

            <div className="flex flex-col gap-6 lg:gap-8">
                <div className="flex justify-between">
                    <Breadcrumb items={breadcrumbs} />

                    <BackButton text="Kembali" />
                </div>
                <FilterTipeEventDropdown
                    activeFilter={currentFilter || "ALL"}
                    onFilter={handleFilter}
                />

                {/* ongoing events */}
                <div className="flex flex-col gap-4 lg:gap-6">
                    <div className="font-body flex justify-between leading-none font-medium">
                        <span className="text-base lg:text-2xl">
                            Sedang Berlangsung!
                        </span>
                        <RouteButton
                            href={route("ongoing.events")}
                            text="Lihat Semua"
                        />
                    </div>

                    <div className="hide-scrollbar flex snap-x snap-mandatory flex-col gap-4 overflow-x-auto md:flex-row">
                        {/* kalau tak ada ongoing event */}
                        {ongoingEvents.length === 0 ? (
                            <NoEvent />
                        ) : (
                            <>
                                {/* kalau ongoing event ada */}
                                {ongoingEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="w-full md:w-120 lg:w-1/3 lg:min-w-0"
                                    >
                                        <EventCard
                                            name={event.nama_event}
                                            tipeEvent={event.tipe_event}
                                            date={event.tanggal_event}
                                            timeStart={event.jam_mulai}
                                            timeEnd={event.jam_selesai}
                                            href={route(
                                                "events.index",
                                                event.id,
                                            )}
                                            location={event.lokasi}
                                            participantsCount={event.participants_count}
                                            col={true}
                                        />
                                    </div>
                                ))}

                                {/* jika ongoingEvents berjumlah 1 atau 2, tambahkan placeholder NoEvent supaya total 3 */}
                                {ongoingEvents.length > 0 &&
                                    ongoingEvents.length < 3 &&
                                    Array.from({
                                        length: 3 - ongoingEvents.length,
                                    }).map((_, i) => (
                                        <div
                                            key={`no-ongoing-${i}`}
                                            className="w-full md:w-120 lg:w-1/3 lg:min-w-0"
                                        >
                                            <NoEvent />
                                        </div>
                                    ))}
                            </>
                        )}
                    </div>
                </div>

                {/* upcoming events */}
                <div className="flex flex-col gap-4 lg:gap-6">
                    <div className="font-body flex justify-between leading-none font-medium">
                        <span className="text-base lg:text-2xl">
                            Acara Mendatang
                        </span>
                        <RouteButton
                            href={route("upcoming.events")}
                            text="Lihat Semua"
                        />
                    </div>

                    <div className="hide-scrollbar flex snap-x snap-mandatory flex-col gap-4 overflow-x-auto md:flex-row">
                        {/* kalau tak ada upcoming event */}
                        {upcomingEvents.length === 0 ? (
                            <NoEvent />
                        ) : (
                            <>
                                {/* kalau upcoming event ada */}
                                {upcomingEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="w-full md:w-120 lg:w-1/3 lg:min-w-0"
                                    >
                                        <EventCard
                                            name={event.nama_event}
                                            tipeEvent={event.tipe_event}
                                            date={event.tanggal_event}
                                            timeStart={event.jam_mulai}
                                            timeEnd={event.jam_selesai}
                                            href={route(
                                                "events.index",
                                                event.id,
                                            )}
                                            location={event.lokasi}
                                            participantsCount={event.participants_count}
                                            col={true}
                                        />
                                    </div>
                                ))}

                                {/* jika upcomingEvents berjumlah 1 atau 2, tambahkan placeholder NoEvent supaya total 3 */}
                                {upcomingEvents.length > 0 &&
                                    upcomingEvents.length < 3 &&
                                    Array.from({
                                        length: 3 - upcomingEvents.length,
                                    }).map((_, i) => (
                                        <div
                                            key={`no-upcoming-${i}`}
                                            className="w-full md:w-120 lg:w-1/3 lg:min-w-0"
                                        >
                                            <NoEvent />
                                        </div>
                                    ))}
                            </>
                        )}
                    </div>
                </div>

                {/* past events */}
                <div className="flex flex-col gap-4 lg:gap-6">
                    <div className="font-body flex justify-between leading-none font-medium">
                        <span className="text-base lg:text-2xl">
                            Acara Sebelumnya
                        </span>
                        <RouteButton
                            href={route("past.events")}
                            text="Lihat Semua"
                        />
                    </div>

                    <div className="hide-scrollbar flex snap-x snap-mandatory flex-col gap-4 overflow-x-auto md:flex-row">
                        {/* kalau tak ada past event */}
                        {pastEvents.length === 0 ? (
                            <NoEvent />
                        ) : (
                            <>
                                {/* kalau past event ada */}
                                {pastEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="w-full md:w-120 lg:w-1/3 lg:min-w-0"
                                    >
                                        <EventCard
                                            name={event.nama_event}
                                            tipeEvent={event.tipe_event}
                                            date={event.tanggal_event}
                                            timeStart={event.jam_mulai}
                                            timeEnd={event.jam_selesai}
                                            href={route(
                                                "events.index",
                                                event.id,
                                            )}
                                            location={event.lokasi}
                                            participantsCount={event.participants_count}
                                            col={true}
                                        />
                                    </div>
                                ))}

                                {/* jika pastEvents berjumlah 1 atau 2, tambahkan placeholder NoEvent supaya total 3 */}
                                {pastEvents.length > 0 &&
                                    pastEvents.length < 3 &&
                                    Array.from({
                                        length: 3 - pastEvents.length,
                                    }).map((_, i) => (
                                        <div
                                            key={`no-past-${i}`}
                                            className="w-full md:w-120 lg:w-1/3 lg:min-w-0"
                                        >
                                            <NoEvent />
                                        </div>
                                    ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
