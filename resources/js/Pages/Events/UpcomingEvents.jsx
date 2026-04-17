import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatTanggalSlash, formatJamMenit } from '@/utils/format';
import Breadcrumb from '@/Components/Breadcrumb';
import { Icon } from '@iconify/react';

export default function AllEvents({ upcomingEvents }) {
    const breadcrumbs = [
        { label: 'Home', href: route('dashboard') },
        { label: 'Events', href: route('all.events') },
        { label: 'Upcoming Events', href: route('upcoming.events') },
    ];

    return (
        <AdminLayout title="Events">
            <Head title="Events" />

            <div className="mx-8 flex flex-col gap-8">
                <Breadcrumb items={breadcrumbs} />

                {/* upcoming events */}
                <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none">Upcoming Events</span>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* kalau tak ada upcoming event */}
                    {upcomingEvents.length === 0 ? (<div className='flex flex-col w-full min-h-64.25 border border-slate-700/30 rounded-2xl p-8 gap-8'>

                        <div className='flex gap-4 items-center justify-center h-full'>
                            <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none text-neutral-500">No Event</span>
                        </div>
                    </div>) : (
                        <>
                            {/* kalau upcoming event ada */}
                            {upcomingEvents.map(event => (
                                <div key={event.id} className='flex flex-col justify-between border border-slate-700/30 rounded-2xl p-8 gap-6'>
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
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}