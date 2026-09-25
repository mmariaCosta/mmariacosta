import { FaEnvelope } from 'react-icons/fa';
import { useLanguage } from '../contexts/useLanguage';
import { usePortfolioData, pickText } from '../hooks/usePortfolioData';
import ServiceIcon from '../components/ServiceIcon';

export default function Services() {
  const { t, lang } = useLanguage();
  const { profile, services, loading, error } = usePortfolioData();

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

  const items = services?.items || [];
  const email = profile?.email || 'mmaria.costa@outlook.com';

  const SIZES = [
    'md:col-span-2 md:row-span-2',
    '',
    '',
    'md:col-span-2',
    '',
    '',
  ];

  return (
    <div>
      <header className="mb-12">
        <p className="text-app-accent font-mono text-xs tracking-widest uppercase mb-2">
          {t.services.eyebrow}
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-app">{t.services.title}</h1>
        <p className="text-app-muted text-sm mt-2 max-w-2xl">
          {t.services.subtitle}
        </p>
      </header>

      <ul className="grid grid-cols-1 md:grid-cols-4 md:auto-rows-[180px] gap-3">
        {items.map((s, i) => {
          const isBig = i === 0;
          const title = pickText(s.title, lang);
          const desc = pickText(s.desc, lang);
          const bullets = s.bullets?.[lang] || s.bullets?.pt || [];

          return (
            <li
              key={s.id || i}
              className={`group relative p-5 rounded-2xl border border-app
                         bg-surface-soft hover:border-app-strong
                         transition-all overflow-hidden flex flex-col
                         ${SIZES[i] || ''}`}
            >
              <div
                className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl
                           opacity-0 group-hover:opacity-25 transition-opacity"
                style={{ backgroundColor: 'var(--accent)' }}
              />

              <div className="relative flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <ServiceIcon
                    name={s.icon}
                    size={isBig ? 32 : 20}
                    className="text-app-accent shrink-0"
                  />
                  <span className="font-mono text-[10px] text-app-dim tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3
                  className={`text-app font-bold leading-tight mb-2 ${
                    isBig ? 'text-2xl' : 'text-sm'
                  }`}
                >
                  {title}
                </h3>
                <p
                  className={`text-app-muted leading-relaxed mb-3 ${
                    isBig ? 'text-sm line-clamp-3' : 'text-[11px] line-clamp-2'
                  }`}
                >
                  {desc}
                </p>

                <div className="mt-auto flex flex-wrap gap-1.5">
                  {bullets.slice(0, isBig ? 3 : 2).map((b) => (
                    <span
                      key={b}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded
                                 border border-app text-app-dim"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-12 text-center">
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg
                     text-white font-medium transition-all hover:-translate-y-0.5"
          style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 20px var(--glow)' }}
        >
          <FaEnvelope size={14} /> {t.services.ctaButton}
        </a>
      </div>
    </div>
  );
}