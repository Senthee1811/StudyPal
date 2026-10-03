'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLocale, TranslationDictionary, getTranslation } from '@studypal/i18n';

interface LanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>('en');

  useEffect(() => {
    const saved = localStorage.getItem('studypal_locale') as SupportedLocale;
    if (saved && (saved === 'en' || saved === 'si' || saved === 'ta')) {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = (newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('studypal_locale', newLocale);
    document.documentElement.lang = newLocale;
  };

  const t = getTranslation(locale);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
