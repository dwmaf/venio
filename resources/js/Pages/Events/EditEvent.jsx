import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import { useForm, Head, Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import SelectOrAddTags from "@/Components/SelectOrAddTags";
import { route } from "ziggy-js";

const EditEvent = ({ event }) => {
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
        {
            label: "Edit Event",
            href: route("events.edit", event.id),
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        nama_event: event.nama_event || "",
        tipe_event: event.tipe_event || "OFFLINE",
        tanggal_event: event.tanggal_event || "",
        jam_mulai: event.jam_mulai?.slice(0, 5) || "",
        jam_selesai: event.jam_selesai?.slice(0, 5) || "",
        lokasi: event.lokasi || "",
        quota: event.quota || "",
        partners: event.partners?.map((partner) => partner.nama) || [],
    });

    const submit = (e) => {
        e.preventDefault();

        put(route("events.update", event.id));
    };

    return (
        <AdminLayout title="Events">
            <Head title={`Edit Event - ${event.nama_event}`} />

            <Breadcrumb items={breadcrumbs} />

            <div className="min-h-[calc(100vh-180px)] w-full flex justify-center items-center py-20 font-body">
                <form
                    onSubmit={submit}
                    className="w-full max-w-[424px] space-y-6"
                >
                    {/* Nama Event */}
                    <div className="space-y-2">
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

                    {/* Format Event + Tanggal Event */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-base lg:text-xl leading-none">
                                Format Event
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

                        <div className="space-y-2">
                            <label className="block text-base lg:text-xl leading-none">
                                Tanggal Event
                            </label>

                            <div className="relative flex items-center">
                                <div className="absolute left-4 text-neutral pointer-events-none">
                                    <Icon
                                        icon="solar:calendar-bold-duotone"
                                        className="w-5 h-5"
                                    />
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

                            {errors.tanggal_event && (
                                <p className="text-red-500 text-xs">
                                    {errors.tanggal_event}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Jam Mulai + Jam Selesai */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-base lg:text-xl leading-none">
                                Jam Mulai
                            </label>

                            <div className="relative flex items-center">
                                <div className="absolute left-4 text-neutral pointer-events-none">
                                    <Icon
                                        icon="solar:clock-circle-bold-duotone"
                                        className="w-5 h-5"
                                    />
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

                            {errors.jam_mulai && (
                                <p className="text-red-500 text-xs">
                                    {errors.jam_mulai}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-base lg:text-xl leading-none">
                                Jam Selesai
                            </label>

                            <div className="relative flex items-center">
                                <div className="absolute left-4 text-neutral pointer-events-none">
                                    <Icon
                                        icon="solar:clock-circle-bold-duotone"
                                        className="w-5 h-5"
                                    />
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

                            {errors.jam_selesai && (
                                <p className="text-red-500 text-xs">
                                    {errors.jam_selesai}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Lokasi + Peserta */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-base lg:text-xl leading-none">
                                Lokasi
                            </label>

                            <div className="relative flex items-center">
                                <div className="absolute left-4 text-neutral pointer-events-none">
                                    <Icon
                                        icon="carbon:location"
                                        className="w-5 h-5"
                                    />
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

                        <div className="space-y-2">
                            <label className="block text-base lg:text-xl leading-none">
                                Peserta
                            </label>

                            <div className="relative flex items-center">
                                <div className="absolute left-4 text-neutral pointer-events-none">
                                    <Icon
                                        icon="mynaui:users-group"
                                        className="w-5 h-5"
                                    />
                                </div>

                                <input
                                    type="number"
                                    className="border border-default/30 placeholder:text-neutral font-body p-3 pl-11 text-sm lg:text-base w-full focus:border-blue-500 focus:outline-blue-500 rounded-lg"
                                    value={data.quota}
                                    placeholder="100"
                                    min="1"
                                    onChange={(e) =>
                                        setData("quota", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Partner */}
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
                            apiEndpoint="/api/partners/search"
                        />

                        {errors.partners && (
                            <p className="text-red-500 text-xs">
                                {errors.partners}
                            </p>
                        )}
                    </div>

                    {/* Button */}
                    <div className="flex justify-end pt-1">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-1.5 lg:gap-2.5 bg-blue-50 font-bold py-3 px-3 lg:px-4 rounded-xl cursor-pointer hover:bg-blue-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Icon
                                icon="solar:diskette-bold-duotone"
                                className="text-blue-700 w-4 h-4 lg:w-5 lg:h-5 aspect-square"
                            />

                            <span className="font-medium text-base leading-none text-blue-700">
                                {processing ? "Menyimpan..." : "Simpan Edit"}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default EditEvent;
