import { createContext, useEffect, useState } from 'react';
import { translations } from '../data/translations';

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'pt';
    return localStorage.getItem('lang') || 'pt';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = {
    lang,
    setLang,
    t: translations[lang],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}