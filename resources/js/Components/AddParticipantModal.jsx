import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function AddParticipantModal({ isOpen, onClose, eventId, tipeEvent }) {
    const defaultMetode = tipeEvent === 'ONLINE' ? 'ONLINE' : 'OFFLINE';
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_lengkap: '',
        email_primary: '',
        no_hp_normalized: '',
        metode_kehadiran: 'OFFLINE', // Default
    });

    useEffect(() => {
        if (isOpen) {
            setData(data => ({ ...data, metode_kehadiran: defaultMetode }));
        }
    }, [isOpen, tipeEvent]);

    if (!isOpen) return null;

    const submit = (e) => {
        e.preventDefault();
        post(route('participants.store', eventId), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral/30 flex justify-between items-center">
                    <h2 className="text-xl font-body leading-none text-neutral-800 font-medium">Tambah Peserta Manual</h2>
                    <button onClick={onClose} className="text-xl leading-none cursor-pointer">✕</button>
                </div>

                <div className="p-6">
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={data.nama_lengkap}
                                onChange={e => setData('nama_lengkap', e.target.value)}
                                className="w-full border border-neutral/30 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none"
                                required
                            />
                            {errors.nama_lengkap && <span className="text-red-500 text-xs">{errors.nama_lengkap}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-1">Email <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                value={data.email_primary}
                                onChange={e => setData('email_primary', e.target.value)}
                                className="w-full border border-neutral/30 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none"
                                required
                            />
                            {errors.email_primary && <span className="text-red-500 text-xs">{errors.email_primary}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-1">No HP</label>
                                <input
                                    type="text"
                                    value={data.no_hp_normalized}
                                    onChange={e => setData('no_hp_normalized', e.target.value)}
                                    className="w-full border border-neutral/30 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none"
                                />
                                {errors.no_hp_normalized && <span className="text-red-500 text-xs">{errors.no_hp_normalized}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-1">Metode Kehadiran</label>
                                <select
                                    value={data.metode_kehadiran}
                                    onChange={e => setData('metode_kehadiran', e.target.value)}
                                    className="w-full border border-neutral/30 rounded-lg p-2 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    disabled={tipeEvent !== 'HYBRID'}
                                >
                                    {(tipeEvent === 'OFFLINE' || tipeEvent === 'HYBRID') && (
                                        <option value="OFFLINE">Offline</option>
                                    )}
                                    
                                    {(tipeEvent === 'ONLINE' || tipeEvent === 'HYBRID') && (
                                        <option value="ONLINE">Online</option>
                                    )}
                                </select>
                                {errors.metode_kehadiran && <span className="text-red-500 text-xs">{errors.metode_kehadiran}</span>}
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Data'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}