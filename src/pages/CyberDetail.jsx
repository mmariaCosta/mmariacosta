import { Link, useParams } from 'react-router-dom';
import {
  FaArrowLeft, FaGithub, FaCalendar, FaExternalLinkAlt,
} from 'react-icons/fa';
import { useCyberItem } from '../hooks/useCyberContent';
import MarkdownRenderer from '../components/MarkdownRenderer';

const DIFF_COLORS = {
  easy:   'var(--diff-easy)',
  medium: 'var(--diff-medium)',
  hard:   'var(--diff-hard)',
};

const STATUS_COLORS = {
  ready:    'var(--status-ready)',
  building: 'var(--status-building)',
  planned:  'var(--status-planned)',
};

const LAYOUT_WIDTH = {
  article: 'max-w-3xl',
  wide:    'max-w-5xl',
  full:    'max-w-full',
};

function getColor(item) {
  if (item?.data?.accent) return item.data.accent;
  if (!item) return 'var(--accent)';
  if (item.type === 'writeup') return DIFF_COLORS[item.data.difficulty] || 'var(--diff-easy)';
  if (item.type === 'note') return 'var(--item-note)';
  return STATUS_COLORS[item.data.status] || 'var(--status-planned)';
}

function getLabel(item) {
  if (!item) return '';
  if (item.type === 'writeup') return 'CTF';
  if (item.type === 'note') return 'Nota';
  if (item.type === 'vm') return 'VM';
  return 'Ferramenta';
}

function getTypeFolder(item) {
  if (!item) return '';
  if (item.type === 'writeup') return 'writeups';
  if (item.type === 'note') return 'notes';
  if (item.type === 'vm') return 'lab/vms';
  return 'lab/tools';
}

