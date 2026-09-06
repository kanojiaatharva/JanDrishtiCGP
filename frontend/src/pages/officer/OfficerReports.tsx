import React, { useEffect, useState } from 'react';
import { Loader2, MapPin, Calendar, Search, Filter } from 'lucide-react';
import api from '../../api/axios';
import type { Report } from '../../types';

const STATUS_COLORS: Record<string, string> = {
    SUBMITTED: 'bg-gray-100 text-gray-700',
    AI_PROCESSED: 'bg-blue-100 text-blue-700',
    UNDER_REVIEW: 'bg-yellow-100 text-yellow-700',
    ACTION_APPROVED: 'bg-indigo-100 text-indigo-700',
    ACTION_IN_PROGRESS: 'bg-orange-100 text-orange-700',
    RESOLVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
};

const OfficerReports: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [filtered, setFiltered] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        api.get<Report[]>('/officer/reports')
            .then(r => { setReports(r.data); setFiltered(r.data); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        let result = reports;
        if (statusFilter !== 'ALL') result = result.filter(r => r.status === statusFilter);
        if (search) result = result.filter(r =>
            r.reportCode?.toLowerCase().includes(search.toLowerCase()) ||
            r.category?.toLowerCase().includes(search.toLowerCase()) ||
            r.ward?.toLowerCase().includes(search.toLowerCase())
        );
        setFiltered(result);
    }, [search, statusFilter, reports]);

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-purple-600 h-8 w-8" /></div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-gray-900">All Reports <span className="text-gray-400 font-normal text-base">({filtered.length})</span></h1>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-5 flex-wrap">
                <div className="relative flex-1 min-w-48">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
                        placeholder="Search by code, category, ward..." />
                </div>
                <div className="relative">
                    <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none appearance-none bg-white">
                        <option value="ALL">All Status</option>
                        <option value="SUBMITTED">Submitted</option>
                        <option value="AI_PROCESSED">AI Processed</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="ACTION_APPROVED">Action Approved</option>
                        <option value="ACTION_IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                    <p className="text-gray-500">No reports match your filters.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3 text-left font-medium">Report Code</th>
                                    <th className="px-5 py-3 text-left font-medium">Category</th>
                                    <th className="px-5 py-3 text-left font-medium">Location</th>
                                    <th className="px-5 py-3 text-left font-medium">Urgency</th>
                                    <th className="px-5 py-3 text-left font-medium">Status</th>
                                    <th className="px-5 py-3 text-left font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((r) => (
                                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{r.reportCode}</td>
                                        <td className="px-5 py-3.5 font-medium text-gray-900">{r.category?.replace(/_/g, ' ')}</td>
                                        <td className="px-5 py-3.5 text-gray-600 flex items-center gap-1">
                                            <MapPin size={13} className="text-gray-400" />{r.ward || '—'}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.urgency && r.urgency >= 3 ? 'bg-red-100 text-red-700' : r.urgency === 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                                                {r.urgency === 3 ? 'High' : r.urgency === 2 ? 'Medium' : r.urgency === 1 ? 'Low' : '—'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[r.status] || 'bg-gray-100 text-gray-600'}`}>
                                                {r.status?.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-500 flex items-center gap-1">
                                            <Calendar size={13} className="text-gray-400" />
                                            {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfficerReports;
