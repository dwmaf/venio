import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatTanggalSlash, formatJamMenit } from '@/utils/format';
import Breadcrumb from '@/Components/Breadcrumb';
import Pagination from '@/Components/Pagination';
import { Icon } from '@iconify/react';

export default function pastEvents({ pastEvents }) {
    const breadcrumbs = [
        { label: 'Home', href: route('dashboard') },
        { label: 'Events', href: route('all.events') },
        { label: 'Past Events', href: route('past.events') },
    ];

    const tipeColors = {
        ONLINE: 'bg-amber-100 text-amber-700',
        HYBRID: 'bg-blue-100 text-blue-700',
        OFFLINE: 'bg-lime-100 text-lime-700',
    };

    return (
        <AdminLayout title="Events">
            <Head title="Events" />

            <div className="mx-8 flex flex-col gap-8">
                <Breadcrumb items={breadcrumbs} />

                {/* past events */}
                <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none">Past Events</span>
                <div className='w-full overflow-x-auto'>
                    {/* kalau tak ada past event */}
                    {pastEvents.data.length === 0 ? (<div className='flex flex-col w-full min-h-64.25 border border-slate-700/30 rounded-2xl p-8 gap-8'>
                        <div className='flex gap-4 items-center justify-center h-full'>
                            <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none text-neutral-500">No Event</span>
                        </div>
                    </div>) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-400">
                                    <th className="p-5 font-normal font-['Plus_Jakarta_Sans'] text-[20px] leading-none text-black">Nama Event</th>
                                    <th className="p-5 font-normal font-['Plus_Jakarta_Sans'] text-[20px] leading-none text-black">Tanggal</th>
                                    <th className="p-5 font-normal font-['Plus_Jakarta_Sans'] text-[20px] leading-none text-black">Total Peserta</th>
                                    <th className="p-5 font-normal font-['Plus_Jakarta_Sans'] text-[20px] leading-none text-black">Tipe</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pastEvents.data.map(event => (
                                    <tr key={event.id} className="border-b border-neutral-400 ">
                                        <td className="p-5 font-normal font-['Plus_Jakarta_Sans'] text-[16px] leading-none text-black">
                                            {event.nama_event}
                                        </td>
                                        <td className="p-5 font-normal font-['Plus_Jakarta_Sans'] text-[16px] leading-none text-black">
                                            {formatTanggalSlash(event.tanggal_event)}
                                        </td>
                                        <td className="p-5 font-normal font-['Plus_Jakarta_Sans'] text-[16px] leading-none text-black">
                                            {event.participants_count} Peserta
                                        </td>
                                        <td className="p-5 font-medium font-['Plus_Jakarta_Sans'] text-[12px] leading-none capitalize">
                                            <div className={`${tipeColors[event.tipe_event] || 'bg-gray-100 text-gray-700'} py-1 rounded-xl max-w-14 text-center max-auto`}>
                                                {event.tipe_event.toLowerCase()}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <div className="mt-8 flex justify-between flex-col md:flex-row">
                        <span className="font-normal font-['Plus_Jakarta_Sans'] text-[16px] leading-none text-gray-500">Menampilkan {pastEvents.data.length} dari {pastEvents.total} data</span>
                        <Pagination links={pastEvents.links} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}