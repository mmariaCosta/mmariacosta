import { useEffect, useState } from 'react';
import { parseFrontmatter, slugFromFilename, langFromFilename } from '../lib/parseFrontmatter';

const USER = 'mmariaCosta';
const REPO = 'cyber';
const BRANCH = 'main';
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const CACHE_KEY = 'cyber-content-v2';
const CACHE_TTL = 1000 * 60 * 30; // 30 min

function authHeaders(extra = {}) {
  return TOKEN
    ? { ...extra, Authorization: `Bearer ${TOKEN}` }
    : extra;
}

/* Lista arquivos .md de uma pasta do repo */
async function listFolder(folder) {
  const url = `https://api.github.com/repos/${USER}/${REPO}/contents/${folder}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.filter((f) => f.type === 'file' && f.name.endsWith('.md'));
}

/* Baixa o conteúdo cru — usando a API (que aceita CORS) */
async function fetchRaw(file) {
  const url = `https://api.github.com/repos/${USER}/${REPO}/contents/${file.path}?ref=${BRANCH}`;
  const res = await fetch(url, {
    headers: authHeaders({ Accept: 'application/vnd.github.raw' }),
  });
  if (!res.ok) return '';
  return res.text();
}

/* Carrega uma pasta inteira */
async function loadFolder(folder, type) {
  const files = await listFolder(folder);
  const items = await Promise.all(
    files.map(async (file) => {
      const raw = await fetchRaw(file);
      const { data, content } = parseFrontmatter(raw);
      return {
        type,
        slug: slugFromFilename(file.name),
        lang: data.lang || langFromFilename(file.name),
        filename: file.name,
        path: file.path,
        githubUrl: file.html_url,
        data,
        content,
      };
    })
  );
  return items;
}

export function useCyberContent() {
  const [state, setState] = useState(() => {
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
        const [writeups, notes, vms, tools] = await Promise.all([
          loadFolder('writeups', 'writeup'),
          loadFolder('notes', 'note'),
          loadFolder('lab/vms', 'vm'),
          loadFolder('lab/tools', 'tool'),
          loadFolder('ctfs', 'ctf'),
        ]);

        if (cancelled) return;

        const payload = { writeups, notes, vms, tools };

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ ts: Date.now(), data: payload })
        );

        setState({ ...payload, loading: false, error: null });
      } catch (e) {
        if (cancelled) return;
        setState({ loading: false, error: e.message });
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return state;
}

/* Busca 1 item pelo slug */
export function useCyberItem(slug) {
  const { writeups, notes, vms, tools, loading, error } = useCyberContent();

  if (loading || error) return { loading, error, item: null };

  const all = [
    ...(writeups || []),
    ...(notes || []),
    ...(vms || []),
    ...(tools || []),
  ];

  const item = all.find((i) => i.slug === slug) || null;

  return { loading: false, error: null, item };
}