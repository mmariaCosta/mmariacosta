import { FaStar, FaCodeBranch, FaExternalLinkAlt } from 'react-icons/fa';
import { useGithubProjects } from '../hooks/useGithubProjects';
import { useLanguage } from '../contexts/LanguageContext';

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
        <p className="text-app-muted text-sm animate-pulse">{t.projects.loading} ⏳</p>
      )}

      {error && (
        <div className="text-red-400 text-sm">
          <p>{t.projects.error}: {error}</p>
          <p className="text-app-muted text-xs mt-1">{t.projects.errorHint}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid md:grid-cols-2 gap-4">
          {repos.map((r) => (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col p-4 rounded-lg
                         border border-app bg-surface-soft
                         hover:border-app-strong hover:shadow-app
                         transition-all"
            >
              <h3 className="text-app font-mono font-semibold text-sm mb-2 flex items-center gap-2 truncate">
                <span className="text-app-dim">&lt;</span>
                <span className="truncate">{r.name}</span>
                <span className="text-app-dim">/&gt;</span>
              </h3>

              <p className="text-app-muted text-xs leading-relaxed mb-3 flex-1">
                {r.summary || t.projects.empty}
              </p>

              <div className="flex items-center gap-3 text-[11px] text-app-muted">
                {r.language && (
                  <span className="px-2 py-0.5 rounded border border-app">{r.language}</span>
                )}
                <span className="flex items-center gap-1"><FaStar size={10} /> {r.stars}</span>
                <span className="flex items-center gap-1"><FaCodeBranch size={10} /> {r.forks}</span>
                <span className="ml-auto text-app-dim group-hover:text-app-accent transition-colors">
                  <FaExternalLinkAlt size={10} />
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}