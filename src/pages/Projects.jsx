import { Link } from 'react-router-dom';
import { FaStar, FaCodeBranch, FaArrowRight } from 'react-icons/fa';
import { useGithubProjects } from '../hooks/useGithubProjects';
import { useLanguage } from '../contexts/useLanguage';

const LANG_EMOJI = {
  JavaScript: '🟨',
  TypeScript: '🔷',
  Python: '🐍',
  Ruby: '💎',
  Java: '☕',
  'C#': '🎯',
  'C++': '🔵',
  HTML: '🌐',
  CSS: '🎨',
  Shell: '🐚',
  Go: '🐹',
  Rust: '🦀',
  PHP: '🐘',
  Swift: '🦅',
  Kotlin: '🟪',
};

export default function Projects() {
  const { t } = useLanguage();
  const { repos, loading, error } = useGithubProjects(12);

  return (
    <div>
      <header className="mb-10">
        <p className="text-app-accent font-mono text-xs tracking-widest uppercase mb-2">
          {t.projects.eyebrow}
        </p>
        <h1 className="text-3xl font-bold text-app">{t.projects.title}</h1>
        <p className="text-app-muted text-sm mt-2">{t.projects.subtitle}</p>
      </header>

      {loading && (
        <p className="text-app-muted text-sm animate-pulse">
          {t.projects.loading} ⏳
        </p>
      )}

      {error && (
        <div className="text-red-400 text-sm">
          <p>{t.projects.error}: {error}</p>
          <p className="text-app-muted text-xs mt-1">{t.projects.errorHint}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {repos.map((r) => (
            <Link
              key={r.id}
              to={`/projetos/${r.name}`}
              className="group rounded-2xl border border-app bg-surface-soft
                         overflow-hidden hover:border-app-strong hover:shadow-app
                         hover:-translate-y-0.5 transition-all flex flex-col"
            >
              {/* Área da imagem */}
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

              {/* Conteúdo */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-app font-mono font-semibold text-sm mb-2
                               flex items-center gap-2 truncate">
                  <span className="text-app-dim">&lt;</span>
                  <span className="truncate">{r.name}</span>
                  <span className="text-app-dim">/&gt;</span>
                </h3>

                <p className="text-app-muted text-xs leading-relaxed mb-3
                              flex-1 line-clamp-3">
                  {r.summary || t.projects.empty}
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
                    {t.projects.viewDetails} <FaArrowRight size={9} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}