import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function Dashboard({ ongoingEvents = [], historyEvents = [], flash }) {
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

    return (
        <div className="">
            <Head title="Dasbor Event" />

            <div className="">
                <div className="">
                    <h1 className="">Daftar Event</h1>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow transition"
                    >
                        + Tambah Event
                    </button>
                </div>

                {/* Notifikasi Flash Message */}
                {flash?.success && (
                    <div className="">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="">
                        {flash.error}
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex space-x-2 border-b border-gray-300 mb-6">
                    <button 
                        onClick={() => setActiveTab('berlangsung')}
                        className={`px-4 py-2 border-b-2 font-medium transition ${activeTab === 'berlangsung' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Berlangsung
                    </button>
                    <button 
                        onClick={() => setActiveTab('riwayat')}
                        className={`px-4 py-2 border-b-2 font-medium transition ${activeTab === 'riwayat' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Riwayat
                    </button>
                </div>

                {/* Tab Content: Berlangsung (Card Grid) */}
                {activeTab === 'berlangsung' && (
                    <div>
                        {ongoingEvents.length === 0 && <p className="text-gray-500">Tidak ada event yang sedang berlangsung.</p>}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ongoingEvents.map(event => (
                                <div key={event.id} className="bg-white rounded-lg shadow p-5 border border-gray-200 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{event.nama_event}</h3>
                                        <p className="text-sm text-gray-600">Mulai: <span className="font-semibold">{event.tanggal_mulai}</span></p>
                                        <p className="text-sm text-gray-600">Selesai: <span className="font-semibold">{event.tanggal_selesai}</span></p>
                                    </div>
                                    <div className="mt-4 flex space-x-2">
                                        <Link 
                                            href={`/inertia/events/${event.id}`}
                                            className="flex-1 text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded text-sm font-medium transition"
                                        >
                                            Buka Detail
                                        </Link>
                                        <button 
                                            onClick={() => openEditModal(event)}
                                            className="flex-1 text-center bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded text-sm font-medium transition"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab Content: Riwayat (Table) */}
                {activeTab === 'riwayat' && (
                    <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                        {historyEvents.length === 0 ? (
                            <p className="text-gray-500 p-6">Tidak ada riwayat event.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Event</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {historyEvents.map(event => (
                                        <tr key={event.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {event.nama_event}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {event.tanggal_mulai} s/d {event.tanggal_selesai}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm space-x-3">
                                                <Link href={`/inertia/event/${event.id}`} className="text-blue-600 hover:text-blue-900 font-medium">Buka Detail</Link>
                                                <button onClick={() => openEditModal(event)} className="text-gray-600 hover:text-gray-900 font-medium">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>

            {/* MODAL: Tambah Event */}
            {isAddModalOpen && (
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
            )}

            {/* MODAL: Edit Event */}
            {editingEvent && (
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
            )}
        </div>
    );
}