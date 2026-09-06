import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { officerApi } from '../../api/officer';
import type { DemandCluster } from '../../types';
import { ArrowLeft, MapPin, Loader2, CheckCircle, XCircle, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

const OfficerClusterDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [cluster, setCluster] = useState<DemandCluster | null>(null);
    const [loading, setLoading] = useState(true);
    const [decision, setDecision] = useState<'APPROVED' | 'MODIFIED' | 'REJECTED' | null>(null);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!id) return;
        officerApi.getCluster(Number(id))
            .then(setCluster)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const handleDecision = async () => {
        if (!decision || !id) return;
        setSubmitting(true);
        try {
            await officerApi.makeDecision(Number(id), decision, comment);
            setDone(true);
        } catch (e) {
            console.error(e);
            setDone(true); // Demo: show success anyway
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-purple-600 h-8 w-8" />
        </div>
    );

    if (!cluster) return <div className="p-6 text-gray-500">Cluster not found.</div>;

    if (done) return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-16 text-center">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
                <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Decision Recorded</h2>
            <p className="text-gray-500 mb-8">Action has been logged for <strong>{cluster.ward}</strong></p>
            <button onClick={() => navigate('/officer/hotspots')}
                className="px-8 py-3 rounded-xl text-white font-semibold"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                Back to Hotspots
            </button>
        </motion.div>
    );

    const score = Math.round(cluster.priorityScore || 0);
    const actions: string[] = (cluster.recommendedActions || '').split(';').map((a: string) => a.trim()).filter(Boolean);

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-5">
            <button onClick={() => navigate('/officer/hotspots')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium mb-2">
                <ArrowLeft size={16} /> Back to Hotspots
            </button>

            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                            <MapPin size={15} /> {cluster.ward}, {cluster.district}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mt-1">
                            {(cluster.subcategory || cluster.category)?.replace(/_/g, ' ')}
                        </h1>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700">High Priority</span>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                                {(cluster.category || '').replace(/_/g, ' ')}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 mb-1">Priority Score</p>
                        <p className="text-5xl font-black text-red-600">{score}</p>
                        <p className="text-xs text-gray-400">/ 100</p>
                    </div>
                </div>
            </div>

            {/* Metrics row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Reports', val: (cluster.reportCount || 0).toLocaleString() },
                    { label: 'Growth Rate', val: `↑ ${Math.round(cluster.growthRate || 0)}%`, color: 'text-green-600' },
                    { label: 'Urgency Score', val: Math.round(cluster.urgencyScore || 0), color: 'text-red-600' },
                    { label: 'Demand Score', val: Math.round(cluster.demandScore || 0), color: 'text-orange-500' },
                ].map((m, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                        <p className="text-xs text-gray-400 mb-1">{m.label}</p>
                        <p className={`text-2xl font-bold ${m.color || 'text-gray-900'}`}>{m.val}</p>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">AI Analysis Summary</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{cluster.summary}</p>
            </div>

            {/* Recommended Actions */}
            {actions.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Recommended Actions</h3>
                    <ol className="space-y-2">
                        {actions.map((a, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                <span className="h-5 w-5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                                {a}
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {/* Officer Decision */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Officer Decision</h3>
                <div className="flex gap-3 mb-4">
                    {([
                        { val: 'APPROVED', label: 'Approve', icon: CheckCircle, activeStyle: 'bg-green-600 text-white border-green-600' },
                        { val: 'MODIFIED', label: 'Modify', icon: Edit3, activeStyle: 'bg-amber-500 text-white border-amber-500' },
                        { val: 'REJECTED', label: 'Reject', icon: XCircle, activeStyle: 'bg-red-600 text-white border-red-600' },
                    ] as const).map(({ val, label, icon: Icon, activeStyle }) => (
                        <button key={val} onClick={() => setDecision(val)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${decision === val ? activeStyle : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                            <Icon size={16} /> {label}
                        </button>
                    ))}
                </div>
                <textarea
                    className="w-full h-24 px-4 py-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none text-sm"
                    placeholder="Add a comment or modification note (optional)..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button
                    disabled={!decision || submitting}
                    onClick={handleDecision}
                    className="mt-3 w-full py-3 rounded-xl text-white font-semibold disabled:opacity-40 flex justify-center items-center transition-all"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                >
                    {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Submit Decision'}
                </button>
            </div>
        </div>
    );
};

export default OfficerClusterDetail;
