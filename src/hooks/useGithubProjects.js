import { useEffect, useState } from 'react';

const USER = 'mmariacosta';
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const CACHE_KEY = 'gh-projects-cache-v3';
const TTL = 1000 * 60 * 60 * 6; // 6 horas

function authHeaders(extra = {}) {
  return TOKEN
    ? { ...extra, Authorization: `Bearer ${TOKEN}` }
    : extra;
}

function extractFirstParagraph(readme) {
  if (!readme) return '';
  const lines = readme.split('\n');
  const paragraphs = [];
  let current = [];
  let inCode = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('```')) { inCode = !inCode; continue; }
    if (inCode) continue;
    if (!line) {
      if (current.length) { paragraphs.push(current.join(' ')); current = []; }
      continue;
    }
    if (line.startsWith('#')) continue;
    if (line.startsWith('![')) continue;
    if (line.startsWith('[![')) continue;
    if (line.startsWith('<')) continue;
    if (line.startsWith('---')) continue;
    current.push(line);
  }
  if (current.length) paragraphs.push(current.join(' '));

  const clean = (p) =>
    p
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`>]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const first = paragraphs.map(clean).find((p) => p.length > 30);
  return (first || '').slice(0, 220) + (first && first.length > 220 ? '…' : '');
}

export function useGithubProjects(limit = 12) {
  const [data, setData] = useState({ repos: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    // tenta cache
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.ts < TTL) {
        setData({ repos: cached.repos, loading: false, error: null });
        return;
      }
    } catch { /* cache inválido */ }

    async function load() {
      try {
        const res = await fetch(
          `https://api.github.com/users/${USER}/repos?sort=updated&per_page=${limit}`,
          { headers: authHeaders() }
        );
        if (!res.ok) throw new Error(`GitHub API ${res.status}`);
        const repos = await res.json();

        const withData = await Promise.all(
          repos.map(async (r) => {
            let summary = r.description || '';

            try {
              const rr = await fetch(
                `https://api.github.com/repos/${USER}/${r.name}/readme`,
                { headers: authHeaders({ Accept: 'application/vnd.github.raw' }) }
              );
              if (rr.ok) {
                const md = await rr.text();
                const p = extractFirstParagraph(md);
                if (p) summary = p;
              }
            } catch { /* ignora */ }

            const cover = `https://opengraph.githubassets.com/1/${USER}/${r.name}`;

            return {
              id: r.id,
              name: r.name,
              url: r.html_url,
              homepage: r.homepage,
              summary,
              language: r.language,
              stars: r.stargazers_count,
              forks: r.forks_count,
              topics: r.topics || [],
              updated: r.updated_at,
              created: r.created_at,
              license: r.license?.name,
              cover,
              images: [cover],
            };
          })
        );

        if (cancelled) return;

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ ts: Date.now(), repos: withData })
        );
        setData({ repos: withData, loading: false, error: null });
      } catch (e) {
        if (cancelled) return;
        setData({ repos: [], loading: false, error: e.message });
      }
    }

    load();
    return () => { cancelled = true; };
  }, [limit]);

  return data;
}