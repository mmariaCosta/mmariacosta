import { useState } from 'react';
import { useLanguage } from '../contexts/useLanguage';
import { usePortfolioData, pickText } from '../hooks/usePortfolioData';

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
          {it.tags && it.tags.length > 0 && (
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
   CERTIFICAÇÕES — consome JSON
   ========================================================= */
function Certifications({ t, certifications }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const STATUS = {
    done:     { color: 'var(--cert-done)',     icon: '✓', label: t.sobre.certsStatus.done },
    studying: { color: 'var(--cert-studying)', icon: '◐', label: t.sobre.certsStatus.studying },
    planned:  { color: 'var(--cert-planned)',  icon: '○', label: t.sobre.certsStatus.planned },
  };

  const DEFAULT_PROGRESS = { planned: 0, studying: 50, done: 100 };

  const items = certifications?.items || [];
  if (items.length === 0) return null;

  const getProgress = (item) => {
    if (typeof item.progress === 'number') return item.progress;
    return DEFAULT_PROGRESS[item.status] || 0;
  };

  const totalProgress = items.reduce((acc, c) => acc + getProgress(c), 0);
  const maxProgress = items.length * 100;
  const calculatedPct = Math.round((totalProgress / maxProgress) * 100);

  const overallPct =
    typeof certifications.overallProgress === 'number'
      ? certifications.overallProgress
      : calculatedPct;

  const active = items[activeIdx];
  const activeS = STATUS[active.status];
  const activeProgress = getProgress(active);

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

        {/* ===================== BARRA DE PROGRESSO GERAL ===================== */}
        <div className="mt-6 max-w-2xl">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-app-muted uppercase tracking-widest">
              {t.sobre.certsProgressLabel || 'Progresso geral'}
            </span>
            <span className="text-app font-bold text-base">{overallPct}%</span>
          </div>

          <div className="h-3 rounded-full bg-surface-soft overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-700 relative"
              style={{
                width: `${Math.min(overallPct, 100)}%`,
                background: `linear-gradient(90deg,
                        #f3d23e,
                        #b0be5e,
                        #1ea356
                       )`,
                boxShadow: overallPct > 0
                  ? `0 0 12px color-mix(in srgb, var(--cert-studying) 50%, transparent)`
                  : 'none',
              }}
            />
          </div>

          <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-app-dim">
            <span>
              {items.filter((c) => c.status === 'done').length} concluída(s)
            </span>
            <span>·</span>
            <span>
              {items.filter((c) => c.status === 'studying').length} estudando
            </span>
            <span>·</span>
            <span>
              {items.filter((c) => c.status === 'planned').length} planejada(s)
            </span>
          </div>
        </div>
        {/* =================== FIM DA BARRA =================== */}
      </header>

      <div className="grid md:grid-cols-[1fr_1.2fr] gap-6 max-w-4xl">
        {/* Lista lateral */}
        <ul className="space-y-1">
          {items.map((c, i) => {
            const s = STATUS[c.status];
            const isActive = i === activeIdx;
            const itemProgress = getProgress(c);
            return (
              <li key={c.id || c.name}>
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
                      {c.year} · {itemProgress}%
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Preview */}
        <div
          className="rounded-xl border p-6 relative overflow-hidden
                     bg-surface-soft backdrop-blur-sm"
          style={{
            borderColor: `color-mix(in srgb, ${activeS.color} 30%, var(--border))`,
          }}
        >
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
                  {activeProgress}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-soft overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${activeProgress}%`,
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
  const { t, lang } = useLanguage();
  const { profile, certifications, education, loading, error } = usePortfolioData();

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

  // Bio do JSON — agora vem como objeto {pt: [...], en: [...]}
  const bio = profile?.bio?.[lang] || profile?.bio?.pt || [];

  // Converte education JSON pro formato do <Timeline>
  const academicItems = (education?.academic || []).map((it) => ({
    title: pickText(it.title, lang),
    place: pickText(it.place, lang),
    period: pickText(it.period, lang),
    desc: pickText(it.desc, lang),
    tags: it.tags || [],
  }));

  const professionalItems = (education?.professional || []).map((it) => ({
    title: pickText(it.title, lang),
    place: pickText(it.place, lang),
    period: pickText(it.period, lang),
    desc: pickText(it.desc, lang),
    tags: it.tags || [],
  }));

  return (
    <div>
      <header className="mb-12">
        <p className="text-app-accent font-mono text-xs tracking-widest uppercase mb-2">
          {t.sobre.eyebrow}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-app">{t.sobre.title}</h1>
        <p className="text-app-muted text-sm mt-2 max-w-2xl">{t.sobre.subtitle}</p>
      </header>

      {/* Bio — do JSON */}
      <section className="max-w-3xl space-y-4 mb-16">
        {bio.map((paragraph, i) => (
          <p key={i} className="text-app/85 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </section>

      {/* Formação — do JSON */}
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
            <Timeline items={academicItems} />
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
            <Timeline items={professionalItems} />
          </section>
        </div>

        {/* Certificações — do JSON */}
        <Certifications t={t} certifications={certifications} />
      </section>
    </div>
  );
}