import { useLanguage } from '../contexts/LanguageContext';

export default function SoftSkills() {
  const { t } = useLanguage();

  return (
    <div>
      <header className="mb-10">
        <p className="text-app-accent font-mono text-xs tracking-widest uppercase mb-2">
          {t.soft.eyebrow}
        </p>
        <h1 className="text-3xl font-bold text-app">{t.soft.title}</h1>
        <p className="text-app-muted text-sm mt-2">{t.soft.subtitle}</p>
      </header>

      <ul className="grid sm:grid-cols-2 gap-3">
        {t.soft.items.map((s, i) => (
          <li
            key={s.title}
            className="group relative p-4 rounded-lg
                       border border-app bg-surface-soft
                       hover:border-app-strong hover:shadow-app
                       transition-all duration-200"
          >
            {/* linha lateral que cresce no hover */}
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
                <p className="text-app-muted text-xs mt-1 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* chip terminal */}
      <div className="mt-10 flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                        border border-app bg-surface-soft backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-app-muted text-xs font-mono">
            {t.soft.items.length} {t.soft.footer}
          </span>
        </div>
      </div>
    </div>
  );
}