/* Extrai headings do markdown pra montar TOC */
function extractHeadings(content) {
  const lines = (content || '').split('\n');
  const headings = [];
  for (const line of lines) {
    const m = line.match(/^(##|###)\s+(.+)$/);
    if (m) {
      const level = m[1].length;
      const text = m[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      headings.push({ level, text, id });
    }
  }
  return headings;
}

export default function CyberDetail() {
  const { slug } = useParams();
  const { item, loading, error } = useCyberItem(slug);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <p className="text-app-muted text-sm animate-pulse">carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-400 text-sm">erro: {error}</p>
        <Link to="/cyber" className="text-app-accent text-sm hover:underline mt-4 inline-block">
          ← voltar
        </Link>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="py-16 text-center">
        <p className="text-app-muted mb-4">Conteúdo não encontrado.</p>
        <Link to="/cyber" className="text-app-accent text-sm hover:underline">
          ← voltar para Cyber
        </Link>
      </div>
    );
  }

  // =========================================================
  // CONFIGURAÇÕES DO LAYOUT (vêm do frontmatter do .md)
  // =========================================================
  const layout      = item.data.layout || 'article';
  const cover       = item.data.cover;
  const hideHeader  = item.data.hideHeader === true;
  const hideMeta    = item.data.hideMeta === true;
  const hideTags    = item.data.hideTags === true;
  const hideButtons = item.data.hideButtons === true;
  const showToc     = item.data.toc === true;

  const widthClass = LAYOUT_WIDTH[layout] || LAYOUT_WIDTH.article;

  const color = getColor(item);
  const label = getLabel(item);
  const title = item.data.title || item.slug;
  const folder = getTypeFolder(item);
  const repoUrl = `https://github.com/mmariaCosta/cyber/blob/main/${folder}/${item.filename}`;

  const headings = showToc ? extractHeadings(item.content) : [];

  return (
    <article className={`${widthClass} mx-auto space-y-6`}>
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-app-dim">
        <Link to="/cyber" className="hover:text-app-accent transition-colors">Cyber</Link>
        <span>›</span>
        <span className="text-app-muted">{label}</span>
        <span>›</span>
        <span className="text-app truncate">{title}</span>
      </nav>

      {/* Voltar */}
      <Link
        to="/cyber"
        className="inline-flex items-center gap-2 text-app-muted text-xs font-mono
                   hover:text-app-accent transition-colors"
      >
        <FaArrowLeft size={10} /> voltar
      </Link>

      {/* Capa (se o .md definir) */}
      {cover && (
        <div
          className="rounded-2xl overflow-hidden border"
          style={{ borderColor: `color-mix(in srgb, ${color} 30%, var(--border))` }}
        >
          <img
            src={cover}
            alt={title}
            className="w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Header */}
      {!hideHeader && (
        <header className="space-y-3">
          {/* Meta (badges) */}
          {!hideMeta && (
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-widest">
              <span className="font-bold" style={{ color }}>{label}</span>
              {item.data.date && (
                <span className="text-app-dim flex items-center gap-1.5">
                  <FaCalendar size={10} /> {item.data.date}
                </span>
              )}
              {item.data.platform && (
                <span
                  className="px-2 py-0.5 rounded border"
                  style={{ color, borderColor: `color-mix(in srgb, ${color} 40%, transparent)` }}
                >
                  {item.data.platform}
                </span>
              )}
              {item.data.category && (
                <span
                  className="px-2 py-0.5 rounded border"
                  style={{ color, borderColor: `color-mix(in srgb, ${color} 40%, transparent)` }}
                >
                  {item.data.category}
                </span>
              )}
              {item.data.difficulty && (
                <span
                  className="px-2 py-0.5 rounded"
                  style={{ color, background: `color-mix(in srgb, ${color} 15%, transparent)` }}
                >
                  {item.data.difficulty}
                </span>
              )}
              {item.data.status && (
                <span
                  className="px-2 py-0.5 rounded"
                  style={{ color, background: `color-mix(in srgb, ${color} 15%, transparent)` }}
                >
                  {item.data.status}
                </span>
              )}
            </div>
          )}

          <h1 className="text-2xl md:text-4xl font-bold text-app leading-tight">
            {title}
          </h1>

          {item.data.summary && (
            <p className="text-app-muted text-sm leading-relaxed">
              {item.data.summary}
            </p>
          )}

          {/* Tags */}
          {!hideTags && item.data.tags && item.data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.data.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-2 py-0.5 rounded
                             border border-app text-app-dim"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Botões */}
          {!hideButtons && (
            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
                           border border-app-strong text-app text-xs
                           hover:bg-surface-soft transition-all"
              >
                <FaGithub size={11} /> Ver no GitHub
              </a>

              {item.data.url && (
                <a
                  href={item.data.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
                             text-white text-xs font-medium transition-all"
                  style={{ background: color }}
                >
                  <FaExternalLinkAlt size={10} /> Link original
                </a>
              )}
            </div>
          )}
        </header>
      )}

      {/* TOC (se ativado) + Conteúdo */}
      <section className="pt-8 border-t border-app">
        {showToc && headings.length > 0 ? (
          <div className="grid md:grid-cols-[220px_1fr] gap-8">
            {/* Sumário */}
            <aside className="md:sticky md:top-24 md:self-start">
              <p className="text-[10px] font-mono uppercase tracking-widest text-app-dim mb-3">
                Nesta página
              </p>
              <ul className="space-y-2 text-xs border-l border-app pl-3">
                {headings.map((h, i) => (
                  <li key={i} style={{ paddingLeft: h.level === 3 ? 12 : 0 }}>
                    <a
                      href={`#${h.id}`}
                      className="text-app-muted hover:text-app-accent transition-colors
                                 line-clamp-2 leading-tight block"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Conteúdo */}
            <div>
              <MarkdownRenderer content={item.content} />
            </div>
          </div>
        ) : (
          <MarkdownRenderer content={item.content} />
        )}
      </section>
    </article>
  );
}