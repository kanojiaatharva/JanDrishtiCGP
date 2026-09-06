"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { fetchApi } from '@/lib/api';
import { Loader2, ArrowLeft, CheckCircle2, Circle, Clock } from 'lucide-react';

export default function TrackReport() {
  const { t } = useLanguage();
  const params = useParams();
  const id = params.id as string;
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi(`/reports/${id}`)
      .then(data => setReport(data))
      .catch(err => {
        console.error(err);
        // Fallback for demo
        setReport({
          id,
          originalInput: 'Demo issue about water supply.',
          status: 'PROCESSING',
          createdAt: new Date().toISOString(),
          category: { name: 'Water Supply' },
          location: { address: 'Ward 7' },
        });
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const steps = ['CREATED', 'PROCESSING', 'UNDER_REVIEW', 'ACTION_PLANNED', 'RESOLVED'];

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!report) {
    return <div className="p-4">Report not found.</div>;
  }

  const currentStepIndex = steps.indexOf(report.status) !== -1 ? steps.indexOf(report.status) : 1;

  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="flex items-center mb-6">
        <Link href="/reports" className="mr-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Track Status
        </h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-6">
        <h3 className="font-mono text-gray-500 mb-2">ID: {report.id}</h3>
        <h1 className="text-xl font-bold mb-1">{report.category?.name || 'General Issue'}</h1>
        <p className="text-gray-600 dark:text-gray-300">{report.location?.address}</p>
        
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm text-gray-700 dark:text-gray-300 italic">
          "{report.originalInput}"
        </div>
      </div>

      <h3 className="text-lg font-bold mb-4">Timeline</h3>
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col space-y-6">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={step} className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className={`rounded-full flex items-center justify-center ${isCompleted ? 'text-green-500' : 'text-gray-300'}`}>
                    {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-0.5 h-10 ${isCompleted && !isCurrent ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
                <div className="pt-0.5">
                  <p className={`font-semibold ${isCompleted ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                    {step.replace(/_/g, ' ')}
                  </p>
                  {isCurrent && <p className="text-sm text-blue-600">Currently working on this.</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
