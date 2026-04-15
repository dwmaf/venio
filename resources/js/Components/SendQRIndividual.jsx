import { useForm } from '@inertiajs/react';

export default function SendQRIndividual({ participant, onClose }) {
    if (!participant) return null;

    const { post, processing } = useForm();

    const submit = (e) => {
        e.preventDefault();
        post(route('inertia.peserta.send-qr', participant.id), {
            onSuccess: () => {
                onClose();
            },
            preserveScroll: true, // Biar layar ga tiba-tiba lompat ke atas
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h4 className="text-lg font-bold text-gray-800">Kirim ulang QR</h4>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
                </div>
                
                <div className="p-6">
                    <p className="text-sm text-gray-600 mb-6">
                        Kirim QR ke email <span className="font-bold text-gray-900">{participant.email_primary}</span> atas nama <span className="font-bold text-gray-900">{participant.nama_lengkap}</span>?
                    </p>
                    
                    <form onSubmit={submit}>
                        <div className="flex justify-end space-x-3">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 font-medium rounded-lg"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow transition disabled:opacity-70"
                            >
                                {processing ? 'Mengirim...' : 'Kirim Sekarang'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}