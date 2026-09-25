import { useLanguage } from '../contexts/useLanguage';
import { usePortfolioData, pickText } from '../hooks/usePortfolioData';

function Card({ children, className = '', hover = true }) {
  return (
    <div
      className={`group relative rounded-2xl border border-app bg-surface-soft
                  overflow-hidden transition-all ${
                    hover ? 'hover:border-app-strong hover:shadow-app hover:-translate-y-0.5' : ''
                  } ${className}`}
    >
      {children}
    </div>
  );
}

export default function Skills() {
  const { t, lang } = useLanguage();
  const { skills, loading, error } = usePortfolioData();

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
      </div>
    );
  }

  const known = skills?.arsenal?.known || [];
  const learning = skills?.arsenal?.learning || [];
  const soft = skills?.soft || [];

  return (
    <div>
      <header className="mb-10">
        <p className="text-app-accent font-mono text-xs tracking-widest uppercase mb-2">
          {t.skills.eyebrow}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-app">{t.skills.title}</h1>
        <p className="text-app-muted text-sm mt-2 max-w-2xl">{t.skills.subtitle}</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {/* COLUNA 1 — Arsenal */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 10px var(--glow)' }} />
            <h2 className="text-sm font-mono uppercase tracking-widest text-app-muted">
              {t.skills.arsenalTitle}
            </h2>
            <span className="flex-1 h-px"
                  style={{ background: 'linear-gradient(to right, var(--border-strong), transparent)' }} />
          </div>

          <div className="space-y-4">
            {/* Domino */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: 'var(--accent)' }} />
                <p className="text-[10px] font-mono uppercase tracking-widest text-app-muted">
                  {t.skills.groups.known}
                </p>
                <span className="text-[10px] font-mono text-app-dim ml-auto">
                  {known.length}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {known.map((s) => (
                  <div
                    key={s.name}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg
                               border border-app bg-surface"
                  >
                    <img
                      src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${s.icon}.svg`}
                      alt={s.name}
                      className="h-8 w-8"
                      loading="lazy"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span className="text-[10px] text-app text-center font-mono">
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Em evolução */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full border"
                      style={{ borderColor: 'var(--accent)' }} />
                <p className="text-[10px] font-mono uppercase tracking-widest text-app-muted">
                  {t.skills.groups.learning}
                </p>
                <span className="text-[10px] font-mono text-app-dim ml-auto">
                  {learning.length}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {learning.map((s) => (
                  <div
                    key={s.name}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg
                               border border-app bg-surface opacity-70 hover:opacity-100
                               transition-opacity"
                  >
                    <img
                      src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${s.icon}.svg`}
                      alt={s.name}
                      className="h-8 w-8"
                      loading="lazy"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span className="text-[10px] text-app-muted text-center font-mono">
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* COLUNA 2 — Soft Skills */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 10px var(--glow)' }} />
            <h2 className="text-sm font-mono uppercase tracking-widest text-app-muted">
              {t.skills.softTitle}
            </h2>
            <span className="flex-1 h-px"
                  style={{ background: 'linear-gradient(to right, var(--border-strong), transparent)' }} />
          </div>

          <ul className="space-y-3">
            {soft.map((s, i) => (
              <li
                key={i}
                className="group p-4 rounded-2xl border border-app bg-surface-soft
                           hover:border-app-strong hover:shadow-app
                           hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-[10px] text-app-dim tabular-nums mt-1 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-app font-semibold text-sm mb-1 leading-tight
                                   group-hover:text-app-accent transition-colors">
                      {pickText(s.title, lang)}
                    </h3>
                    <p className="text-app-muted text-xs leading-relaxed">
                      {pickText(s.desc, lang)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}