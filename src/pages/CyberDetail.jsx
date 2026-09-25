import { Link, useParams } from 'react-router-dom';
import {
  FaArrowLeft, FaGithub, FaCalendar, FaExternalLinkAlt,
} from 'react-icons/fa';
import { useLanguage } from '../contexts/useLanguage';
import { useCyberItem } from '../hooks/useCyberContent';
import MarkdownRenderer from '../components/MarkdownRenderer';

const DIFF_COLORS = { easy: '#86efac', medium: '#fde68a', hard: '#fca5a5' };
const STATUS_COLORS = { ready: '#86efac', building: '#fde68a', planned: '#c4b5fd' };

function getColor(item) {
  if (!item) return 'var(--accent)';
  if (item.type === 'writeup') return DIFF_COLORS[item.data.difficulty] || '#c4b5fd';
  if (item.type === 'note') return 'var(--accent)';
  return STATUS_COLORS[item.data.status] || '#c4b5fd';
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

export default function CyberDetail() {
  const { slug } = useParams();
  const { t } = useLanguage();
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

  const color = getColor(item);
  const label = getLabel(item);
  const title = item.data.title || item.slug;
  const folder = getTypeFolder(item);

  const repoUrl = `https://github.com/mmariaCosta/cyber/blob/main/${folder}/${item.filename}`;

  return (
    <article className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-app-dim">
        <Link to="/cyber" className="hover:text-app-accent transition-colors">
          Cyber
        </Link>
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

      {/* Header */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-widest">
          <span className="font-bold" style={{ color }}>{label}</span>
          {item.data.date && (
            <>
              <span className="text-app-dim flex items-center gap-1.5">
                <FaCalendar size={10} /> {item.data.date}
              </span>
            </>
          )}
          {item.data.platform && (
            <span className="px-2 py-0.5 rounded border"
                  style={{ color, borderColor: `color-mix(in srgb, ${color} 40%, transparent)` }}>
              {item.data.platform}
            </span>
          )}
          {item.data.category && (
            <span className="px-2 py-0.5 rounded border"
                  style={{ color, borderColor: `color-mix(in srgb, ${color} 40%, transparent)` }}>
              {item.data.category}
            </span>
          )}
          {item.data.difficulty && (
            <span className="px-2 py-0.5 rounded"
                  style={{ color, background: `color-mix(in srgb, ${color} 15%, transparent)` }}>
              {item.data.difficulty}
            </span>
          )}
          {item.data.status && (
            <span className="px-2 py-0.5 rounded"
                  style={{ color, background: `color-mix(in srgb, ${color} 15%, transparent)` }}>
              {item.data.status}
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-app leading-tight">
          {title}
        </h1>

        {item.data.summary && (
          <p className="text-app-muted text-sm leading-relaxed">
            {item.data.summary}
          </p>
        )}

        {/* Tags */}
        {item.data.tags && item.data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.data.tags.map((tag) => (
              <span key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded
                               border border-app text-app-dim">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Botões */}
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
      </header>

      {/* Corpo do markdown */}
      <section className="pt-8 border-t border-app">
        <MarkdownRenderer content={item.content} />
      </section>
    </article>
  );
}