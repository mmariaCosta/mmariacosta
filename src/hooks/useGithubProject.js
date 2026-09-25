import { useEffect, useState } from 'react';

const USER = 'mmariacosta';
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|svg|bmp|avif)$/i;
const PREFERRED_FOLDERS = ['img', 'images', 'screenshots'];
const EXCLUDE_KEYWORDS = ['badge', 'logo', 'icon', 'shields', 'avatar', 'profile'];

function authHeaders(extra = {}) {
  return TOKEN
    ? { ...extra, Authorization: `Bearer ${TOKEN}` }
    : extra;
}

async function fetchAllImages(repo, branch) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${USER}/${repo}/git/trees/${branch}?recursive=1`,
      { headers: authHeaders() }
    );
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.tree) return [];

    return data.tree
      .filter((item) => item.type === 'blob' && IMAGE_EXT.test(item.path))
      .filter((item) => {
        const name = item.path.toLowerCase();
        return !EXCLUDE_KEYWORDS.some((kw) => name.includes(kw));
      })
      .map((item) => {
        const path = item.path.toLowerCase();
        const priority = PREFERRED_FOLDERS.findIndex((f) =>
          path.startsWith(`${f}/`)
        );
        return {
          path: item.path,
          url: `https://raw.githubusercontent.com/${USER}/${repo}/${branch}/${item.path}`,
          priority: priority === -1 ? 999 : priority,
        };
      })
      .sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return a.path.localeCompare(b.path);
      })
      .map((img) => img.url);
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
        const images = await fetchAllImages(name, branch);

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
          images,     // ⬅️ volta a retornar as imagens (pro carrossel)
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