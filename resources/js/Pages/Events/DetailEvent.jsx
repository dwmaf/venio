import { useForm, Link, Head, router } from '@inertiajs/react';
import { useState } from 'react';
import ImportPeserta from '@/Components/ImportPeserta';
import SendQREmail from '@/Components/SendQREmail';
import SendQRIndividual from '@/Components/SendQRIndividual';
import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import Pagination from '@/Components/Pagination';
import { RouteButton } from '@/Components/Buttons';
import { route } from 'ziggy-js';
import { Icon } from "@iconify/react";

export default function Event({ event, participants, stats }) {
    // State untuk modal/form Single Action
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isSendQRBulkOpen, setIsSendQRBulkOpen] = useState(false);
    const today = new Date().toISOString().split('T')[0];
    let eventCategoryLabel = '';
    let eventCategoryRoute = '';

    if (event.status === 'SELESAI') {
        eventCategoryLabel = 'Past Events';
        eventCategoryRoute = route('past.events');
    } else {
        if (event.tanggal_event === today) {
            eventCategoryLabel = 'Ongoing Events';
            eventCategoryRoute = route('ongoing.events');
        } else {
            eventCategoryLabel = 'Upcoming Events';
            eventCategoryRoute = route('upcoming.events');
        }
    }
    const breadcrumbs = [
        { label: 'Home', href: route('dashboard') },
        { label: 'Events', href: route('all.events') },
        { label: eventCategoryLabel, href: eventCategoryRoute },
        { label: event.nama_event || 'Detail Event', href: route('events.index', event.id) },
    ];

    return (
        <AdminLayout title="Events">
            <Head title={`Detail Event - ${event.nama_event}`} />
            <div className="flex flex-col gap-4">
                <Breadcrumb items={breadcrumbs} />
                <div className="flex flex-col gap-6">
                    <div className="flex justify-between">
                        <h2 className="font-['Plus_Jakarta_Sans'] font-medium text-2xl leading-none">{event.nama_event}</h2>
                        {event.tipe_event !== 'ONLINE' && (
                            <Link href={route('datang.index', event.id)}  className="flex gap-2">
                                <span className="font-['Plus_Jakarta_Sans'] font-medium text-xl leading-none text-blue-700">Scan QR</span>
                                <Icon
                                    icon="basil:arrow-left-outline"
                                    width="24"
                                    height="24"
                                    className='text-blue-700'
                                    rotate={2}
                                />
                            </Link>
                        )}
                    </div>

                    {/* 3 statistik */}
                    <div className='flex justify-between gap-4 w-full'>
                        <div className='flex flex-1 items-center justify-between bg-purple-50 border border-purple-500/30 rounded-2xl p-4'>
                            <div className='flex flex-col gap-2.5'>
                                <span className="font-['Plus_Jakarta_Sans'] font-medium text-xl leading-none">Total Peserta</span>
                                <span className="font-['Plus_Jakarta_Sans'] font-normal text-xl leading-none text-neutral-500">{stats.total} Peserta</span>
                            </div>
                            <Icon icon="solar:users-group-rounded-bold-duotone" width="32" height="32" className='text-purple-500' />
                        </div>
                        {(event.tipe_event === 'HYBRID') && (
                            <>
                                <div className='flex flex-1 items-center justify-between bg-teal-50 border border-teal-500/30 rounded-2xl p-4'>
                                    <div className='flex flex-col gap-2.5'>
                                        <span className="font-['Plus_Jakarta_Sans'] font-normal text-xl leading-none">Peserta Offline</span>
                                        <span className="font-['Plus_Jakarta_Sans'] font-normal text-xl leading-none text-neutral-500">{stats.offline} Peserta</span>
                                    </div>
                                    <Icon icon="duo-icons:approved" width="32" height="32" className='text-blue-700' />
                                </div>
                                <div className='flex flex-1 items-center justify-between bg-yellow-50 border border-yellow-500/30 rounded-2xl p-4'>
                                    <div className='flex flex-col gap-2.5'>
                                        <span className="font-['Plus_Jakarta_Sans'] font-normal text-xl leading-none">Peserta Online</span>
                                        <span className="font-['Plus_Jakarta_Sans'] font-normal text-xl leading-none text-neutral-500">{stats.online} Peserta</span>
                                    </div>
                                    <Icon icon="duo-icons:user" width="32" height="32" className='text-yellow-500' />
                                </div>
                            </>
                        )}
                        {(event.tipe_event === 'HYBRID' || event.tipe_event === 'OFFLINE') && (
                            <div className='flex flex-1 items-center justify-between bg-teal-50 border border-teal-500/30 rounded-2xl p-4'>
                                <div className='flex flex-col gap-2.5'>
                                    <span className="font-['Plus_Jakarta_Sans'] font-normal text-xl leading-none">Sudah Scan QR</span>
                                    <span className="font-['Plus_Jakarta_Sans'] font-normal text-xl leading-none text-neutral-500">{stats.offline_checked_in}</span>
                                </div>
                                <Icon icon="solar:qr-code-bold-duotone" width="32" height="32" className='text-teal-500' />
                            </div>
                        )}
                        {(event.tipe_event === 'ONLINE') && (
                            <div className='flex flex-1 items-center justify-between bg-teal-50 border border-teal-500/30 rounded-2xl p-4'>
                                <div className='flex flex-col gap-2.5'>
                                    <span className="font-['Plus_Jakarta_Sans'] font-normal text-xl leading-none">Link Zoom Terisi</span>
                                    <span className="font-['Plus_Jakarta_Sans'] font-normal text-xl leading-none text-neutral-500">{stats.online_zoom_filled}</span>
                                </div>
                                <Icon icon="hugeicons:zoom" width="32" height="32" className='text-blue-700' />
                            </div>
                        )}
                        {(event.tipe_event === 'ONLINE' || event.tipe_event === 'OFFLINE') && (
                            <div className='flex flex-1 items-center justify-between bg-yellow-50 border border-yellow-500/30 rounded-2xl p-4'>
                                <div className='flex flex-col gap-2.5'>
                                    <span className="font-['Plus_Jakarta_Sans'] font-normal text-xl leading-none">{event.tipe_event === 'ONLINE' ? 'Zoom Belum Terisi' : 'Belum Hadir'}</span>
                                    <span className="font-['Plus_Jakarta_Sans'] font-normal text-xl leading-none text-neutral-500 ">
                                        {event.tipe_event === 'ONLINE' ? stats.online_zoom_empty : stats.offline_not_checked_in} Peserta
                                    </span>
                                </div>
                                <Icon icon="duo-icons:user" width="32" height="32" className='text-yellow-500' />
                            </div>
                        )}
                    </div>

                    {/* button" fungsional */}
                    <div className="flex flex-col gap-8">
                        {/* impor ekspor */}
                        <div className="flex justify-between">
                            <div className='flex flex-col gap-2'>
                                <h2 className="font-['Plus_Jakarta_Sans'] font-medium text-2xl leading-none">Daftar Peserta</h2>
                                <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none text-neutral">Kelola peserta, impor data, dan kirim informasi dalam satu area.</span>
                            </div>
                            <div className='flex gap-2'>
                                <button onClick={() => setIsImportModalOpen(true)} className="flex items-center rounded-lg bg-blue-50 p-3 gap-2 cursor-pointer">
                                    <Icon icon="mingcute:file-import-fill" width="20" height="20" className='text-blue-700' />
                                    <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none text-blue-700">Import Peserta</span>
                                </button>
                                <a href={route('ekspor.wa')} className="flex items-center rounded-lg bg-lime-100 p-3 gap-2">
                                    <Icon icon="ri:whatsapp-fill" width="20" height="20" className='text-lime-700' />
                                    <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none text-lime-700">Export WA</span>
                                </a>
                            </div>
                        </div>
                        {/* zoom, QR, rekap */}
                        <div className='flex justify-between'>
                            <button className='flex gap-2 items-center border border-neutral/30 rounded-xl px-4 py-2'>
                                <Icon icon="lsicon:filter-outline" width="20" height="20" className='text-neutral' />
                                <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none text-neutral">Filter Metode Kehadiran</span>
                            </button>
                            <div className='flex gap-2'>
                                {event.tipe_event !== 'OFFLINE' && (
                                    <button className="flex items-center rounded-lg border border-neutral/30 p-3 gap-2 cursor-pointer">
                                        <Icon icon="hugeicons:zoom" width="20" height="20" className='text-blue-700' />
                                        <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none ">Zoom Bulk</span>
                                    </button>
                                )}
                                {event.tipe_event !== 'ONLINE' && (
                                    <button onClick={() => setIsSendQRBulkOpen(true)} className="flex items-center rounded-lg border border-neutral/30 p-3 gap-2 cursor-pointer">
                                        <Icon icon="material-symbols-light:qr-code-rounded" width="20" height="20" className='text-blue-700' />
                                        <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none ">QR Bulk</span>
                                    </button>
                                )}
                                <a href={route('ekspor.wa')} className="flex items-center rounded-lg border border-neutral/30 p-3 gap-2">
                                    <Icon icon="basil:document-outline" width="20" height="20" className='text-blue-700' />
                                    <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none">Rekap Hadir</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* tabel */}
                    <div className='w-full overflow-x-auto'>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-400">
                                    <th className="p-5 font-normal font-['Plus_Jakarta_Sans'] text-xl leading-none text-black">Nama</th>
                                    <th className="p-5 font-normal font-['Plus_Jakarta_Sans'] text-xl leading-none text-black">Email</th>
                                    <th className="p-5 font-normal font-['Plus_Jakarta_Sans'] text-xl leading-none text-black">No. HP</th>
                                    <th className="p-5 font-normal font-['Plus_Jakarta_Sans'] text-xl leading-none text-black">Status</th>
                                    <th className="p-5 font-normal font-['Plus_Jakarta_Sans'] text-xl leading-none text-black">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {participants.data.map(participant => (
                                    <tr key={participant.id} className="border-b border-neutral-400 ">
                                        <td className="p-5 font-normal font-['Plus_Jakarta_Sans'] text-base leading-none text-black whitespace-nowrap">
                                            {participant.nama_lengkap}
                                        </td>
                                        <td className="p-5 font-normal font-['Plus_Jakarta_Sans'] text-base leading-none text-black">
                                            {participant.email_primary}
                                        </td>
                                        <td className="p-5 font-normal font-['Plus_Jakarta_Sans'] text-base leading-none text-black">
                                            {participant.no_hp_normalized}
                                        </td>
                                        <td className="p-5 font-medium font-['Plus_Jakarta_Sans'] text-xs leading-none">
                                            <div className='flex flex-col gap-2'>
                                                <div className='flex gap-2'>
                                                    <div className={`rounded-2xl px-2 py-1 capitalize max-w-14 max-auto ${participant.metode_kehadiran === 'OFFLINE' ? 'bg-lime-100 text-lime-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {participant.metode_kehadiran.toLowerCase()}
                                                    </div>
                                                    {(participant.metode_kehadiran === 'OFFLINE') && (
                                                        <div className={`rounded-2xl px-2 py-1 whitespace-nowrap ${participant.checked_in_at ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {participant.checked_in_at ? 'Sudah Hadir' : 'Belum Hadir'}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="font-normal font-['Plus_Jakarta_Sans'] text-xs leading-none text-neutral whitespace-nowrap">
                                                    {participant.metode_kehadiran === 'OFFLINE' ? (
                                                        <>QR: {participant.qr_token || 'Belum Terisi'}</>
                                                    ) : (
                                                        <>Zoom: {participant.zoom_link || 'Belum Terisi'}</>
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            {participant.metode_kehadiran === 'OFFLINE' ? (
                                                <button onClick={() => setIsImportModalOpen(true)} className="flex items-center rounded-lg bg-teal-50 p-3 gap-2 cursor-pointer">
                                                    <Icon icon="material-symbols-light:qr-code-rounded" width="20" height="20" className='text-teal-500' />
                                                    <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none text-teal-500 whitespace-nowrap">Kirim Email QR</span>
                                                </button>
                                            ) : (
                                                <button onClick={() => setIsImportModalOpen(true)} className="flex items-center rounded-lg bg-blue-50 p-3 gap-2 cursor-pointer">
                                                    <Icon icon="hugeicons:zoom" width="20" height="20" className='text-blue-500' />
                                                    <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none text-blue-500 whitespace-nowrap">Kirim Link Zoom</span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-8 flex justify-between flex-col md:flex-row items-center gap-4">
                    <span className="font-normal font-['Plus_Jakarta_Sans'] text-base leading-none text-neutral whitespace-nowrap">Menampilkan {participants.data.length} dari {participants.total} data</span>
                    <Pagination links={participants.links} />
                </div>
            </div>

            <SendQRIndividual
                participant={selectedParticipant}
                onClose={() => setSelectedParticipant(null)}
            />

            <SendQREmail
                isOpen={isSendQRBulkOpen}
                onClose={() => setIsSendQRBulkOpen(false)}
                eventId={event.id}
            />

            <ImportPeserta
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                eventId={event.id}
            />

        </AdminLayout>
    );
}