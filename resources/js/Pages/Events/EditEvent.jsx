import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import { useForm, Head, Link } from "@inertiajs/react";
import { IconMynauiCalender, IconClockLight, IconCarbonLocation, IconUsersGroup, IconDisketteBold, IconChevronDown, } from '@/Components/Icons';
import SelectOrAddTags from "@/Components/SelectOrAddTags";
import { route } from "ziggy-js";
import { BackButton } from "@/Components/Buttons";
import { InputWithIcon, FormInput, SelectInput } from "@/Components/Inputs";


const EditEvent = ({ event }) => {
    const today = new Date().toISOString().split("T")[0];
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
        { label: eventCategoryLabel, href: eventCategoryRoute, hideOnMobile: true },
        {
            label: event.nama_event || "Detail Event",
            href: route("events.index", event.id),
        },
        {
            label: "Edit",
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

            <div className="flex justify-between">
                <Breadcrumb items={breadcrumbs} />
                <BackButton text="Kembali" />
            </div>

            <div className="min-h-[calc(100vh-180px)] w-full flex justify-center items-center py-20 font-body">
                <form
                    onSubmit={submit}
                    className="w-full max-w-106 space-y-6"
                >
                    <FormInput
                        label="Nama Acara"
                        id="nama_event"
                        name="nama_event"
                        placeholder="Nama Event"
                        value={data.nama_event}
                        onChange={(e) => setData("nama_event", e.target.value)}
                        error={errors.nama_event}
                        required={true}
                    />

                    {/* Format Event + Tanggal Event */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SelectInput
                            label="Format Event"
                            value={data.tipe_event}
                            onChange={(e) => setData("tipe_event", e.target.value)}
                            options={[
                                { value: "OFFLINE", label: "Offline" },
                                { value: "ONLINE", label: "Online" },
                                { value: "HYBRID", label: "Hybrid" }
                            ]}
                            error={errors.tipe_event}
                            required={true}
                        />

                        <InputWithIcon
                            label="Tanggal Event"
                            type="date"
                            icon={IconMynauiCalender}
                            value={data.tanggal_event}
                            onChange={(e) => setData("tanggal_event", e.target.value)}
                            error={errors.tanggal_event}
                            required={true}
                        />
                    </div>

                    {/* Jam Mulai + Jam Selesai */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputWithIcon
                            label="Jam Mulai"
                            type="time"
                            icon={IconClockLight}
                            value={data.jam_mulai}
                            onChange={(e) => setData("jam_mulai", e.target.value)}
                            error={errors.jam_mulai}
                            required={true}
                        />

                        <InputWithIcon
                            label="Jam Selesai"
                            type="time"
                            icon={IconClockLight}
                            value={data.jam_selesai}
                            onChange={(e) => setData("jam_selesai", e.target.value)}
                            error={errors.jam_selesai}
                            required={true}
                        />
                    </div>

                    {/* Lokasi + Peserta */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(data.tipe_event === "OFFLINE" || data.tipe_event === "HYBRID") && (
                            <InputWithIcon
                                label="Lokasi"
                                type="text"
                                icon={IconCarbonLocation}
                                placeholder="UPA PKK"
                                value={data.lokasi}
                                onChange={(e) => setData("lokasi", e.target.value)}
                                error={errors.lokasi}
                            />
                        )}

                        <InputWithIcon
                            label="Peserta"
                            type="number"
                            icon={IconUsersGroup}
                            placeholder="100"
                            min="1"
                            value={data.quota}
                            onChange={(e) => setData("quota", e.target.value)}
                            error={errors.quota}
                        />
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

                        <p className="text-neutral text-xs lg:text-sm">
                            Tekan 'Enter' untuk menambahkan partner baru.
                        </p>

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
                            <IconDisketteBold className="text-blue-700 w-4 h-4 lg:w-5 lg:h-5 aspect-square" />

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
