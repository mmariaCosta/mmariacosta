import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { useLanguage } from '../contexts/useLanguage';
import { useCyberContent } from '../hooks/useCyberContent';

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

function getColor(item) {
  if (item.type === 'writeup') return DIFF_COLORS[item.data.difficulty] || 'var(--diff-easy)';
  if (item.type === 'note') return 'var(--item-note)';
  return STATUS_COLORS[item.data.status] || 'var(--status-planned)';
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

/* Agrupa por ano */
function extractYear(date) {
  if (!date) return 'sem-data';
  const m = String(date).match(/\b(20\d{2})\b/);
  return m ? m[1] : 'sem-data';
}

/* =========================================================
   PÁGINA
   ========================================================= */
export default function Cyber() {
  const { t, lang } = useLanguage();
  const { writeups, notes, vms, tools, loading, error } = useCyberContent();
  const [filter, setFilter] = useState('all');

    // Junta tudo
  const rawAll = [
    ...(writeups || []),
    ...(notes || []),
    ...(vms || []),
    ...(tools || []),
  ];

  // Filtra pelo idioma atual
  let all = rawAll.filter((item) => item.lang === lang || !item.lang);

  // FALLBACK: se não tem nada no idioma atual, mostra os em PT
  const showingFallback = all.length === 0 && rawAll.length > 0;
  if (showingFallback) {
    all = rawAll.filter((item) => item.lang === 'pt' || !item.lang);
  }

  // Ordena por data
  all = all.sort((a, b) => {
    const da = a.data?.date || '';
    const db = b.data?.date || '';
    if (!da) return 1;
    if (!db) return -1;
    return da < db ? 1 : -1;
  });

  const FILTERS = [
    { id: 'all',      label: 'Tudo',  count: all.length },
    { id: 'writeup',  label: 'CTF',   count: all.filter((i) => i.type === 'writeup').length },
    { id: 'note',     label: 'Notas', count: all.filter((i) => i.type === 'note').length },
    { id: 'lab',      label: 'Lab',   count: all.filter((i) => i.type === 'vm' || i.type === 'tool').length },
  ];

  const filtered = filter === 'all'
    ? all
    : filter === 'lab'
      ? all.filter((i) => i.type === 'vm' || i.type === 'tool')
      : all.filter((i) => i.type === filter);

  const [featured, ...rest] = filtered;

  return (
    <div className="space-y-8">
      {/* INTRO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-72 h-72 rounded-full blur-3xl
                    opacity-10 pointer-events-none"
          style={{ background: 'var(--diff-easy)' }}
        />
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

      {showingFallback && (
      <div className="rounded-xl border border-dashed border-app-strong
                      bg-surface-soft px-4 py-3 text-center">
        <p className="text-app-muted text-xs font-mono">
          ⚠️ {lang === 'en'
            ? 'No content in English yet — showing Portuguese version.'
            : 'Sem conteúdo em inglês ainda — mostrando versão em português.'}
        </p>
      </div>
    )}

      {/* FILTROS */}
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

      {/* LOADING / ERRO / VAZIO */}
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

      {/* CONTEÚDO */}
      {!loading && !error && filtered.length > 0 && (
        <>
          {/* DESTAQUE — card grande */}
          {featured && <FeaturedCard item={featured} lang={lang} t={t} />}

          {/* TIMELINE — agrupada por ano */}
          {rest.length > 0 && (
            <section className="mt-12">
              <div className="mb-7">
                <p className="text-app-accent font-mono text-[10px] tracking-[0.25em] uppercase mb-1">
                  {t.cyber?.timelineEyebrow || 'learning path'}
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-app">
                  {t.cyber?.timelineTitle || 'Linha do tempo'}
                </h2>
                <p className="text-app-muted text-sm mt-1">
                  {t.cyber?.timelineSubtitle}
                </p>
              </div>
              <Timeline items={rest} lang={lang} t={t} />
            </section>
          )}
        </>
      )}
    </div>
  );
}

/* =========================================================
   FEATURED — card grande
   ========================================================= */
function FeaturedCard({ item, lang, t }) {
  const color = getColor(item);
  const label = getLabel(item);
  const badge = getBadge(item, lang);
  const title = item.data.title || item.slug;
  const summary = item.data.summary || '';

  return (
    <Link
      to={`/cyber/${item.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-app
                 bg-surface-soft backdrop-blur-sm p-6 md:p-8 min-h-[280px]
                 transition-all duration-300 hover:border-app-strong hover:shadow-app"
      style={{ borderColor: `color-mix(in srgb, ${color} 30%, var(--border))` }}
    >
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl
                   opacity-[0.14] pointer-events-none transition-opacity
                   group-hover:opacity-[0.24]"
        style={{ background: color }}
      />
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] opacity-70"
        style={{ background: color, boxShadow: `0 0 18px ${color}` }}
      />

      <div className="relative h-full flex flex-col">
        <div className="flex flex-wrap items-center gap-3 text-sm font-mono uppercase tracking-widest">
          <span className="font-bold" style={{ color }}>{label}</span>
          <span className="text-app-dim">·</span>
          <span className="text-app-muted">{item.data.date || ''}</span>
          <span
            className="ml-auto px-3 py-1 rounded-md border text-xs"
            style={{
              color,
              background: `color-mix(in srgb, ${color} 12%, transparent)`,
              borderColor: `color-mix(in srgb, ${color} 40%, transparent)`,
            }}
          >
            {badge}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <p
            className="text-xs font-mono uppercase tracking-[0.3em] mb-3"
            style={{ color: `color-mix(in srgb, ${color} 80%, transparent)` }}
          >
            {t.cyber?.featured || 'destaque'}
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-app leading-tight
                         max-w-4xl group-hover:text-app-accent transition-colors">
            {title}
          </h2>
          {summary && (
            <p className="text-app-muted text-sm md:text-base leading-relaxed mt-4 max-w-3xl">
              {summary}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          {item.data.platform && (
            <span className="text-sm font-mono uppercase tracking-wider text-app-muted">
              {item.data.platform}
            </span>
          )}
          {item.data.category && (
            <span className="text-sm font-mono uppercase tracking-wider text-app-muted">
              · {item.data.category}
            </span>
          )}
          {item.data.tags?.slice(0, 4).map((tag) => (
            <span key={tag}
                  className="text-xs font-mono px-3 py-1 rounded-md
                             border border-app text-app-muted">
              #{tag}
            </span>
          ))}
          <FaArrowRight size={12} className="ml-auto opacity-0 group-hover:opacity-100
                                             transition-opacity" style={{ color }} />
        </div>
      </div>
    </Link>
  );
}

/* =========================================================
   TIMELINE
   ========================================================= */
function Timeline({ items, lang, t }) {
  const groups = {};
  items.forEach((item) => {
    const year = extractYear(item.data?.date);
    if (!groups[year]) groups[year] = [];
    groups[year].push(item);
  });

  const years = Object.keys(groups).sort((a, b) => {
    if (a === 'sem-data') return 1;
    if (b === 'sem-data') return -1;
    return Number(b) - Number(a);
  });

  return (
    <div className="relative">
      <div
        className="absolute left-[7px] top-2 bottom-2 w-px"
        style={{ background: 'linear-gradient(to bottom, var(--accent), transparent)' }}
      />

      <div className="space-y-10">
        {years.map((year) => (
          <div key={year} className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div
                className="relative z-10 w-[15px] h-[15px] rounded-full border-2"
                style={{
                  borderColor: 'var(--accent)',
                  background: 'var(--surface-soft)',
                  boxShadow: '0 0 12px var(--glow)',
                }}
              />
              <span className="font-mono text-sm uppercase tracking-[0.2em] text-app-accent">
                {year === 'sem-data' ? 'sem data' : year}
              </span>
            </div>

            <div className="ml-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {groups[year].map((item, i) => (
                <SmallCard key={item.slug + i} item={item} lang={lang} t={t} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   SMALL CARD
   ========================================================= */
function SmallCard({ item, lang, t }) {
  const color = getColor(item);
  const label = getLabel(item);
  const badge = getBadge(item, lang);
  const title = item.data.title || item.slug;
  const summary = item.data.summary || '';

  return (
    <Link
      to={`/cyber/${item.slug}`}
      className="group relative overflow-hidden rounded-xl border border-app
                 bg-surface-soft backdrop-blur-sm p-5 transition-all duration-200
                 hover:-translate-y-0.5 hover:border-app-strong flex flex-col min-h-[180px]"
      style={{ borderColor: `color-mix(in srgb, ${color} 25%, var(--border))` }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{ background: color, boxShadow: `0 0 12px color-mix(in srgb, ${color} 60%, transparent)` }}
      />
      <div
        className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-3xl
                   opacity-0 group-hover:opacity-25 transition-opacity pointer-events-none"
        style={{ background: color }}
      />

      <div className="relative flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest">
          <span className="font-bold" style={{ color }}>{label}</span>
          <span className="text-app-dim">·</span>
          <span className="text-app-muted">{item.data.date || ''}</span>
          <span
            className="ml-auto px-2 py-0.5 rounded-md text-[10px]"
            style={{
              color,
              background: `color-mix(in srgb, ${color} 15%, transparent)`,
            }}
          >
            {badge}
          </span>
        </div>

        <h3 className="text-app font-bold text-base leading-tight mt-4 mb-2
                       group-hover:text-app-accent transition-colors line-clamp-2">
          {title}
        </h3>

        {summary && (
          <p className="text-app-muted text-xs leading-relaxed line-clamp-3 flex-1">
            {summary}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-app">
          {item.data.platform && (
            <span className="text-[10px] font-mono text-app-muted uppercase tracking-wider">
              {item.data.platform}
            </span>
          )}
          {item.data.category && (
            <span className="text-[10px] font-mono text-app-dim">
              · {item.data.category}
            </span>
          )}
          {item.data.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] font-mono text-app-dim">
              #{tag}
            </span>
          ))}
          <FaArrowRight size={9}
            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color }} />
        </div>
      </div>
    </Link>
  );
}