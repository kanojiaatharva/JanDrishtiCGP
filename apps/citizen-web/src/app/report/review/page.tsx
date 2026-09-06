"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { fetchApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface ExtractedData {
  issue: string;
  location: string;
  category: string;
  urgency: number;
  description: string;
}

export default function ReviewReport() {
  const { t } = useLanguage();
  const router = useRouter();
  const [data, setData] = useState<ExtractedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const rawText = sessionStorage.getItem('temp_report_text');
    if (!rawText) {
      router.push('/');
      return;
    }

    const extractInfo = async () => {
      try {
        const response = await fetchApi('/ai/extract', {
          method: 'POST',
          body: JSON.stringify({ text: rawText })
        });
        setData(response);
      } catch (err: any) {
        setError(err.message || 'Failed to analyze text');
      } finally {
        setIsLoading(false);
      }
    };

    extractInfo();
  }, [router]);

  const handleSubmit = async () => {
    if (!data || !consent) return;
    setIsSubmitting(true);
    
    try {
      const channel = sessionStorage.getItem('temp_report_channel') || 'WEB';
      const payload = {
        originalInput: sessionStorage.getItem('temp_report_text'),
        language: 'hi', // Hardcoded for MVP or extracted from context
        channel,
        transcription: data.description,
        normalizedText: data.description,
        urgency: data.urgency,
      };

      const response = await fetchApi('/reports', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      sessionStorage.setItem('last_report_id', response.id);
      sessionStorage.removeItem('temp_report_text');
      router.push('/report/success');
    } catch (err: any) {
      alert(err.message || 'Submission failed');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
        <p className="text-xl font-medium text-gray-700 dark:text-gray-200">Analyzing your report...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        {t('review_title')}
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Issue Summary</h3>
          <p className="text-lg text-gray-900 dark:text-gray-100 font-medium">{data.issue}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</h3>
            <p className="text-gray-900 dark:text-gray-100">{data.category}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</h3>
            <p className="text-gray-900 dark:text-gray-100">{data.location}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
           <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Original Detail</h3>
           <p className="text-gray-700 dark:text-gray-300 italic">"{data.description}"</p>
        </div>
      </div>

      <label className="flex items-start gap-4 p-4 mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl cursor-pointer select-none border border-blue-100 dark:border-blue-800">
        <input 
          type="checkbox" 
          className="mt-1 w-6 h-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span className="text-sm md:text-base text-gray-700 dark:text-gray-200 leading-tight">
          {t('consent_text')}
        </span>
      </label>

      <div className="mt-auto flex gap-4">
        <Button variant="outline" onClick={() => router.back()} className="flex-1">
          Edit
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          disabled={!consent} 
          isLoading={isSubmitting}
          className="flex-1"
        >
          {t('submit_btn')}
        </Button>
      </div>
    </div>
  );
}
