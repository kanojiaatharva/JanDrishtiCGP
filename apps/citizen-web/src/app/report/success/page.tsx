"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, List } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuccessPage() {
  const { t } = useLanguage();
  // Ensure this runs on client only to avoid hydration mismatch if using session storage directly, 
  // but it's okay for MVP.
  const reportId = typeof window !== 'undefined' ? sessionStorage.getItem('last_report_id') : '...';

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="mb-8"
      >
        <CheckCircle className="w-32 h-32 text-green-500" />
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4"
      >
        {t('success_msg')}
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 dark:text-gray-300 mb-2"
      >
        Your Report ID is:
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-lg text-lg font-mono tracking-widest text-gray-900 dark:text-gray-100 mb-12"
      >
        {reportId || 'PENDING'}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full flex flex-col gap-4"
      >
        <Link href={`/reports/${reportId}`} className="w-full">
          <Button variant="primary" className="w-full">
            {t('track_btn')}
          </Button>
        </Link>
        <Link href="/" className="w-full">
          <Button variant="outline" className="w-full">
            <Home className="mr-2 w-5 h-5" />
            Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
