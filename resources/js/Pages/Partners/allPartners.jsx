import { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import Pagination from "@/Components/Pagination";
import { TableHead, TableData, TableRow } from "@/Components/Tables";
import { SearchInput, TextInput } from "@/Components/Inputs";
import { IconDuoTrash, IconSolarPenBoldDuotone } from "@/Components/Icons";
import { AddButton, BackButton } from "@/Components/Buttons";
import { DeleteSingleModal } from "@/Components/DeleteModals";

export default function Index({ partners, filters }) {
    const [search, setSearch] = useState(filters?.search || "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // 'add' atau 'edit'
    const [editingPartner, setEditingPartner] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [partnerToDelete, setPartnerToDelete] = useState(null);
    const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        nama: "",
    });

    // Handle Search
    useEffect(() => {
        if (search === (filters?.search || "")) return;
        const delayDebounceFn = setTimeout(() => {
            router.get(route("partners.index"), { search: search }, { preserveState: true, replace: true });
        }, 800);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Daftar Partner", href: route("partners.index") },
    ];

    const openAddModal = () => {
        setModalMode("add");
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (partner) => {
        setModalMode("edit");
        setEditingPartner(partner);
        setData("nama", partner.nama);
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => reset(), 300);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === "add") {
            post(route("partners.store"), {
                onSuccess: () => closeModal(),
            });
        } else {
            put(route("partners.update", editingPartner.id), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        setPartnerToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (partnerToDelete) {
            destroy(route("partners.destroy", partnerToDelete), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setPartnerToDelete(null);
                },
            });
        }
    };

    return (
        <AdminLayout title="Daftar Partner">
            <Head title="Venio | Daftar Partner" />

            <div className="flex flex-col gap-6 lg:gap-8">
                <div className="flex justify-between">
                    <Breadcrumb items={breadcrumbs} />

                    <BackButton text="Kembali" />
                </div>

                <div className="flex flex-col gap-4 lg:gap-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="w-full md:w-1/3">
                            <SearchInput
                                placeholder="Cari Nama Partner..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <AddButton
                            text="Tambah Partner"
                            onClick={openAddModal}
                        />
                    </div>

                    <div className="w-full overflow-x-auto">
                        {partners.data.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 font-body">Belum ada partner ditemukan.</div>
                        ) : (
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-neutral-400">
                                        <TableHead text="Nama Partner" />
                                        <TableHead text="Acara Disponsori" />
                                        <TableHead text="Aksi" width="w-[15%]" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {partners.data.map((partner) => (
                                        <TableRow key={partner.id}>
                                            <TableData text={partner.nama} />
                                            <td className="p-3 lg:p-5">
                                                {partner.events_count > 0 ? (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedPartner(partner);
                                                            setIsEventsModalOpen(true);
                                                        }}
                                                        className="font-body text-sm text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                                                    >
                                                        {partner.events_count} Acara
                                                    </button>
                                                ) : (
                                                    <span className="font-body text-sm text-neutral-500">0 Acara</span>
                                                )}
                                            </td>
                                            <td className="p-3 lg:p-5 flex gap-2">
                                                <button
                                                    onClick={() => openEditModal(partner)}
                                                    className="p-2 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <IconSolarPenBoldDuotone className="w-5 h-5 text-yellow-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(partner.id)}
                                                    className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition cursor-pointer"
                                                    title="Hapus"
                                                >
                                                    <IconDuoTrash className="w-5 h-5 text-red-600" />
                                                </button>
                                            </td>
                                        </TableRow>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {partners.data.length > 0 && (
                        <div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
                            <span className="font-body text-neutral text-base leading-none font-normal whitespace-nowrap">
                                Menampilkan {partners.data.length} dari {partners.total} data
                            </span>
                            <Pagination links={partners.links} />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Tambah/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
                        <div className="flex justify-between items-center border-b p-4">
                            <h3 className="font-body text-xl font-medium">
                                {modalMode === "add" ? "Tambah Partner" : "Edit Partner"}
                            </h3>
                            <button onClick={closeModal} className="text-xl hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-4">
                                <TextInput
                                    id="nama"
                                    name="nama"
                                    text="Nama Partner"
                                    value={data.nama}
                                    placeholder="Contoh: PT. Venio Karya"
                                    onChange={(e) => setData("nama", e.target.value)}
                                />
                                {errors.nama && <span className="text-red-500 text-sm font-body mt-1">{errors.nama}</span>}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 border border-neutral/30 rounded-lg font-body hover:bg-gray-50 cursor-pointer"
                                >
                                    <span className="font-body font-normal text-base leading-none text-neutral">
                                        Batal
                                    </span>
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-50 rounded-lg font-body disabled:opacity-50 cursor-pointer"
                                >
                                    <span className="font-body font-normal text-base leading-none text-blue-700">
                                        {processing ? "Menyimpan..." : "Simpan"}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Daftar Acara */}
            {isEventsModalOpen && selectedPartner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="flex justify-between items-center border-b p-4 shrink-0">
                            <h3 className="font-body text-lg font-medium leading-tight">
                                Acara yang Disponsori
                                <span className="block text-sm text-neutral-500 font-normal mt-1">{selectedPartner.nama}</span>
                            </h3>
                            <button onClick={() => setIsEventsModalOpen(false)} className="text-xl hover:text-gray-600 cursor-pointer">✕</button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            {selectedPartner.events && selectedPartner.events.length > 0 ? (
                                <ul className="space-y-3">
                                    {selectedPartner.events.map((event, index) => (
                                        <li key={event.id || index} className="font-body text-sm flex items-start gap-2">
                                            <span className="text-blue-500 mt-0.5">•</span>
                                            <span className="text-default">{event.nama_event}</span> 
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="font-body text-sm text-gray-500 text-center py-4">
                                    {selectedPartner.events_count > 0
                                        ? "Gagal memuat data (Pastikan sudah memanggil with('events') di Controller)."
                                        : "Belum mensponsori acara apapun."}
                                </p>
                            )}
                        </div>
                        <div className="border-t p-4 flex justify-end shrink-0">
                            <button
                                onClick={() => setIsEventsModalOpen(false)}
                                className="px-5 py-2 bg-blue-50 text-blue-700 rounded-lg font-body text-sm hover:bg-blue-100 cursor-pointer"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <DeleteSingleModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                processing={processing}
                title="Hapus Partner"
                description="Apakah Anda yakin ingin menghapus data partner ini? ini tidak akan menghapus data Acara yang memiliki data partner ini."
            />
        </AdminLayout>
    );
}