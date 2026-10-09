import { useState } from 'react';
import { useLanguage } from '../contexts/useLanguage';
import { pickText } from '../utils/pickText';

/* =========================================================
   DADOS HARD-CODED
   ========================================================= */
const BIO = {
  pt: [
    'Sou estudante de TI no COTUCA (Unicamp), formada no técnico e atualmente estagiando como desenvolvedora ADVPL no ecossistema TOTVS Protheus. Fui aprovada em Cibersegurança na FIAP e vou começar em 2027.',
    'Meu foco é segurança defensiva. Gosto de entender como sistemas funcionam por dentro — de infraestrutura a código — porque acredito que não dá pra proteger o que não se entende.',
    'Estou construindo projetos que mostram isso na prática: simuladores de SOC, laboratórios, análise de logs. Tudo no GitHub, tudo documentado.',
  ],
  en: [
    'I study IT at COTUCA (Unicamp), graduated from the technical program and currently interning as an ADVPL developer in the TOTVS Protheus ecosystem. I was accepted into FIAP for Cybersecurity starting in 2027.',
    'My focus is defensive security. I like understanding how systems work from the inside — from infrastructure to code — because I believe you cannot protect what you do not understand.',
    'I am building projects that show this in practice: SOC simulators, labs, log analysis. All on GitHub, all documented.',
  ],
};

const ACADEMIC = [
  {
    title: { pt: 'Cibersegurança', en: 'Cybersecurity' },
    place: { pt: 'FIAP', en: 'FIAP' },
    period: { pt: '2027 — 2029', en: '2027 — 2029' },
    desc: {
      pt: 'Graduação em Cibersegurança. Foco em segurança defensiva, análise de ameaças, resposta a incidentes e infraestrutura.',
      en: 'Cybersecurity degree. Focus on defensive security, threat analysis, incident response, and infrastructure.',
    },
    tags: ['Blue Team', 'SOC', 'Threat Intel'],
  },
  {
    title: { pt: 'Técnico em Informática', en: 'Technical Degree in IT' },
    place: { pt: 'COTUCA — Unicamp', en: 'COTUCA — Unicamp' },
    period: { pt: '2022 — 2026', en: '2022 — 2026' },
    desc: {
      pt: 'Curso técnico integrado ao ensino médio. Base em programação, redes, banco de dados e desenvolvimento de sistemas.',
      en: 'Technical program integrated with high school. Foundation in programming, networks, databases, and systems development.',
    },
    tags: ['Programação', 'Redes', 'Banco de Dados'],
  },
];

const PROFESSIONAL = [
  {
    title: { pt: 'Estágio em Desenvolvimento ADVPL', en: 'ADVPL Development Internship' },
    place: { pt: 'TOTVS Protheus', en: 'TOTVS Protheus' },
    period: { pt: '2026 — 2027', en: '2026 — 2027' },
    desc: {
      pt: 'Desenvolvimento de rotinas customizadas em ADVPL, geração de relatórios HTML, integrações REST e automações no ecossistema Protheus.',
      en: 'Development of custom ADVPL routines, HTML report generation, REST integrations, and automation in the Protheus ecosystem.',
    },
    tags: ['ADVPL', 'Protheus', 'SQL', 'REST'],
  },
];

const CERTIFICATIONS = {
  items: [
    {
      id: 'isc2-cc',
      name: 'ISC2 Certified in Cybersecurity (CC)',
      issuer: 'ISC2',
      year: 2026,
      status: 'studying',
      progress: 40,
    },
    {
      id: 'comptia-security',
      name: 'CompTIA Security+',
      issuer: 'CompTIA',
      year: 2027,
      status: 'planned',
      progress: 0,
    },
    {
      id: 'blue-team-l1',
      name: 'Blue Team Level 1 (BTL1)',
      issuer: 'Security Blue Team',
      year: 2027,
      status: 'planned',
      progress: 0,
    },
    {
      id: 'ejpt',
      name: 'eJPT — Junior Penetration Tester',
      issuer: 'INE Security',
      year: 2028,
      status: 'planned',
      progress: 0,
    },
  ],
  overallProgress: null,
};

/* =========================================================
   COMPONENTES INTERNOS
   ========================================================= */
function Timeline({ items, lang }) {
  return (
    <ol className="relative border-l border-app pl-6 space-y-8">
      {items.map((it, i) => (
        <li key={i} className="relative group">
          <span
            className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 group-hover:scale-125 transition-transform"
            style={{
              backgroundColor: 'var(--accent)',
              borderColor: 'var(--bg)',
              boxShadow: '0 0 10px var(--glow)',
            }}
          />
          <p className="text-[10px] font-mono text-app-dim tracking-wider uppercase">
            {pickText(it.period, lang)}
          </p>
          <h3 className="text-app font-semibold mt-1 group-hover:text-app-accent transition-colors">
            {pickText(it.title, lang)}
          </h3>
          <p className="text-app-muted text-xs mt-0.5">{pickText(it.place, lang)}</p>
          <p className="text-app/80 text-sm mt-2 leading-relaxed">{pickText(it.desc, lang)}</p>
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
              }}
            />
          </div>

          <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-app-dim">
            <span>{items.filter((c) => c.status === 'done').length} concluída(s)</span>
            <span>·</span>
            <span>{items.filter((c) => c.status === 'studying').length} estudando</span>
            <span>·</span>
            <span>{items.filter((c) => c.status === 'planned').length} planejada(s)</span>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-[1fr_1.2fr] gap-6 max-w-4xl">
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

  const bio = BIO[lang] || BIO.pt;

  return (
    <div>
      <header className="mb-12">
        <p className="text-app-accent font-mono text-xs tracking-widest uppercase mb-2">
          {t.sobre.eyebrow}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-app">{t.sobre.title}</h1>
        <p className="text-app-muted text-sm mt-2 max-w-2xl">{t.sobre.subtitle}</p>
      </header>

      <section className="max-w-3xl space-y-4 mb-16">
        {bio.map((paragraph, i) => (
          <p key={i} className="text-app/85 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </section>

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
            <Timeline items={ACADEMIC} lang={lang} />
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
            <Timeline items={PROFESSIONAL} lang={lang} />
          </section>
        </div>

        <Certifications t={t} certifications={CERTIFICATIONS} />
      </section>
    </div>
  );
}