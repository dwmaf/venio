import { useForm, Link, Head, router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import ImportPeserta from "@/Components/ImportPeserta";
import SendQRBulk from "@/Components/SendQRBulk";
import SendZoomBulk from "@/Components/SendZoomBulk";
import SendQRIndividual from "@/Components/SendQRIndividual";
import SendZoomIndividual from "@/Components/SendZoomIndividual";
import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import Pagination from "@/Components/Pagination";
import AddParticipantModal from "@/Components/AddParticipantModal";
import DocumentationModal from "@/Components/DocumentationModal";
import {
    RouteButton,
    ImportButton,
    WAButton,
    ActionButton,
    SendButton,
    FilterDropdownButton,
    DeleteButton,
    DeleteSelectedButton,
    AddButton,
    DocumentationButton,
    BackButton
} from "@/Components/Buttons";
import { route } from "ziggy-js";
import {
    IconMaterialSymLightQrCodeRounded,
    IconBasilDocOutline,
    IconHugeZoom,
    IconDuoCalendar,
    IconDuoClock,
    IconDuoLocation,
    IconPepHandshakePrint,
    IconDuoHandshake,
    IconSolarPenBoldDuotone,
    IconSolarUsersGroupBoldDuotone,
    IconDuoApproved,
    IconDuoUser,
    IconQrCodeBoldDuotone,
    IconDuoTrash,
} from "@/Components/Icons";
import Metadata from "@/Components/Metadata";
import {
    TableHead,
    TableData,
    TableRow,
    CopyableText,
} from "@/Components/Tables";
import { formatTanggalSlash, formatJamMenit } from "@/utils/format";
import { SearchInput } from "@/Components/Inputs";
import {
    DeleteSelectedModal,
    DeleteAllDataModal
} from "@/Components/DeleteModals";

export default function Event({ event, participants, stats }) {
    const [selectedParticipantQR, setSelectedParticipantQR] = useState(null);
    const [selectedParticipantZoom, setSelectedParticipantZoom] =
        useState(null);

    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isSendQRBulkOpen, setIsSendQRBulkOpen] = useState(false);
    const [isSendZoomBulkOpen, setIsSendZoomBulkOpen] = useState(false);
    const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] = useState(false);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);

    const urlParams = new URLSearchParams(window.location.search);
    const activeFilter = urlParams.get("filter") || "";
    const activeSearch = urlParams.get("search") || "";
    const [search, setSearch] = useState(activeSearch);

    const [selectedIds, setSelectedIds] = useState([]);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteSelectedModalOpen, setIsDeleteSelectedModalOpen] = useState(false);
    const { processing, delete: destroy } = useForm();

    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    let eventCategoryLabel = "";
    let eventCategoryRoute = "";

    if (event.tanggal_event < today) {
        eventCategoryLabel = "Past Events";
        eventCategoryRoute = route("past.events");
    } else if (event.tanggal_event === today) {
        eventCategoryLabel = "Ongoing Events";
        eventCategoryRoute = route("ongoing.events");
    } else {
        eventCategoryLabel = "Upcoming Events";
        eventCategoryRoute = route("upcoming.events");
    }

    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Events", href: route("all.events"), hideOnMobile: true },
        { label: eventCategoryLabel, href: eventCategoryRoute },
        {
            label: event.nama_event || "Detail Event",
            href: route("events.index", event.id),
        },
    ];

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = participants.data.map((p) => p.id);
            setSelectedIds(allIds);
        } else {
            setSelectedIds([]);
        }
    };

    const isAllSelected =
        participants.data.length > 0 &&
        selectedIds.length === participants.data.length;

    const handleSelectOne = (id) => {
        setSelectedIds((prevSelectedIds) => {
            if (prevSelectedIds.includes(id)) {
                return prevSelectedIds.filter(
                    (selectedId) => selectedId !== id,
                );
            } else {
                return [...prevSelectedIds, id];
            }
        });
    };

    const handleDeleteAllData = () => {
        destroy(route("participants.destroy.all", event.id), {
            onSuccess: () => setIsDeleteModalOpen(false),
        });
    };

    const handleDeleteSelected = () => {
        router.delete(route("participants.destroy.selected", event.id), {
            data: { ids: selectedIds },
            onSuccess: () => {
                setIsDeleteSelectedModalOpen(false);
                setSelectedIds([]);
            },
        });
    };

    const bgPurpleGradient = "bg-gradient-to-br from-purple-400 to-purple-600";
    const bgBlueGradient = "bg-gradient-to-br from-blue-400 to-blue-600";
    const bgTealGradient = "bg-gradient-to-br from-teal-400 to-teal-600";
    const bgYellowGradient = "bg-gradient-to-br from-yellow-400 to-yellow-600";

    useEffect(() => {
        if (search === activeSearch) return;

        const delayDebounceFn = setTimeout(() => {
            router.get(
                route("events.index", event.id),
                { filter: activeFilter, search: search },
                { preserveState: true, replace: true },
            );
        }, 800);

        return () => clearTimeout(delayDebounceFn);
    }, [search, activeFilter, event.id, activeSearch]);

    const handleFilter = (val) => {
        router.get(
            route("events.index", event.id),
            { filter: val },
            { preserveState: true, replace: true },
        );
    };

    return (
        <AdminLayout title="Acara">
            <Head title={`Detail Acara - ${event.nama_event}`} />

            <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                    <Breadcrumb items={breadcrumbs} />
                    <BackButton text="Kembali" />
                </div>

                <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <h2 className="font-body text-base leading-7 font-medium sm:text-2xl">
                                {event.nama_event}
                                <span
                                    className={`ml-2 w-fit rounded-full px-2 py-0.5 text-xs font-semibold ${event.tipe_event === "ONLINE"
                                        ? "bg-amber-100 text-amber-700"
                                        : event.tipe_event === "OFFLINE"
                                            ? "bg-lime-100 text-lime-700"
                                            : "bg-blue-100 text-blue-700"
                                        }`}
                                >
                                    {event.tipe_event.charAt(0).toUpperCase() +
                                        event.tipe_event.slice(1).toLowerCase()}
                                </span>
                            </h2>
                        </div>

                        {event.tipe_event !== "ONLINE" && (
                            <div className="ml-auto sm:ml-0">
                                <RouteButton
                                    text="Scan QR"
                                    href={route("datang.index", event.id)}
                                />
                            </div>
                        )}
                    </div>

                    <div className={`flex flex-wrap gap-x-2 gap-y-2 sm:gap-4`}>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <IconDuoCalendar className="text-neutral h-4 w-4 lg:h-6 lg:w-6" />
                            <span className="text-neutral text-xs leading-none sm:text-base lg:mt-0">
                                {formatTanggalSlash(event.tanggal_event)}
                            </span>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2">
                            <IconDuoClock className="text-neutral h-4 w-4 lg:h-6 lg:w-6" />
                            <span className="text-neutral text-xs leading-none sm:text-base lg:mt-0">
                                {formatJamMenit(event.jam_mulai)} -{" "}
                                {formatJamMenit(event.jam_selesai)}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <IconDuoLocation className="text-neutral h-4 w-4 lg:h-6 lg:w-6" />

                            <span className="text-neutral text-xs leading-none sm:text-base lg:mt-0">
                                {event.lokasi ? event.lokasi : "Online"}
                            </span>
                        </div>

                        {event.partners && event.partners.length > 0 && (
                            <div className="flex items-center gap-1 sm:gap-2">
                                <IconDuoHandshake className="text-neutral h-5 w-5 lg:h-6 lg:w-6" />
                                <span className="text-neutral mt-1 text-sm leading-none lg:mt-0 lg:text-base">
                                    {event.partners
                                        .map((p) => p.nama)
                                        .join(", ")}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* 3 statistik */}
                    <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
                        <Metadata
                            icon={IconSolarUsersGroupBoldDuotone}
                            title="Total Peserta"
                            data={`${stats.total} Peserta`}
                            className={`${bgPurpleGradient}`}
                            textColor="text-white"
                        />

                        {event.tipe_event === "HYBRID" && (
                            <>
                                <Metadata
                                    icon={IconDuoApproved}
                                    title="Peserta Offline"
                                    data={`${stats.offline} Peserta`}
                                    className={`${bgBlueGradient}`}
                                    textColor="text-white"
                                />

                                <Metadata
                                    icon={IconDuoUser}
                                    title="Peserta Online"
                                    data={`${stats.online} Peserta`}
                                    className={`${bgYellowGradient}`}
                                    textColor="text-white"
                                />
                            </>
                        )}

                        {(event.tipe_event === "HYBRID" ||
                            event.tipe_event === "OFFLINE") && (
                                <Metadata
                                    icon={IconQrCodeBoldDuotone}
                                    title="Sudah Scan QR"
                                    data={stats.offline_checked_in}
                                    className={`${bgTealGradient}`}
                                    textColor="text-white"
                                />
                            )}

                        {event.tipe_event === "ONLINE" && (
                            <Metadata
                                icon={IconHugeZoom}
                                title="Link Zoom Terisi"
                                data={`${stats.online_zoom_filled}`}
                                className={`${bgBlueGradient}`}
                                textColor="text-white"
                            />
                        )}

                        {(event.tipe_event === "ONLINE" ||
                            event.tipe_event === "OFFLINE") && (
                                <Metadata
                                    icon={IconDuoUser}
                                    title={
                                        event.tipe_event === "ONLINE"
                                            ? "Zoom Belum Terisi"
                                            : "Belum Hadir"
                                    }
                                    data={`${event.tipe_event === "ONLINE" ? stats.online_zoom_empty : stats.offline_not_checked_in} Peserta`}
                                    className={`${bgYellowGradient}`}
                                    textColor="text-white"
                                />
                            )}
                    </div>

                    {/* button" fungsional */}
                    <div className="flex flex-col gap-6 lg:gap-8">
                        {/* impor ekspor */}
                        <div className="flex flex-col items-start justify-between gap-4 xl:flex-row">
                            <div className="flex flex-col gap-2">
                                <h2 className="font-body text-lg leading-none font-medium md:text-xl">
                                    Daftar Peserta
                                </h2>
                                <span className="font-body text-neutral text-sm leading-5 md:text-base">
                                    Kelola peserta, impor data, dan kirim
                                    informasi dalam satu area.
                                </span>
                            </div>

                            <div className="grid h-fit w-full grid-cols-2 flex-wrap items-start gap-2 md:flex-nowrap md:justify-center lg:gap-4 xl:flex xl:w-fit">
                                <ImportButton
                                    text="Impor Peserta"
                                    onClick={() => setIsImportModalOpen(true)}
                                />

                                <WAButton
                                    text="Expor WA"
                                    href={route("ekspor.wa", event.id)}
                                />

                                <DeleteSelectedButton
                                    disabled={selectedIds.length === 0}
                                    onClick={() => setIsDeleteSelectedModalOpen(true)}
                                />

                                <DeleteButton
                                    text="Hapus Data"
                                    onClick={() => setIsDeleteModalOpen(true)}
                                />

                                <Link
                                    href={route("events.edit", event.id)}
                                    className=" flex h-fit items-center justify-center gap-2 rounded-lg bg-yellow-100 p-3 transition hover:bg-yellow-200 lg:h-full"
                                >
                                    <IconSolarPenBoldDuotone className="h-5 w-5 text-yellow-500" />
                                    <span className="font-body text-sm leading-none text-yellow-700 lg:text-base">
                                        Edit
                                    </span>
                                </Link>
                                <DocumentationButton onClick={() => setIsDocModalOpen(true)} />
                            </div>
                        </div>

                        {/* zoom, QR, rekap */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <FilterDropdownButton
                                tipeEvent={event.tipe_event}
                                activeFilter={activeFilter}
                                onFilter={handleFilter}
                            />

                            <div className="grid w-full grid-cols-2 flex-wrap gap-2 md:flex md:w-fit">
                                {event.tipe_event !== "OFFLINE" && (
                                    <ActionButton
                                        onClick={() =>
                                            setIsSendZoomBulkOpen(true)
                                        }
                                        icon={IconHugeZoom}
                                        label="Zoom Bulk"
                                    />
                                )}

                                {event.tipe_event !== "ONLINE" && (
                                    <ActionButton
                                        onClick={() =>
                                            setIsSendQRBulkOpen(true)
                                        }
                                        icon={IconMaterialSymLightQrCodeRounded}
                                        label="QR Bulk"
                                    />
                                )}

                                <ActionButton
                                    href={route("ekspor.recap", event.id)}
                                    icon={IconBasilDocOutline}
                                    label="Ekspor Rekap Hadir"
                                    className="col-span-2 justify-center"
                                />

                                <AddButton
                                    text="Tambah Peserta Manual"
                                    onClick={() => setIsAddParticipantModalOpen(true)}
                                    className="col-span-2 justify-center"
                                />
                            </div>
                        </div>

                        <div className="w-full lg:w-1/3 lg:max-w-md">
                            <SearchInput
                                id="search"
                                name="search"
                                placeholder="Cari Nama, Email, atau No. HP..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* tabel */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-neutral-400">
                                    <th className="w-[3%] p-3">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                            className="border-default/30 h-4 w-4 border accent-blue-500 outline-blue-500 focus:border-blue-500 focus:outline-blue-500"
                                        />
                                    </th>
                                    <TableHead text="Nama" />
                                    <TableHead text="Email" />
                                    <TableHead text="No. HP" />
                                    <TableHead text="Status" />
                                    <TableHead text="Aksi" width="w-[10%]" />
                                </tr>
                            </thead>

                            <tbody>
                                {participants.data.map((participant) => (
                                    <TableRow key={participant.id}>
                                        <td className="p-3">
                                            <input
                                                type="checkbox"
                                                name=""
                                                id=""
                                                className="border-default/30 h-4 w-4 border accent-blue-500 outline-blue-500 focus:border-blue-500 focus:outline-blue-500"
                                                checked={selectedIds.includes(
                                                    participant.id,
                                                )}
                                                onChange={() =>
                                                    handleSelectOne(
                                                        participant.id,
                                                    )
                                                }
                                            />
                                        </td>

                                        <TableData
                                            text={participant.nama_lengkap}
                                        />

                                        <TableData
                                            text={participant.email_primary}
                                        />

                                        <TableData
                                            text={participant.no_hp_normalized}
                                        />

                                        <td className="font-body p-3 text-xs leading-none font-medium lg:p-5">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex gap-2">
                                                    <div
                                                        className={`max-auto max-w-14 rounded-2xl px-2 py-1 capitalize ${participant.metode_kehadiran === "OFFLINE" ? "bg-lime-100 text-lime-700" : "bg-yellow-100 text-yellow-700"}`}
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

                                                <CopyableText
                                                    label={
                                                        participant.metode_kehadiran ===
                                                            "OFFLINE"
                                                            ? "QR"
                                                            : "Zoom"
                                                    }
                                                    textToCopy={
                                                        participant.metode_kehadiran ===
                                                            "OFFLINE"
                                                            ? participant.qr_token
                                                            : participant.zoom_link
                                                    }
                                                />
                                            </div>
                                        </td>

                                        <td className="p-3 lg:p-5">
                                            {participant.metode_kehadiran ===
                                                "OFFLINE" ? (
                                                <SendButton
                                                    onClick={() =>
                                                        setSelectedParticipantQR(
                                                            participant,
                                                        )
                                                    }
                                                    icon={
                                                        IconMaterialSymLightQrCodeRounded
                                                    }
                                                    text="Kirim QR"
                                                    textClass="text-teal-500"
                                                    buttonClass="bg-teal-50 w-full flex justify-center hover:bg-teal-100 active:bg-teal-200 transition-all duration-300"
                                                />
                                            ) : (
                                                <SendButton
                                                    onClick={() =>
                                                        setSelectedParticipantZoom(
                                                            participant,
                                                        )
                                                    }
                                                    icon={IconHugeZoom}
                                                    text="Kirim Link Zoom"
                                                    textClass="text-blue-500"
                                                    buttonClass="bg-blue-50 hover:bg-blue-100 active:bg-blue-200 transition-all duration-300"
                                                />
                                            )}
                                        </td>
                                    </TableRow>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
                    <span className="font-body text-neutral text-base leading-none font-normal whitespace-nowrap">
                        Menampilkan {participants.data.length} dari{" "}
                        {participants.total} data
                    </span>
                    <Pagination links={participants.links} />
                </div>
            </div>

            <DeleteSelectedModal
                isOpen={isDeleteSelectedModalOpen}
                onClose={() => setIsDeleteSelectedModalOpen(false)}
                onConfirm={handleDeleteSelected}
                count={selectedIds.length}
                processing={processing}
            />

            <DeleteAllDataModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAllData}
                processing={processing}
            />

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
                sentCount={stats.offline_qr_sent}
            />

            <SendZoomBulk
                isOpen={isSendZoomBulkOpen}
                onClose={() => setIsSendZoomBulkOpen(false)}
                eventId={event.id}
                online={stats.online}
                sentCount={stats.online_zoom_sent}
            />

            <ImportPeserta
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                eventId={event.id}
            />

            <AddParticipantModal
                isOpen={isAddParticipantModalOpen}
                onClose={() => setIsAddParticipantModalOpen(false)}
                eventId={event.id}
                tipeEvent={event.tipe_event}
            />

            <DocumentationModal
                isOpen={isDocModalOpen}
                onClose={() => setIsDocModalOpen(false)}
                event={event}
            />
        </AdminLayout>
    );
}
