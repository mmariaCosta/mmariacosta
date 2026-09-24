import { FaEnvelope } from 'react-icons/fa';
import { useLanguage } from '../contexts/useLanguage';

const ICONS = ['🛡️', '🔍', '⚙️', '📊', '📚', '🚨'];

export default function Services() {
  const { t } = useLanguage();

  return (
    <div>
      <header className="mb-12">
        <p className="text-app-accent font-mono text-xs tracking-widest uppercase mb-2">
          {t.services.eyebrow}
        </p>
        <h1 className="text-3xl font-bold text-app">{t.services.title}</h1>
        <p className="text-app-muted text-sm mt-2 max-w-2xl">
          {t.services.subtitle}
        </p>
      </header>

      <ul className="grid md:grid-cols-2 gap-4">
        {t.services.items.map((s, i) => (
          <li
            key={s.title}
            className="group p-5 rounded-xl border border-app bg-surface-soft
                       hover:border-app-strong hover:shadow-app
                       hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">{ICONS[i] || '•'}</span>
              <div className="flex-1 min-w-0">
                <h3 className="text-app font-semibold text-base mb-2
                               group-hover:text-app-accent transition-colors">
                  {s.title}
                </h3>
                <p className="text-app-muted text-sm leading-relaxed mb-3">
                  {s.desc}
                </p>
                <ul className="space-y-1">
                  {s.bullets?.map((b) => (
                    <li key={b} className="text-app-dim text-xs font-mono flex items-start gap-2">
                      <span className="text-app-accent mt-0.5">▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <section className="mt-16 p-8 rounded-xl border border-app-strong
                          bg-surface-soft text-center">
        <h2 className="text-xl font-bold text-app mb-2">{t.services.ctaTitle}</h2>
        <p className="text-app-muted text-sm mb-5 max-w-md mx-auto">
          {t.services.ctaSubtitle}
        </p>
        <a
            href="mailto:mmaria.costa@outlook.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg
                        text-white font-medium transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 20px var(--glow)' }}
            >
            <FaEnvelope size={14} /> {t.services.ctaButton}
            </a>
      </section>
    </div>
  );
}