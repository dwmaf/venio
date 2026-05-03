import { useForm } from '@inertiajs/react';
import { IconFluentSend24Filled } from "@/Components/Icons";

export default function SendQRIndividual({ participant, onClose }) {
    const { post, processing } = useForm();
    if (!participant) return null;

    const submit = (e) => {
        e.preventDefault();
        post(route('peserta.send-qr', participant.id), {
            onSuccess: () => {
                onClose();
            },
            preserveScroll: true,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-default/50 px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral/30 flex justify-between items-center">
                    <h4 className="text-xl font-['Plus_Jakarta_Sans'] leading-none text-default font-medium">Kirim QR</h4>
                    <button onClick={onClose} className=" text-xl leading-none cursor-pointer">✕</button>
                </div>
                
                <div className="p-6 space-y-6">
                    <p className="text-sm font-['Plus_Jakarta_Sans'] leading-none font-normal">
                        Kirim QR ke email <span className="font-bold ">{participant.email_primary}</span> atas nama <span className="font-bold ">{participant.nama_lengkap}</span>?
                    </p>
                    
                    <form onSubmit={submit}>
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
                                <IconFluentSend24Filled className='w-5 h-5 text-blue-700'/>
                                <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none text-blue-700">
                                {processing ? 'Mengirim...' : 'Kirim Sekarang'}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}