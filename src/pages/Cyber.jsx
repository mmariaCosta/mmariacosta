import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/useLanguage';
import { useTheme } from '../contexts/useTheme';

/* =========================================================
   CORES POR TEMA
   ========================================================= */
const COLORS_LIGHT = {
  easy:     '#14532d',
  medium:   '#713f12',
  hard:     '#7f1d1d',
  note:     '#4c1d95',
  done:     '#14532d',
  building: '#713f12',
  planned:  '#4c1d95',
};

const COLORS_DARK = {
  easy:     '#86efac',
  medium:   '#fde68a',
  hard:     '#fca5a5',
  note:     '#c4b5fd',
  done:     '#86efac',
  building: '#fde68a',
  planned:  '#c4b5fd',
};

let STATUS_COLORS = COLORS_DARK;

/* =========================================================
   PÁGINA
   ========================================================= */
export default function Cyber() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [filter, setFilter] = useState('all');

  STATUS_COLORS = theme === 'dark' ? COLORS_DARK : COLORS_LIGHT;

  const lab = t.cyber.lab;
  const w = t.cyber.writeups;
  const n = t.cyber.notes;

  const all = [
    ...w.items.map((item) => ({ kind: 'ctf',   date: item.date,          data: item })),
    ...n.items.map((item) => ({ kind: 'notes', date: item.date,          data: item })),
    ...lab.exercises.map((item) => ({ kind: 'lab', date: 'em andamento', data: item })),
  ].sort((a, b) => {
    if (a.date === 'em andamento') return -1;
    if (b.date === 'em andamento') return 1;
    return a.date < b.date ? 1 : -1;
  });

  const FILTERS = [
    { id: 'all',   label: 'Tudo',              count: all.length },
    { id: 'ctf',   label: 'CTF',               count: w.items.length },
    { id: 'notes', label: t.cyber.tabs.notes,  count: n.items.length },
    { id: 'lab',   label: t.cyber.tabs.lab,    count: lab.exercises.length },
  ];

  const filtered = filter === 'all' ? all : all.filter((item) => item.kind === filter);
  const [featured, ...rest] = filtered;

  return (
    <div className="space-y-8">
      {/* INTRO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-72 h-72 rounded-full blur-3xl
                     opacity-10 pointer-events-none"
          style={{ background: STATUS_COLORS.easy }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: 'var(--accent)',
                boxShadow: '0 0 10px var(--glow)',
              }}
            />
            <p className="text-app-accent font-mono text-[10px] tracking-[0.25em] uppercase">
              {t.cyber.eyebrow}
            </p>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-app leading-tight">
            {t.cyber.title}
          </h1>
          <div className="mt-5 max-w-3xl">
            <p className="text-app-muted text-sm md:text-base leading-relaxed">
              {t.cyber.intro}
            </p>
          </div>
        </div>
      </section>

      {/* MINI STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <MiniStat value={all.length}           label={t.cyber.stats.records} color={STATUS_COLORS.easy} />
        <MiniStat value={w.items.length}       label={t.cyber.stats.ctf}     color={STATUS_COLORS.hard} />
        <MiniStat value={n.items.length}       label={t.cyber.stats.notes}   color={STATUS_COLORS.note} />
        <MiniStat value={lab.exercises.length} label={t.cyber.stats.lab}     color={STATUS_COLORS.medium} />
      </div>

      {/* LEGENDA + FILTROS */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono uppercase tracking-widest text-app-dim">
            {t.cyber.legend.title}:
          </span>
          <Legend color={STATUS_COLORS.easy}   label={t.cyber.legend.easy} />
          <Legend color={STATUS_COLORS.medium} label={t.cyber.legend.medium} />
          <Legend color={STATUS_COLORS.hard}   label={t.cyber.legend.hard} />
          <Legend color={STATUS_COLORS.note}   label={t.cyber.legend.note} />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 ml-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-app-dim mr-1">
            {t.cyber.filterLabel}:
          </span>
          {FILTERS.map((f) => {
            const isActive = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-mono
                           uppercase tracking-wider transition-all ${
                             isActive
                               ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                               : 'border-app text-app-muted hover:border-app-strong hover:text-app'
                           }`}
              >
                {f.label} · {String(f.count).padStart(2, '0')}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTEÚDO */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {filtered.length === 0 ? (
            <EmptyState t={t} />
          ) : (
            <>
              {featured && <FeaturedCard item={featured} t={t} />}
              <section className="mt-12">
                <div className="mb-7">
                  <p className="text-app-accent font-mono text-[10px] tracking-[0.25em] uppercase mb-1">
                    {t.cyber.timelineEyebrow}
                  </p>
                  <h2 className="text-xl md:text-2xl font-bold text-app">
                    {t.cyber.timelineTitle}
                  </h2>
                  <p className="text-app-muted text-sm mt-1">
                    {t.cyber.timelineSubtitle}
                  </p>
                </div>
                <Timeline items={rest} t={t} />
              </section>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* =========================================================
   FEATURED CARD
========================================================= */
function FeaturedCard({ item, t }) {
  const c = getConfig(item, t);
  const Wrapper = c.href ? 'a' : 'div';
  const props = c.href
    ? { href: c.href, ...(c.external ? { target: '_blank', rel: 'noreferrer' } : {}) }
    : {};

  return (
    <Wrapper
      {...props}
      className="group relative block overflow-hidden rounded-2xl border border-app
                 bg-surface-soft backdrop-blur-sm p-6 md:p-8 min-h-[280px]
                 transition-all duration-300
                 hover:border-app-strong hover:shadow-app"
      style={{
        borderColor: `color-mix(in srgb, ${c.color} 30%, var(--border))`,
      }}
    >
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl
                   opacity-[0.14] pointer-events-none transition-opacity
                   group-hover:opacity-[0.24]"
        style={{ background: c.color }}
      />

      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] opacity-70"
        style={{ background: c.color, boxShadow: `0 0 18px ${c.color}` }}
      />

      <div className="relative h-full flex flex-col">
        {/* Topo: tipo + data + badge — MAIORES */}
        <div className="flex flex-wrap items-center gap-3 text-sm font-mono
                        uppercase tracking-widest">
          <span className="font-bold" style={{ color: c.color }}>
            {c.label}
          </span>
          <span className="text-app-dim">·</span>
          <span className="text-app-muted">{item.date}</span>
          <span
            className="ml-auto px-3 py-1 rounded-md border text-xs"
            style={{
              color: c.color,
              background: `color-mix(in srgb, ${c.color} 12%, transparent)`,
              borderColor: `color-mix(in srgb, ${c.color} 40%, transparent)`,
            }}
          >
            {c.badge}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <p
            className="text-xs font-mono uppercase tracking-[0.3em] mb-3"
            style={{ color: `color-mix(in srgb, ${c.color} 80%, transparent)` }}
          >
            {t.cyber.featured}
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-app leading-tight
                         max-w-4xl group-hover:text-app-accent transition-colors">
            {c.title}
          </h2>
        </div>

        {/* Rodapé: plataforma + tags — MAIORES */}
        <div className="flex flex-wrap items-center gap-3">
          {c.platform && (
            <span className="text-sm font-mono uppercase tracking-wider text-app-muted">
              {c.platform}
            </span>
          )}
          {c.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono px-3 py-1 rounded-md
                         border border-app text-app-muted"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}

/* =========================================================
   TIMELINE
========================================================= */
function Timeline({ items, t }) {
  if (!items.length) {
    return (
      <div className="border border-dashed border-app rounded-2xl p-8 text-center">
        <p className="text-app-muted font-mono text-sm">{t.cyber.emptyFilter}</p>
      </div>
    );
  }

  const groups = {};
  items.forEach((item) => {
    const year = extractYear(item.date);
    if (!groups[year]) groups[year] = [];
    groups[year].push(item);
  });

  const years = Object.keys(groups).sort((a, b) => {
    if (a === 'atual') return -1;
    if (b === 'atual') return 1;
    return Number(b) - Number(a);
  });

  return (
    <div className="relative">
      <div
        className="absolute left-[7px] top-2 bottom-2 w-px"
        style={{
          background: 'linear-gradient(to bottom, var(--accent), transparent)',
        }}
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
                {year === 'atual' ? t.cyber.currentYear : year}
              </span>
            </div>

            <div className="ml-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {groups[year].map((item, index) => (
                <TimelineCard key={`${item.kind}-${index}`} item={item} t={t} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   TIMELINE CARD — tags e datas maiores
========================================================= */
function TimelineCard({ item, t }) {
  const c = getConfig(item, t);
  const Wrapper = c.href ? 'a' : 'div';
  const props = c.href
    ? { href: c.href, ...(c.external ? { target: '_blank', rel: 'noreferrer' } : {}) }
    : {};

  return (
    <Wrapper
      {...props}
      className="group relative overflow-hidden rounded-xl border border-app
                 bg-surface-soft backdrop-blur-sm p-5 transition-all duration-200
                 hover:-translate-y-0.5 hover:border-app-strong"
      style={{
        borderColor: `color-mix(in srgb, ${c.color} 25%, var(--border))`,
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{
          background: c.color,
          boxShadow: `0 0 12px color-mix(in srgb, ${c.color} 60%, transparent)`,
        }}
      />

      <div
        className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-3xl
                   opacity-0 group-hover:opacity-25 transition-opacity"
        style={{ background: c.color }}
      />

      <div className="relative">
        {/* Tipo + Data — MAIORES */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest">
          <span className="font-bold" style={{ color: c.color }}>
            {c.label}
          </span>
          <span className="text-app-dim">·</span>
          <span className="text-app-muted">{item.date}</span>
        </div>

        {/* Título */}
        <h3 className="text-app font-bold text-base leading-tight mt-4
                       group-hover:text-app-accent transition-colors">
          {c.title}
        </h3>

        {/* Rodapé: badge + plataforma + tags — MAIORES */}
        <div className="flex flex-wrap items-center gap-2 mt-5">
          <span
            className="text-xs font-mono px-2.5 py-1 rounded-md"
            style={{
              color: c.color,
              background: `color-mix(in srgb, ${c.color} 15%, transparent)`,
            }}
          >
            {c.badge}
          </span>
          {c.platform && (
            <span className="text-xs font-mono text-app-muted uppercase tracking-wider">
              {c.platform}
            </span>
          )}
          {c.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono px-2.5 py-1 rounded-md
                         border border-app text-app-muted"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}

/* =========================================================
   MINI STAT — translúcido
========================================================= */
function MiniStat({ value, label, color }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border px-4 py-3
                 bg-surface-soft backdrop-blur-sm"
      style={{
        borderColor: `color-mix(in srgb, ${color} 25%, var(--border))`,
      }}
    >
      <div
        className="absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl opacity-20"
        style={{ background: color }}
      />
      <div
        className="relative text-xl md:text-2xl font-bold font-mono"
        style={{ color }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div className="relative text-[9px] font-mono uppercase tracking-widest
                      text-app-dim mt-1">
        {label}
      </div>
    </div>
  );
}

/* =========================================================
   LEGEND — maior
========================================================= */
function Legend({ color, label }) {
  return (
    <span className="flex items-center gap-2 text-xs font-mono
                     uppercase tracking-wider text-app-muted">
      <span
        className="w-2.5 h-2.5 rounded-full"
        style={{
          background: color,
          boxShadow: `0 0 6px color-mix(in srgb, ${color} 50%, transparent)`,
        }}
      />
      {label}
    </span>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */
function EmptyState({ t }) {
  return (
    <div className="text-center py-16 border border-dashed border-app rounded-2xl">
      <div className="font-mono text-lg mb-2" style={{ color: 'var(--accent)' }}>
        404
      </div>
      <p className="text-app-muted text-sm font-mono">{t.cyber.emptyFilter}</p>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */
function extractYear(date) {
  if (!date || date === 'em andamento') return 'atual';
  const match = String(date).match(/\b(20\d{2})\b/);
  return match ? match[1] : 'atual';
}

function getConfig(item, t) {
  const { kind, data } = item;

  if (kind === 'ctf') {
    return {
      color: STATUS_COLORS[data.difficulty] || STATUS_COLORS.easy,
      badge: t.cyber.writeups.difficulty[data.difficulty] || data.difficulty,
      label: 'CTF',
      title: data.title,
      platform: data.platform,
      tags: data.tags || [data.category, data.platform].filter(Boolean),
      href: data.url,
      external: true,
    };
  }

  if (kind === 'notes') {
    return {
      color: STATUS_COLORS.note,
      badge: t.cyber.legend.note.toLowerCase(),
      label: 'NOTA',
      title: data.title,
      platform: null,
      tags: data.tags || [],
      href: data.url,
      external: false,
    };
  }

  return {
    color: STATUS_COLORS[data.status] || STATUS_COLORS.medium,
    badge: t.cyber.lab.status[data.status] || data.status,
    label: 'LAB',
    title: data.title,
    platform: null,
    tags: [],
    href: null,
    external: false,
  };
}