import { parseFrontmatter, slugFromFilename } from './frontmatter';

// Lê todos os .md da pasta em tempo de build
const arquivos = import.meta.glob('/src/labs/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

console.log('[labs debug]', Object.keys(arquivos));

export function carregarLabs() {
  const labs = [];

  for (const [caminho, conteudoBruto] of Object.entries(arquivos)) {
  // Ignora arquivos que começam com _ (templates)
  const nome = caminho.split('/').pop();
  if (nome.startsWith('_')) continue;

  const { data, content } = parseFrontmatter(conteudoBruto);
  const slug = slugFromFilename(caminho);

    labs.push({
      slug,
      data: {
        title: data.title || slug,
        date: data.date || '',
        platform: data.platform || '',
        difficulty: data.difficulty || 'easy',
        category: data.category || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        summary: data.summary || '',
        lang: data.lang || 'pt',
      },
      content,
    });
  }

  // Ordena por data (mais recente primeiro)
  return labs.sort((a, b) => {
    if (!a.data.date) return 1;
    if (!b.data.date) return -1;
    return a.data.date < b.data.date ? 1 : -1;
  });
}

export function carregarLab(slug) {
  return carregarLabs().find((l) => l.slug === slug) || null;
}