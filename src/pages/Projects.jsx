import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaStar, FaCodeBranch, FaArrowRight, FaGithub,
} from 'react-icons/fa';
import { useLanguage } from '../contexts/useLanguage';
import { useGithubProjects } from '../hooks/useGithubProjects';
import { useCyberContent } from '../hooks/useCyberContent';

const LANG_EMOJI = {
  JavaScript: '🟨', TypeScript: '🔷', Python: '🐍',
  Ruby: '💎', Java: '☕', 'C#': '🎯',
  'C++': '🔵', HTML: '🌐', CSS: '🎨',
  Shell: '🐚', Go: '🐹', Rust: '🦀',
  PHP: '🐘', Swift: '🦅', Kotlin: '🟪',
};

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
    const map = {
      pt: { easy: 'fácil', medium: 'médio', hard: 'difícil' },
      en: { easy: 'easy', medium: 'medium', hard: 'hard' },
    };
    return (map[lang] || map.pt)[item.data.difficulty] || item.data.difficulty;
  }
  if (item.type === 'note') return lang === 'pt' ? 'nota' : 'note';
  const map = {
    pt: { ready: 'pronto', building: 'montando', planned: 'planejado' },
    en: { ready: 'ready', building: 'building', planned: 'planned' },
  };
  return (map[lang] || map.pt)[item.data.status] || item.data.status;
}

/* =========================================================
   PÁGINA
   ========================================================= */
