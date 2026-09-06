"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import { Loader2, ArrowLeft, AlertTriangle, TrendingUp, Users, Building, Activity, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HotspotDetail() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi(`/hotspots/${id}`)
      .then(res => setData(res))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="h-8 w-8 text-blue-600 animate-spin" /></div>;
  }

  if (!data) {
    return <div className="p-8">Hotspot not found.</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-200 rounded-full transition-colors bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{data.area}</h2>
          <p className="text-gray-500 font-medium">Hotspot ID: {id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Priority & AI Assessment */}
        <div className="lg:col-span-1 space-y-8">
          {/* Priority Score */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Priority Score</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-red-600">{data.priority.totalScore}</span>
                <span className="text-xl text-gray-400 font-bold">/ 100</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {data.priority.breakdown.map((item: any) => (
                <div key={item.name}>
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-gray-900">{item.score}/{item.max}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(item.score / item.max) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Assessment */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl"
          >
            <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" /> AI Assessment
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-indigo-700 font-medium">Category</span>
                <span className="text-indigo-900 font-bold">{data.aiAssessment.issueCategory}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-700 font-medium">Severity</span>
                <span className="text-red-700 font-bold">{data.aiAssessment.severity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-700 font-medium">Confidence</span>
                <span className="text-indigo-900 font-bold">{(data.aiAssessment.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="pt-3 border-t border-indigo-200 mt-2">
                <span className="block text-indigo-700 font-medium mb-1">Recommendation</span>
                <p className="text-indigo-900 font-semibold">{data.aiAssessment.recommendation}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Demand & Evidence */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Demand Signal */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-500" /> Citizen Demand
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Report Count</p>
                <p className="text-3xl font-bold text-gray-900">{data.demand.reportCount}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Unique Citizens</p>
                <p className="text-3xl font-bold text-gray-900">{data.demand.uniqueCitizens}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Recurrence</p>
                <p className="text-lg font-bold text-gray-900">{data.demand.recurrence}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Trend</p>
                <p className="text-lg font-bold text-red-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> {data.demand.trend}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Evidence */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 }}
             className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building className="w-6 h-6 text-green-500" /> Integrated Evidence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-100 p-4 rounded-lg">
                <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Infrastructure</h4>
                <p className="text-gray-900">{data.evidence.infrastructureCoverage}</p>
              </div>
              <div className="border border-gray-100 p-4 rounded-lg">
                <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Demographics</h4>
                <p className="text-gray-900">{data.evidence.demographicIndicators}</p>
              </div>
              <div className="border border-gray-100 p-4 rounded-lg">
                <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Existing Schemes</h4>
                <p className="text-gray-900">{data.evidence.existingSchemes}</p>
              </div>
              <div className="border border-gray-100 p-4 rounded-lg">
                <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Investment Plans</h4>
                <p className="text-gray-900">{data.evidence.investmentPlans}</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
