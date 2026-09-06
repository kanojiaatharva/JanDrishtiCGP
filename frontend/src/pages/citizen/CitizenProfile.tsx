import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Phone, Globe, Mail, Bell } from 'lucide-react';
import { notificationsApi } from '../../api/notifications';
import { useState, useEffect } from 'react';
import type { Notification } from '../../types';

const CitizenProfile: React.FC = () => {
    const { user, logout } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        notificationsApi.getAll().then(setNotifications).catch(console.error);
    }, []);

    const unread = notifications.filter(n => !n.read).length;

    const typeIcon: Record<string, string> = {
        AI_COMPLETE: '🤖', STATUS_UPDATE: '📋', ACTION_APPROVED: '✅', ALERT: '⚠️', INFO: 'ℹ️'
    };

    return (
        <div className="px-5 py-6 space-y-5">
            {/* Avatar */}
            <div className="flex flex-col items-center py-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="h-20 w-20 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-3"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                    {user?.name?.charAt(0) || 'U'}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                <span className="mt-1 text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700 capitalize">
                    {user?.role?.toLowerCase()}
                </span>
            </div>

            {/* Info card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {[
                    { icon: Mail, label: 'Email', value: user?.email },
                    { icon: Phone, label: 'Phone', value: user?.phone || '—' },
                    { icon: Globe, label: 'Language', value: user?.preferredLanguage === 'hi' ? 'हिंदी' : 'English' },
                ].map(({ icon: Icon, label, value }, i) => (
                    <div key={label} className={`flex items-center gap-4 px-5 py-4 ${i !== 0 ? 'border-t border-gray-50' : ''}`}>
                        <div className="h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                            <Icon size={18} className="text-purple-500" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">{label}</p>
                            <p className="text-sm font-medium text-gray-800">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bell size={16} className="text-gray-500" />
                        <p className="font-semibold text-gray-900 text-sm">Notifications</p>
                    </div>
                    {unread > 0 && (
                        <span className="text-xs font-bold bg-purple-600 text-white px-2 py-0.5 rounded-full">{unread} new</span>
                    )}
                </div>
                <div className="divide-y divide-gray-50 max-h-52 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <p className="text-center text-sm text-gray-400 py-6">No notifications</p>
                    ) : notifications.map(n => (
                        <div key={n.id} className={`px-5 py-3 flex items-start gap-3 ${!n.read ? 'bg-purple-50/30' : ''}`}>
                            <span className="text-lg mt-0.5">{typeIcon[n.type] || '📌'}</span>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Logout */}
            <button onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-red-100 text-red-600 rounded-2xl font-semibold text-sm hover:bg-red-50 transition-colors">
                <LogOut size={18} /> Sign Out
            </button>
        </div>
    );
};

export default CitizenProfile;
