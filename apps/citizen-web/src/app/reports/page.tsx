"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { fetchApi } from '@/lib/api';
import { Loader2, ArrowLeft, ChevronRight } from 'lucide-react';

export default function MyReports() {
  const { t } = useLanguage();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Attempt to fetch actual reports. 
    // Fallback to empty if api isn't ready or mocked auth isn't working yet.
    fetchApi('/reports')
      .then(data => setReports(data))
      .catch(err => {
        console.error(err);
        // Provide fallback demo data if real API is missing or fails (for MVP)
        setReports([
          { id: 'JD-8X91', category: { name: 'Infrastructure' }, location: { address: 'Ward 14' }, createdAt: new Date().toISOString(), status: 'PROCESSING' },
          { id: 'JD-2L44', category: { name: 'Water Supply' }, location: { address: 'Ward 7' }, createdAt: new Date(Date.now() - 86400000).toISOString(), status: 'RESOLVED' },
        ]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t('my_reports_btn')}
        </h2>
      </div>

      {isLoading ? (
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center items-center text-gray-500">
          <p>You haven't submitted any reports yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((report) => (
            <Link 
              key={report.id} 
              href={`/reports/${report.id}`}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col">
                <span className="font-mono text-sm text-gray-500">{report.id.substring(0,8)}</span>
                <span className="font-semibold text-lg">{report.category?.name || 'Issue'}</span>
                <span className="text-sm text-gray-500">{report.location?.address || 'Unknown location'}</span>
                <span className={`mt-2 w-fit px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
