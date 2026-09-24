import { useState } from 'react';
import { useLanguage } from '../contexts/useLanguage';
import { useTheme } from '../contexts/useTheme';

/* =========================================================
   TIMELINE
   ========================================================= */
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
          <p className="text-[10px] font-mono text-app-dim tracking-wider uppercase">
            {it.period}
          </p>
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

/* =========================================================
   CERTIFICAÇÕES
   ========================================================= */
function Certifications({ t }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const STATUS = {
    done:     { color: 'var(--cert-done)',     icon: '✓', label: t.sobre.certsStatus.done },
    studying: { color: 'var(--cert-studying)', icon: '◐', label: t.sobre.certsStatus.studying },
    planned:  { color: 'var(--cert-planned)',  icon: '○', label: t.sobre.certsStatus.planned },
  };

  const PROGRESS = { planned: 0, studying: 50, done: 100 };

  const active = t.sobre.certs[activeIdx];
  const activeS = STATUS[active.status];

  return (
    <section className="mt-16 pt-12 border-t border-app">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-app">{t.sobre.certsTitle}</h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full
                           border border-app text-app-dim">
            roadmap
          </span>
        </div>
        <p className="text-app-muted text-sm max-w-2xl">{t.sobre.certsSubtitle}</p>
      </header>

      <div className="grid md:grid-cols-[1fr_1.2fr] gap-6 max-w-4xl">
        {/* Lista lateral */}
        <ul className="space-y-1">
          {t.sobre.certs.map((c, i) => {
            const s = STATUS[c.status];
            const isActive = i === activeIdx;
            return (
              <li key={c.name}>
                <button
                  onClick={() => setActiveIdx(i)}
                  className={`w-full text-left p-3 rounded-lg border
                             flex items-center gap-3 transition-all ${
                               isActive
                                 ? 'border-app-strong bg-surface-soft shadow-app'
                                 : 'border-transparent hover:bg-surface-soft/50'
                             }`}
                >
                  <span
                    className="w-1 h-10 rounded-full shrink-0 transition-colors"
                    style={{
                      backgroundColor: isActive ? s.color : 'var(--border)',
                    }}
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-app text-sm font-medium truncate">
                      {c.name}
                    </span>
                    <span className="block text-app-dim text-[10px] font-mono mt-0.5">
                      {c.year} · {PROGRESS[c.status]}%
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Preview do ativo — TRANSLÚCIDO */}
        <div
          className="rounded-xl border p-6 relative overflow-hidden
                     bg-surface-soft backdrop-blur-sm"
          style={{
            borderColor: `color-mix(in srgb, ${activeS.color} 30%, var(--border))`,
          }}
        >
          {/* Glow da cor do status */}
          <div
            className="absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl opacity-25"
            style={{ background: activeS.color }}
          />

          <div className="relative">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center
                           text-3xl font-bold border-2 shrink-0 bg-surface-soft"
                style={{
                  borderColor: activeS.color,
                  color: activeS.color,
                }}
              >
                {activeS.icon}
              </div>

              <div className="text-right">
                <p className="text-[10px] font-mono uppercase tracking-widest text-app-dim">
                  Meta
                </p>
                <p
                  className="text-4xl md:text-5xl font-bold font-mono leading-none"
                  style={{ color: activeS.color }}
                >
                  {active.year}
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-app mb-2">{active.name}</h3>
            <p className="text-app-muted text-sm mb-6">{active.issuer}</p>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-[10px] font-mono uppercase tracking-widest"
                  style={{ color: activeS.color }}
                >
                  {activeS.label}
                </span>
                <span
                  className="text-2xl font-bold font-mono leading-none"
                  style={{ color: activeS.color }}
                >
                  {PROGRESS[active.status]}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-soft overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${PROGRESS[active.status]}%`,
                    backgroundColor: activeS.color,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PÁGINA
   ========================================================= */
export default function Sobre() {
  const { t } = useLanguage();

  return (
    <div>
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
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 10px var(--glow)' }}
              />
              <h3 className="text-sm font-mono uppercase tracking-widest text-app-muted">
                {t.sobre.education.academic}
              </h3>
              <span
                className="flex-1 h-px"
                style={{
                  background:
                    'linear-gradient(to right, var(--border-strong), transparent)',
                }}
              />
            </div>
            <Timeline items={t.sobre.education.items.academic} />
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 10px var(--glow)' }}
              />
              <h3 className="text-sm font-mono uppercase tracking-widest text-app-muted">
                {t.sobre.education.professional}
              </h3>
              <span
                className="flex-1 h-px"
                style={{
                  background:
                    'linear-gradient(to right, var(--border-strong), transparent)',
                }}
              />
            </div>
            <Timeline items={t.sobre.education.items.professional} />
          </section>
        </div>

        <Certifications t={t} />
      </section>
    </div>
  );
}