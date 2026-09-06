"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VoiceReport() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = () => {
    // In a real app, use navigator.mediaDevices.getUserMedia
    setIsRecording(true);
    
    // Auto stop after 5 seconds for MVP simulation
    timerRef.current = setTimeout(() => {
      stopRecording();
    }, 5000);
  };

  const stopRecording = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRecording(false);
    processAudio();
  };

  const processAudio = () => {
    setIsProcessing(true);
    
    // Simulate audio processing and redirect to review
    setTimeout(() => {
      // Pass simulated transcribed text via sessionStorage
      sessionStorage.setItem('temp_report_text', 'There is a large pothole on Main Street near the hospital causing severe traffic jams.');
      sessionStorage.setItem('temp_report_channel', 'VOICE');
      router.push('/report/review');
    }, 2000);
  };

  if (isProcessing) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="h-16 w-16 text-blue-600 mb-6" />
        </motion.div>
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">
          {t('processing')}
        </h2>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 gap-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          What problem would you like to report?
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Tap the microphone and start speaking.
        </p>
      </div>

      <motion.button
        onClick={isRecording ? stopRecording : startRecording}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center justify-center rounded-full shadow-xl w-48 h-48 transition-colors ${
          isRecording ? 'bg-red-500' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-red-500 opacity-50"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
        {isRecording ? (
          <Square className="h-16 w-16 text-white fill-current" />
        ) : (
          <Mic className="h-20 w-20 text-white" />
        )}
      </motion.button>
      
      <Button variant="outline" onClick={() => router.back()} className="mt-8">
        Cancel
      </Button>
    </div>
  );
}
