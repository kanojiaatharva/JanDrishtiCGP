"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Map, ListTodo, ShieldAlert, BarChart3, Users, History, Bell, UserCircle } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Hotspots', href: '/dashboard/hotspots', icon: Map },
  { name: 'Recommendations', href: '/dashboard/recommendations', icon: ListTodo },
  { name: 'Reports', href: '/dashboard/reports', icon: ShieldAlert },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Evidence', href: '/dashboard/evidence', icon: History },
  { name: 'Officers', href: '/dashboard/officers', icon: Users },
  { name: 'Audit', href: '/dashboard/audit', icon: History },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-900 tracking-tight">JanDrishti Officer</h1>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${
                      isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Column */}
      <div className="flex-1 flex flex-col w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <select className="form-select block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option>District X (Madhya Pradesh)</option>
              <option>District Y</option>
            </select>
            <select className="form-select block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-500 p-1 relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
            </button>
            <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
              <UserCircle className="h-8 w-8 text-gray-400" />
              <div className="text-sm">
                <p className="font-medium text-gray-700 leading-none">Officer X</p>
                <p className="text-gray-500 mt-1">District Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
