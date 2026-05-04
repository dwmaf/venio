
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import { Head, router } from "@inertiajs/react";
import { useState, useEffect } from 'react';
import { IconFluentMailUnread20Filled } from '@/Components/Icons';
import { SearchInput } from '@/Components/Inputs';
import { route } from "ziggy-js";

export default function MailLogs({ logs, filters }) {
    const activeSearch = filters?.search || "";
    const [search, setSearch] = useState(activeSearch);

    useEffect(() => {
        if (search === activeSearch) return;

        const delayDebounceFn = setTimeout(() => {
            router.get(
                route("mail.logs"),
                { search: search },
                { preserveState: true, replace: true }
            );
        }, 800);

        return () => clearTimeout(delayDebounceFn);
    }, [search, activeSearch]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <AdminLayout title="Mail Logs">
            
            <Head title="Mail Logs" />
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <IconFluentMailUnread20Filled className="h-6 w-6" />
                        Email Delivery Logs
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                        Monitor the status of all sent emails (QR and Zoom links).
                    </p>
                </div>

                <div className="w-full md:w-72">
                    <SearchInput
                        id="search"
                        name="search"
                        placeholder="Cari Nama atau Email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Sent At</th>
                                <th className="px-6 py-4 font-semibold">Recipient</th>
                                <th className="px-6 py-4 font-semibold">Type</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Error Message</th>
                                <th className="px-6 py-4 font-semibold">Triggered By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {logs.data.length > 0 ? (
                                logs.data.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {formatDate(log.sent_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{log.recipient_email}</div>
                                            {log.participant && (
                                                <div className="text-xs text-gray-500 mt-0.5">
                                                    {log.participant.nama_lengkap}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                log.email_type === 'QR_EVENT' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                            }`}>
                                                {log.email_type === 'QR_EVENT' ? 'QR Code' : 'Zoom Link'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                log.status === 'SENT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {log.status === 'FAILED' ? (
                                                <div className="text-red-600 max-w-xs" title={log.error_message}>
                                                    {log.error_message || 'Unknown Error'}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {log.triggered_by}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No email logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {logs.links && logs.links.length > 3 && (
                    <div className="border-t border-gray-100 p-4">
                        <Pagination links={logs.links} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
