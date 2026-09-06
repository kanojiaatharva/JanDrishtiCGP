import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, FileText, Activity, Settings, LogOut, Bell, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { notificationsApi } from '../api/notifications';
import type { Notification } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const OfficerLayout: React.FC = () => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifs, setShowNotifs] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        notificationsApi.getAll().then(setNotifications).catch(console.error);
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setShowNotifs(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAllRead = async () => {
        await notificationsApi.markAllRead();
        setNotifications(ns => ns.map(n => ({ ...n, read: true })));
    };

    const navItems = [
        { path: '/officer', icon: LayoutDashboard, label: 'Overview', exact: true },
        { path: '/officer/hotspots', icon: Map, label: 'Demand Hotspots' },
        { path: '/officer/reports', icon: FileText, label: 'Reports' },
        { path: '/officer/priority', icon: Activity, label: 'Priority Areas' },
    ];

    const isActive = (path: string, exact?: boolean) =>
        exact ? location.pathname === path : location.pathname === path || location.pathname.startsWith(path + '/');

    const typeIcon: Record<string, string> = {
        CRITICAL: '🚨', ALERT: '⚠️', REPORT: '📊', AI_COMPLETE: '🤖', STATUS_UPDATE: '📋', ACTION_APPROVED: '✅'
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            {/* Sidebar */}
            <aside className={`hidden md:flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}
                style={{ background: '#1e2a3b', minHeight: '100vh' }}>
                <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${collapsed ? 'justify-center' : ''}`}>
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>JD</div>
                    {!collapsed && (
                        <div>
                            <p className="text-white font-bold text-sm leading-tight">JanDrishti</p>
                            <p className="text-blue-300 text-xs">Officer Portal</p>
                        </div>
                    )}
                </div>

                <nav className="flex-1 px-2 py-4 space-y-1">
                    {navItems.map(({ path, icon: Icon, label, exact }) => {
                        const active = isActive(path, exact);
                        return (
                            <Link key={path} to={path} title={collapsed ? label : undefined}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${active ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                                style={active ? { background: 'rgba(124,58,237,0.25)', color: '#c4b5fd' } : {}}>
                                <Icon size={20} className="shrink-0" />
                                {!collapsed && <span className="text-sm font-medium">{label}</span>}
                                {!collapsed && active && <ChevronRight size={14} className="ml-auto opacity-60" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-2 pb-4 space-y-1 border-t border-white/10 pt-3">
                    <button onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-all text-sm">
                        <Settings size={18} className="shrink-0" />
                        {!collapsed && <span>{collapsed ? 'Expand' : 'Collapse'}</span>}
                    </button>
                    <button onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 rounded-xl hover:bg-red-500/10 transition-all text-sm">
                        <LogOut size={18} className="shrink-0" />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shrink-0">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">District X <span className="text-gray-400 font-normal text-sm">▾</span></h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">May 2024 ▾</span>

                        {/* Notification Bell */}
                        <div ref={notifRef} className="relative">
                            <button onClick={() => setShowNotifs(!showNotifs)}
                                className="relative text-gray-500 hover:text-gray-900 transition-colors">
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            <AnimatePresence>
                                {showNotifs && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                        className="absolute right-0 top-9 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden"
                                    >
                                        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                                            <p className="font-semibold text-gray-900 text-sm">Notifications</p>
                                            <div className="flex items-center gap-3">
                                                {unreadCount > 0 && (
                                                    <button onClick={handleMarkAllRead}
                                                        className="text-xs text-purple-600 font-medium hover:underline">
                                                        Mark all read
                                                    </button>
                                                )}
                                                <button onClick={() => setShowNotifs(false)}>
                                                    <X size={16} className="text-gray-400 hover:text-gray-700" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                                            {notifications.length === 0 ? (
                                                <p className="text-center text-sm text-gray-400 py-8">No notifications</p>
                                            ) : (
                                                notifications.map(n => (
                                                    <div key={n.id}
                                                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${!n.read ? 'bg-purple-50/40' : ''}`}
                                                        onClick={async () => {
                                                            if (!n.read) {
                                                                await notificationsApi.markRead(n.id);
                                                                setNotifications(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x));
                                                            }
                                                        }}>
                                                        <div className="flex items-start gap-2">
                                                            <span className="text-base mt-0.5">{typeIcon[n.type] || '📌'}</span>
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-sm font-medium truncate ${!n.read ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</p>
                                                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                                                            </div>
                                                            {!n.read && <span className="h-2 w-2 rounded-full bg-purple-500 shrink-0 mt-1.5" />}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center">
                            {user?.name?.charAt(0) || 'O'}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto bg-gray-50">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default OfficerLayout;
