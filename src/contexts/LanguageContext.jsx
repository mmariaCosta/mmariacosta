import { createContext, useEffect, useState } from 'react';

export const LanguageContext = createContext();

const CACHE_KEY = 'i18n-cache-v1';
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24h

function getCached(lang) {
  try {
    const all = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    const entry = all[lang];
    if (entry && Date.now() - entry.ts < CACHE_TTL) {
      return entry.data;
    }
  } catch { /* ignora */ }
  return null;
}

function setCache(lang, data) {
  try {
    const all = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    all[lang] = { ts: Date.now(), data };
    localStorage.setItem(CACHE_KEY, JSON.stringify(all));
  } catch { /* ignora */ }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window === 'undefined') return 'pt';
    return localStorage.getItem('lang') || 'pt';
  });

  // Começa com o cache se existir — carrega na hora
  const [t, setT] = useState(() => getCached('pt') || null);
  const [loading, setLoading] = useState(() => !getCached('pt'));
  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    let cancelled = false;

    // Se já tem cache pro idioma atual, usa e não faz fetch
    const cached = getCached(lang);
    if (cached) {
      setT(cached);
      setLoading(false);
      setError(null);
      return;
    }

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
        setCache(lang, data);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message);
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: t || {}, loading, error }}>
      {children}
    </LanguageContext.Provider>
  );
}