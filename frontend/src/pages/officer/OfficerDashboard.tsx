import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { officerApi } from '../../api/officer';
import type { DemandCluster } from '../../types';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const OfficerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState<any>(null);
    const [clusters, setClusters] = useState<DemandCluster[]>([]);

    useEffect(() => {
        officerApi.getSummary().then(setSummary).catch(console.error);
        officerApi.getClusters().then(setClusters).catch(console.error);
    }, []);
    const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#e5e7eb'];

    const categories = useMemo(() => {
        if (!summary?.categoryBreakdown || summary.categoryBreakdown.length === 0) {
            return [
                { label: 'Water', pct: 42, color: '#6366f1' },
                { label: 'Roads', pct: 28, color: '#22c55e' },
                { label: 'Health', pct: 18, color: '#f59e0b' },
                { label: 'Others', pct: 12, color: '#e5e7eb' },
            ];
        }
        const total = summary.categoryBreakdown.reduce((sum: number, item: any) => sum + item.count, 0);
        return summary.categoryBreakdown.map((item: any, i: number) => ({
            label: item.category.replace(/_/g, ' '),
            pct: total > 0 ? Math.round((item.count / total) * 100) : 0,
            color: colors[i % colors.length]
        })).sort((a: any, b: any) => b.pct - a.pct);
    }, [summary]);

    const gradientStr = useMemo(() => {
        let currentPct = 0;
        const parts = categories.map((c: any) => {
            const start = currentPct;
            currentPct += c.pct;
            return `${c.color} ${start}% ${currentPct}%`;
        });
        return `conic-gradient(${parts.join(', ')})`;
    }, [categories]);
    const topCluster = clusters[0];
    const tableData = clusters.slice(0, 5).map(c => ({
        area: c.ward,
        issue: (c.subcategory || c.category)?.replace(/_/g, ' '),
        score: c.priorityScore ? Math.round(c.priorityScore) : 0,
        reason: c.summary?.split('.')[0] || 'High demand',
        id: c.id,
    }));

    // Clusters with coordinates for the map
    const mappableClusters = clusters.filter(c => c.latitude && c.longitude);

    const getHeatColor = (score: number) => {
        if (score >= 80) return '#ef4444';
        if (score >= 60) return '#f97316';
        if (score >= 40) return '#f59e0b';
        return '#22c55e';
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <h1 className="text-xl font-bold text-gray-900">District Overview</h1>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500 font-medium mb-2">Total Reports</p>
                    <p className="text-4xl font-extrabold text-gray-900 mb-1">
                        {summary?.totalReports?.toLocaleString() ?? '—'}
                    </p>
                    <p className="text-sm font-medium text-green-500">↑ 18% vs last month</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500 font-medium mb-2">High Priority Areas</p>
                    <p className="text-4xl font-extrabold text-gray-900 mb-1">{summary?.totalClusters ?? '—'}</p>
                    <p className="text-sm font-medium text-green-500">↑ 27% vs last month</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border border-gray-200 p-5">
                    <p className="text-sm text-gray-500 font-medium mb-3">Categories</p>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full shrink-0" style={{
                            background: gradientStr
                        }} />
                        <div className="space-y-1.5">
                            {categories.map((c: any) => (
                                <div key={c.label} className="flex items-center gap-2 text-xs text-gray-600">
                                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                                    {c.label}
                                    <span className="ml-auto font-semibold text-gray-800">{c.pct}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Map + Top Hotspot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Leaflet Real Map */}
                <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-3 border-b border-gray-100 flex justify-between items-center">
                        <p className="font-semibold text-gray-900">Demand Hotspots</p>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">Live Map</span>
                    </div>
                    <div className="h-56">
                        <MapContainer
                            center={[22.7196, 75.8577]}
                            zoom={12}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap'
                            />
                            {mappableClusters.map(c => (
                                <CircleMarker
                                    key={c.id}
                                    center={[c.latitude!, c.longitude!]}
                                    radius={Math.max(12, (c.reportCount || 50) / 30)}
                                    fillColor={getHeatColor(c.priorityScore || 0)}
                                    color="white"
                                    weight={2}
                                    fillOpacity={0.8}
                                    eventHandlers={{ click: () => navigate(`/officer/clusters/${c.id}`) }}
                                >
                                    <Tooltip direction="top" permanent={c.priorityScore > 80}>
                                        <span className="font-semibold">{c.ward}</span><br />
                                        {(c.subcategory || c.category)?.replace(/_/g, ' ')} • Score: {Math.round(c.priorityScore || 0)}
                                    </Tooltip>
                                </CircleMarker>
                            ))}
                        </MapContainer>
                    </div>
                    <div className="px-5 py-2 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                        <span>Low</span>
                        <div className="h-2 flex-1 rounded-full" style={{ background: 'linear-gradient(to right, #22c55e, #f59e0b, #ef4444)' }} />
                        <span>High</span>
                    </div>
                </div>

                {/* Top Hotspot Card */}
                {topCluster && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-5">
                        <p className="text-sm text-gray-500 font-medium mb-4">Top Hotspot</p>
                        <h3 className="text-2xl font-extrabold text-gray-900">{topCluster.ward}</h3>
                        <p className="text-gray-500 font-medium mt-1 mb-3">
                            {(topCluster.subcategory || topCluster.category)?.replace(/_/g, ' ')}
                        </p>
                        <span className="text-xs font-bold bg-red-100 text-red-700 px-3 py-1 rounded-full">High</span>
                        <div className="mt-4 space-y-2">
                            <div className="text-sm text-gray-500">{(topCluster.reportCount || 0).toLocaleString()} Reports</div>
                            <div className="text-green-600 text-sm font-medium">↑ {Math.round(topCluster.growthRate || 0)}% this month</div>
                        </div>
                        <button onClick={() => navigate(`/officer/clusters/${topCluster.id}`)}
                            className="mt-5 w-full py-2.5 border-2 border-purple-200 text-purple-700 rounded-xl text-sm font-semibold hover:bg-purple-50 transition-colors">
                            View Details
                        </button>
                    </div>
                )}
            </div>

            {/* Priority Recommendations Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">Top Priority Recommendations</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-5 py-3 text-left font-medium">Area</th>
                                <th className="px-5 py-3 text-left font-medium">Issue</th>
                                <th className="px-5 py-3 text-left font-medium">Priority Score</th>
                                <th className="px-5 py-3 text-left font-medium">Reason</th>
                                <th className="px-5 py-3 text-left font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {tableData.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3.5 font-medium text-gray-900">
                                        <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-400" />{row.area}</div>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-600">{row.issue}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`font-bold ${row.score >= 80 ? 'text-red-600' : row.score >= 60 ? 'text-orange-500' : 'text-gray-700'}`}>
                                            {row.score} / 100
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-gray-500 max-w-xs truncate">{row.reason}</td>
                                    <td className="px-5 py-3.5">
                                        <button onClick={() => navigate(`/officer/clusters/${row.id}`)}
                                            className="flex items-center gap-1 text-xs font-semibold border border-green-200 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">
                                            Review <ArrowUpRight size={12} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OfficerDashboard;
