import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaStar, FaCodeBranch, FaArrowRight, FaGithub, FaExternalLinkAlt,
} from 'react-icons/fa';
import { useLanguage } from '../contexts/useLanguage';
import LabCard from '../components/LabCard';
import { carregarLabs } from '../utils/labs';

/* =========================================================
   DADOS DOS PROJETOS
   Edita esse array quando quiser adicionar/remover projetos.
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
    stars: 0,
    forks: 0,
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
    stars: 0,
    forks: 0,
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
    stars: 0,
    forks: 0,
  },
];

/* =========================================================
   DADOS DO CYBER (writeups / notas / lab)
   Vazio por enquanto. Preenche quando tiver conteúdo.
   ========================================================= */
const CYBER_WRITEUPS = [];
const CYBER_NOTES = [];
const CYBER_LAB = [];

const LANG_EMOJI = {
  JavaScript: '🟨', TypeScript: '🔷', Python: '🐍',
  Ruby: '💎', Java: '☕', 'C#': '🎯',
  'C++': '🔵', HTML: '🌐', CSS: '🎨',
  Shell: '🐚', Go: '🐹', Rust: '🦀',
};

/* =========================================================
   PÁGINA
   ========================================================= */
export default function Projects() {
  const { t, lang } = useLanguage();
  const [tab, setTab] = useState('repos');

  const TABS = [
    { id: 'repos',    label: t.projects?.tabs?.repos    || 'Repos',     count: PROJETOS.length },
    { id: 'writeups', label: t.projects?.tabs?.writeups || 'Write-ups', count: CYBER_WRITEUPS.length },
    { id: 'notes',    label: t.projects?.tabs?.notes    || 'Notas',     count: CYBER_NOTES.length },
    { id: 'lab', label: t.projects?.tabs?.lab || 'Lab', count: carregarLabs().length },
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
          {tab === 'repos' && <ReposTab t={t} />}
          {tab === 'writeups' && <CyberEmptyTab label="// sem write-ups ainda" />}
          {tab === 'notes' && <CyberEmptyTab label="// sem notas ainda" />}
          {tab === 'lab' && <LabsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* =========================================================
   TAB: REPOS (agora estática)
   ========================================================= */
function ReposTab({ t }) {
  if (PROJETOS.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-app rounded-2xl">
        <p className="text-app-muted text-sm font-mono">// sem repositórios</p>
      </div>
    );
  }

  return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {PROJETOS.map((r) => (
        <ProjetoCard key={r.id} projeto={r} t={t} />
      ))}
    </div>
  );
}

/* =========================================================
   CARD DE PROJETO
   ========================================================= */
function ProjetoCard({ projeto, t }) {
  return (
    <article
      className="group rounded-2xl border border-app bg-surface-soft
                 overflow-hidden hover:border-app-strong hover:shadow-app
                 hover:-translate-y-0.5 transition-all flex flex-col"
    >
      {/* Capa */}
      <div className="aspect-video overflow-hidden bg-[#0a0613] relative">
        {projeto.cover ? (
          <img
            src={projeto.cover}
            alt={projeto.name}
            width="600"
            height="400"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500
                       group-hover:scale-105"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center
                          bg-gradient-to-br from-purple-900/50 to-purple-700/20">
            <span className="text-4xl mb-2">
              {LANG_EMOJI[projeto.language] || '📦'}
            </span>
            <span className="text-app-muted font-mono text-[10px] uppercase tracking-widest">
              {projeto.language || 'project'}
            </span>
          </div>
        )}

        {projeto.language && (
          <span className="absolute top-2 right-2 text-[10px] font-mono
                           px-2 py-0.5 rounded bg-black/60 text-purple-200
                           backdrop-blur-sm">
            {projeto.language}
          </span>
        )}
      </div>

      {/* Corpo */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-app font-mono font-semibold text-sm mb-2
                       flex items-center gap-2 truncate">
          <span className="text-app-dim">&lt;</span>
          <span className="truncate">{projeto.name}</span>
          <span className="text-app-dim">/&gt;</span>
        </h3>

        <p className="text-app-muted text-xs leading-relaxed mb-4 flex-1 line-clamp-4">
          {projeto.summary}
        </p>

        {/* Stack */}
        {projeto.stack && projeto.stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {projeto.stack.map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-mono px-2 py-0.5 rounded
                           border border-app text-app-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-app">
          <a
            href={projeto.demo}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2
                       px-3 py-2 rounded-lg text-xs font-medium
                       bg-[var(--accent)] text-white
                       hover:opacity-90 transition-opacity"
          >
            <FaExternalLinkAlt size={10} />
            Ver demo
          </a>

          <a
            href={projeto.github}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-2
                       px-3 py-2 rounded-lg text-xs font-medium
                       border border-app text-app-muted
                       hover:border-app-strong hover:text-app transition-colors"
          >
            <FaGithub size={11} />
            GitHub
          </a>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   TAB VAZIA (cyber)
   ========================================================= */
function CyberEmptyTab({ label }) {
  return (
    <div className="text-center py-16 border border-dashed border-app rounded-2xl">
      <p className="text-app-muted text-sm font-mono">{label}</p>
    </div>
  );
}

function LabsTab() {
  const labs = carregarLabs();

  if (labs.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-app rounded-2xl">
        <p className="text-app-muted text-sm font-mono">// sem labs publicados ainda</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {labs.map((lab) => (
        <LabCard key={lab.slug} lab={lab} />
      ))}
    </div>
  );
}