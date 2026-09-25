export function parseFrontmatter(raw) {
  if (!raw) return { data: {}, content: '' };

  // Normaliza quebras de linha Windows → Unix
  const text = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  if (!text.startsWith('---')) {
    return { data: {}, content: text };
  }

  // Encontra o fechamento do frontmatter
  const endIdx = text.indexOf('\n---', 3);
  if (endIdx === -1) {
    return { data: {}, content: text };
  }

  const yamlBlock = text.slice(3, endIdx).trim();
  const content = text.slice(endIdx + 4).replace(/^\n+/, '');

  const data = {};

  for (const line of yamlBlock.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const idx = trimmed.indexOf(':');
    if (idx === -1) continue;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();

    if (!key) continue;

    // Remove aspas
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Array inline: [a, b, c]
    if (value.startsWith('[') && value.endsWith(']')) {
      const inner = value.slice(1, -1);
      data[key] = inner
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
      continue;
    }

    // Booleano
    if (value === 'true') { data[key] = true; continue; }
    if (value === 'false') { data[key] = false; continue; }

    // Número
    if (/^\d+$/.test(value)) { data[key] = Number(value); continue; }

    data[key] = value;
  }

  return { data, content };
}

export function slugFromFilename(filename) {
  return filename.replace(/\.(pt|en)\.md$/i, '').replace(/\.md$/i, '');
}

export function langFromFilename(filename) {
  const m = filename.match(/\.(pt|en)\.md$/i);
  return m ? m[1].toLowerCase() : 'pt';
}