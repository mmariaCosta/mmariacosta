import { useLanguage } from '../contexts/useLanguage';

const SKILLS = [
  { name: 'Python',      group: 'known',    icon: 'python/python-original' },
  { name: 'C#',          group: 'known',    icon: 'csharp/csharp-original' },
  { name: 'SQL Server',  group: 'known',    icon: 'microsoftsqlserver/microsoftsqlserver-plain' },
  { name: 'Git',         group: 'known',    icon: 'git/git-original' },
  { name: 'VS Code',     group: 'known',    icon: 'vscode/vscode-original' },
  { name: 'AWS',         group: 'learning', icon: 'amazonwebservices/amazonwebservices-original-wordmark' },
  { name: 'GCP',         group: 'learning', icon: 'googlecloud/googlecloud-original' },
  { name: 'Docker',      group: 'learning', icon: 'docker/docker-original' },
  { name: 'Linux',       group: 'learning', icon: 'linux/linux-original' },
];

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
  const { t } = useLanguage();

  return (
    <div>
      <header className="mb-10">
        <p className="text-app-accent font-mono text-xs tracking-widest uppercase mb-2">
          {t.skills.eyebrow}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-app">{t.skills.title}</h1>
        <p className="text-app-muted text-sm mt-2 max-w-2xl">{t.skills.subtitle}</p>
      </header>

      {/* Duas colunas */}
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
                  {SKILLS.filter((s) => s.group === 'known').length}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {SKILLS.filter((s) => s.group === 'known').map((s) => (
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
                  {SKILLS.filter((s) => s.group === 'learning').length}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {SKILLS.filter((s) => s.group === 'learning').map((s) => (
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
            {t.skills.softItems.map((s, i) => (
              <li
                key={s.title}
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
                      {s.title}
                    </h3>
                    <p className="text-app-muted text-xs leading-relaxed">
                      {s.desc}
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