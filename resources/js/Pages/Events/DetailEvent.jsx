import { useForm, Link, Head, router } from "@inertiajs/react";
import { useState } from "react";
import ImportPeserta from "@/Components/ImportPeserta";
import SendQRBulk from "@/Components/SendQRBulk";
import SendZoomBulk from "@/Components/SendZoomBulk";
import SendQRIndividual from "@/Components/SendQRIndividual";
import SendZoomIndividual from "@/Components/SendZoomIndividual";
import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import Pagination from "@/Components/Pagination";
import {
    RouteButton,
    ImportButton,
    WAButton,
    ActionButton,
    SendButton,
} from "@/Components/Buttons";
import { route } from "ziggy-js";
import { Icon } from "@iconify/react";
import Metadata from "@/Components/Metadata";
import { TableHead, TableData, TableRow } from "@/Components/Tables";

export default function Event({ event, participants, stats }) {
    // State untuk modal/form Single Action
    const [selectedParticipantQR, setSelectedParticipantQR] = useState(null);
    const [selectedParticipantZoom, setSelectedParticipantZoom] =
        useState(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isSendQRBulkOpen, setIsSendQRBulkOpen] = useState(false);
    const [isSendZoomBulkOpen, setIsSendZoomBulkOpen] = useState(false);
    const today = new Date().toISOString().split("T")[0];
    let eventCategoryLabel = "";
    let eventCategoryRoute = "";

    if (event.status === "SELESAI") {
        eventCategoryLabel = "Past Events";
        eventCategoryRoute = route("past.events");
    } else {
        if (event.tanggal_event === today) {
            eventCategoryLabel = "Ongoing Events";
            eventCategoryRoute = route("ongoing.events");
        } else {
            eventCategoryLabel = "Upcoming Events";
            eventCategoryRoute = route("upcoming.events");
        }
    }
    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Events", href: route("all.events") },
        { label: eventCategoryLabel, href: eventCategoryRoute },
        {
            label: event.nama_event || "Detail Event",
            href: route("events.index", event.id),
        },
    ];

    return (
        <AdminLayout title="Events">
            <Head title={`Detail Event - ${event.nama_event}`} />

            <div className="flex flex-col gap-4">
                <Breadcrumb items={breadcrumbs} />

                <div className="flex flex-col gap-6">
                    <div className="flex justify-between">
                        <h2 className="font-body font-medium text-base lg:text-2xl leading-none">
                            {event.nama_event}
                        </h2>

                        {event.tipe_event !== "ONLINE" && (
                            <RouteButton
                                text="Scan QR"
                                href={route("datang.index", event.id)}
                            />
                        )}
                    </div>

                    {/* 3 statistik */}
                    <div className="flex flex-col lg:flex-row justify-between gap-4 w-full">
                        <Metadata
                            icon="solar:users-group-rounded-bold-duotone"
                            title="Total Peserta"
                            data={`${stats.total} Peserta`}
                            className="bg-purple-50 border border-purple-500/30"
                            textColor="text-purple-500"
                        />

                        {event.tipe_event === "HYBRID" && (
                            <>
                                <Metadata
                                    icon="duo-icons:approved"
                                    title="Peserta Offline"
                                    data={`${stats.offline} Peserta`}
                                    className="bg-blue-50 border border-blue-500/30"
                                    textColor="text-blue-500"
                                />

                                <Metadata
                                    icon="duo-icons:user"
                                    title="Peserta Online"
                                    data={`${stats.online} Peserta`}
                                    className="bg-yellow-50 border border-yellow-500/30"
                                    textColor="text-yellow-500"
                                />
                            </>
                        )}

                        {(event.tipe_event === "HYBRID" ||
                            event.tipe_event === "OFFLINE") && (
                            <Metadata
                                icon="solar:qr-code-bold-duotone"
                                title="Sudah Scan QR"
                                data={stats.offline_checked_in}
                                className="bg-teal-50 border border-teal-500/30"
                                textColor="text-teal-500"
                            />
                        )}

                        {event.tipe_event === "ONLINE" && (
                            <Metadata
                                icon="hugeicons:zoom"
                                title="Link Zoom Terisi"
                                data={stats.online_zoom_filled}
                                className="bg-blue-50 border border-blue-500/30"
                                textColor="text-blue-500"
                            />
                        )}

                        {(event.tipe_event === "ONLINE" ||
                            event.tipe_event === "OFFLINE") && (
                            <Metadata
                                icon="duo-icons:user"
                                title={
                                    event.tipe_event === "ONLINE"
                                        ? "Zoom Belum Terisi"
                                        : "Belum Hadir"
                                }
                                data={`${event.tipe_event === "ONLINE" ? stats.online_zoom_empty : stats.offline_not_checked_in} Peserta`}
                                className="bg-yellow-50 border border-yellow-500/30"
                                textColor="text-yellow-500"
                            />
                        )}
                    </div>

                    {/* button" fungsional */}
                    <div className="flex flex-col gap-6 lg:gap-8">
                        {/* impor ekspor */}
                        <div className="flex flex-col lg:flex-row gap-4 justify-between">
                            <div className="flex flex-col gap-2">
                                <h2 className="font-body font-medium text-lg lg:text-2xl leading-none">
                                    Daftar Peserta
                                </h2>
                                <span className="font-body text-sm lg:text-base leading-4 text-neutral">
                                    Kelola peserta, impor data, dan kirim
                                    informasi dalam satu area.
                                </span>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <ImportButton
                                    text="Impor Peserta"
                                    onClick={() => setIsImportModalOpen(true)}
                                />

                                <WAButton
                                    text="Export WA"
                                    href={route("ekspor.wa", event.id)}
                                />

                                <Link
                                    href={route("events.edit", event.id)}
                                    className="flex items-center justify-center rounded-lg bg-yellow-100 hover:bg-yellow-200 transition px-5 py-3 lg:px-5 lg:py-2"
                                >
                                    <Icon
                                        icon="solar:pen-bold-duotone"
                                        className="w-5 h-5 text-yellow-500"
                                    />
                                </Link>
                            </div>
                        </div>

                        {/* zoom, QR, rekap */}
                        <div className="flex justify-between">
                            <button className="flex gap-2 items-center border border-neutral/30 rounded-lg lg:rounded-xl p-3 lg:px-4 lg:py-2">
                                <Icon
                                    icon="lsicon:filter-outline"
                                    className="text-neutral w-5 h-5 aspect-square"
                                />
                                <span className="hidden lg:flex font-body font-normal text-sm lg:text-base leading-none text-neutral max-w-[5ch] lg:max-w-fit truncate">
                                    Filter Metode Kehadiran
                                </span>
                            </button>

                            <div className="flex gap-2">
                                {event.tipe_event !== "OFFLINE" && (
                                    <ActionButton
                                        onClick={() =>
                                            setIsSendZoomBulkOpen(true)
                                        }
                                        icon="hugeicons:zoom"
                                        label="Zoom Bulk"
                                    />
                                )}

                                {event.tipe_event !== "ONLINE" && (
                                    <ActionButton
                                        onClick={() =>
                                            setIsSendQRBulkOpen(true)
                                        }
                                        icon="material-symbols-light:qr-code-rounded"
                                        label="QR Bulk"
                                    />
                                )}

                                <ActionButton
                                    href={route("ekspor.recap", event.id)}
                                    icon="basil:document-outline"
                                    label="Rekap Hadir"
                                />
                            </div>
                        </div>
                    </div>

                    {/* tabel */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-400">
                                    <TableHead text="Nama" />
                                    <TableHead text="Email" />
                                    <TableHead text="No. HP" />
                                    <TableHead text="Status" />
                                    <TableHead text="Aksi" />
                                </tr>
                            </thead>

                            <tbody>
                                {participants.data.map((participant) => (
                                    <TableRow key={participant.id}>
                                        <TableData
                                            text={participant.nama_lengkap}
                                        />

                                        <TableData
                                            text={participant.email_primary}
                                        />

                                        <TableData
                                            text={participant.no_hp_normalized}
                                        />

                                        <td className="p-5 font-medium font-body text-xs leading-none">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex gap-2">
                                                    <div
                                                        className={`rounded-2xl px-2 py-1 capitalize max-w-14 max-auto ${participant.metode_kehadiran === "OFFLINE" ? "bg-lime-100 text-lime-700" : "bg-yellow-100 text-yellow-700"}`}
                                                    >
                                                        {participant.metode_kehadiran.toLowerCase()}
                                                    </div>

                                                    {participant.metode_kehadiran ===
                                                        "OFFLINE" && (
                                                        <div
                                                            className={`rounded-2xl px-2 py-1 whitespace-nowrap ${participant.checked_in_at ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}
                                                        >
                                                            {participant.checked_in_at
                                                                ? "Sudah Hadir"
                                                                : "Belum Hadir"}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="font-body text-xs leading-none text-neutral whitespace-nowrap">
                                                    {participant.metode_kehadiran ===
                                                    "OFFLINE" ? (
                                                        <>
                                                            QR:{" "}
                                                            {participant.qr_token ||
                                                                "Belum Terisi"}
                                                        </>
                                                    ) : (
                                                        <>
                                                            Zoom:{" "}
                                                            {participant.zoom_link ||
                                                                "Belum Terisi"}
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="p-5">
                                            {participant.metode_kehadiran ===
                                            "OFFLINE" ? (
                                                <SendButton
                                                    onClick={() =>
                                                        setSelectedParticipantQR(
                                                            participant,
                                                        )
                                                    }
                                                    icon="material-symbols-light:qr-code-rounded"
                                                    text="Kirim QR"
                                                    textClass="text-teal-500"
                                                    buttonClass="bg-teal-50"
                                                />
                                            ) : (
                                                <SendButton
                                                    onClick={() =>
                                                        setSelectedParticipantZoom(
                                                            participant,
                                                        )
                                                    }
                                                    icon="hugeicons:zoom"
                                                    text="Kirim Link Zoom"
                                                    textClass="text-blue-500"
                                                    buttonClass="bg-blue-50"
                                                />
                                            )}
                                        </td>
                                    </TableRow>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-8 flex justify-between flex-col md:flex-row items-center gap-4">
                    <span className="font-normal font-body text-base leading-none text-neutral whitespace-nowrap">
                        Menampilkan {participants.data.length} dari{" "}
                        {participants.total} data
                    </span>
                    <Pagination links={participants.links} />
                </div>
            </div>

            <SendQRIndividual
                participant={selectedParticipantQR}
                onClose={() => setSelectedParticipantQR(null)}
            />

            <SendZoomIndividual
                participant={selectedParticipantZoom}
                onClose={() => setSelectedParticipantZoom(null)}
            />

            <SendQRBulk
                isOpen={isSendQRBulkOpen}
                onClose={() => setIsSendQRBulkOpen(false)}
                eventId={event.id}
                offline={stats.offline}
            />

            <SendZoomBulk
                isOpen={isSendZoomBulkOpen}
                onClose={() => setIsSendZoomBulkOpen(false)}
                eventId={event.id}
                online={stats.online}
            />

            <ImportPeserta
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                eventId={event.id}
            />
        </AdminLayout>
    );
}
