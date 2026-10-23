import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaArrowRight, FaGithub, FaExternalLinkAlt,
} from 'react-icons/fa';
import { useLanguage } from '../contexts/useLanguage';
import { useLocalContent } from '../hooks/useLocalContent';

/* =========================================================
   DADOS ESTÁTICOS DOS PROJETOS (Repos)
   ========================================================= */
const PROJETOS = [
  {
    id: 'torre-de-controle',
    name: 'Torre de Controle',
    summary: 'SOC simulado com geração de logs em tempo real, 3 regras de detecção baseadas em MITRE ATT&CK, terminal de investigação e relatórios. Backend Python + Frontend React.',
    language: 'Python',
    stack: ['Python', 'FastAPI', 'React', 'Vite'],
    demo: 'https://torre-de-controle-tawny.vercel.app',
    github: 'https://github.com/mmariacosta/torre-de-controle',
    cover: '/projects/torre.png',
  },
  {
    id: 'protheus-workspace',
    name: 'Protheus Workspace',
    summary: 'Portfólio interativo que simula um ambiente corporativo TOTVS Protheus. Relatórios HTML via ADVPL, gestão de chamados, painel de indicadores e dois temas.',
    language: 'JavaScript',
    stack: ['React', 'Vite', 'ADVPL', 'Protheus'],
    demo: 'https://protheus-workspace.vercel.app',
    github: 'https://github.com/mmariacosta/Protheus-Workspace',
    cover: '/projects/protheus.png',
  },
  {
    id: 'mmariacosta',
    name: 'mmariacosta',
    summary: 'Este portfólio. Construído em React + Vite com suporte a dois idiomas, dois temas, terminal interativo e design focado em tipografia. Código aberto pra quem quiser referência.',
    language: 'JavaScript',
    stack: ['React', 'Vite', 'Framer Motion', 'Tailwind'],
    demo: 'https://mmariacosta.vercel.app',
    github: 'https://github.com/mmariacosta/mmariacosta',
    cover: '/projects/portfolio.png',
  },
];

const LANG_EMOJI = {
  JavaScript: '🟨', TypeScript: '🔷', Python: '🐍',
  Ruby: '💎', Java: '☕', 'C#': '🎯',
};

/* =========================================================
   LÓGICA DE TRADUÇÃO (Junta os arquivos PT e EN)
   ========================================================= */
function resolveItemsByLanguage(rawItems, currentLang) {
  const grouped = new Map();

  rawItems.forEach((item) => {
    if (!item.slug) return;
    
    // Se o slug não existe no mapa, cria com valores nulos
    if (!grouped.has(item.slug)) {
      grouped.set(item.slug, { pt: null, en: null, other: null });
    }

    const group = grouped.get(item.slug);
    if (item.lang === 'pt') group.pt = item;
    else if (item.lang === 'en') group.en = item;
    else group.other = item;
  });

  const resolved = [];
  grouped.forEach((group) => {
    // Prioriza o idioma atual, senão cai pro PT, senão EN, senão outro
    let chosen = group[currentLang] || group.pt || group.en || group.other;
    if (chosen) resolved.push(chosen);
  });

  // Ordena pela data mais recente
  return resolved.sort((a, b) => {
    const da = a.data?.date || '';
    const db = b.data?.date || '';
    if (!da) return 1;
    if (!db) return -1;
    return da < db ? 1 : -1;
  });
}

/* =========================================================
   PÁGINA
   ========================================================= */
export default function Projects() {
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState('repos');

  // Pega os dados locais (arquivos .md)
  const { writeups, notes, labs } = useLocalContent();

  // Aplica a lógica para não duplicar os cards
  const cyberWriteups = resolveItemsByLanguage(writeups, lang);
  const cyberNotes = resolveItemsByLanguage(notes, lang);
  const cyberLabs = resolveItemsByLanguage(labs, lang);

  const TABS = [
    { id: 'repos',    label: t.projects?.tabs?.repos    || 'Repos',     count: PROJETOS.length },
    { id: 'writeups', label: t.projects?.tabs?.writeups || 'Write-ups', count: cyberWriteups.length },
    { id: 'notes',    label: t.projects?.tabs?.notes    || 'Notas',     count: cyberNotes.length },
    { id: 'lab',      label: t.projects?.tabs?.lab      || 'Lab',       count: cyberLabs.length },
  ];

  return (
    <div className="space-y-8">
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

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'repos' && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROJETOS.map((r) => (
                <ProjetoCard key={r.id} projeto={r} />
              ))}
            </div>
          )}
          
          {tab === 'writeups' && <CyberTab items={cyberWriteups} emptyLabel="// sem write-ups ainda" />}
          {tab === 'notes' && <CyberTab items={cyberNotes} emptyLabel="// sem notas ainda" />}
          {tab === 'lab' && <CyberTab items={cyberLabs} emptyLabel="// sem labs ainda" />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* =========================================================
   COMPONENTES DE CARD
   ========================================================= */
function ProjetoCard({ projeto }) {
  return (
    <article className="group rounded-2xl border border-app bg-surface-soft overflow-hidden hover:border-app-strong hover:shadow-app hover:-translate-y-0.5 transition-all flex flex-col">
      <div className="aspect-video overflow-hidden bg-[#0a0613] relative">
        <img
          src={projeto.cover}
          alt={projeto.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <span className="absolute top-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-purple-200 backdrop-blur-sm">
          {projeto.language}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-app font-mono font-semibold text-sm mb-2 truncate">
          &lt;{projeto.name}/&gt;
        </h3>
        <p className="text-app-muted text-xs leading-relaxed mb-4 flex-1 line-clamp-4">
          {projeto.summary}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {projeto.stack.map((tech) => (
            <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded border border-app text-app-muted">
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-app">
          <a href={projeto.demo} target="_blank" rel="noreferrer" className="flex-1 flex justify-center items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-[var(--accent)] text-white hover:opacity-90">
            <FaExternalLinkAlt size={10} /> Demo
          </a>
          <a href={projeto.github} target="_blank" rel="noreferrer" className="flex-1 flex justify-center items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border border-app text-app-muted hover:border-app-strong hover:text-app">
            <FaGithub size={11} /> GitHub
          </a>
        </div>
      </div>
    </article>
  );
}

function CyberTab({ items, emptyLabel }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-app rounded-2xl">
        <p className="text-app-muted text-sm font-mono">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item) => (
        <Link
          key={item.slug}
          to={`/cyber/${item.slug}`}
          className="group relative overflow-hidden rounded-xl border border-app bg-surface-soft p-5 hover:border-app-strong hover:-translate-y-0.5 transition-all flex flex-col min-h-[180px]"
        >
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-4">
            <span className="font-bold text-[var(--accent)]">{item.type}</span>
            <span className="text-app-muted">{item.data.date || ''}</span>
          </div>
          <h3 className="text-app font-bold text-base leading-tight mb-2 group-hover:text-app-accent transition-colors line-clamp-2">
            {item.data.title || item.slug}
          </h3>
          <p className="text-app-muted text-xs leading-relaxed line-clamp-3 flex-1">
            {item.data.summary || ''}
          </p>
          <FaArrowRight size={9} className="mt-4 ml-auto text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      ))}
    </div>
  );
}