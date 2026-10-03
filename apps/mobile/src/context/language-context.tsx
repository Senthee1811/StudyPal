import React, { createContext, useContext, useState } from 'react';
import { SupportedLocale, TranslationDictionary, getTranslation } from '@studypal/i18n';

interface MobileLanguageContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: TranslationDictionary;
}

const MobileLanguageContext = createContext<MobileLanguageContextType | undefined>(undefined);

export function MobileLanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<SupportedLocale>('en');
  const t = getTranslation(locale);

  return (
    <MobileLanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </MobileLanguageContext.Provider>
  );
}

export function useMobileLanguage() {
  const ctx = useContext(MobileLanguageContext);
  if (!ctx) throw new Error('useMobileLanguage must be used within MobileLanguageProvider');
  return ctx;
}
