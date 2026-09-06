"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Profile
        </h2>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
          <User className="w-12 h-12" />
        </div>
        <h1 className="text-xl font-bold">Citizen</h1>
        <p className="text-gray-500">+91 9999999999</p>
      </div>

      <div className="space-y-4 w-full">
        <Button variant="outline" className="w-full justify-start text-left" size="md">
          Language Preferences
        </Button>
        <Button variant="outline" className="w-full justify-start text-left" size="md">
          Notification Settings
        </Button>
        <Button variant="danger" className="w-full mt-8" size="md">
          Logout
        </Button>
      </div>
    </div>
  );
}
