import { useLanguage } from '../contexts/LanguageContext';

function Timeline({ items }) {
  return (
    <ol className="relative border-l border-app pl-6 space-y-8">
      {items.map((it) => (
        <li key={it.title} className="relative group">
          <span
            className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 group-hover:scale-125 transition-transform"
            style={{
              backgroundColor: 'var(--accent)',
              borderColor: 'var(--bg)',
              boxShadow: '0 0 10px var(--glow)',
            }}
          />
          <p className="text-[10px] font-mono text-app-dim tracking-wider uppercase">{it.period}</p>
          <h3 className="text-app font-semibold mt-1 group-hover:text-app-accent transition-colors">
            {it.title}
          </h3>
          <p className="text-app-muted text-xs mt-0.5">{it.place}</p>
          <p className="text-app/80 text-sm mt-2 leading-relaxed">{it.desc}</p>

          {it.tags && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {it.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded border border-app bg-surface-soft text-app-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

export default function Education() {
  const { t } = useLanguage();

  return (
    <div>
      <header className="mb-10">
        <p className="text-app-accent font-mono text-xs tracking-widest uppercase mb-2">
          {t.education.eyebrow}
        </p>
        <h1 className="text-3xl font-bold text-app">{t.education.title}</h1>
        <p className="text-app-muted text-sm mt-2">{t.education.subtitle}</p>
      </header>

      <div className="grid md:grid-cols-2 gap-10 md:gap-8">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 10px var(--glow)' }} />
            <h2 className="text-sm font-mono uppercase tracking-widest text-app-muted">
              {t.education.academic}
            </h2>
            <span className="flex-1 h-px"
                  style={{ background: 'linear-gradient(to right, var(--border-strong), transparent)' }} />
          </div>
          <Timeline items={t.education.items.academic} />
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 10px var(--glow)' }} />
            <h2 className="text-sm font-mono uppercase tracking-widest text-app-muted">
              {t.education.professional}
            </h2>
            <span className="flex-1 h-px"
                  style={{ background: 'linear-gradient(to right, var(--border-strong), transparent)' }} />
          </div>
          <Timeline items={t.education.items.professional} />
        </section>
      </div>
    </div>
  );
}