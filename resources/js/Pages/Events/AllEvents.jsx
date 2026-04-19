import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatTanggalSlash, formatJamMenit } from '@/utils/format';
import Breadcrumb from '@/Components/Breadcrumb';
import { Icon } from '@iconify/react';

export default function AllEvents({ ongoingEvents, upcomingEvents, pastEvents }) {
    const breadcrumbs = [
        { label: 'Home', href: route('dashboard') },
        { label: 'Events', href: route('all.events') },
    ];

    return (
        <AdminLayout title="Events">
            <Head title="Events" />

            <div className="mx-8 flex flex-col gap-8">
                <Breadcrumb items={breadcrumbs} />

                {/* ongoing events */}
                <div className='flex justify-between'>
                    <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none">Ongoing Events</span>
                    <Link href={route('ongoing.events')} className='flex gap-2'>
                        <span className="font-['Plus_Jakarta_Sans'] font-medium text-[20px] leading-none text-blue-700">
                            Lihat Semua
                        </span>
                        <Icon icon="basil:arrow-left-outline" width="24" height="24" rotate={2} className='text-blue-700' />
                    </Link>
                </div>
                <div className='flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar'>
                    {/* kalau tak ada ongoing event */}
                    {ongoingEvents.length === 0 ? (<div className='flex flex-col shrink-0 w-full min-h-64.25 border border-slate-700/30 rounded-2xl p-8 gap-8'>
                        <div className='flex gap-4 items-center justify-center h-full'>
                            <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none text-neutral-500">No Event</span>
                        </div>
                    </div>) : (
                        <>
                            {/* kalau ongoing event ada */}
                            {ongoingEvents.map(event => (
                                <div key={event.id} className='flex flex-col shrink-0 snap-center min-w-129 justify-between border border-slate-700/30 rounded-2xl p-8 gap-6'>
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
                                <div className='flex flex-col shrink-0 min-w-129 min-h-50.75 border border-slate-700/30 rounded-2xl p-8 gap-8'>
                                    <div className="flex-1 flex items-center justify-center w-full h-full">
                                        <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none text-neutral-500">No Event</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* upcoming events */}
                <div className='flex justify-between'>
                    <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none">Upcoming Events</span>
                    <Link href={route('upcoming.events')} className='flex gap-2'>
                        <span className="font-['Plus_Jakarta_Sans'] font-medium text-[20px] leading-none text-blue-700">
                            Lihat Semua
                        </span>
                        <Icon icon="basil:arrow-left-outline" width="24" height="24" rotate={2} className='text-blue-700' />
                    </Link>
                </div>
                <div className='flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar'>
                    {/* kalau tak ada upcoming event */}
                    {upcomingEvents.length === 0 ? (<div className='flex flex-col shrink-0 w-full min-h-64.25 border border-slate-700/30 rounded-2xl p-8 gap-8'>
                        
                        <div className='flex gap-4 items-center justify-center h-full'>
                            <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none text-neutral-500">No Event</span>
                        </div>
                    </div>) : (
                        <>
                            {/* kalau upcoming event ada */}
                            {upcomingEvents.map(event => (
                                <div key={event.id} className='flex flex-col shrink-0 snap-center min-w-129 justify-between border border-slate-700/30 rounded-2xl p-8 gap-6'>
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
                            {/* kalau upcoming event cuman 1, kasih tambahan card*/}
                            {upcomingEvents.length === 1 && (
                                <div className='flex flex-col shrink-0 min-w-129 min-h-50.75 border border-slate-700/30 rounded-2xl p-8 gap-8'>
                                    <div className="flex-1 flex items-center justify-center w-full h-full">
                                        <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none text-neutral-500">No Event</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* past events */}
                <div className='flex justify-between'>
                    <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none">Past Events</span>
                    <Link href={route('past.events')} className='flex gap-2'>
                        <span className="font-['Plus_Jakarta_Sans'] font-medium text-[20px] leading-none text-blue-700">
                            Lihat Semua
                        </span>
                        <Icon icon="basil:arrow-left-outline" width="24" height="24" rotate={2} className='text-blue-700' />
                    </Link>
                </div>
                <div className='flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar'>
                    {/* kalau tak ada past event */}
                    {pastEvents.length === 0 ? (<div className='flex flex-col shrink-0 w-full min-h-64.25 border border-slate-700/30 rounded-2xl p-8 gap-8'>
                        <div className='flex gap-4 items-center justify-center h-full'>
                            <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none text-neutral-500">No Event</span>
                        </div>
                    </div>) : (
                        <>
                            {/* kalau past event ada */}
                            {pastEvents.map(event => (
                                <div key={event.id} className='flex flex-col shrink-0 snap-center min-w-129 justify-between border border-slate-700/30 rounded-2xl p-8 gap-6'>
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
                            {/* kalau past event cuman 1, kasih tambahan card*/}
                            {pastEvents.length === 1 && (
                                <div className='flex flex-col shrink-0 min-w-129 min-h-50.75 border border-slate-700/30 rounded-2xl p-8 gap-8'>
                                    <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none">Past Events!</span>
                                    <div className="flex-1 flex items-center justify-center w-full h-full">
                                        <span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none text-neutral-500">No Event</span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                
            </div>
        </AdminLayout>
    );
}