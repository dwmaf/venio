import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import { useForm, Head } from "@inertiajs/react";
import { IconMynauiCalender, IconClockLight, IconCarbonLocation, IconUsersGroup, IconMaterialSymAddRounded } from '@/Components/Icons';
import SelectOrAddTags from "@/Components/SelectOrAddTags";

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
            <Breadcrumb items={breadcrumbs} />
            <div className="mt-12 lg:m-auto max-w-106 font-body">
                <form onSubmit={submit} className="space-y-4">
                    {/* Nama Event */}
                    <div className="space-y-3">
                        <label className="block text-base lg:text-xl leading-none">
                            Nama Event
                        </label>
                        <input
                            type="text"
                            className="border border-default/30 placeholder:text-neutral font-body p-3 text-sm lg:text-base w-full focus:border-blue-500 focus:outline-blue-500 rounded-lg"
                            placeholder="Nama Event"
                            value={data.nama_event}
                            onChange={(e) =>
                                setData("nama_event", e.target.value)
                            }
                        />

                        {errors.nama_event && (
                            <p className="text-red-500 text-xs">
                                {errors.nama_event}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Tipe Event */}
                        <div className="space-y-2">
                            <label className="block text-base lg:text-xl leading-none">
                                Metode Hadir
                            </label>
                            <select
                                className="border border-default/30 placeholder:text-neutral font-body p-3 text-sm lg:text-base w-full focus:border-blue-500 focus:outline-blue-500 rounded-lg"
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
                            <label className="block text-base lg:text-xl leading-none">
                                Tanggal
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute left-4 text-neutral pointer-events-none">

                                    <IconMynauiCalender className="w-5 h-5 " />
                                </div>
                                <input
                                    type="date"
                                    className="border border-default/30 placeholder:text-neutral font-body p-3 pl-11 text-sm lg:text-base w-full focus:border-blue-500 focus:outline-blue-500 rounded-lg"
                                    value={data.tanggal_event}
                                    onChange={(e) =>
                                        setData("tanggal_event", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Jam Mulai */}
                        <div className="space-y-2">
                            <label className="block text-base lg:text-xl leading-none">
                                Jam Mulai
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute left-4 text-neutral pointer-events-none">
                                    <IconClockLight className="w-5 h-5" />
                                </div>
                                <input
                                    type="time"
                                    className="border border-default/30 placeholder:text-neutral font-body p-3 pl-11 text-sm lg:text-base w-full focus:border-blue-500 focus:outline-blue-500 rounded-lg"
                                    value={data.jam_mulai}
                                    onChange={(e) =>
                                        setData("jam_mulai", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        {/* Jam Selesai */}
                        <div className="space-y-2">
                            <label className="block text-base lg:text-xl leading-none">
                                Jam Selesai
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute left-4 text-neutral pointer-events-none">
                                    <IconClockLight className="w-5 h-5" />
                                </div>
                                <input
                                    type="time"
                                    className="border border-default/30 placeholder:text-neutral font-body p-3 pl-11 text-sm lg:text-base w-full focus:border-blue-500 focus:outline-blue-500 rounded-lg"
                                    value={data.jam_selesai}
                                    onChange={(e) =>
                                        setData("jam_selesai", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Lokasi (Dinamis) */}
                        {(data.tipe_event === "OFFLINE" ||
                            data.tipe_event === "HYBRID") && (
                                <div className="space-y-2">
                                    <label className="block text-base lg:text-xl leading-none">
                                        Lokasi
                                    </label>
                                    <div className="relative flex items-center">
                                        <div className="absolute left-4 text-neutral">
                                            <IconCarbonLocation className="w-5 h-5" />
                                        </div>
                                        <input
                                            type="text"
                                            className="border border-default/30 placeholder:text-neutral font-body p-3 pl-11 text-sm lg:text-base w-full focus:border-blue-500 focus:outline-blue-500 rounded-lg"
                                            value={data.lokasi}
                                            onChange={(e) =>
                                                setData("lokasi", e.target.value)
                                            }
                                            placeholder="UPA PKK"
                                        />
                                    </div>

                                    {errors.lokasi && (
                                        <p className="text-red-500 text-xs">
                                            {errors.lokasi}
                                        </p>
                                    )}
                                </div>
                            )}

                        {/* Jumlah Peserta */}
                        <div className="space-y-2">
                            <label className="block text-base lg:text-xl leading-none">
                                Peserta
                            </label>
                            <div className="relative flex items-center">
                                <div className="absolute left-4 text-neutral">
                                    <IconUsersGroup className="w-5 h-5" />
                                </div>

                                <input
                                    type="number"
                                    className="border border-default/30 placeholder:text-neutral font-body p-3 pl-11 text-sm lg:text-base w-full focus:border-blue-500 focus:outline-blue-500 rounded-lg"
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
                        <label className="block text-base lg:text-xl leading-none">
                            Partner
                            <span className="text-base ml-2 text-neutral">
                                (Opsional)
                            </span>
                        </label>

                        <SelectOrAddTags
                            selectedTags={data.partners}
                            onChange={(newTags) => setData("partners", newTags)}
                            placeholder="e.g. AIESEC"
                            apiEndpoint="/api/partners/search" // Pastikan route ini ada!
                        />
                        <p className="text-xs lg:text-sm text-neutral">
                            Tekan 'Enter' untuk menambahkan partner baru.
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-1.5 lg:gap-2.5 bg-blue-50 font-bold py-3 px-3 lg:px-4 rounded-xl cursor-pointer"
                        >
                            <IconMaterialSymAddRounded className="text-blue-700 w-4 h-4 lg:w-5 lg:h-5 aspect-square" />
                            <span className="font-medium text-base leading-none text-blue-700">
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
