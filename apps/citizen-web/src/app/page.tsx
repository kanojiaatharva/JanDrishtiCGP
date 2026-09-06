"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Mic, FileText, List } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold tracking-tight text-blue-900 dark:text-blue-400">
          {t('landing_title')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 px-4">
          {t('landing_subtitle')}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-4 w-full"
      >
        <Link href="/report" className="w-full block">
          <Button variant="primary" className="w-full py-8 text-xl group" size="xl">
            <Mic className="mr-3 h-8 w-8 group-hover:scale-110 transition-transform" />
            {t('report_voice_btn')}
          </Button>
        </Link>
        
        <Link href="/report/text" className="w-full block">
          <Button variant="outline" className="w-full py-8 text-xl" size="xl">
            <FileText className="mr-3 h-6 w-6" />
            {t('report_text_btn')}
          </Button>
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 w-full"
      >
        <Link href="/reports" className="w-full block">
          <Button variant="secondary" className="w-full">
            <List className="mr-2 h-5 w-5" />
            {t('my_reports_btn')}
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
