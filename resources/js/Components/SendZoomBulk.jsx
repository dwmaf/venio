import { useForm } from '@inertiajs/react';

export default function SendZoomBulk({ isOpen, onClose, eventId, online }) {
    const { data, setData, post, processing, errors } = useForm({
        zoom_link: '',
    });
    if (!isOpen) return null;

    const submit = (e) => {
        e.preventDefault();
        post(route('peserta.send-zoom-bulk', { event: eventId }), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-default/50 px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral/30 flex justify-between items-center">
                    <h4 className="text-xl font-['Plus_Jakarta_Sans'] leading-none text-default font-medium">Kirim Zoom Bulk</h4>
                    <button onClick={onClose} className="text-xl leading-none cursor-pointer">✕</button>
                </div>

                <div className="p-6 space-y-6">
                    <p className="text-sm font-['Plus_Jakarta_Sans'] leading-none font-normal">
                        Kirim email Zoom ke <strong>{online} peserta</strong> online di event ini sekarang?
                        <br /><br />
                        <span className="text-xs text-red-500">Tindakan ini mungkin memakan waktu jika jumlah peserta banyak.</span>
                    </p>

                    <form onSubmit={submit}>
                        <div className="mb-4 space-y-2">
                            <label className="block text-sm font-medium text-default font-['Plus_Jakarta_Sans']">Masukan Link Zoom untuk Event ini</label>
                            <input 
                                type="url" 
                                required
                                placeholder="https://zoom.us/j/..."
                                value={data.zoom_link} 
                                onChange={(e) => setData('zoom_link', e.target.value)} 
                                className="w-full font-['Plus_Jakarta_Sans'] border border-neutral/30 rounded-lg p-2 text-sm placeholder:font-['Plus_Jakarta_Sans']"
                            />
                            {errors.zoom_link && <span className="font-['Plus_Jakarta_Sans'] text-red-500 text-xs">{errors.zoom_link}</span>}
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex items-center rounded-lg border border-neutral/30 p-3 gap-2 cursor-pointer"
                            >
                                <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none text-neutral">Batal</span>
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center rounded-lg bg-blue-50 p-3 gap-2 cursor-pointer"
                            >
                                <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none text-blue-700">
                                    {processing ? 'Mengirim...' : 'Kirim QR Bulk'}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}