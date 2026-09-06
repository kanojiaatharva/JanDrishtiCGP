import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { officerApi } from '../../api/officer';
import type { DemandCluster } from '../../types';
import { MapPin, TrendingUp, ArrowUpRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const OfficerHotspots: React.FC = () => {
    const navigate = useNavigate();
    const [clusters, setClusters] = useState<DemandCluster[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        officerApi.getClusters()
            .then(setClusters)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-purple-600 h-8 w-8" />
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Demand Hotspots</h1>
                    <p className="text-sm text-gray-500 mt-1">AI-clustered civic issues • {clusters.length} active clusters</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {clusters.map((c, i) => {
                    const score = Math.round(c.priorityScore || 0);
                    const isCritical = score >= 80;
                    return (
                        <motion.div
                            key={c.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            onClick={() => navigate(`/officer/clusters/${c.id}`)}
                            className="bg-white rounded-2xl border border-gray-200 p-5 cursor-pointer hover:shadow-md hover:border-purple-200 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-1">
                                        <MapPin size={14} />
                                        <span className="font-medium">{c.ward}</span>
                                    </div>
                                    <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full"
                                        style={{ background: '#ede9fe', color: '#6d28d9' }}>
                                        {(c.subcategory || c.category)?.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 mb-1">Priority Score</p>
                                    <p className={`text-3xl font-black ${isCritical ? 'text-red-600' : 'text-gray-800'}`}>{score}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 py-3 border-y border-gray-100 mb-4 text-center">
                                <div>
                                    <p className="text-xs text-gray-400">Reports</p>
                                    <p className="font-bold text-gray-900 text-lg">{(c.reportCount || 0).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Growth</p>
                                    <p className="font-bold text-green-600 text-lg flex items-center justify-center gap-0.5">
                                        <TrendingUp size={14} /> {Math.round(c.growthRate || 0)}%
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Urgency</p>
                                    <p className={`font-bold text-lg ${isCritical ? 'text-red-600' : 'text-orange-500'}`}>
                                        {Math.round(c.urgencyScore || 0)}
                                    </p>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 line-clamp-2 mb-3">{c.summary}</p>

                            <div className="flex justify-end">
                                <span className="flex items-center gap-1 text-xs font-semibold text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Details <ArrowUpRight size={12} />
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default OfficerHotspots;
