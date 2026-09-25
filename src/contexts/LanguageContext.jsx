import { createContext, useEffect, useState } from 'react';

export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'pt';
    return localStorage.getItem('lang') || 'pt';
  });

  const [t, setT] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Salva idioma
  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // Carrega traduções quando o idioma muda
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/data/i18n/${lang}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load translations: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setT(data);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [lang]);

  const value = {
    lang,
    setLang,
    t: t || {},       // fallback vazio enquanto carrega
    loading,
    error,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}