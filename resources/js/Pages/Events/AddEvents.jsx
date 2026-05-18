import AdminLayout from "@/Layouts/AdminLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import { useForm, Head } from "@inertiajs/react";
import {
    IconMynauiCalender,
    IconClockLight,
    IconCarbonLocation,
    IconUsersGroup,
    IconMaterialSymAddRounded,
    IconChevronDown,
} from "@/Components/Icons";
import SelectOrAddTags from "@/Components/SelectOrAddTags";
import { BackButton } from "@/Components/Buttons";
import { InputWithIcon, FormInput, SelectInput } from "@/Components/Inputs";

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
        <AdminLayout title="Acara Baru">
            <Head title="Tambah Acara" />

            <div className="flex justify-between">
                <Breadcrumb items={breadcrumbs} />

                <BackButton text="Kembali" />
            </div>

            <div className="font-body m-auto mt-12 max-w-106">
                <form onSubmit={submit} className="m space-y-4">
                    {/* Nama Event */}
                    <FormInput
                        label="Nama Acara"
                        placeholder="Nama Event"
                        value={data.nama_event}
                        onChange={(e) => setData("nama_event", e.target.value)}
                        error={errors.nama_event}
                        required={true}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tipe Event */}
                        <SelectInput
                            label="Metode Hadir"
                            value={data.tipe_event}
                            onChange={(e) => setData("tipe_event", e.target.value)}
                            options={[
                                { value: "OFFLINE", label: "Offline" },
                                { value: "ONLINE", label: "Online" },
                                { value: "HYBRID", label: "Hybrid" }
                            ]}
                            error={errors.tipe_event}
                        />

                        {/* Tanggal */}
                        <InputWithIcon
                            label="Tanggal"
                            type="date"
                            icon={IconMynauiCalender}
                            value={data.tanggal_event}
                            onChange={(e) => setData("tanggal_event", e.target.value)}
                            error={errors.tanggal_event}
                            required={true}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Jam Mulai */}
                        <InputWithIcon
                            label="Jam Mulai"
                            type="time"
                            icon={IconClockLight}
                            value={data.jam_mulai}
                            onChange={(e) => setData("jam_mulai", e.target.value)}
                            error={errors.jam_mulai}
                            required={true}
                        />

                        {/* Jam Selesai */}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Lokasi (Dinamis) */}
                        {(data.tipe_event === "OFFLINE" ||
                            data.tipe_event === "HYBRID") && (
                                <InputWithIcon
                                label="Lokasi"
                                type="text"
                                icon={IconCarbonLocation}
                                placeholder="UPA PKK"
                                value={data.lokasi}
                                onChange={(e) => setData("lokasi", e.target.value)}
                                error={errors.lokasi}
                                required={true}
                            />
                            )}

                        {/* Jumlah Peserta */}
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
                                {processing
                                    ? "Menyimpan..."
                                    : "Tambah Acara Baru"}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AddEvents;
