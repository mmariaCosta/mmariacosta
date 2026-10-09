import { useMemo } from 'react';

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function markdownToHtml(md) {
  if (!md) return '';

  let html = md;

  // Code blocks
  const codeBlocks = [];
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(
      `<pre><code class="lang-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`
    );
    return `\u0000CODEBLOCK${idx}\u0000`;
  });

  html = escapeHtml(html);

  // Code inline
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Headers
  html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold / Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer">$1</a>'
  );

  // Imagens
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" loading="lazy" />'
  );

  // Blockquote
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');

  // Listas não ordenadas
  html = html.replace(/^[\-\*] (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  // Listas ordenadas
  html = html.replace(/^\d+\. (.+)$/gm, '<li-ordered>$1</li-ordered>');
  html = html.replace(
    /(<li-ordered>.*<\/li-ordered>\n?)+/g,
    (match) =>
      `<ol>${match.replace(/<\/?li-ordered>/g, (m) =>
        m.includes('/') ? '</li>' : '<li>'
      )}</ol>`
  );

  // Parágrafos
  html = html
    .split('\n\n')
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^<(h[1-4]|ul|ol|pre|blockquote|li|img)/.test(trimmed)) return trimmed;
      if (trimmed.startsWith('\u0000CODEBLOCK')) return trimmed;
      return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('\n');

  codeBlocks.forEach((block, idx) => {
    html = html.replace(`\u0000CODEBLOCK${idx}\u0000`, block);
  });

  return html;
}

export default function MarkdownRenderer({ content = '' }) {
  const html = useMemo(() => markdownToHtml(content), [content]);

  return (
    <div
      className="prose-readme"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}