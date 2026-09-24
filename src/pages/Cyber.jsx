import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useLanguage } from '../contexts/useLanguage';

const LAB_STATUS = {
  done:     { color: '#00ff88' },
  building: { color: '#facc15' },
  planned:  { color: '#a78bfa' },
};

function Intro({ text }) {
  return (
    <p className="text-app/80 text-sm leading-relaxed max-w-3xl mb-8
                  border-l-2 border-app-strong pl-4">
      {text}
    </p>
  );
}

function LabSection({ t }) {
  const lab = t.cyber.lab;
  const hasContent =
    (lab.vms?.length || 0) + (lab.tools?.length || 0) + (lab.exercises?.length || 0) > 0;

  return (
    <div>
      <h2 className="text-xl font-bold text-app mb-1">{lab.title}</h2>
      <p className="text-app-muted text-sm mb-5">{lab.subtitle}</p>
      <Intro text={lab.intro} />

      {!hasContent ? (
        <EmptyState title={lab.emptyTitle} desc={lab.emptyDesc} prompt="$ ls -la lab/" />
      ) : (
        <>
          <SectionBlock title={lab.sections.vms}       items={lab.vms}       statusLabels={lab.status} />
          <SectionBlock title={lab.sections.tools}     items={lab.tools}     statusLabels={lab.status} />
          <SectionBlock title={lab.sections.exercises} items={lab.exercises} statusLabels={lab.status} />
        </>
      )}
    </div>
  );
}

function WriteupsSection({ t }) {
  const w = t.cyber.writeups;
  const items = w.items || [];

  return (
    <div>
      <h2 className="text-xl font-bold text-app mb-1">{w.title}</h2>
      <p className="text-app-muted text-sm mb-5">{w.subtitle}</p>
      <Intro text={w.intro} />

      {!items.length ? (
        <EmptyState title={w.emptyTitle} desc={w.emptyDesc} prompt="$ find writeups/ -type f" />
      ) : (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="group p-4 rounded-lg border border-app bg-surface-soft
                                   hover:border-app-strong hover:shadow-app transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-app font-semibold text-sm">{item.title}</h3>
                    {item.difficulty && (
                      <span
                        className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
                        style={{
                          color: DIFF_COLOR[item.difficulty],
                          border: `1px solid ${DIFF_COLOR[item.difficulty]}40`,
                        }}
                      >
                        {w.difficulty[item.difficulty]}
                      </span>
                    )}
                  </div>
                  <p className="text-app-muted text-xs font-mono">
                    {item.platform} · {item.category} · {item.date}
                  </p>
                  {item.summary && (
                    <p className="text-app/80 text-sm mt-2 leading-relaxed">{item.summary}</p>
                  )}
                </div>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noreferrer"
                     className="text-app-dim group-hover:text-app-accent transition-colors shrink-0">
                    <FaExternalLinkAlt size={12} />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NotesSection({ t }) {
  const n = t.cyber.notes;
  const items = n.items || [];

  return (
    <div>
      <h2 className="text-xl font-bold text-app mb-1">{n.title}</h2>
      <p className="text-app-muted text-sm mb-5">{n.subtitle}</p>
      <Intro text={n.intro} />

      {!items.length ? (
        <EmptyState title={n.emptyTitle} desc={n.emptyDesc} prompt="$ cat notes/*.md | wc -l" />
      ) : (
        <ul className="grid sm:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <li key={i} className="group p-4 rounded-lg border border-app bg-surface-soft
                                   hover:border-app-strong hover:shadow-app transition-all">
              <p className="text-app-dim font-mono text-[10px] tracking-wider mb-1">{item.date}</p>
              <h3 className="text-app font-semibold text-base mb-2 group-hover:text-app-accent transition-colors">
                {item.title}
              </h3>
              <p className="text-app-muted text-sm leading-relaxed mb-3">{item.excerpt}</p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-1.5 flex-wrap">
                  {item.tags?.map((tag) => (
                    <span key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded border border-app text-app-muted font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noreferrer"
                     className="text-app-accent text-xs font-mono flex items-center gap-1 hover:underline shrink-0">
                    {n.readMore} <FaExternalLinkAlt size={9} />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyState({ title, desc, prompt }) {
  return (
    <div className="rounded-xl border border-app bg-surface-soft p-8 text-center">
      <p className="text-app text-lg font-semibold mb-2">{title}</p>
      <p className="text-app-muted text-sm max-w-md mx-auto leading-relaxed">{desc}</p>
      {prompt && (
        <p className="mt-4 text-app-dim font-mono text-xs">
          {prompt} <span className="animate-pulse">▊</span>
        </p>
      )}
    </div>
  );
}

function SectionBlock({ title, items, statusLabels }) {
  if (!items?.length) return null;
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 10px var(--glow)' }} />
        <h3 className="text-sm font-mono uppercase tracking-widest text-app-muted">{title}</h3>
        <span className="flex-1 h-px"
              style={{ background: 'linear-gradient(to right, var(--border-strong), transparent)' }} />
      </div>
      <ul className="grid sm:grid-cols-2 gap-3">
        {items.map((it, i) => {
          const s = LAB_STATUS[it.status] || LAB_STATUS.planned;
          return (
            <li key={i} className="p-4 rounded-lg border border-app bg-surface-soft
                                   hover:border-app-strong hover:shadow-app transition-all">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-[10px] font-mono uppercase tracking-wider"
                      style={{ color: s.color }}>
                  {statusLabels[it.status] || it.status}
                </span>
              </div>
              <p className="text-app font-medium text-sm">{it.name || it.title}</p>
              {(it.role || it.desc) && (
                <p className="text-app-muted text-xs mt-1">{it.role || it.desc}</p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const DIFF_COLOR = { easy: '#00ff88', medium: '#facc15', hard: '#ef4444' };

export default function Cyber() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('lab');

  const TABS = [
    { id: 'lab',      label: t.cyber.tabs.lab,      content: <LabSection t={t} /> },
    { id: 'writeups', label: t.cyber.tabs.writeups, content: <WriteupsSection t={t} /> },
    { id: 'notes',    label: t.cyber.tabs.notes,    content: <NotesSection t={t} /> },
  ];

  const ActiveTab = TABS.find((x) => x.id === tab);

  return (
    <div>
      <header className="mb-10">
        <p className="text-app-accent font-mono text-xs tracking-widest uppercase mb-2">
          {t.cyber.eyebrow}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-app">{t.cyber.title}</h1>
        <p className="text-app-muted text-sm mt-2">{t.cyber.subtitle}</p>
      </header>

      {/* Intro geral */}
      <p className="text-app/80 text-sm leading-relaxed max-w-3xl mb-10
                    border-l-2 border-app-strong pl-4">
        {t.cyber.intro}
      </p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-8 border-b border-app">
        {TABS.map((x) => {
          const isActive = tab === x.id;
          return (
            <button
              key={x.id}
              onClick={() => setTab(x.id)}
              className={`relative px-4 py-2 text-sm rounded-t-md transition-colors ${
                isActive ? 'text-app' : 'text-app-muted hover:text-app'
              }`}
            >
              {x.label}
              {isActive && (
                <motion.span
                  layoutId="cyber-tab"
                  className="absolute left-0 right-0 -bottom-px h-0.5"
                  style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 8px var(--glow)' }}
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {ActiveTab.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}