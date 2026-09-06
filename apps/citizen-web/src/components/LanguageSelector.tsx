"use client";

import React from 'react';
import { useLanguage } from '../lib/i18n';

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 w-fit">
      <button
        onClick={() => setLanguage('hi')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          language === 'hi'
            ? 'bg-orange-500 text-white shadow-md'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        aria-pressed={language === 'hi'}
      >
        हिन्दी
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        aria-pressed={language === 'en'}
      >
        English
      </button>
    </div>
  );
};