export default function Projects() {
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState('repos');

  // Fonte 1: GitHub (repos)
  const { repos, loading: loadingRepos, error: errorRepos } = useGithubProjects(12);

  // Fonte 2: Cyber (markdown do repo `cyber`)
  const {
    writeups = [],
    notes = [],
    vms = [],
    tools = [],
    loading: loadingCyber,
    error: errorCyber,
  } = useCyberContent();

  // Filtra por idioma + ordena por data
  const filterLang = (arr) =>
    (arr || [])
      .filter((item) => item.lang === lang || !item.lang)
      .sort((a, b) => {
        const da = a.data?.date || '';
        const db = b.data?.date || '';
        if (!da) return 1;
        if (!db) return -1;
        return da < db ? 1 : -1;
      });

  const cyberWriteups = filterLang(writeups);
  const cyberNotes = filterLang(notes);
  const cyberLab = filterLang([...(vms || []), ...(tools || [])]);

  const TABS = [
    { id: 'repos',    label: t.projects?.tabs?.repos    || 'Repos',     count: repos?.length || 0 },
    { id: 'writeups', label: t.projects?.tabs?.writeups || 'Write-ups', count: cyberWriteups.length },
    { id: 'notes',    label: t.projects?.tabs?.notes    || 'Notas',     count: cyberNotes.length },
    { id: 'lab',      label: t.projects?.tabs?.lab      || 'Lab',       count: cyberLab.length },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="mb-2">
        <p className="text-app-accent font-mono text-xs tracking-widest uppercase mb-2">
          {t.projects?.eyebrow || 'Projetos'}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-app">
          {t.projects?.title || 'Coisas que construí'}
        </h1>
        <p className="text-app-muted text-sm mt-2 max-w-2xl">
          {t.projects?.subtitle}
        </p>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-app pb-3">
        {TABS.map((x) => {
          const isActive = tab === x.id;
          return (
            <button
              key={x.id}
              onClick={() => setTab(x.id)}
              className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider
                         transition-all flex items-center gap-2 ${
                           isActive
                             ? 'bg-[var(--accent)] text-white shadow-app'
                             : 'border border-app text-app-muted hover:border-app-strong hover:text-app'
                         }`}
            >
              {x.label}
              <span className={`text-[10px] tabular-nums ${isActive ? 'opacity-80' : 'opacity-60'}`}>
                {String(x.count).padStart(2, '0')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'repos' && (
            <ReposTab
              repos={repos}
              loading={loadingRepos}
              error={errorRepos}
              t={t}
            />
          )}

          {tab === 'writeups' && (
            <CyberTab
              items={cyberWriteups}
              loading={loadingCyber}
              error={errorCyber}
              lang={lang}
              emptyLabel="// sem write-ups ainda"
            />
          )}

          {tab === 'notes' && (
            <CyberTab
              items={cyberNotes}
              loading={loadingCyber}
              error={errorCyber}
              lang={lang}
              emptyLabel="// sem notas ainda"
            />
          )}

          {tab === 'lab' && (
            <CyberTab
              items={cyberLab}
              loading={loadingCyber}
              error={errorCyber}
              lang={lang}
              emptyLabel="// sem itens no lab ainda"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* =========================================================
   TAB: REPOS
   ========================================================= */
function ReposTab({ repos, loading, error, t }) {
  if (loading) {
    return (
      <p className="text-app-muted text-sm animate-pulse py-8 text-center">
        {t.projects?.loading || 'carregando projetos...'}
      </p>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 text-sm">{t.projects?.error}: {error}</p>
        <p className="text-app-muted text-xs mt-1">{t.projects?.errorHint}</p>
      </div>
    );
  }

  if (!repos || repos.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-app rounded-2xl">
        <p className="text-app-muted text-sm font-mono">// sem repositórios</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {repos.map((r) => (
        <Link
          key={r.id}
          to={`/projetos/${r.name}`}
          className="group rounded-2xl border border-app bg-surface-soft
                     overflow-hidden hover:border-app-strong hover:shadow-app
                     hover:-translate-y-0.5 transition-all flex flex-col"
        >
          <div className="aspect-video overflow-hidden bg-[#0a0613] relative">
            {r.cover ? (
              <img
                src={r.cover}
                alt={r.name}
                width="600"
                height="400"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500
                           group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center
                              bg-gradient-to-br from-purple-900/50 to-purple-700/20">
                <span className="text-4xl mb-2">
                  {LANG_EMOJI[r.language] || '📦'}
                </span>
                <span className="text-app-muted font-mono text-[10px] uppercase tracking-widest">
                  {r.language || 'project'}
                </span>
              </div>
            )}
            {r.language && r.cover && (
              <span className="absolute top-2 right-2 text-[10px] font-mono
                               px-2 py-0.5 rounded bg-black/60 text-purple-200
                               backdrop-blur-sm">
                {r.language}
              </span>
            )}
          </div>

          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-app font-mono font-semibold text-sm mb-2
                           flex items-center gap-2 truncate">
              <span className="text-app-dim">&lt;</span>
              <span className="truncate">{r.name}</span>
              <span className="text-app-dim">/&gt;</span>
            </h3>

            <p className="text-app-muted text-xs leading-relaxed mb-3
                          flex-1 line-clamp-3">
              {r.summary || t.projects?.empty}
            </p>

            <div className="flex items-center gap-3 text-[11px] text-app-muted">
              <span className="flex items-center gap-1">
                <FaStar size={10} /> {r.stars}
              </span>
              <span className="flex items-center gap-1">
                <FaCodeBranch size={10} /> {r.forks}
              </span>
              <span className="ml-auto text-app-accent flex items-center gap-1
                               opacity-0 group-hover:opacity-100 transition-opacity">
                {t.projects?.viewDetails} <FaArrowRight size={9} />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* =========================================================
   TAB: CYBER (writeups / notes / lab)
   ========================================================= */
function CyberTab({ items, loading, error, lang, emptyLabel }) {
  if (loading) {
    return (
      <p className="text-app-muted text-sm animate-pulse py-8 text-center">
        carregando...
      </p>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 text-sm">erro: {error}</p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-app rounded-2xl">
        <p className="text-app-muted text-sm font-mono">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item, i) => (
        <CyberCard key={item.slug + item.type + i} item={item} lang={lang} />
      ))}
    </div>
  );
}

/* =========================================================
   CARD DO CYBER
   ========================================================= */
function CyberCard({ item, lang }) {
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
        style={{
          background: color,
          boxShadow: `0 0 12px color-mix(in srgb, ${color} 60%, transparent)`,
        }}
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
          <FaArrowRight size={9}
            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color }} />
        </div>
      </div>
    </Link>
  );
}