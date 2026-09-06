import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/auth';
import api from '../api/axios';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSeedLoading, setIsSeedLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await authApi.login(email, password);
            login(response);
            navigate(response.user.role === 'OFFICER' ? '/officer' : '/citizen');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials. Click a demo button first.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadDemo = async (role: 'citizen' | 'officer') => {
        setIsSeedLoading(true);
        setError('');
        try {
            await api.post('/demo/seed');
        } catch { /* already seeded is fine */ }
        setEmail(role === 'citizen' ? 'citizen@demo.com' : 'officer@demo.com');
        setPassword('password');
        setIsSeedLoading(false);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left — Citizen side */}
            <div className="hidden lg:flex flex-1 flex-col justify-center items-center"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center text-white px-12"
                >
                    <div className="text-6xl mb-6">🎙️</div>
                    <h2 className="text-4xl font-bold mb-4">जन दृष्टि</h2>
                    <p className="text-xl opacity-80 mb-2">JanDrishti</p>
                    <p className="text-lg opacity-70">AI-Powered Civic Intelligence Platform</p>
                    <div className="mt-12 text-left bg-white/10 rounded-2xl p-6">
                        <p className="text-sm opacity-80 mb-4 font-medium uppercase tracking-wider">Citizen App</p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3"><span className="text-green-300">✓</span><span>Voice or text complaint in Hindi / English</span></div>
                            <div className="flex items-center gap-3"><span className="text-green-300">✓</span><span>AI instantly categorizes & extracts location</span></div>
                            <div className="flex items-center gap-3"><span className="text-green-300">✓</span><span>Real-time tracking of your report status</span></div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right — Login form */}
            <div className="flex-1 flex flex-col justify-center items-center bg-white px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-sm"
                >
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
                        <p className="text-gray-500">Sign in to JanDrishti</p>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-xl font-semibold text-white flex justify-center items-center transition-all"
                            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                        >
                            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign in'}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400 font-medium">Quick Demo Access</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                disabled={isSeedLoading}
                                onClick={() => handleLoadDemo('citizen')}
                                className="flex-1 py-2.5 border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                            >
                                {isSeedLoading ? <Loader2 className="animate-spin h-4 w-4 mx-auto" /> : '👤 Citizen'}
                            </button>
                            <button
                                type="button"
                                disabled={isSeedLoading}
                                onClick={() => handleLoadDemo('officer')}
                                className="flex-1 py-2.5 border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                            >
                                {isSeedLoading ? <Loader2 className="animate-spin h-4 w-4 mx-auto" /> : '🏛️ Officer'}
                            </button>
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-3">Click role → then Sign in</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
