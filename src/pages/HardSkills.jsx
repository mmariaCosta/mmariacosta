import { useLanguage } from '../contexts/LanguageContext';

const SKILLS = [
  // ===== DOMINO =====
  { name: 'Python',      group: 'known',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'C#',          group: 'known',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
  { name: 'SQL Server',  group: 'known',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg' },
  { name: 'Git',         group: 'known',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name: 'VS Code',     group: 'known',    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },

  // ===== EM EVOLUÇÃO =====
  { name: 'AWS',         group: 'learning', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
  { name: 'GCP',         group: 'learning', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' },
  { name: 'Docker',      group: 'learning', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
  { name: 'Linux',       group: 'learning', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
];

export default function HardSkills() {
  const { t } = useLanguage();
  const groups = ['known', 'learning'];

  return (
    <div>
      <header className="mb-10">
        <p className="text-app-accent font-mono text-xs tracking-widest uppercase mb-2">
          {t.hard.eyebrow}
        </p>
        <h1 className="text-3xl font-bold text-app">{t.hard.title}</h1>
        <p className="text-app-muted text-sm mt-2">{t.hard.subtitle}</p>
      </header>

      <div className="space-y-10">
        {groups.map((g) => (
          <section key={g}>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: g === 'known' ? 'var(--accent)' : 'transparent',
                  border: g === 'learning' ? '2px solid var(--accent)' : 'none',
                  boxShadow: g === 'known' ? '0 0 10px var(--glow)' : 'none',
                }}
              />
              <h2 className="text-sm font-mono uppercase tracking-widest text-app-muted">
                {t.hard.groups[g]}
              </h2>
              <span
                className="flex-1 h-px"
                style={{
                  background: 'linear-gradient(to right, var(--border-strong), transparent)',
                }}
              />
              {g === 'learning' && (
                <span className="text-[10px] font-mono text-app-dim uppercase tracking-wider">
                  {t.hard.learningHint}
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
                    className="h-10 w-10 md:h-12 md:w-12
                               transition-transform group-hover:scale-110"
                    loading="lazy"
                  />
                  <span className="text-[11px] text-app-muted text-center">{s.name}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}