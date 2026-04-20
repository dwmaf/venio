import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import { useForm, Head } from '@inertiajs/react';
import { Icon } from '@iconify/react';
import SelectOrAddTags from '@/Components/SelectOrAddTags';

const AddEvents = () => {

    const breadcrumbs = [
        { label: 'Home', href: route('dashboard') },
        { label: 'Events', href: route('all.events') },
        { label: 'Add Event', href: route('create.events') },
    ];

    const { data, setData, post, processing, errors } = useForm({
        nama_event: '',
        tipe_event: 'OFFLINE',
        lokasi: '',
        tanggal_event: '',
        jam_mulai: '',
        jam_selesai: '',
        quota: '',
        partners: [],
    });

    const handleAddPartner = () => {
        setData('partners', [...data.partners, { name: '' }]);
    };

    const handleRemovePartner = (index) => {
        const newPartners = data.partners.filter((_, i) => i !== index);
        setData('partners', newPartners);
    };

    const handlePartnerChange = (index, value) => {
        const newPartners = [...data.partners];
        newPartners[index].name = value;
        setData('partners', newPartners);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('events.store'));
    };

    return (
        <AdminLayout title="Add New Event">
            <Head title="Tambah Event" />
            <Breadcrumb items={breadcrumbs} />
            <div className="mt-36 max-w-106 mx-auto">
                <form onSubmit={submit} className="space-y-6">
                    {/* Nama Event */}
                    <div className="space-y-2">
                        <label className="block font-normal text-[20px] leading-none">Nama Event</label>
                        <input
                            type="text"
                            className="w-full border border-default/30 rounded-lg p-3 text-[16px] placeholder:text-neutral-400"
                            placeholder='Nama Event'
                            value={data.nama_event}
                            onChange={e => setData('nama_event', e.target.value)}
                        />
                        {errors.nama_event && <p className="text-red-500 text-xs">{errors.nama_event}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Tipe Event */}
                        <div className="space-y-2">
                            <label className="block font-normal text-[20px] leading-none">Metode</label>
                            <select
                                className="w-full border border-default/30 rounded-lg p-3"
                                value={data.tipe_event}
                                onChange={e => setData('tipe_event', e.target.value)}
                            >
                                <option value="OFFLINE">OFFLINE</option>
                                <option value="ONLINE">ONLINE</option>
                                <option value="HYBRID">HYBRID</option>
                            </select>
                        </div>

                        {/* Tanggal */}
                        <div className="space-y-2">
                            <label className="block font-normal text-[20px] leading-none">Tanggal</label>
                            <input
                                type="date"
                                className="w-full border border-default/30 rounded-lg p-3 text-[16px] placeholder:text-neutral-400"
                                value={data.tanggal_event}
                                onChange={e => setData('tanggal_event', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Jam Mulai */}
                        <div className="space-y-2">
                            <label className="block font-normal text-[20px] leading-none">Jam Mulai</label>
                            <input
                                type="time"
                                className="w-full border border-default/30 rounded-lg p-3"
                                value={data.jam_mulai}
                                onChange={e => setData('jam_mulai', e.target.value)}
                            />
                        </div>
                        {/* Jam Selesai */}
                        <div className="space-y-2">
                            <label className="block font-normal text-[20px] leading-none">Jam Selesai</label>
                            <input
                                type="time"
                                className="w-full border border-default/30 rounded-lg p-3"
                                value={data.jam_selesai}
                                onChange={e => setData('jam_selesai', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Lokasi (Dinamis) */}
                        {(data.tipe_event === 'OFFLINE' || data.tipe_event === 'HYBRID') && (
                            <div className="space-y-2">
                                <label className="block font-normal text-[20px] leading-none">Lokasi</label>
                                <div className="relative flex items-center">
                                    <div className="absolute left-4 text-neutral">
                                        <Icon icon="carbon:location" width="20" height="20" />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full border border-default/30 rounded-lg p-3 pl-11 text-[16px] placeholder:text-neutral"
                                        value={data.lokasi}
                                        onChange={e => setData('lokasi', e.target.value)}
                                        placeholder="UPA PKK"
                                    />
                                </div>
                                {errors.lokasi && <p className="text-red-500 text-xs">{errors.lokasi}</p>}
                            </div>
                        )}
                        {/* Jumlah Peserta */}
                        <div className="space-y-2">
                            <label className="block font-normal text-[20px] leading-none">Peserta</label>
                            <div className="relative flex items-center">
                                <div className="absolute left-4 text-neutral">
                                    <Icon icon="mynaui:users-group" width="20" height="20" />
                                </div>
                                <input
                                    type="number"
                                    className="w-full border border-default/30 rounded-lg p-3 pl-11 text-[16px] placeholder:text-neutral"
                                    value={data.quota}
                                    placeholder="100"
                                    onChange={e => setData('quota', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block font-normal text-[20px] leading-none">Partner
                            <span className="text-[16px] ml-2 text-neutral">
                                (Opsional)
                            </span>
                        </label>
                        <SelectOrAddTags
                            selectedTags={data.partners}
                            onChange={(newTags) => setData('partners', newTags)}
                            placeholder="e.g. AIESEC"
                            apiEndpoint="/api/partners/search" // Pastikan route ini ada!
                        />
                        <p className="text-sm text-neutral">Tekan 'Enter' untuk menambahkan partner baru.</p>
                    </div>

                    <div className="flex justify-end">
                        <button
                            disabled={processing}
                            className="flex items-center gap-2.5 bg-blue-50 font-bold py-3 px-4 rounded-xl cursor-pointer"
                        >
                            <Icon icon="material-symbols:add-rounded" width="20" height="20" className="text-blue-700" />
                            <span className="font-normal text-[16px] leading-none text-blue-700">
                                {processing ? 'Menyimpan...' : 'Tambah Event'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default AddEvents;