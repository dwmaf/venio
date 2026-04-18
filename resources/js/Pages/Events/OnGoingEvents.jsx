import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Icon } from '@iconify/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import { formatTanggalSlash, formatJamMenit } from '@/utils/format';

export default function OngoingEvents({ ongoingEvents = [] }) {
	const breadcrumbs = [
		{ label: 'Home', href: route('dashboard') },
		{ label: 'Events', href: route('all.events') },
		{ label: 'Ongoing Events' },
	];

	const hasEvents = ongoingEvents.length > 0;

	return (
		<AdminLayout title="Events">
			<Head title="Ongoing Events" />

			<div className="mx-8 flex flex-col gap-8">
				<Breadcrumb items={breadcrumbs} />

				<span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none">Ongoing Events</span>

				{hasEvents ? (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{ongoingEvents.map((event) => (
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
					</div>
				) : (
					<div className='flex flex-col w-full min-h-64.25 border border-slate-700/30 rounded-2xl p-8 gap-8'>

						<div className='flex gap-4 items-center justify-center h-full'>
							<span className="font-['Plus_Jakarta_Sans'] font-medium text-[24px] leading-none text-neutral-500">No Event!</span>
						</div>
					</div>
				)}
			</div>
		</AdminLayout>
	);
}
