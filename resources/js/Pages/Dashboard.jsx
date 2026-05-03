import { useState, useEffect, useRef } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AdminLayout from "@/Layouts/AdminLayout";
import { formatTanggalSlash, formatJamMenit } from "@/utils/format";
import Breadcrumb from "@/Components/Breadcrumb";
import {
    IconDuoApproved,
    IconDuoAlignBottom,
    IconTwotoneHandshake,
} from "@/Components/Icons";
import Metadata from "@/Components/Metadata";
import { NoEvent, EventCard } from "@/Components/EventCard";
import { RouteButton, Redirect } from "@/Components/Buttons";

export default function Dashboard({ ongoingEvents, upcomingEvents, stats }) {
    const [activeTab, setActiveTab] = useState("berlangsung"); // 'berlangsung' | 'riwayat'
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef(null);
    const slideRefs = useRef([]);

    const isScrollingByClick = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (isScrollingByClick.current) {
                    return;
                }

                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Temukan index dari slide yang terlihat
                        const index = slideRefs.current.findIndex(
                            (ref) => ref === entry.target,
                        );
                        if (index !== -1) {
                            setActiveIndex(index);
                        }
                    }
                });
            },
            {
                root: scrollContainerRef.current, // Mengamati di dalam kontainer scroll
                threshold: 0.75, // Dianggap terlihat jika 50% slide masuk layar
            },
        );

        // Mulai mengamati setiap slide
        const currentRefs = slideRefs.current;
        currentRefs.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        // Cleanup observer saat komponen unmount
        return () => {
            slideRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, [ongoingEvents]);

    const handleDotClick = (index) => {
        isScrollingByClick.current = true;
        setActiveIndex(index); // Langsung update UI titik

        slideRefs.current[index]?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "start",
        });

        // Reset flag setelah scroll selesai
        // Diberi sedikit jeda untuk memastikan animasi scroll dimulai
        setTimeout(() => {
            isScrollingByClick.current = false;
        }, 800); // Durasi harus lebih lama dari animasi scroll
    };

    const breadcrumbs = [{ label: "Home", href: route("dashboard") }];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Venio | Dashboard Event" />

            <div className="flex flex-col gap-8">
                <Breadcrumb items={breadcrumbs} />

                {/* 3 statistik */}
                <div className="flex w-full flex-col justify-between gap-4 sm:flex-row">
                    <Metadata
                        icon={IconDuoAlignBottom}
                        title="Total Events"
                        data={`${stats.totalEvents} Events`}
                        className="border border-yellow-500/30 bg-yellow-50"
                        textColor="text-yellow-400"
                    />

                    <Metadata
                        icon={IconDuoApproved}
                        title="Completed Events"
                        data={`${stats.completedEvents} Events`}
                        className="border border-teal-500/30 bg-teal-50"
                        textColor="text-teal-400"
                    />

                    <Metadata
                        icon={IconTwotoneHandshake}
                        title="Partners"
                        data={`${stats.completedEvents} Partners`}
                        className="border border-purple-500/30 bg-purple-50"
                        textColor="text-purple-400"
                    />
                </div>

                {/* ongoing events */}
                <div className="relative">
                    <div
                        ref={scrollContainerRef}
                        className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto"
                    >
                        {/* kalau tak ada ongoing event */}
                        {ongoingEvents.length === 0 ? (
                            <div className="border-default/30 flex min-h-64.25 w-full shrink-0 flex-col gap-8 rounded-2xl border p-8">
                                <span className="font-body text-2xl leading-none font-medium">
                                    Ongoing Events!
                                </span>
                                <NoEvent inner={true} />
                            </div>
                        ) : (
                            <>
                                {/* kalau ongoing event ada */}
                                {ongoingEvents.map((event, index) => (
                                    <div
                                        // Tambahkan ref untuk setiap slide
                                        ref={(el) =>
                                            (slideRefs.current[index] = el)
                                        }
                                        key={event.id}
                                        className="w-full shrink-0 snap-center md:w-120 lg:w-140"
                                    >
                                        <EventCard
                                            name={event.nama_event}
                                            date={event.tanggal_event}
                                            timeStart={event.jam_mulai}
                                            timeEnd={event.jam_selesai}
                                            href={route(
                                                "events.index",
                                                event.id,
                                            )}
                                            location={event.lokasi}
                                            snap={true}
                                        />
                                    </div>
                                ))}

                                {/* kalau ongoing event cuman 1, kasih tambahan card*/}
                                {ongoingEvents.length === 1 && (
                                    <div className="border-default/30 flex min-h-64.25 min-w-129 shrink-0 flex-col gap-8 rounded-2xl border p-8">
                                        <span className="font-body text-2xl leading-none font-medium">
                                            Ongoing Events!
                                        </span>
                                        <NoEvent inner={true} />
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Render Titik Indikator */}
                    {ongoingEvents.length > 1 && (
                        <div className="mt-4 flex justify-center gap-2">
                            {ongoingEvents.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleDotClick(index)}
                                    className={`h-2 w-2 cursor-pointer rounded-full transition-all duration-300 ${
                                        activeIndex === index
                                            ? "w-4 bg-blue-700"
                                            : "bg-gray-300"
                                    }`}
                                ></button>
                            ))}
                        </div>
                    )}
                </div>

                {/* upcoming events */}
                <div className="border-default/30 flex min-h-101.75 flex-1 flex-col gap-6 rounded-2xl border p-6 lg:gap-8 lg:p-8">
                    <div className="flex justify-between">
                        <div className="font-body flex w-full flex-col gap-2 leading-none lg:gap-4">
                            <span className="text-xl leading-none font-medium lg:text-2xl">
                                Upcoming Events
                            </span>
                            <div className="text-neutral flex w-full items-center justify-between text-base lg:text-xl">
                                <span>Event yang akan berlangsung</span>
                                <RouteButton
                                    href={route("upcoming.events")}
                                    text="Lihat Semua"
                                />
                            </div>
                        </div>
                    </div>
                    {upcomingEvents.length === 0 ? (
                        <NoEvent inner={true} />
                    ) : (
                        upcomingEvents.map((event) => (
                            <div className="flex items-center justify-between">
                                <EventCard
                                    name={event.nama_event}
                                    date={event.tanggal_event}
                                    timeStart={event.jam_mulai}
                                    timeEnd={event.jam_selesai}
                                    location={event.lokasi}
                                    inner={true}
                                    col={false}
                                />

                                <Redirect
                                    href={route("events.index", event.id)}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
