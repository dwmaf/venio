import { useForm, Link, Head, router } from '@inertiajs/react';
import { useState } from 'react';
import ImportPeserta from '@/Components/ImportPeserta';
import SendQREmail from '@/Components/SendQREmail';
import SendQRIndividual from '@/Components/SendQRIndividual';
import { route } from 'ziggy-js';

export default function Event({ event, participants, stats }) {
    // State untuk modal/form Single Action
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isSendQRBulkOpen, setIsSendQRBulkOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Head title={`Detail Event - ${event.nama_event}`} />

            <div className="max-w-7xl mx-auto">
                <Link href={route('inertia.dasbor')} className="text-blue-600 hover:text-blue-800 hover:underline mb-6 inline-block font-medium">
                    &larr; Kembali ke Daftar Event
                </Link>

                <div className="bg-white shadow rounded-lg p-6 mb-6 border border-gray-200 flex justify-between items-center flex-wrap gap-4">
                    <h1 className="text-2xl font-bold text-gray-800">{event.nama_event}</h1>

                    <div className="flex space-x-3">
                        {/* Indikator Active (Daftar Peserta) */}
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg font-medium text-sm cursor-default">
                            Daftar Peserta
                        </span>

                        {/* Tombol Link ke Scanner (Mengirim parameter event_id) */}
                        <Link
                            href={route('inertia.datang.index', { event_id: event.id })}
                            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition text-sm shadow-sm"
                        >
                            Buka Scanner
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
                        <h2 className="text-sm font-medium text-gray-500 uppercase">Total Peserta</h2>
                        <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                    </div>
                    <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
                        <h2 className="text-sm font-medium text-gray-500 uppercase">Sudah Check-in</h2>
                        <p className="text-2xl font-bold text-green-600">{stats.checked_in}</p>
                    </div>
                    <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
                        <h2 className="text-sm font-medium text-gray-500 uppercase">Belum Check-in</h2>
                        <p className="text-2xl font-bold text-red-600">{stats.not_checked_in}</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                    <button onClick={() => setIsImportModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow transition">
                        Import Peserta
                    </button>
                    <a href={route('inertia.ekspor.wa')} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded shadow transition inline-block">
                        Export WA
                    </a>
                    <button 
                    onClick={() => setIsSendQRBulkOpen(true)}
                     className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded shadow transition">
                        Kirim QR Bulk
                    </button>
                    <a href={route('inertia.ekspor.recap')} className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded shadow transition inline-block">
                        Export Rekap Hadir
                    </a>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                        <p className="text-sm text-gray-600">Menampilkan {participants.data.length} dari total {participants.total} peserta.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No HP</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {participants.data.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">Tidak ada peserta.</td>
                                    </tr>
                                )}
                                {participants.data.map((participant) => (
                                    <tr key={participant.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{participant.nama_lengkap}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.email_primary}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{participant.no_hp_normalized}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${participant.checked_in_at ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {participant.checked_in_at ? 'Sudah Hadir' : 'Belum Hadir'}
                                            </span>
                                            {participant.checked_in_at}
                                            {participant.qr_token ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => setSelectedParticipant(participant)} className="text-blue-600 hover:text-blue-900 font-medium">
                                                Kirim QR Email
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-wrap items-center gap-1">
                        {participants.links.map((link, index) => (
                            link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 border rounded text-sm transition ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                                />
                            ) : (
                                <span
                                    key={index}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className="px-3 py-1 border rounded text-sm bg-gray-100 text-gray-400 border-gray-200"
                                />
                            )
                        ))}
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
            </div>
        </div>
    );
}