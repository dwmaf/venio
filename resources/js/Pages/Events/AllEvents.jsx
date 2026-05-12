import { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AdminLayout from "@/Layouts/AdminLayout";
import { formatTanggalSlash, formatJamMenit } from "@/utils/format";
import Breadcrumb from "@/Components/Breadcrumb";
import { NoEvent, EventCard } from "@/Components/EventCard";
import { RouteButton } from "@/Components/Buttons";

export default function AllEvents({
    ongoingEvents,
    upcomingEvents,
    pastEvents,
}) {
    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Events", href: route("all.events") },
    ];

    return (
        <AdminLayout title="Events">
            <Head title="Venio | Events" />
            <div className="flex flex-col gap-6 lg:gap-8">
                <Breadcrumb items={breadcrumbs} />

                {/* ongoing events */}
                <div className="flex flex-col gap-4 lg:gap-6">
                    <div className="flex justify-between font-body font-medium leading-none">
                        <span className="text-base lg:text-2xl">
                            Ongoing Events
                        </span>
                        <RouteButton
                            href={route("ongoing.events")}
                            text="Lihat Semua"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar">
                        {/* kalau tak ada ongoing event */}
                        {ongoingEvents.length === 0 ? (
                            <NoEvent />
                        ) : (
                            <>
                                {/* kalau ongoing event ada */}
                                {ongoingEvents.map((event) => (
                                    <div key={event.id} className="w-full shrink-0 snap-center md:w-120 lg:w-1/3 lg:min-w-0">
                                        <EventCard
                                            name={event.nama_event}
                                            date={event.tanggal_event}
                                            timeStart={event.jam_mulai}
                                            timeEnd={event.jam_selesai}
                                            href={route("events.index", event.id)}
                                            location={event.lokasi}
                                            col={true}
                                        />
                                    </div>
                                ))}
                                {/* jika ongoingEvents berjumlah 1 atau 2, tambahkan placeholder NoEvent supaya total 3 */}
                                {ongoingEvents.length > 0 && ongoingEvents.length < 3 &&
                                    Array.from({ length: 3 - ongoingEvents.length }).map((_, i) => (
                                        <div key={`no-ongoing-${i}`} className="w-full shrink-0 snap-center md:w-120 lg:w-1/3 lg:min-w-0">
                                            <NoEvent />
                                        </div>
                                    ))}
                            </>
                        )}
                    </div>
                </div>

                {/* upcoming events */}
                <div className="flex flex-col gap-4 lg:gap-6">
                    <div className="flex justify-between font-body font-medium leading-none">
                        <span className="text-base lg:text-2xl">
                            Upcoming Events
                        </span>
                        <RouteButton
                            href={route("upcoming.events")}
                            text="Lihat Semua"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar">
                        {/* kalau tak ada upcoming event */}
                        {upcomingEvents.length === 0 ? (
                            <NoEvent />
                        ) : (
                            <>
                                {/* kalau upcoming event ada */}
                                {upcomingEvents.map((event) => (
                                    <div key={event.id} className="w-full shrink-0 snap-center md:w-120 lg:w-1/3 lg:min-w-0">
                                        <EventCard
                                            name={event.nama_event}
                                            date={event.tanggal_event}
                                            timeStart={event.jam_mulai}
                                            timeEnd={event.jam_selesai}
                                            href={route("events.index", event.id)}
                                            location={event.lokasi}
                                            col={true}
                                        />
                                    </div>
                                ))}
                                {/* jika upcomingEvents berjumlah 1 atau 2, tambahkan placeholder NoEvent supaya total 3 */}
                                {upcomingEvents.length > 0 && upcomingEvents.length < 3 &&
                                    Array.from({ length: 3 - upcomingEvents.length }).map((_, i) => (
                                        <div key={`no-upcoming-${i}`} className="w-full shrink-0 snap-center md:w-120 lg:w-1/3 lg:min-w-0">
                                            <NoEvent />
                                        </div>
                                    ))}
                            </>
                        )}
                    </div>
                </div>

                {/* past events */}
                <div className="flex flex-col  gap-4 lg:gap-6">
                    <div className="flex justify-between font-body font-medium leading-none">
                        <span className="text-base lg:text-2xl">
                            Past Events
                        </span>
                        <RouteButton
                            href={route("past.events")}
                            text="Lihat Semua"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar">
                        {/* kalau tak ada past event */}
                        {pastEvents.length === 0 ? (
                            <NoEvent />
                        ) : (
                            <>
                                {/* kalau past event ada */}
                                {pastEvents.map((event) => (
                                    <div key={event.id} className="w-full shrink-0 snap-center md:w-120 lg:w-1/3 lg:min-w-0">
                                        <EventCard
                                            name={event.nama_event}
                                            date={event.tanggal_event}
                                            timeStart={event.jam_mulai}
                                            timeEnd={event.jam_selesai}
                                            href={route("events.index", event.id)}
                                            location={event.lokasi}
                                            col={true}
                                        />
                                    </div>
                                ))}
                                {/* jika pastEvents berjumlah 1 atau 2, tambahkan placeholder NoEvent supaya total 3 */}
                                {pastEvents.length > 0 && pastEvents.length < 3 &&
                                    Array.from({ length: 3 - pastEvents.length }).map((_, i) => (
                                        <div key={`no-past-${i}`} className="w-full shrink-0 snap-center md:w-120 lg:w-1/3 lg:min-w-0">
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
