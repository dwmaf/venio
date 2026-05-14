import { Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import { NoEvent, EventCard } from "@/Components/EventCard";
import { RouteButton, BackButton } from "@/Components/Buttons";

export default function OngoingEvents({ ongoingEvents }) {
    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Events", href: route("all.events") },
        { label: "Ongoing Events", href: route("ongoing.events") },
    ];

    return (
        <AdminLayout title="Events">
            <Head title="Venio | Ongoing Events" />

            <div className="flex h-full flex-col gap-6 lg:gap-8">
                <div className="flex justify-between">
                    <Breadcrumb items={breadcrumbs} />

                    <BackButton text="Kembali" />
                </div>

                <div className="flex h-full flex-col gap-4 lg:gap-6">
                    <div className="flex justify-between">
                        <h1 className="font-body text-base leading-none font-medium lg:text-2xl">
                            Sedang Berlangsung!
                        </h1>

                        <RouteButton
                            href={route("create.events")}
                            text="Tambah Acara"
                        />
                    </div>

                    {ongoingEvents.length === 0 ? (
                        <div className="font-heading text-neutral flex h-full w-full grow items-center justify-center text-xl font-medium lg:text-2xl">
                            <p>Tidak ada acara!</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {ongoingEvents.map((event) => (
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
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
