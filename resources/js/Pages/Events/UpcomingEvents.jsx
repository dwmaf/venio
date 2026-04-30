import { Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import { NoEvent, EventCard } from "@/Components/EventCard";

export default function UpcomingEvents({ upcomingEvents }) {
    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Events", href: route("all.events") },
        { label: "Upcoming Events", href: route("upcoming.events") },
    ];

    return (
        <AdminLayout title="Events">
            <Head title="Venio | Upcoming Events" />

            <div className="flex flex-col gap-6 lg:gap-8">
                <Breadcrumb items={breadcrumbs} />

                <div className="flex flex-col gap-4 lg:gap-6">
                    <span className="font-body font-medium text-base lg:text-2xl leading-none">
                        Upcoming Events
                    </span>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {upcomingEvents.length === 0 ? (
                            <NoEvent />
                        ) : (
                            <>
                                {upcomingEvents.map((event) => (
                                    <EventCard
                                        key={event.id}
                                        name={event.nama_event}
                                        date={event.tanggal_event}
                                        timeStart={event.jam_mulai}
                                        timeEnd={event.jam_selesai}
                                        href={route("events.index", event.id)}
                                        location={event.lokasi}
                                    />
                                ))}
                                {upcomingEvents.length === 1 && <NoEvent />}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}