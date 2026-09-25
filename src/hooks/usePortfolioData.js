import { useEffect, useState } from 'react';

const CACHE_KEY = 'portfolio-data-v2';
const CACHE_TTL = 1000 * 60 * 60; // 1 hora

const DATA_FILES = {
  profile:        '/data/profile.json',
  services:       '/data/services.json',
  certifications: '/data/certifications.json',
  education:      '/data/education.json',
  skills:         '/data/skills.json',
};

async function loadFile(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return res.json();
}

export function usePortfolioData() {
  const [data, setData] = useState(() => {
    if (typeof window === 'undefined') return { loading: true };
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        return { ...cached.data, loading: false, error: null };
      }
    } catch { /* ignora */ }
    return { loading: true, error: null };
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [profile, services, certifications, education, skills] = await Promise.all([
          loadFile(DATA_FILES.profile),
          loadFile(DATA_FILES.services),
          loadFile(DATA_FILES.certifications),
          loadFile(DATA_FILES.education),
          loadFile(DATA_FILES.skills),
        ]);

        if (cancelled) return;

        const payload = { profile, services, certifications, education, skills };

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ ts: Date.now(), data: payload })
        );

        setData({ ...payload, loading: false, error: null });
      } catch (e) {
        if (cancelled) return;
        setData({ loading: false, error: e.message });
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return data;
}

export function pickText(obj, lang) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.pt || obj.en || '';
}