import { useForm } from '@inertiajs/react';

export default function SendZoomBulk({ isOpen, onClose, eventId, online, sentCount }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        zoom_link: '',
        resend_all: false,
    });
    if (!isOpen) return null;

    const submit = (e) => {
        e.preventDefault();
        post(route('peserta.send-zoom-bulk', { event: eventId }), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const targetCount = data.resend_all ? online : (online - sentCount);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-default/50 px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral/30 flex justify-between items-center">
                    <h4 className="text-xl font-['Plus_Jakarta_Sans'] leading-none text-default font-medium">Kirim Zoom Bulk</h4>
                    <button onClick={onClose} className="text-xl leading-none cursor-pointer">✕</button>
                </div>

                <div className="p-6 space-y-6">
                    <p className="text-sm font-['Plus_Jakarta_Sans'] leading-normal font-normal">
                        Kirim email Zoom ke <strong>{targetCount} peserta online</strong> di event ini?
                        <br /><br />
                        Secara default, email hanya akan dikirim ke peserta yang belum menerima Link Zoom.
                        <br />
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
                        {sentCount > 0 && (
                            <div className="mb-4 flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="resend_all" 
                                    checked={data.resend_all}
                                    onChange={(e) => setData('resend_all', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="resend_all" className="text-sm font-['Plus_Jakarta_Sans'] text-default cursor-pointer">
                                    Kirim ulang juga ke peserta yang sudah menerima ({sentCount} peserta)
                                </label>
                            </div>
                        )}
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
                                disabled={processing || targetCount === 0}
                                className={`flex items-center rounded-lg p-3 gap-2 cursor-pointer ${
                                    targetCount === 0 ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' : 'bg-blue-50 text-blue-700'
                                }`}
                            >
                                <span className={`font-['Plus_Jakarta_Sans'] font-normal text-base leading-none ${targetCount === 0 ? 'text-neutral-400' : 'text-blue-700'}`}>
                                    {processing ? 'Mengirim...' : 'Kirim Zoom Bulk'}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}