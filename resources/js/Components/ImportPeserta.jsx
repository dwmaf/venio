import { useForm } from '@inertiajs/react';

export default function ImportPeserta({ isOpen, onClose, eventId }) {
    if (!isOpen) return null;

    // Form untuk Upload CSV
    const csvForm = useForm({
        csv_file: null,
        event_id: eventId, // ID event agar peserta masuk ke event yang tepat
    });

    // Form untuk URL Spreadsheet
    const sheetForm = useForm({
        sheet_url: '',
        event_id: eventId,
    });

    const submitCsv = (e) => {
        e.preventDefault();
        csvForm.post(route('inertia.peserta.import'), {
            onSuccess: () => {
                csvForm.reset();
                onClose();
            },
        });
    };

    const submitSheet = (e) => {
        e.preventDefault();
        sheetForm.post(route('inertia.peserta.import-sheet'), {
            onSuccess: () => {
                sheetForm.reset();
                onClose();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Import Data Peserta</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-semibold leading-none">&times;</button>
                </div>
                
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Area Upload CSV */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload CSV</h3>
                            <form onSubmit={submitCsv} className="space-y-4">
                                <div>
                                    <input 
                                        type="file" 
                                        accept=".csv,text/csv"
                                        onChange={e => csvForm.setData('csv_file', e.target.files[0])}
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        required
                                    />
                                    {csvForm.errors.csv_file && <span className="text-red-600 text-xs mt-1">{csvForm.errors.csv_file}</span>}
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={csvForm.processing}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition disabled:opacity-70 text-sm"
                                >
                                    {csvForm.processing ? 'Mengimpor...' : 'Import CSV'}
                                </button>
                            </form>
                            <p className="text-xs text-gray-500 mt-3">Gunakan CSV hasil ekspor dari tab Form Responses.</p>
                        </div>

                        {/* Area Import Google Sheet */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Import dari Spreadsheet</h3>
                            <form onSubmit={submitSheet} className="space-y-4">
                                <div>
                                    <input 
                                        type="url" 
                                        placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                                        value={sheetForm.data.sheet_url}
                                        onChange={e => sheetForm.setData('sheet_url', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                    {sheetForm.errors.sheet_url && <span className="text-red-600 text-xs mt-1">{sheetForm.errors.sheet_url}</span>}
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={sheetForm.processing}
                                    className="w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg shadow-sm transition disabled:opacity-70 text-sm"
                                >
                                    {sheetForm.processing ? 'Mengimpor...' : 'Import Link Spreadsheet'}
                                </button>
                            </form>
                            <p className="text-xs text-gray-500 mt-3">Jika dikosongkan, sistem memakai GOOGLE_SHEET_URL dari konfigurasi asli server (.env).</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}