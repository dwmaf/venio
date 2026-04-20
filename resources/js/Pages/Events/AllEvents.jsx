import { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AdminLayout from "@/Layouts/AdminLayout";
import { formatTanggalSlash, formatJamMenit } from "@/utils/format";
import Breadcrumb from "@/Components/Breadcrumb";
import { Icon } from "@iconify/react";
import { NoEvent, EventCard } from "@/Components/EventCard";

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

            <div className="flex flex-col gap-8">
                <Breadcrumb items={breadcrumbs} />

                {/* ongoing events */}
                <div className="flex justify-between">
                    <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none">
                        Ongoing Events
                    </span>
                    <Link href={route("ongoing.events")} className="flex gap-2">
                        <span className="font-['Plus_Jakarta_Sans'] font-medium text-[20px] leading-none text-blue-700">
                            Lihat Semua
                        </span>
                        <Icon
                            icon="basil:arrow-left-outline"
                            width="24"
                            height="24"
                            rotate={2}
                            className="text-blue-700"
                        />
                    </Link>
                </div>
                <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar">
                    {/* kalau tak ada ongoing event */}
                    {ongoingEvents.length === 0 ? (
                        <NoEvent />
                    ) : (
                        <>
                            {/* kalau ongoing event ada */}
                            {ongoingEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    name={event.nama_event}
                                    date={event.tanggal_event}
                                    timeStart={event.jam_mulai}
                                    timeEnd={event.jam_selesai}
                                    location={event.lokasi}
                                />
                            ))}
                            {/* kalau ongoing event cuman 1, kasih tambahan card*/}
                            {ongoingEvents.length === 1 && <NoEvent />}
                        </>
                    )}
                </div>

                {/* upcoming events */}
                <div className="flex justify-between">
                    <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none">
                        Upcoming Events
                    </span>
                    <Link
                        href={route("upcoming.events")}
                        className="flex gap-2"
                    >
                        <span className="font-['Plus_Jakarta_Sans'] font-medium text-[20px] leading-none text-blue-700">
                            Lihat Semua
                        </span>
                        <Icon
                            icon="basil:arrow-left-outline"
                            width="24"
                            height="24"
                            rotate={2}
                            className="text-blue-700"
                        />
                    </Link>
                </div>
                <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar">
                    {/* kalau tak ada upcoming event */}
                    {upcomingEvents.length === 0 ? (
                        <NoEvent />
                    ) : (
                        <>
                            {/* kalau upcoming event ada */}
                            {upcomingEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    name={event.nama_event}
                                    date={event.tanggal_event}
                                    timeStart={event.jam_mulai}
                                    timeEnd={event.jam_selesai}
                                    location={event.lokasi}
                                />
                            ))}
                            {/* kalau upcoming event cuman 1, kasih tambahan card*/}
                            {upcomingEvents.length === 1 && <NoEvent />}
                        </>
                    )}
                </div>

                {/* past events */}
                <div className="flex justify-between">
                    <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none">
                        Past Events
                    </span>
                    <Link href={route("past.events")} className="flex gap-2">
                        <span className="font-['Plus_Jakarta_Sans'] font-medium text-[20px] leading-none text-blue-700">
                            Lihat Semua
                        </span>
                        <Icon
                            icon="basil:arrow-left-outline"
                            width="24"
                            height="24"
                            rotate={2}
                            className="text-blue-700"
                        />
                    </Link>
                </div>
                <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar">
                    {/* kalau tak ada past event */}
                    {pastEvents.length === 0 ? (
                        <NoEvent />
                    ) : (
                        <>
                            {/* kalau past event ada */}
                            {pastEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    name={event.nama_event}
                                    date={event.tanggal_event}
                                    timeStart={event.jam_mulai}
                                    timeEnd={event.jam_selesai}
                                    location={event.lokasi}
                                />
                            ))}
                            {/* kalau past event cuman 1, kasih tambahan card*/}
                            {pastEvents.length === 1 && <NoEvent />}
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
