import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, FileText, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CitizenLayout: React.FC = () => {
    const location = useLocation();
    const { user } = useAuth();

    const navItems = [
        { path: '/citizen', icon: Home, label: 'Home' },
        { path: '/citizen/reports', icon: FileText, label: 'My Reports' },
        { path: '/citizen/profile', icon: User, label: 'Profile' },
    ];

    return (
        <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto relative shadow-xl">
            {/* Purple Header */}
            <header className="text-white px-5 pt-12 pb-6" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-purple-200 text-sm font-medium">नमस्ते, {user?.name?.split(' ')[0]} 👋</p>
                        <p className="text-white/80 text-xs mt-0.5">How can we help your community today?</p>
                    </div>
                    <div className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium border border-white/30">
                        Hindi ▾
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-24">
                <Outlet />
            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 flex justify-around py-2 shadow-lg">
                {navItems.map(({ path, icon: Icon, label }) => {
                    const active = location.pathname === path || (path !== '/citizen' && location.pathname.startsWith(path));
                    return (
                        <Link key={path} to={path} className={`flex flex-col items-center px-6 py-1.5 rounded-xl transition-all ${active ? 'text-purple-600' : 'text-gray-400'}`}>
                            <Icon size={22} className={active ? 'stroke-[2.5px]' : ''} />
                            <span className="text-xs mt-0.5 font-medium">{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default CitizenLayout;
