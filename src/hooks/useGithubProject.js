import { useEffect, useState } from 'react';

const USER = 'mmariacosta';
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const IMAGE_FOLDERS = [
  'img',
  'images',
  'screenshots',
  'assets',
  'docs/img',
  'docs/images',
  'public/img',
  'public/images',
  'src/assets',
  'static',
];

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|bmp|avif)$/i;
const EXCLUDE_KEYWORDS = ['badge', 'logo', 'icon', 'shields'];

function authHeaders(extra = {}) {
  return TOKEN
    ? { ...extra, Authorization: `Bearer ${TOKEN}` }
    : extra;
}

async function fetchFolderImages(repo, branch) {
  for (const folder of IMAGE_FOLDERS) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${USER}/${repo}/contents/${folder}?ref=${branch}`,
        { headers: authHeaders() }
      );
      if (!res.ok) continue;

      const data = await res.json();
      if (!Array.isArray(data)) continue;

      const images = data
        .filter((f) => f.type === 'file' && IMAGE_EXT.test(f.name))
        .filter((f) => {
          const n = f.name.toLowerCase();
          return !EXCLUDE_KEYWORDS.some((kw) => n.includes(kw));
        })
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((f) => f.download_url);

      if (images.length > 0) return images;
    } catch {
      /* tenta próxima pasta */
    }
  }
  return [];
}

async function fetchReadmeImages(repo, branch) {
  try {
    const rr = await fetch(
      `https://api.github.com/repos/${USER}/${repo}/readme`,
      { headers: authHeaders({ Accept: 'application/vnd.github.html' }) }
    );
    if (!rr.ok) return [];

    const html = await rr.text();
    const baseRaw = `https://raw.githubusercontent.com/${USER}/${repo}/${branch}/`;
    const regex = /<img[^>]+src="([^"]+)"/g;
    const found = [];
    let m;

    while ((m = regex.exec(html)) !== null) {
      let url = m[1];
      if (url.startsWith('http://') || url.startsWith('https://')) {
        /* mantém */
      } else if (url.startsWith('data:')) continue;
      else url = baseRaw + url.replace(/^\.?\//, '');

      const lower = url.toLowerCase();
      if (
        lower.includes('shields.io') ||
        lower.includes('badge') ||
        lower.includes('travis-ci') ||
        lower.includes('codecov')
      ) continue;

      found.push(url);
    }
    return [...new Set(found)];
  } catch {
    return [];
  }
}

export function useGithubProject(name) {
  const [data, setData] = useState({
    project: null,
    readmeHtml: '',
    images: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!name) return;
    let cancelled = false;

    async function load() {
      try {
        const repoRes = await fetch(
          `https://api.github.com/repos/${USER}/${name}`,
          { headers: authHeaders() }
        );
        if (!repoRes.ok) throw new Error(`GitHub API ${repoRes.status}`);
        const repo = await repoRes.json();

        const branch = repo.default_branch || 'main';

        // 1) tenta pastas de imagens
        let images = await fetchFolderImages(name, branch);

        // 2) se não achou, tenta README
        if (images.length === 0) {
          images = await fetchReadmeImages(name, branch);
        }

        // 3) OpenGraph só como último recurso
        if (images.length === 0) {
          images = [`https://opengraph.githubassets.com/1/${USER}/${repo.name}`];
        }

        // README HTML pra renderizar
        let readmeHtml = '';
        try {
          const rr = await fetch(
            `https://api.github.com/repos/${USER}/${name}/readme`,
            { headers: authHeaders({ Accept: 'application/vnd.github.html' }) }
          );
          if (rr.ok) readmeHtml = await rr.text();
        } catch { /* ignora */ }

        if (cancelled) return;

        setData({
          project: {
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            homepage: repo.homepage,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            topics: repo.topics || [],
            updated: repo.updated_at,
            created: repo.created_at,
            license: repo.license?.name,
            branch,
            cover: `https://opengraph.githubassets.com/1/${USER}/${repo.name}`,
          },
          readmeHtml,
          images,
          loading: false,
          error: null,
        });
      } catch (e) {
        if (cancelled) return;
        setData({
          project: null,
          readmeHtml: '',
          images: [],
          loading: false,
          error: e.message,
        });
      }
    }

    load();
    return () => { cancelled = true; };
  }, [name]);

  return data;
}