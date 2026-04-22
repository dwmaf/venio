import { useForm } from '@inertiajs/react';

export default function ImportPeserta({ isOpen, onClose, eventId }) {
    const csvForm = useForm({
        csv_file: null,
        event_id: eventId, // ID event agar peserta masuk ke event yang tepat
    });

    // Form untuk URL Spreadsheet
    const sheetForm = useForm({
        sheet_url: '',
        event_id: eventId,
    });
    if (!isOpen) return null;

    const submitCsv = (e) => {
        e.preventDefault();
        csvForm.post(route('peserta.import'), {
            onSuccess: () => {
                csvForm.reset();
                onClose();
            },
        });
    };

    const submitSheet = (e) => {
        e.preventDefault();
        sheetForm.post(route('peserta.import-sheet'), {
            onSuccess: () => {
                sheetForm.reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-default/50 px-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral/30 flex justify-between items-center">
                    <h2 className="text-xl font-['Plus_Jakarta_Sans'] leading-none text-default font-medium">Import Data Peserta</h2>
                    <button onClick={onClose} className="text-xl leading-none cursor-pointer">✕</button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Area Upload CSV */}
                        <div className='space-y-4'>
                            <h3 className="text-lg font-semibold font-['Plus_Jakarta_Sans'] leading-none">Upload CSV</h3>
                            <form onSubmit={submitCsv} className="space-y-4">
                                <div>
                                    <input
                                        type="file"
                                        accept=".csv,text/csv"
                                        onChange={e => csvForm.setData('csv_file', e.target.files[0])}
                                        className="w-full font-['Plus_Jakarta_Sans'] border border-neutral/30 rounded-lg p-2 text-sm"
                                        required
                                    />
                                    {csvForm.errors.csv_file && <span className="text-red-600 text-xs mt-1">{csvForm.errors.csv_file}</span>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={csvForm.processing}
                                    className="w-full flex items-center justify-center rounded-lg bg-blue-50 p-3 gap-2 cursor-pointer"
                                >
                                    <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none text-blue-700">
                                        {csvForm.processing ? 'Mengimpor...' : 'Import CSV'}
                                    </span>
                                </button>
                            </form>
                            <p className="font-['Plus_Jakarta_Sans'] leading-none text-xs text-neutral">Gunakan CSV hasil ekspor dari tab Form Responses.</p>
                        </div>

                        {/* Area Import Google Sheet */}
                        <div className='space-y-4'>
                            <h3 className="text-lg font-semibold font-['Plus_Jakarta_Sans'] leading-none">Import dari Spreadsheet</h3>
                            <form onSubmit={submitSheet} className="space-y-4">
                                <div>
                                    <input
                                        type="url"
                                        placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                                        value={sheetForm.data.sheet_url}
                                        onChange={e => sheetForm.setData('sheet_url', e.target.value)}
                                        className="w-full font-['Plus_Jakarta_Sans'] border border-neutral/30 rounded-lg p-2 text-sm"
                                    />
                                    {sheetForm.errors.sheet_url && <span className="text-red-600 text-xs mt-1">{sheetForm.errors.sheet_url}</span>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={sheetForm.processing}
                                    className="w-full flex items-center justify-center rounded-lg border border-neutral/30 p-3 gap-2 cursor-pointer"
                                >
                                    <span className="font-['Plus_Jakarta_Sans'] font-normal text-base leading-none text-neutral">
                                        {sheetForm.processing ? 'Mengimpor...' : 'Import Link Spreadsheet'}
                                    </span>
                                </button>
                            </form>
                            <p className="font-['Plus_Jakarta_Sans'] leading-none text-xs text-neutral">Jika dikosongkan, sistem memakai GOOGLE_SHEET_URL dari konfigurasi asli server (.env).</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}