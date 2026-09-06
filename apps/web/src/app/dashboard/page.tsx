"use client";

import React, { useEffect, useState } from 'react';
import { fetchApi } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ShieldAlert, Map, ListTodo, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#3b82f6', '#f97316', '#22c55e', '#eab308'];

export default function DashboardHome() {
  const [summary, setSummary] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sumRes, anaRes] = await Promise.all([
          fetchApi('/dashboard/summary'),
          fetchApi('/dashboard/analytics')
        ]);
        setSummary(sumRes);
        setAnalytics(anaRes);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const cards = [
    { name: 'Total Reports', value: summary?.totalReports || 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Active Hotspots', value: summary?.activeHotspots || 0, icon: Map, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'High Priority Areas', value: summary?.highPriorityAreas || 0, icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-100' },
    { name: 'Pending Reviews', value: summary?.pendingReviews || 0, icon: ListTodo, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">District Overview</h2>
        <p className="text-gray-500 mt-1">Real-time civic intelligence summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={card.name} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center"
            >
              <div className={`p-4 rounded-full ${card.bg} ${card.color} mr-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{card.name}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Reports Over Time</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.reportsOverTime || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Issues by Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.reportsByCategory || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(analytics?.reportsByCategory || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
               {(analytics?.reportsByCategory || []).map((entry: any, index: number) => (
                  <div key={entry.name} className="flex items-center text-sm text-gray-600">
                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    {entry.name}
                  </div>
               ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
