import { useState, useEffect } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import Pagination from "@/Components/Pagination";
import { TableHead, TableData, TableRow } from "@/Components/Tables";
import { SearchInput } from "@/Components/Inputs";
import { IconDuoTrash, IconSolarPenBoldDuotone } from "@/Components/Icons";

export default function Index({ partners, filters }) {
    const [search, setSearch] = useState(filters?.search || "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // 'add' atau 'edit'
    const [editingPartner, setEditingPartner] = useState(null);

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
        if (confirm("Yakin ingin menghapus partner ini?")) {
            destroy(route("partners.destroy", id));
        }
    };

    return (
        <AdminLayout title="Daftar Partner">
            <Head title="Venio | Daftar Partner" />

            <div className="flex flex-col gap-6 lg:gap-8">
                <Breadcrumb items={breadcrumbs} />

                <div className="flex flex-col gap-4 lg:gap-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="w-full md:w-1/3">
                            <SearchInput
                                placeholder="Cari Nama Partner..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={openAddModal}
                            className="bg-blue-600 text-white font-body px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Tambah Partner
                        </button>
                    </div>

                    <div className="w-full overflow-x-auto">
                        {partners.data.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 font-body">Belum ada partner ditemukan.</div>
                        ) : (
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-neutral-400">
                                        <TableHead text="Nama Partner" />
                                        <TableHead text="Event Disponsori" />
                                        <TableHead text="Aksi" width="w-[15%]" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {partners.data.map((partner) => (
                                        <TableRow key={partner.id}>
                                            <TableData text={partner.nama} />
                                            <TableData text={`${partner.events_count} Event`} />
                                            <td className="p-3 lg:p-5 flex gap-2">
                                                <button
                                                    onClick={() => openEditModal(partner)}
                                                    className="p-2 bg-yellow-100 rounded-lg hover:bg-yellow-200 transition"
                                                    title="Edit"
                                                >
                                                    <IconSolarPenBoldDuotone className="w-5 h-5 text-yellow-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(partner.id)}
                                                    className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition"
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
                                <label className="block font-body text-sm font-medium mb-2">Nama Partner</label>
                                <input
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) => setData("nama", e.target.value)}
                                    className="w-full border rounded-lg p-2 font-body outline-blue-500"
                                    placeholder="Contoh: PT. Venio Karya"
                                    required
                                />
                                {errors.nama && <span className="text-red-500 text-sm font-body mt-1">{errors.nama}</span>}
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 border rounded-lg font-body hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-body hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}