import { parseFrontmatter, slugFromFilename, langFromFilename } from '../lib/parseFrontmatter';

// Caminhos apontando para a nova pasta Cyber
const writeupsFiles = import.meta.glob('../cyber/write-ups/*.md', { query: '?raw', import: 'default', eager: true });
const notasFiles = import.meta.glob('../cyber/notas/*.md', { query: '?raw', import: 'default', eager: true });
const labsFiles = import.meta.glob('../cyber/labs/*.md', { query: '?raw', import: 'default', eager: true });

function processFiles(files, type) {
  return Object.keys(files).map((path) => {
    const filename = path.split('/').pop();
    const raw = files[path];
    const { data, content } = parseFrontmatter(raw);

    return {
      type,
      slug: slugFromFilename(filename),
      lang: data.lang || langFromFilename(filename),
      filename,
      data,
      content,
    };
  });
}

const ALL_WRITEUPS = processFiles(writeupsFiles, 'writeup');
const ALL_NOTAS = processFiles(notasFiles, 'note');
const ALL_LABS = processFiles(labsFiles, 'lab');

export function useLocalContent() {
  return {
    writeups: ALL_WRITEUPS,
    notes: ALL_NOTAS,
    labs: ALL_LABS,
    loading: false,
    error: null,
  };
}

export function useLocalItem(slug, lang = 'pt') {
  const all = [...ALL_WRITEUPS, ...ALL_NOTAS, ...ALL_LABS];
  const candidates = all.filter((i) => i.slug === slug);

  if (candidates.length === 0) return { item: null };

  const item =
    candidates.find((i) => i.lang === lang) ||
    candidates.find((i) => i.lang === 'pt') ||
    candidates[0];

  return { item };
}