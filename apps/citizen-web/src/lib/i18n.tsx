"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

const translations: Translations = {
  landing_title: {
    en: 'Welcome to JanDrishti',
    hi: 'जनदृष्टि में आपका स्वागत है',
  },
  landing_subtitle: {
    en: 'Report your civic issues directly to the government.',
    hi: 'अपनी नागरिक समस्याओं की रिपोर्ट सीधे सरकार को करें।',
  },
  report_voice_btn: {
    en: 'Report with Voice',
    hi: 'आवाज़ से रिपोर्ट करें',
  },
  report_text_btn: {
    en: 'Report with Text',
    hi: 'लिख कर रिपोर्ट करें',
  },
  processing: {
    en: 'Processing your report...',
    hi: 'आपकी रिपोर्ट प्रोसेस हो रही है...',
  },
  review_title: {
    en: 'Review Your Report',
    hi: 'अपनी रिपोर्ट की समीक्षा करें',
  },
  submit_btn: {
    en: 'Submit Report',
    hi: 'रिपोर्ट जमा करें',
  },
  my_reports_btn: {
    en: 'My Reports',
    hi: 'मेरी रिपोर्ट',
  },
  success_msg: {
    en: 'Your report has been submitted successfully.',
    hi: 'आपकी रिपोर्ट सफलतापूर्वक जमा कर दी गई है।',
  },
  track_btn: {
    en: 'Track Status',
    hi: 'स्थिति ट्रैक करें',
  },
  consent_text: {
    en: 'I agree that the information provided is true and consent to its use for resolution.',
    hi: 'मैं सहमत हूँ कि दी गई जानकारी सत्य है और समाधान के लिए इसके उपयोग की सहमति देता हूँ।',
  }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('hi'); // Defaulting to Hindi for citizens usually

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][language] || key;
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div lang={language} dir="ltr">
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
