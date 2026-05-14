import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import { useForm, Head } from "@inertiajs/react";
import {
    IconMynauiCalender,
    IconClockLight,
    IconCarbonLocation,
    IconUsersGroup,
    IconMaterialSymAddRounded,
} from "@/Components/Icons";
import SelectOrAddTags from "@/Components/SelectOrAddTags";
import { BackButton } from "@/Components/Buttons";

const AddEvents = () => {
    const breadcrumbs = [
        { label: "Home", href: route("dashboard") },
        { label: "Events", href: route("all.events") },
        { label: "Add Event", href: route("create.events") },
    ];

    const { data, setData, post, processing, errors } = useForm({
        nama_event: "",
        tipe_event: "OFFLINE",
        lokasi: "",
        tanggal_event: "",
        jam_mulai: "",
        jam_selesai: "",
        quota: "",
        partners: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("events.store"));
    };

    return (
        <AdminLayout title="Add New Event">
            <Head title="Tambah Event" />

            <div className="flex justify-between">
                <Breadcrumb items={breadcrumbs} />

                <BackButton text="Kembali" />
            </div>

            <div className="font-body m-auto mt-12 max-w-106">
                <form onSubmit={submit} className="m space-y-4">
                    {/* Nama Event */}
                    <div className="space-y-3">
                        <label className="block text-base leading-none lg:text-xl">
                            Nama Event
                        </label>
                        <input
                            type="text"
                            className="border-default/30 placeholder:text-neutral font-body w-full rounded-lg border p-3 text-sm focus:border-blue-500 focus:outline-blue-500 lg:text-base"
                            placeholder="Nama Event"
                            value={data.nama_event}
                            onChange={(e) =>
                                setData("nama_event", e.target.value)
                            }
                        />

                        {errors.nama_event && (
                            <p className="text-xs text-red-500">
                                {errors.nama_event}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Tipe Event */}
                        <div className="space-y-2">
                            <label className="block text-base leading-none lg:text-xl">
                                Metode Hadir
                            </label>
                            <select
                                className="border-default/30 placeholder:text-neutral font-body w-full rounded-lg border p-3 text-sm focus:border-blue-500 focus:outline-blue-500 lg:text-base"
                                value={data.tipe_event}
                                onChange={(e) =>
                                    setData("tipe_event", e.target.value)
                                }
                            >
                                <option value="OFFLINE">Offline</option>
                                <option value="ONLINE">Online</option>
                                <option value="HYBRID">Hybrid</option>
                            </select>
                        </div>

                        {/* Tanggal */}
                        <div className="space-y-2">
                            <label className="block text-base leading-none lg:text-xl">
                                Tanggal
                            </label>
                            <div className="relative flex items-center">
                                <div className="text-neutral pointer-events-none absolute left-4">
                                    <IconMynauiCalender className="h-5 w-5" />
                                </div>
                                <input
                                    type="date"
                                    className="border-default/30 placeholder:text-neutral font-body w-full rounded-lg border p-3 pl-11 text-sm focus:border-blue-500 focus:outline-blue-500 lg:text-base"
                                    value={data.tanggal_event}
                                    onChange={(e) =>
                                        setData("tanggal_event", e.target.value)
                                    }
                                />
                            </div>

                            {errors.tanggal_event && (
                                <p className="text-xs text-red-500">
                                    {errors.tanggal_event}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Jam Mulai */}
                        <div className="space-y-2">
                            <label className="block text-base leading-none lg:text-xl">
                                Jam Mulai
                            </label>
                            <div className="relative flex items-center">
                                <div className="text-neutral pointer-events-none absolute left-4">
                                    <IconClockLight className="h-5 w-5" />
                                </div>
                                <input
                                    type="time"
                                    className="border-default/30 placeholder:text-neutral font-body w-full rounded-lg border p-3 pl-11 text-sm focus:border-blue-500 focus:outline-blue-500 lg:text-base"
                                    value={data.jam_mulai}
                                    onChange={(e) =>
                                        setData("jam_mulai", e.target.value)
                                    }
                                />
                            </div>

                            {errors.jam_mulai && (
                                <p className="text-xs text-red-500">
                                    {errors.jam_mulai}
                                </p>
                            )}
                        </div>

                        {/* Jam Selesai */}
                        <div className="space-y-2">
                            <label className="block text-base leading-none lg:text-xl">
                                Jam Selesai
                            </label>
                            <div className="relative flex items-center">
                                <div className="text-neutral pointer-events-none absolute left-4">
                                    <IconClockLight className="h-5 w-5" />
                                </div>
                                <input
                                    type="time"
                                    className="border-default/30 placeholder:text-neutral font-body w-full rounded-lg border p-3 pl-11 text-sm focus:border-blue-500 focus:outline-blue-500 lg:text-base"
                                    value={data.jam_selesai}
                                    onChange={(e) =>
                                        setData("jam_selesai", e.target.value)
                                    }
                                />
                            </div>

                            {errors.jam_selesai && (
                                <p className="text-xs text-red-500">
                                    {errors.jam_selesai}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Lokasi (Dinamis) */}
                        {(data.tipe_event === "OFFLINE" ||
                            data.tipe_event === "HYBRID") && (
                            <div className="space-y-2">
                                <label className="block text-base leading-none lg:text-xl">
                                    Lokasi
                                </label>
                                <div className="relative flex items-center">
                                    <div className="text-neutral absolute left-4">
                                        <IconCarbonLocation className="h-5 w-5" />
                                    </div>
                                    <input
                                        type="text"
                                        className="border-default/30 placeholder:text-neutral font-body w-full rounded-lg border p-3 pl-11 text-sm focus:border-blue-500 focus:outline-blue-500 lg:text-base"
                                        value={data.lokasi}
                                        onChange={(e) =>
                                            setData("lokasi", e.target.value)
                                        }
                                        placeholder="UPA PKK"
                                    />
                                </div>

                                {errors.lokasi && (
                                    <p className="text-xs text-red-500">
                                        {errors.lokasi}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Jumlah Peserta */}
                        <div className="space-y-2">
                            <label className="block text-base leading-none lg:text-xl">
                                Peserta
                            </label>
                            <div className="relative flex items-center">
                                <div className="text-neutral absolute left-4">
                                    <IconUsersGroup className="h-5 w-5" />
                                </div>

                                <input
                                    type="number"
                                    className="border-default/30 placeholder:text-neutral font-body w-full rounded-lg border p-3 pl-11 text-sm focus:border-blue-500 focus:outline-blue-500 lg:text-base"
                                    value={data.quota}
                                    placeholder="100"
                                    onChange={(e) =>
                                        setData("quota", e.target.value)
                                    }
                                    min="1"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-base leading-none lg:text-xl">
                            Partner
                            <span className="text-neutral ml-2 text-base">
                                (Opsional)
                            </span>
                        </label>

                        <SelectOrAddTags
                            selectedTags={data.partners}
                            onChange={(newTags) => setData("partners", newTags)}
                            placeholder="e.g. AIESEC"
                            apiEndpoint="/api/partners/search" // Pastikan route ini ada!
                        />
                        <p className="text-neutral text-xs lg:text-sm">
                            Tekan 'Enter' untuk menambahkan partner baru.
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-3 font-bold lg:gap-2.5 lg:px-4"
                        >
                            <IconMaterialSymAddRounded className="aspect-square h-4 w-4 text-blue-700 lg:h-5 lg:w-5" />
                            <span className="text-base leading-none font-medium text-blue-700">
                                {processing ? "Menyimpan..." : "Tambah Event"}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AddEvents;
