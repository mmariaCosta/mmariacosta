/**
 * Extrai frontmatter (YAML) + corpo do markdown.
 */
export function parseFrontmatter(raw) {
  if (!raw || !raw.startsWith('---')) {
    return { data: {}, content: raw || '' };
  }

  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const [, yamlBlock, content] = match;
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

  return { data, content: content.trim() };
}

/**
 * "simple-ctf.pt.md" → "simple-ctf"
 */
export function slugFromFilename(filename) {
  return filename.replace(/\.(pt|en)\.md$/i, '').replace(/\.md$/i, '');
}

/**
 * "simple-ctf.pt.md" → "pt"
 * "simple-ctf.md"    → "pt"
 */
export function langFromFilename(filename) {
  const m = filename.match(/\.(pt|en)\.md$/i);
  return m ? m[1].toLowerCase() : 'pt';
}