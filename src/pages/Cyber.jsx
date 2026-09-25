import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { useLanguage } from '../contexts/useLanguage';
import { useCyberContent } from '../hooks/useCyberContent';

const DIFF_COLORS = { easy: '#86efac', medium: '#fde68a', hard: '#fca5a5' };
const STATUS_COLORS = { ready: '#86efac', building: '#fde68a', planned: '#c4b5fd' };

function getColor(item) {
  if (item.type === 'writeup') return DIFF_COLORS[item.data.difficulty] || '#c4b5fd';
  if (item.type === 'note') return 'var(--accent)';
  return STATUS_COLORS[item.data.status] || '#c4b5fd';
}

function getLabel(item) {
  if (item.type === 'writeup') return 'CTF';
  if (item.type === 'note') return 'NOTA';
  if (item.type === 'vm') return 'VM';
  return 'TOOL';
}

function getBadge(item, lang) {
  if (item.type === 'writeup') {
    const map = { pt: { easy: 'fácil', medium: 'médio', hard: 'difícil' }, en: { easy: 'easy', medium: 'medium', hard: 'hard' } };
    return (map[lang] || map.pt)[item.data.difficulty] || item.data.difficulty;
  }
  if (item.type === 'note') return lang === 'pt' ? 'nota' : 'note';
  const map = {
    pt: { ready: 'pronto', building: 'montando', planned: 'planejado' },
    en: { ready: 'ready', building: 'building', planned: 'planned' },
  };
  return (map[lang] || map.pt)[item.data.status] || item.data.status;
}

export default function Cyber() {
  const { t, lang } = useLanguage();
  const { writeups, notes, vms, tools, loading, error } = useCyberContent();
  const [filter, setFilter] = useState('all');

  const all = [
    ...(writeups || []),
    ...(notes || []),
    ...(vms || []),
    ...(tools || []),
  ]
    .filter((item) => item.lang === lang || !item.lang)
    .sort((a, b) => {
      const da = a.data?.date || '';
      const db = b.data?.date || '';
      return da < db ? 1 : -1;
    });

  const FILTERS = [
    { id: 'all',      label: 'Tudo',  count: all.length },
    { id: 'writeup',  label: 'CTF',   count: (writeups || []).filter((i) => i.lang === lang).length },
    { id: 'note',     label: 'Notas', count: (notes || []).filter((i) => i.lang === lang).length },
    { id: 'lab',      label: 'Lab',   count: [...(vms||[]), ...(tools||[])].filter((i) => i.lang === lang).length },
  ];

  const filtered = filter === 'all'
    ? all
    : filter === 'lab'
      ? all.filter((i) => i.type === 'vm' || i.type === 'tool')
      : all.filter((i) => i.type === filter);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full blur-3xl
                        opacity-10 pointer-events-none" style={{ background: '#86efac' }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full"
                  style={{ background: 'var(--accent)', boxShadow: '0 0 10px var(--glow)' }} />
            <p className="text-app-accent font-mono text-[10px] tracking-[0.25em] uppercase">
              {t.cyber?.eyebrow || 'Cyber'}
            </p>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-app leading-tight">
            {t.cyber?.title || 'Laboratório e prática'}
          </h1>
          <p className="text-app-muted text-sm md:text-base leading-relaxed mt-5 max-w-3xl">
            {t.cyber?.intro}
          </p>
        </div>
      </section>

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => {
          const isActive = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-full border text-[10px] font-mono
                         uppercase tracking-wider transition-all ${
                           isActive
                             ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                             : 'border-app text-app-muted hover:border-app-strong'
                         }`}
            >
              {f.label} · {String(f.count).padStart(2, '0')}
            </button>
          );
        })}
      </div>

      {loading && (
        <p className="text-app-muted text-sm animate-pulse py-8 text-center">
          carregando conteúdo...
        </p>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-400 text-sm">erro: {error}</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 border border-dashed border-app rounded-2xl">
          <p className="text-app-muted text-sm font-mono">// sem conteúdo ainda</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((item, i) => (
            <Card key={item.slug + item.type + i} item={item} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}

function Card({ item, lang }) {
  const color = getColor(item);
  const label = getLabel(item);
  const badge = getBadge(item, lang);
  const title = item.data.title || item.slug;
  const summary = item.data.summary || '';

  return (
    <Link
      to={`/cyber/${item.slug}`}
      className="group relative rounded-xl border border-app bg-surface-soft
                 overflow-hidden transition-all hover:border-app-strong
                 hover:-translate-y-1 flex flex-col min-h-[180px]"
      style={{ borderColor: `color-mix(in srgb, ${color} 25%, var(--border))` }}
    >
      <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl
                      opacity-0 group-hover:opacity-25 transition-opacity pointer-events-none"
           style={{ background: color }} />
      <div className="absolute left-0 top-0 bottom-0 w-[2px]"
           style={{ background: color, boxShadow: `0 0 12px ${color}` }} />

      <div className="relative p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-widest">
          <span className="font-bold" style={{ color }}>{label}</span>
          <span className="text-app-dim">·</span>
          <span className="text-app-muted">{item.data.date || ''}</span>
          <span className="ml-auto px-2 py-0.5 rounded text-[10px]"
                style={{ color, background: `color-mix(in srgb, ${color} 15%, transparent)` }}>
            {badge}
          </span>
        </div>

        <h3 className="text-app font-bold text-base leading-tight mb-2
                       group-hover:text-app-accent transition-colors line-clamp-2">
          {title}
        </h3>

        {summary && (
          <p className="text-app-muted text-xs leading-relaxed line-clamp-3 flex-1">
            {summary}
          </p>
        )}

        <div className="flex items-center gap-2 mt-3 text-[10px] font-mono text-app-dim">
          {item.data.platform && <span>{item.data.platform}</span>}
          {item.data.category && <span>· {item.data.category}</span>}
          <FaArrowRight size={9}
            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color }} />
        </div>
      </div>
    </Link>
  );
}