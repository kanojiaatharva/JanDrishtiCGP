"use client";

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { Check, X, AlertCircle, FileSearch, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecommendationsWorkflow() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi('/recommendations/pending')
      .then(data => setRecommendations(data))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAction = async (id: string, action: string) => {
    const reason = prompt(`Please provide a reason for ${action} this recommendation:`);
    if (reason === null) return; // Cancelled

    try {
      await fetchApi(`/recommendations/${id}/decision`, {
        method: 'POST',
        body: JSON.stringify({ decision: action, reason })
      });
      // Remove from list
      setRecommendations(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      alert("Failed to submit decision.");
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Pending Recommendations</h2>
        <p className="text-gray-500 mt-1">Review AI-generated interventions and take action.</p>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {recommendations.map((rec) => (
            <motion.div 
              key={rec.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-bold rounded-full uppercase tracking-wider">
                        Score: {rec.priorityScore}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">{rec.issue} - {rec.area}</h3>
                    </div>
                    <p className="text-gray-600 font-medium">Suggested Action: <span className="text-gray-900 font-bold">{rec.action}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAction(rec.id, 'APPROVE')}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Check className="mr-2 h-4 w-4" /> Approve
                    </button>
                    <button 
                      onClick={() => handleAction(rec.id, 'REJECT')}
                      className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <X className="mr-2 h-4 w-4" /> Reject
                    </button>
                    <button 
                      onClick={() => handleAction(rec.id, 'REQUEST_EVIDENCE')}
                      className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <HelpCircle className="mr-2 h-4 w-4" /> More Info
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg mt-4 border border-gray-100">
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4" /> AI Reasoning
                    </h4>
                    <p className="text-gray-700 text-sm">{rec.reason}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 uppercase flex items-center gap-2 mb-2">
                      <FileSearch className="w-4 h-4" /> Supporting Evidence
                    </h4>
                    <p className="text-gray-700 text-sm">{rec.evidence}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {recommendations.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
            <p className="text-gray-500 mt-1">There are no pending recommendations to review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
