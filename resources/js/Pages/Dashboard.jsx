import { useState, useEffect, useRef } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AdminLayout from "@/Layouts/AdminLayout";
import { formatTanggalSlash, formatJamMenit } from "@/utils/format";
import Breadcrumb from "@/Components/Breadcrumb";
import { Icon } from "@iconify/react";
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
                <div className="flex flex-col sm:flex-row justify-between gap-4 w-full">
                    <Metadata
                        icon="duo-icons:align-bottom"
                        title="Total Events"
                        data={`${stats.totalEvents} Events`}
                        className="bg-yellow-50 border border-yellow-500/30"
                        textColor="text-yellow-400"
                    />

                    <Metadata
                        icon="duo-icons:approved"
                        title="Completed Events"
                        data={`${stats.completedEvents} Events`}
                        className="bg-teal-50 border border-teal-500/30"
                        textColor="text-teal-400"
                    />

                    <Metadata
                        icon="ic:twotone-handshake"
                        title="Partners"
                        data={`${stats.completedEvents} Partners`}
                        className="bg-purple-50 border border-purple-500/30"
                        textColor="text-purple-400"
                    />
                </div>

                {/* ongoing events */}
                <div className="relative">
                    <div
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar"
                    >
                        {/* kalau tak ada ongoing event */}
                        {ongoingEvents.length === 0 ? (
                            <div className="flex flex-col shrink-0 w-full min-h-64.25 border border-default/30 rounded-2xl p-8 gap-8">
                                <span className="font-body font-medium text-2xl leading-none">
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
                                        className="shrink-0 w-full md:w-120 lg:w-140 snap-center"
                                    >
                                        <EventCard
                                            name={event.nama_event}
                                            date={event.tanggal_event}
                                            timeStart={event.jam_mulai}
                                            timeEnd={event.jam_selesai}
                                            location={event.lokasi}
                                            snap={true}
                                        />
                                    </div>
                                ))}

                                {/* kalau ongoing event cuman 1, kasih tambahan card*/}
                                {ongoingEvents.length === 1 && (
                                    <div className="flex flex-col shrink-0 min-w-129 min-h-64.25 border border-default/30 rounded-2xl p-8 gap-8">
                                        <span className="font-body font-medium text-2xl leading-none">
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
                        <div className="flex justify-center gap-2 mt-4">
                            {ongoingEvents.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleDotClick(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                        activeIndex === index
                                            ? "bg-blue-700 w-4"
                                            : "bg-gray-300"
                                    }`}
                                ></button>
                            ))}
                        </div>
                    )}
                </div>

                {/* upcoming events */}
                <div className="flex flex-col flex-1 min-h-101.75 border border-default/30 rounded-2xl p-6 lg:p-8 gap-6 lg:gap-8">
                    <div className="flex justify-between">
                        <div className="flex flex-col gap-2 lg:gap-4 font-body leading-none w-full">
                            <span className="font-medium text-xl lg:text-2xl leading-none">
                                Upcoming Events
                            </span>
                            <div className="flex items-center justify-between text-base lg:text-xl text-neutral w-full">
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
                                    row={true}
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
