import { useLanguage } from '../contexts/useLanguage';

const SKILLS = [
  { name: 'Python',      group: 'known',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'C#',          group: 'known',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
  { name: 'SQL Server',  group: 'known',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg' },
  { name: 'Git',         group: 'known',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'VS Code',     group: 'known',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },

  { name: 'AWS',         group: 'learning', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
  { name: 'GCP',         group: 'learning', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' },
  { name: 'Docker',      group: 'learning', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Linux',       group: 'learning', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
];

export default function Skills() {
  const { t } = useLanguage();
  const groups = ['known', 'learning'];

  return (
    <div>
      <header className="mb-12">
        <p className="text-app-accent font-mono text-xs tracking-widest uppercase mb-2">
          {t.skills.eyebrow}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-app">{t.skills.title}</h1>
        <p className="text-app-muted text-sm mt-2 max-w-2xl">{t.skills.subtitle}</p>
      </header>

      {/* Arsenal */}
      <section className="mb-16">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-app">{t.skills.arsenalTitle}</h2>
          <p className="text-app-muted text-sm mt-1">{t.skills.arsenalSubtitle}</p>
        </header>

        <div className="space-y-10">
          {groups.map((g) => (
            <div key={g}>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: g === 'known' ? 'var(--accent)' : 'transparent',
                    border: g === 'learning' ? '2px solid var(--accent)' : 'none',
                    boxShadow: g === 'known' ? '0 0 10px var(--glow)' : 'none',
                  }}
                />
                <h3 className="text-sm font-mono uppercase tracking-widest text-app-muted">
                  {t.skills.groups[g]}
                </h3>
                <span className="flex-1 h-px"
                      style={{ background: 'linear-gradient(to right, var(--border-strong), transparent)' }} />
                {g === 'learning' && (
                  <span className="text-[10px] font-mono text-app-dim uppercase tracking-wider">
                    {t.skills.learningHint}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {SKILLS.filter((s) => s.group === g).map((s) => (
                  <div
                    key={s.name}
                    className={`group flex flex-col items-center gap-2 p-3 rounded-lg
                               border border-app bg-surface-soft
                               hover:border-app-strong hover:shadow-app
                               transition-all ${g === 'learning' ? 'opacity-70 hover:opacity-100' : ''}`}
                  >
                    <img
                      src={s.icon}
                      alt={s.name}
                      className="h-10 w-10 md:h-12 md:w-12 transition-transform group-hover:scale-110"
                      loading="lazy"
                    />
                    <span className="text-[11px] text-app-muted text-center">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Soft Skills */}
      <section className="pt-12 border-t border-app">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-app">{t.skills.softTitle}</h2>
          <p className="text-app-muted text-sm mt-1">{t.skills.softSubtitle}</p>
        </header>

        <ul className="grid sm:grid-cols-2 gap-3">
          {t.skills.softItems.map((s, i) => (
            <li
              key={s.title}
              className="group relative p-4 rounded-lg border border-app bg-surface-soft
                         hover:border-app-strong hover:shadow-app transition-all"
            >
              <span
                className="absolute left-0 top-0 h-full w-[2px] scale-y-0
                           group-hover:scale-y-100 origin-center
                           transition-transform duration-300 rounded-l-lg"
                style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 8px var(--glow)' }}
              />
              <div className="flex items-start gap-3">
                <span className="font-mono text-[10px] text-app-dim mt-1 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-app group-hover:text-app-accent transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-app-muted text-xs mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}