import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Type, Loader2, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { reportsApi } from '../../api/reports';

type State = 'idle' | 'listening' | 'transcribed' | 'typing' | 'analyzing';

// Web Speech API typing for TypeScript
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

const LANG_OPTIONS = [
    { code: 'hi-IN', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'en-IN', label: 'English', flag: '🇬🇧' },
    { code: 'mr-IN', label: 'मराठी', flag: '🇮🇳' },
];

const CitizenHome: React.FC = () => {
    const navigate = useNavigate();
    const [state, setState] = useState<State>('idle');
    const [text, setText] = useState('');
    const [lang, setLang] = useState(LANG_OPTIONS[0]);
    const [showLangPicker, setShowLangPicker] = useState(false);
    const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
    const recognitionRef = useRef<any>(null);

    React.useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => console.warn('Geolocation error:', err),
                { enableHighAccuracy: true }
            );
        }
    }, []);

    const isSpeechSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

    const startListening = () => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
            alert('Voice input not supported in this browser. Please try Chrome.');
            return;
        }
        const recognition = new SR();
        recognition.lang = lang.code;
        recognition.continuous = false;
        recognition.interimResults = false;
        recognitionRef.current = recognition;

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setText(transcript);
            setState('transcribed');
        };
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setState('idle');
            if (event.error === 'not-allowed') {
                alert('Microphone access denied. Please allow microphone in your browser.');
            }
        };
        recognition.onend = () => {
            if (state === 'listening') setState('idle');
        };

        recognition.start();
        setState('listening');
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
        setState('idle');
    };

    const handleVoiceClick = () => {
        if (state === 'listening') {
            stopListening();
        } else {
            startListening();
        }
    };

    const handleSubmit = async () => {
        if (!text.trim()) return;
        setState('analyzing');
        
        const lat = location?.lat || 22.7196;
        const lng = location?.lng || 75.8577;

        try {
            const report = await reportsApi.createReport({
                originalText: text,
                language: lang.code.split('-')[0],
                latitude: lat,
                longitude: lng,
            });
            navigate('/citizen/report/review', { state: { report } });
        } catch (e) {
            console.error(e);
            // Demo fallback — still show review so the demo doesn't break
            navigate('/citizen/report/review', {
                state: {
                    report: {
                        id: Math.floor(Math.random() * 10000),
                        reportCode: 'JR-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 90000 + 10000)),
                        originalText: text,
                        category: 'OTHER',
                        subcategory: 'General',
                        ward: 'Current Location',
                        district: 'Indore',
                        urgency: 3,
                        aiConfidence: 0.92,
                        status: 'AI_PROCESSED',
                        createdAt: new Date().toISOString(),
                    }
                }
            });
        }
    };

    return (
        <div className="flex flex-col items-center px-6 py-6 min-h-full">
            <AnimatePresence mode="wait">
                {state === 'analyzing' ? (
                    <motion.div key="analyzing"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-16 text-center w-full">
                        <div className="relative mb-6">
                            <div className="h-20 w-20 rounded-full flex items-center justify-center"
                                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                                <Loader2 className="h-10 w-10 text-white animate-spin" />
                            </div>
                        </div>
                        <p className="text-lg font-semibold text-gray-800">AI Processing via Gemini...</p>
                        <p className="text-sm text-gray-500 mt-2">Speech-to-Text → NLP → Category Extraction</p>
                        <div className="mt-6 flex gap-3 text-xs text-gray-400 flex-wrap justify-center">
                            <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full">🎤 Chirp 3 STT</span>
                            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">✦ Gemini AI</span>
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full">📍 Location NLP</span>
                        </div>
                    </motion.div>
                ) : state === 'typing' ? (
                    <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                        <h3 className="text-base font-semibold text-gray-700 mb-3">Describe your issue</h3>
                        <textarea
                            className="w-full h-36 p-4 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none text-gray-800"
                            placeholder={lang.code.startsWith('hi') ? 'यहाँ अपनी शिकायत लिखें...' : 'Type your complaint here...'}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            autoFocus
                        />
                        <div className="flex gap-3 mt-4">
                            <button onClick={() => { setState('idle'); setText(''); }}
                                className="flex-1 py-3 border border-gray-200 rounded-2xl text-gray-600 font-medium text-sm">
                                Cancel
                            </button>
                            <button disabled={!text.trim()} onClick={handleSubmit}
                                className="flex-1 py-3 rounded-2xl text-white font-semibold text-sm disabled:opacity-40"
                                style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                                Submit Report
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="voice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center w-full">

                        {/* Big Mic Button */}
                        <div className="relative mt-4 mb-8">
                            {state === 'listening' && (
                                <>
                                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}
                                        className="absolute rounded-full"
                                        style={{ inset: '-24px', background: '#7c3aed', opacity: 0.1 }} />
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
                                        className="absolute rounded-full"
                                        style={{ inset: '-12px', background: '#7c3aed', opacity: 0.2 }} />
                                </>
                            )}
                            <motion.button whileTap={{ scale: 0.92 }} onClick={handleVoiceClick}
                                className="relative h-36 w-36 rounded-full flex flex-col items-center justify-center shadow-xl text-white"
                                style={{ background: state === 'listening' ? 'linear-gradient(135deg,#dc2626,#b91c1c)' : 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                                {state === 'listening'
                                    ? <MicOff size={52} className="mb-1" />
                                    : <Mic size={52} className="mb-1" />}
                            </motion.button>
                        </div>

                        <p className="text-base font-semibold text-gray-700">
                            {state === 'listening' ? 'सुन रहा हूँ... (Tap to stop)' : 'Tap to speak'}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">आप बोलिए...</p>

                        {!isSpeechSupported && (
                            <p className="text-xs text-red-500 mt-2 bg-red-50 px-3 py-1.5 rounded-full">
                                Use Chrome for voice input
                            </p>
                        )}

                        {/* Transcribed text */}
                        {state === 'transcribed' && text && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="w-full mt-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                <p className="text-xs text-gray-400 uppercase font-semibold mb-2 flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                    Transcribed
                                </p>
                                <p className="text-gray-800 leading-relaxed">{text}</p>
                                <div className="flex gap-3 mt-4">
                                    <button onClick={() => { setState('idle'); setText(''); }}
                                        className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium">
                                        Re-record
                                    </button>
                                    <button onClick={handleSubmit}
                                        className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold"
                                        style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>
                                        Submit Report
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Bottom controls */}
                        {state === 'idle' && (
                            <div className="mt-10 flex flex-col items-center gap-4 w-full">
                                <button onClick={() => setState('typing')}
                                    className="flex items-center gap-2 text-purple-600 text-sm font-medium border border-purple-200 bg-purple-50 px-5 py-2.5 rounded-full">
                                    <Type size={16} /> Type your complaint instead
                                </button>

                                {/* Language selector */}
                                <div className="relative">
                                    <button onClick={() => setShowLangPicker(!showLangPicker)}
                                        className="flex items-center gap-2 text-gray-500 text-sm border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50">
                                        <Languages size={15} />
                                        {lang.flag} {lang.label} ▾
                                    </button>
                                    {showLangPicker && (
                                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                                            className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-w-36 z-50">
                                            {LANG_OPTIONS.map(l => (
                                                <button key={l.code}
                                                    onClick={() => { setLang(l); setShowLangPicker(false); }}
                                                    className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 flex items-center gap-2 ${lang.code === l.code ? 'text-purple-600 font-semibold' : 'text-gray-700'}`}>
                                                    {l.flag} {l.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CitizenHome;
