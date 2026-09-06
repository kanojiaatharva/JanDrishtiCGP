"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';

export default function TextReport() {
  const { t } = useLanguage();
  const router = useRouter();
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    sessionStorage.setItem('temp_report_text', text);
    sessionStorage.setItem('temp_report_channel', 'WEB');
    router.push('/report/review');
  };

  return (
    <div className="flex-1 flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Describe your issue
      </h2>
      
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
        <textarea
          className="flex-1 w-full p-4 text-lg border-2 border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none"
          placeholder="Please type the details of the problem..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />
        
        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Back
          </Button>
          <Button type="submit" variant="primary" className="flex-1" disabled={!text.trim()}>
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}
