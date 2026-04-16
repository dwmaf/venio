import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatTanggalSlash, formatJamMenit } from '@/utils/format';
import Breadcrumb from '@/Components/Breadcrumb';
import { Icon } from '@iconify/react';

export default function Dashboard({ ongoingEvents, upcomingEvents, stats }) {
    const [activeTab, setActiveTab] = useState('berlangsung'); // 'berlangsung' | 'riwayat'
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    // Form untuk Tambah Event
    const addForm = useForm({
        nama_event: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        status: 'BERLANGSUNG',
    });

    // Form untuk Edit Event
    const editForm = useForm({
        nama_event: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        status: 'BERLANGSUNG',
    });

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addForm.post(route('inertia.events.store'), {
            onSuccess: () => {
                setIsAddModalOpen(false);
                addForm.reset();
            },
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.put(route('inertia.events.update', editingEvent.id), {
            onSuccess: () => {
                setEditingEvent(null);
                editForm.reset();
            },
        });
    };

    const handleEditClick = (event) => {
        setEditingEvent(event);
        editForm.setData({
            nama_event: event.nama_event,
            tanggal_mulai: event.tanggal_mulai,
            tanggal_selesai: event.tanggal_selesai,
            status: event.status,
        });
    };

    const openEditModal = (event) => {
        editForm.setData({
            nama_event: event.nama_event,
            tanggal_mulai: event.tanggal_mulai || '',
            tanggal_selesai: event.tanggal_selesai || '',
            status: event.status,
        });
        setEditingEvent(event);
    };

    const breadcrumbs = [
        { label: 'Home', href: route('dashboard') },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard Event" />

            <div className="mx-8 flex flex-col gap-8">
                <Breadcrumb items={breadcrumbs} />
                {/* 3 statistik */}
                <div className='flex justify-between gap-4 w-full'>
                    <div className='flex flex-1 justify-between border border-slate-700/30 rounded-2xl p-4'>
                        <div className='flex flex-col gap-2.5'>
                            <span className="font-['Plus_Jakarta_Sans'] font-medium text-[20px] leading-none">Total Events</span>
                            <span className="font-['Plus_Jakarta_Sans'] font-normal text-[20px] leading-none text-neutral-500">{stats.totalEvents} Events</span>
                        </div>
                        <Icon icon="duo-icons:align-bottom" width="50" height="50" />
                    </div>
                    <div className='flex flex-1 justify-between border border-slate-700/30 rounded-2xl p-4'>
                        <div className='flex flex-col gap-2.5'>
                            <span className="font-['Plus_Jakarta_Sans'] font-normal text-[20px] leading-none">Completed Events</span>
                            <span className="font-['Plus_Jakarta_Sans'] font-normal text-[20px] leading-none text-neutral-500">{stats.completedEvents} Events</span>
                        </div>
                        <Icon icon="duo-icons:approved" width="50" height="50" />
                    </div>
                    <div className='flex flex-1 justify-between border border-slate-700/30 rounded-2xl p-4'>
                        <div className='flex flex-col gap-2.5'>
                            <span className="font-['Plus_Jakarta_Sans'] font-normal text-[20px] leading-none">Partners</span>
                            <span className="font-['Plus_Jakarta_Sans'] font-normal text-[20px] leading-none text-neutral-500">{stats.partners} Partners</span>
                        </div>
                        <Icon icon="duo-icons:user" width="50" height="50" />
                    </div>
                </div>

                {/* ongoing events */}
                <div className='flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar'>
                    {/* kalau tak ada ongoing event */}
                    {ongoingEvents.length === 0 ? (<div className='flex flex-col shrink-0 w-full min-h-64.25 border border-slate-700/30 rounded-2xl p-8 gap-8'>
                        <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none">Ongoing Events!</span>
                        <div className='flex gap-4 items-center justify-center h-full'>
                            <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none text-neutral-500">No Event</span>
                        </div>
                    </div>) : (
                        <>
                            {/* kalau ongoing event ada */}
                            {ongoingEvents.map(event => (
                                <div key={event.id} className='flex flex-col shrink-0 snap-center min-w-129 justify-between border border-slate-700/30 rounded-2xl p-8 gap-6'>
                                    <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none">Ongoing Events!</span>
                                    <div className='flex gap-4 items-center'>
                                        <Icon icon="duo-icons:award" width="40" height="40" />
                                        <div className="flex flex-col gap-2.5">
                                            <span className="font-['Plus_Jakarta_Sans'] font-medium text-[20px] leading-none text-dark">{event.nama_event}</span>
                                            <div className="flex flex-col gap-4">
                                                <div className='flex gap-2.5'>
                                                    <Icon icon="duo-icons:calendar" width="24" height="24" />
                                                    <span className="font-['Plus_Jakarta_Sans'] font-normal text-[20px] leading-none text-neutral-500">{formatTanggalSlash(event.tanggal_event)}</span>
                                                </div>
                                                <div className='flex gap-2.5'>
                                                    <Icon icon="duo-icons:clock" width="24" height="24" />
                                                    <span className="font-['Plus_Jakarta_Sans'] font-normal text-[20px] leading-none text-neutral-500">{formatJamMenit(event.jam_mulai)} - {formatJamMenit(event.jam_selesai)}</span>
                                                </div>
                                                <div className='flex gap-2.5'>
                                                    <Icon icon="duo-icons:location" width="24" height="24" />
                                                    <span className="font-['Plus_Jakarta_Sans'] font-normal text-[20px] leading-none text-neutral-500">{event.lokasi}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* kalau ongoing event cuman 1, kasih tambahan card*/}
                            {ongoingEvents.length === 1 && (
                                <div className='flex flex-col shrink-0 min-w-129 min-h-64.25 border border-slate-700/30 rounded-2xl p-8 gap-8'>
                                    <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none">Ongoing Events!</span>
                                    <div className="flex-1 flex items-center justify-center w-full h-full">
                                        <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none text-neutral-500">No Event</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* upcoming events */}
                <div className='flex flex-col flex-1 min-h-101.75 border border-slate-700/30 rounded-2xl p-8 gap-8'>
                    <div className='flex justify-between'>
                        <div className='flex flex-col gap-4'>
                            <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none">Upcoming Events</span>
                            <span className="font-['Plus_Jakarta_Sans'] font-normal text-[20px] leading-none text-neutral-500">Event yang akan berlangsung</span>
                        </div>
                        <Link href={route('upcoming.events')} className='flex gap-2'>
                            <span className="font-['Plus_Jakarta_Sans'] font-medium text-[20px] leading-none text-blue-700">
                                Lihat Semua
                            </span>
                            <Icon icon="basil:arrow-left-outline" width="24" height="24" rotate={2} className='text-blue-700' />
                        </Link>
                    </div>
                    {upcomingEvents.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center w-full h-full">
                            <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none text-neutral-500">No Event</span>
                        </div>
                    ) : (
                        upcomingEvents.map(event => (
                            <div key={event.id} className='flex justify-between'>
                                <div className='flex gap-4 items-center'>
                                    <Icon icon="duo-icons:award" width="40" height="40" />
                                    <div className="flex flex-col gap-2.5">
                                        <span className="font-['Plus_Jakarta_Sans'] font-medium text-[20px] leading-none text-dark">{event.nama_event}</span>
                                        <div className="flex gap-4">
                                            <div className='flex gap-2.5'>
                                                <Icon icon="duo-icons:calendar" width="24" height="24" />
                                                <span className="font-['Plus_Jakarta_Sans'] font-normal text-[20px] leading-none text-neutral-500">{formatTanggalSlash(event.tanggal_event)}</span>
                                            </div>
                                            <div className='flex gap-2.5'>
                                                <Icon icon="duo-icons:clock" width="24" height="24" />
                                                <span className="font-['Plus_Jakarta_Sans'] font-normal text-[20px] leading-none text-neutral-500">{formatJamMenit(event.jam_mulai)} - {formatJamMenit(event.jam_selesai)}</span>
                                            </div>
                                            <div className='flex gap-2.5'>
                                                <Icon icon="duo-icons:location" width="24" height="24" />
                                                <span className="font-['Plus_Jakarta_Sans'] font-normal text-[20px] leading-none text-neutral-500">{event.lokasi}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Link href={route('events.index', event.id)}>
                                    <Icon icon="eva:external-link-fill" width="24" height="24" className='text-blue-700' />
                                </Link>
                            </div>
                        ))
                    )}
                </div>

            </div>

            {/* MODAL: Tambah Event */}
            {/* {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Tambah Event Baru</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Event</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={addForm.data.nama_event} 
                                    onChange={e => addForm.setData('nama_event', e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                                    <input 
                                        type="date" 
                                        className="w-full border border-gray-300 rounded p-2"
                                        value={addForm.data.tanggal_mulai} 
                                        onChange={e => addForm.setData('tanggal_mulai', e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                                    <input 
                                        type="date" 
                                        className="w-full border border-gray-300 rounded p-2"
                                        value={addForm.data.tanggal_selesai} 
                                        onChange={e => addForm.setData('tanggal_selesai', e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select 
                                    className="w-full border border-gray-300 rounded p-2"
                                    value={addForm.data.status} 
                                    onChange={e => addForm.setData('status', e.target.value)}
                                >
                                    <option value="BERLANGSUNG">Berlangsung</option>
                                    <option value="RIWAYAT">Riwayat</option>
                                </select>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">Batal</button>
                                <button type="submit" disabled={addForm.processing} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium disabled:opacity-50">
                                    {addForm.processing ? 'Menyimpan...' : 'Simpan Event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )} */}

            {/* MODAL: Edit Event */}
            {/* {editingEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
                         <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Edit Event</h2>
                            <button onClick={() => setEditingEvent(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Event</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={editForm.data.nama_event} 
                                    onChange={e => editForm.setData('nama_event', e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                                    <input 
                                        type="date" 
                                        className="w-full border border-gray-300 rounded p-2"
                                        value={editForm.data.tanggal_mulai} 
                                        onChange={e => editForm.setData('tanggal_mulai', e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                                    <input 
                                        type="date" 
                                        className="w-full border border-gray-300 rounded p-2"
                                        value={editForm.data.tanggal_selesai} 
                                        onChange={e => editForm.setData('tanggal_selesai', e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select 
                                    className="w-full border border-gray-300 rounded p-2"
                                    value={editForm.data.status} 
                                    onChange={e => editForm.setData('status', e.target.value)}
                                >
                                    <option value="BERLANGSUNG">Berlangsung</option>
                                    <option value="RIWAYAT">Riwayat</option>
                                </select>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={() => setEditingEvent(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">Batal</button>
                                <button type="submit" disabled={editForm.processing} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium disabled:opacity-50">
                                    {editForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )} */}
        </AdminLayout>
    );
}