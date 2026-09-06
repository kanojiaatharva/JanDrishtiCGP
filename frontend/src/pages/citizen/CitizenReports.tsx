import React, { useEffect, useState } from 'react';
import { reportsApi } from '../../api/reports';
import type { Report } from '../../types';
import { Loader2, MapPin, Calendar, Clock, CheckCircle2, Loader, AlertCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    SUBMITTED: { label: 'Submitted', color: 'bg-gray-100 text-gray-700', icon: <Clock size={12} /> },
    AI_PROCESSED: { label: 'AI Analysed', color: 'bg-blue-100 text-blue-700', icon: <FileText size={12} /> },
    UNDER_REVIEW: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-700', icon: <Loader size={12} /> },
    ACTION_APPROVED: { label: 'Action Approved', color: 'bg-indigo-100 text-indigo-700', icon: <CheckCircle2 size={12} /> },
    ACTION_IN_PROGRESS: { label: 'In Progress', color: 'bg-orange-100 text-orange-700', icon: <Loader size={12} /> },
    RESOLVED: { label: 'Resolved ✓', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 size={12} /> },
    REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: <AlertCircle size={12} /> },
};

const PIPELINE = ['SUBMITTED', 'AI_PROCESSED', 'UNDER_REVIEW', 'ACTION_APPROVED', 'ACTION_IN_PROGRESS', 'RESOLVED'];

const CitizenReports: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        reportsApi.getMyReports()
            .then(setReports)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-purple-600 h-8 w-8" />
        </div>
    );

    if (reports.length === 0) return (
        <div className="text-center px-6 py-16">
            <div className="h-16 w-16 rounded-full bg-purple-50 flex items-center justify-center mx-auto mb-4">
                <FileText size={28} className="text-purple-400" />
            </div>
            <p className="text-gray-500 font-medium">No reports submitted yet.</p>
            <p className="text-gray-400 text-sm mt-1">Go to Home and tap the mic to report an issue.</p>
        </div>
    );

    return (
        <div className="px-5 py-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900">My Reports</h2>
            {reports.map((report, i) => {
                const meta = STATUS_META[report.status] || STATUS_META.SUBMITTED;
                const pipelineIdx = PIPELINE.indexOf(report.status);
                return (
                    <motion.div key={report.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-xs font-mono text-gray-400">{report.reportCode}</span>
                            <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${meta.color}`}>
                                {meta.icon} {meta.label}
                            </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-base mb-1">
                            {report.category?.replace(/_/g, ' ') || 'Civic Issue'}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                            <span className="flex items-center gap-1"><MapPin size={12} />{report.ward || 'Unknown'}</span>
                            <span className="flex items-center gap-1"><Calendar size={12} />{new Date(report.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>

                        {/* Progress pipeline */}
                        <div className="relative">
                            <div className="flex justify-between mb-1">
                                {PIPELINE.slice(0, 5).map((step, si) => (
                                    <div key={step} className={`h-1.5 flex-1 mx-0.5 rounded-full transition-all ${si <= pipelineIdx ? 'bg-purple-500' : 'bg-gray-100'}`} />
                                ))}
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-400 px-0.5">
                                <span>Submitted</span>
                                <span>AI</span>
                                <span>Review</span>
                                <span>Approved</span>
                                <span>Resolved</span>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default CitizenReports;
