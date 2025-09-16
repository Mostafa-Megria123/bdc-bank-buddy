import React, { useState, ReactNode } from 'react';
import { getTranslation, Language } from '@/locales';
import { LanguageContext } from './LanguageContextCore';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  
  const t = (key: string): unknown => {
    return getTranslation(language, key);
  };

  const tString = (key: string): string => {
    const res = getTranslation(language, key);
    if (typeof res === 'string') return res;
    // If it's undefined/null/object/array return the key as fallback
    return String(res ?? key);
  };

  return (
  <LanguageContext.Provider value={{ language, setLanguage, t, tString }}>
      <div className={language === 'ar' ? 'rtl' : 'ltr'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

// `useLanguage` is provided from `src/contexts/useLanguage.ts` to keep HMR-friendly file exports