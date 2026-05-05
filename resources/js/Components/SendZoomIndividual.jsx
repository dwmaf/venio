import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { IconFluentSend24Filled } from "@/Components/Icons";

export default function SendZoomIndividual({ participant, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        zoom_link: '',
    });

    useEffect(() => {
        if (participant) {
            setData('zoom_link', participant.zoom_link || '');
        } else {
            reset();
        }
    }, [participant]);

    if (!participant) return null;

    const submit = (e) => {
        e.preventDefault();
        post(route('peserta.send-zoom', participant.id), {
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
                    <h4 className="text-xl font-['Plus_Jakarta_Sans'] leading-none text-default font-medium">Kirim Link Zoom</h4>
                    <button onClick={onClose} className=" text-xl leading-none cursor-pointer">✕</button>
                </div>

                <div className="p-6 space-y-6">
                    <p className="text-sm font-['Plus_Jakarta_Sans'] leading-normal font-normal">
                        {participant.zoom_sent_at ? (
                            <>
                                Email Link Zoom sudah pernah dikirim pada <span className="font-bold">{new Date(participant.zoom_sent_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</span>.
                                <br />
                                Anda yakin untuk <span className="font-bold text-blue-700">mengirim ulang</span> Link Zoom ke <span className="font-bold ">{participant.email_primary}</span> atas nama <span className="font-bold ">{participant.nama_lengkap}</span>?
                            </>
                        ) : (
                            <>
                                Kirim Link Zoom ke email <span className="font-bold ">{participant.email_primary}</span> atas nama <span className="font-bold ">{participant.nama_lengkap}</span>?
                            </>
                        )}
                    </p>

                    <form onSubmit={submit}>
                        <div className="mb-4 space-y-2">
                            <label className="block text-sm font-medium text-default font-['Plus_Jakarta_Sans']">Link Zoom</label>
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
                                <IconFluentSend24Filled className='w-5 h-5 text-blue-700'/>
                                <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none text-blue-700">
                                    {processing ? 'Mengirim...' : (participant.zoom_sent_at ? 'Kirim Ulang Sekarang' : 'Kirim Sekarang')}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}