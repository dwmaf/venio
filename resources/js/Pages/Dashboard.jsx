import { useState, useEffect, useRef } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AdminLayout from "@/Layouts/AdminLayout";
import { formatTanggalSlash, formatJamMenit } from "@/utils/format";
import Breadcrumb from "@/Components/Breadcrumb";
import { useMediaQuery } from "@/Utils/useMediaQuery";
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
    const isMobile = useMediaQuery("(max-width: 640px)");
    const isMobileMin = useMediaQuery(
        "(min-width: 641px) and (max-width: 767px)",
    );
    const isMedium = useMediaQuery(
        "(min-width: 768px) and (max-width: 1023px)",
    );

    const cardsPerPage = isMobile || isMobileMin ? 1 : isMedium ? 2 : 3;

    const totalPages = Math.ceil(ongoingEvents.length / cardsPerPage);
    const currentPage = Math.floor(activeIndex / cardsPerPage);

    const bgBlueGradient = "bg-gradient-to-br from-blue-400 to-blue-600";
    const bgTealGradient = "bg-gradient-to-br from-teal-400 to-teal-600";
    const bgPurpleGradient = "bg-gradient-to-br from-purple-400 to-purple-600";

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (isScrollingByClick.current) {
                    return;
                }

                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const index = slideRefs.current.findIndex(
                            (ref) => ref === entry.target,
                        );
                        if (index !== -1) {
                            setActiveIndex(index);
                            break;
                        }
                    }
                }
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

    const handlePrev = () => {
        isScrollingByClick.current = true;
        // Pindah ke halaman sebelumnya
        const prevPageIndex = Math.max(currentPage - 1, 0);
        const targetIndex = prevPageIndex * cardsPerPage;

        slideRefs.current[targetIndex]?.scrollIntoView({
            behavior: "smooth",
            inline: "start",
            block: "nearest",
        });
        setActiveIndex(targetIndex);
        setTimeout(() => (isScrollingByClick.current = false), 800);
    };

    const handleNext = () => {
        isScrollingByClick.current = true;
        // Pindah ke halaman berikutnya
        const nextPageIndex = Math.min(currentPage + 1, totalPages - 1);
        const targetIndex = nextPageIndex * cardsPerPage;

        slideRefs.current[targetIndex]?.scrollIntoView({
            behavior: "smooth",
            inline: "start",
            block: "nearest",
        });
        setActiveIndex(targetIndex);
        setTimeout(() => (isScrollingByClick.current = false), 800);
    };

    const breadcrumbs = [{ label: "Home", href: route("dashboard") }];

    let placeholderCount = 0;
    if (ongoingEvents.length > 0) {
        if (isMobileMin)
            placeholderCount = Math.max(0, 2 - ongoingEvents.length);
        else if (isMedium)
            placeholderCount = Math.max(0, 2 - ongoingEvents.length);
        else placeholderCount = Math.max(0, 3 - ongoingEvents.length);
    }

    return (
        <AdminLayout title="Dashboard">
            <Head title="Venio | Dashboard" />

            <div className="flex flex-col gap-8">
                <Breadcrumb items={breadcrumbs} />

                {/* 3 statistik */}
                <div className="flex w-full flex-col justify-between gap-4 sm:flex-row">
                    <Metadata
                        icon={IconDuoAlignBottom}
                        title="Total Acara"
                        data={`${stats.totalEvents} Acara`}
                        className={`${bgBlueGradient}`}
                        textColor="text-white"
                    />

                    <Metadata
                        icon={IconDuoApproved}
                        title="Acara Selesai"
                        data={`${stats.completedEvents} Acara`}
                        className={`${bgTealGradient}`}
                        textColor="text-white"
                    />

                    <Metadata
                        icon={IconTwotoneHandshake}
                        title="Partner"
                        data={`${stats.completedEvents} Partner`}
                        className={`${bgPurpleGradient}`}
                        textColor="text-white"
                    />
                </div>

                {/* ongoing events */}
                <div className="relative">
                    <div className="flex justify-between">
                        <span className="font-body text-base leading-none font-medium md:text-2xl">
                            Sedang Berlangsung!
                        </span>

                        <RouteButton
                            href={route("create.events")}
                            text="Tambah Acara"
                        />
                    </div>

                    {ongoingEvents.length > cardsPerPage && (
                        <>
                            {/* Tombol Panah Kiri */}
                            <button
                                onClick={handlePrev}
                                disabled={currentPage === 0}
                                className="group absolute top-1/2 left-0 z-10 -translate-y-1/2 transform cursor-pointer rounded-full bg-white/80 p-2 shadow-md transition hover:bg-white disabled:cursor-default disabled:opacity-0 md:-left-5"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="h-6 w-6 text-blue-700 transition-transform duration-300 hover:-translate-x-0.5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 19.5L8.25 12l7.5-7.5"
                                    />
                                </svg>
                            </button>

                            {/* Tombol Panah Kanan */}
                            <button
                                onClick={handleNext}
                                disabled={currentPage === totalPages - 1}
                                className="absolute top-1/2 right-0 z-10 -translate-y-1/2 transform cursor-pointer rounded-full bg-white/80 p-2 shadow-md transition hover:bg-white disabled:cursor-default disabled:opacity-0 md:-right-5"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="h-6 w-6 text-blue-700 transition-transform duration-300 hover:translate-x-0.5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                    />
                                </svg>
                            </button>
                        </>
                    )}

                    <div
                        ref={scrollContainerRef}
                        className={`hide-scrollbar flex gap-4 p-4 ${
                            ongoingEvents.length > 3
                                ? "snap-x snap-mandatory overflow-x-auto"
                                : ""
                        }`}
                    >
                        {/* kalau tak ada ongoing event */}
                        {ongoingEvents.length === 0 ? (
                            <div className="border-default/30 flex min-h-64.25 w-full shrink-0 flex-col gap-8 rounded-2xl border p-4 md:p-8">
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
                                        className={`flex-1 shrink-0 rounded-2xl shadow-md ${
                                            ongoingEvents.length > 3
                                                ? "min-w-72 snap-center md:min-w-96"
                                                : "lg:min-w-0"
                                        }`}
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
                                            participantsCount={
                                                event.jumlah_peserta
                                            }
                                            snap={true}
                                        />
                                    </div>
                                ))}

                                {/* jika ongoingEvents berjumlah 1 atau 2, tambahkan placeholder NoEvent supaya total 3 */}
                                {placeholderCount > 0 &&
                                    ongoingEvents.length < 3 &&
                                    Array.from({
                                        length: placeholderCount,
                                    }).map((_, i) => (
                                        <div
                                            key={`no-event-${i}`}
                                            className={`border-default/30 hidden flex-1 shrink-0 justify-center rounded-2xl border shadow-md sm:flex md:w-120 lg:w-1/3 lg:min-w-0 ${
                                                ongoingEvents.length > 3
                                                    ? "snap-center"
                                                    : ""
                                            }`}
                                        >
                                            <NoEvent inner={true} />
                                        </div>
                                    ))}
                            </>
                        )}
                    </div>

                    {/* Render Titik Indikator */}
                    {ongoingEvents.length > 3 && (
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
                <div className="flex min-h-101.75 flex-1 flex-col gap-6 rounded-2xl lg:gap-8">
                    <div className="flex justify-between">
                        <div className="font-body flex w-full flex-col gap-2 leading-none lg:gap-4">
                            <span className="text-xl leading-none font-medium lg:text-2xl">
                                Yang akan datang
                            </span>
                            <div className="text-neutral flex w-full items-center justify-between text-base lg:text-xl">
                                <span>Daftar acara yang akan berlangsung</span>
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
                        <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                            {upcomingEvents.map((event, index) => (
                                <div
                                    key={event.id}
                                    className="flex items-center justify-between rounded-xl bg-slate-50/30 px-4 py-4 md:px-8"
                                >
                                    <EventCard
                                        key={index}
                                        name={event.nama_event}
                                        date={event.tanggal_event}
                                        timeStart={event.jam_mulai}
                                        timeEnd={event.jam_selesai}
                                        location={event.lokasi}
                                        participantsCount={event.jumlah_peserta}
                                        inner={true}
                                        col={isMobile}
                                    />

                                    <Redirect
                                        href={route("events.index", event.id)}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
