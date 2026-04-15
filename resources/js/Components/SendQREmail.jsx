import { useForm } from '@inertiajs/react';

export default function SendQREmail({ isOpen, onClose, eventId }) {
    if (!isOpen) return null;

    const { post, processing } = useForm({
        event_id: eventId // Kirim ID Event agar controller tahu peserta dari event mana yang harus di-email
    });

    const submit = (e) => {
        e.preventDefault();
        
        // Memanggil route bulk send di web.php
        post(route('inertia.peserta.send-qr-bulk'), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h4 className="text-lg font-bold text-gray-800">Kirim QR Bulk</h4>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>
                
                <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4">
                        Kirim email QR ke <strong>semua peserta</strong> offline di event ini sekarang? 
                        <br/><br/>
                        <span className="text-xs text-red-500">Tindakan ini mungkin memakan waktu jika jumlah peserta banyak.</span>
                    </p>
                    
                    <form onSubmit={submit}>
                        <div className="flex justify-end space-x-3">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="px-4 py-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded font-medium shadow transition disabled:opacity-70"
                            >
                                {processing ? 'Mengirim...' : 'Kirim QR Bulk'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}