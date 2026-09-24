import { useEffect, useState } from 'react';

const USER = 'mmariacosta';
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const IMAGE_FOLDERS = ['img', 'images', 'screenshots'];

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
    } catch { /* tenta próxima */ }
  }
  return [];
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

        // Só busca das pastas — sem fallback pra OpenGraph
        const images = await fetchFolderImages(name, branch);

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
          },
          readmeHtml,
          images, // vazio se não tiver pasta
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