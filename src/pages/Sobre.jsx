import { useLanguage } from '../contexts/useLanguage';

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

function Certifications({ t }) {
  const STATUS = {
    done:     { color: '#00ff88', icon: '✓', label: t.sobre.certsStatus.done },
    studying: { color: '#facc15', icon: '◐', label: t.sobre.certsStatus.studying },
    planned:  { color: '#a78bfa', icon: '○', label: t.sobre.certsStatus.planned },
  };
  const PROGRESS = { planned: 0, studying: 50, done: 100 };

  return (
    <section className="mt-16 pt-12 border-t border-app">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-app">{t.sobre.certsTitle}</h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-app text-app-dim">
            roadmap
          </span>
        </div>
        <p className="text-app-muted text-sm max-w-2xl">{t.sobre.certsSubtitle}</p>
      </header>

      <div className="flex flex-wrap gap-4 mb-6 text-xs font-mono">
        {Object.entries(STATUS).map(([key, s]) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ backgroundColor: `${s.color}22`, border: `1px solid ${s.color}`, color: s.color }}
            >
              {s.icon}
            </span>
            <span className="text-app-muted">{s.label}</span>
          </div>
        ))}
      </div>

      <ul className="space-y-3">
        {t.sobre.certs.map((c) => {
          const s = STATUS[c.status];
          const progress = PROGRESS[c.status];
          return (
            <li
              key={c.name}
              className="p-5 rounded-xl border border-app bg-surface-soft
                         hover:border-app-strong hover:shadow-app transition-all"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-lg shrink-0 flex items-center justify-center border"
                  style={{ backgroundColor: `${s.color}11`, borderColor: `${s.color}55` }}
                >
                  <span className="text-xl font-bold font-mono" style={{ color: s.color }}>
                    {s.icon}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-app font-semibold">{c.name}</h3>
                    <span
                      className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded"
                      style={{ color: s.color, border: `1px solid ${s.color}55`, backgroundColor: `${s.color}11` }}
                    >
                      {s.label}
                    </span>
                    <span className="ml-auto text-app-dim text-xs font-mono">{c.year}</span>
                  </div>
                  <p className="text-app-muted text-xs mb-3">{c.issuer}</p>
                  <div className="h-1.5 rounded-full bg-surface-soft overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: s.color,
                        boxShadow: progress > 0 ? `0 0 8px ${s.color}` : 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-app-dim text-xs font-mono italic">{t.sobre.certsHint}</p>
    </section>
  );
}

export default function Sobre() {
  const { t } = useLanguage();

  return (
    <div>
      {/* Header */}
      <header className="mb-12">
        <p className="text-app-accent font-mono text-xs tracking-widest uppercase mb-2">
          {t.sobre.eyebrow}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-app">{t.sobre.title}</h1>
        <p className="text-app-muted text-sm mt-2 max-w-2xl">{t.sobre.subtitle}</p>
      </header>

      {/* Bio */}
      <section className="max-w-3xl space-y-4 mb-16">
        {t.sobre.bio.map((paragraph, i) => (
          <p key={i} className="text-app/85 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </section>

      {/* Formação */}
      <section className="pt-12 border-t border-app">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-app">{t.sobre.eduTitle}</h2>
          <p className="text-app-muted text-sm mt-2">{t.sobre.eduSubtitle}</p>
        </header>

        <div className="grid md:grid-cols-2 gap-10 md:gap-8">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 10px var(--glow)' }} />
              <h3 className="text-sm font-mono uppercase tracking-widest text-app-muted">
                {t.sobre.education.academic}
              </h3>
              <span className="flex-1 h-px"
                    style={{ background: 'linear-gradient(to right, var(--border-strong), transparent)' }} />
            </div>
            <Timeline items={t.sobre.education.items.academic} />
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 10px var(--glow)' }} />
              <h3 className="text-sm font-mono uppercase tracking-widest text-app-muted">
                {t.sobre.education.professional}
              </h3>
              <span className="flex-1 h-px"
                    style={{ background: 'linear-gradient(to right, var(--border-strong), transparent)' }} />
            </div>
            <Timeline items={t.sobre.education.items.professional} />
          </section>
        </div>

        <Certifications t={t} />
      </section>
    </div>
  );
}