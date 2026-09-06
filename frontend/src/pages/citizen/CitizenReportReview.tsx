import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { MapPin, AlertTriangle, Tag, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const urgencyLabel: Record<number, string> = { 1: 'Low', 2: 'Medium', 3: 'High', 4: 'Critical' };
const urgencyColor: Record<number, string> = {
    1: 'bg-green-100 text-green-700',
    2: 'bg-yellow-100 text-yellow-700',
    3: 'bg-red-100 text-red-700',
    4: 'bg-red-200 text-red-800',
};

const CitizenReportReview: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [confirmed, setConfirmed] = useState(false);

    const report = location.state?.report;
    if (!report) return <Navigate to="/citizen" replace />;

    const urgencyNum: number = typeof report.urgency === 'number' ? report.urgency : 3;

    if (confirmed) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center px-6 py-16 text-center"
            >
                {/* Green check circle */}
                <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircle className="h-14 w-14 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
                <p className="text-gray-500 mb-8">Your report has been submitted successfully.</p>

                <div className="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 mb-8 w-full">
                    <p className="text-xs text-gray-400 mb-1">Your Report ID</p>
                    <p className="text-lg font-bold font-mono text-purple-700">{report.reportCode}</p>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <button
                        onClick={() => navigate('/citizen/reports')}
                        className="w-full py-3.5 rounded-2xl text-white font-semibold"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                    >
                        Track Status
                    </button>
                    <button onClick={() => navigate('/citizen')}
                        className="w-full py-3.5 border border-gray-200 rounded-2xl text-gray-600 font-medium">
                        Back to Home
                    </button>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="px-5 py-6">
            <button onClick={() => navigate('/citizen')} className="flex items-center text-purple-600 text-sm font-medium mb-5">
                ← Back
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-5">Report Summary</h2>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-5">
                <div className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                        <Tag size={18} className="text-gray-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-semibold">Issue</p>
                            <p className="text-gray-900 font-medium mt-0.5">
                                {report.category?.replace(/_/g, ' ') || 'General Issue'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-gray-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-semibold">Location</p>
                            <p className="text-gray-900 font-medium mt-0.5">
                                {report.ward || 'Village X, Ward 4'}{report.district ? `, ${report.district}` : ''}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <AlertTriangle size={18} className="text-gray-400 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs text-gray-400 uppercase font-semibold">Urgency</p>
                            <span className={`inline-block mt-1 text-sm font-semibold px-3 py-1 rounded-full ${urgencyColor[urgencyNum]}`}>
                                {urgencyLabel[urgencyNum] || 'High'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 px-5 py-4">
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Description</p>
                    <p className="text-gray-800 text-sm leading-relaxed">{report.originalText}</p>
                </div>

                {report.aiConfidence && (
                    <div className="border-t border-gray-100 px-5 py-3 flex justify-between items-center">
                        <span className="text-xs text-gray-400">AI Confidence</span>
                        <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                            {Math.round(report.aiConfidence * 100)}%
                        </span>
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                <button onClick={() => navigate('/citizen')}
                    className="flex-1 py-3.5 border border-gray-200 rounded-2xl text-gray-600 font-medium text-sm">
                    Cancel
                </button>
                <button
                    onClick={() => setConfirmed(true)}
                    className="flex-1 py-3.5 rounded-2xl text-white font-semibold text-sm"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                >
                    Submit Report
                </button>
            </div>
        </div>
    );
};

export default CitizenReportReview;
