import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp } from 'react-icons/fa';
import { useLanguage } from '../contexts/useLanguage';
import { usePortfolioData } from '../hooks/usePortfolioData';

export default function SocialIcons() {
  const { t } = useLanguage();
  const { profile } = usePortfolioData();

  if (!profile) return null;

  const links = [
    profile.social?.github && {
      icon: FaGithub,
      href: profile.social.github.url,
      label: 'GitHub',
      user: profile.social.github.handle,
    },
    profile.social?.linkedin && {
      icon: FaLinkedin,
      href: profile.social.linkedin.url,
      label: 'LinkedIn',
      user: profile.social.linkedin.handle,
    },
    profile.email && {
      icon: FaEnvelope,
      href: `mailto:${profile.email}`,
      label: 'Email',
      user: profile.email,
    },
    profile.whatsappUrl && {
      icon: FaWhatsapp,
      href: profile.whatsappUrl,
      label: 'WhatsApp',
      user: profile.whatsapp,
    },
  ].filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-6">
      <p className="text-center text-app-muted font-mono text-xs tracking-widest uppercase mb-4">
        {t.social?.where || 'Onde me encontrar'}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {links.map(({ icon: Icon, href, label, user }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="group flex items-center gap-3 p-3 rounded-lg
                       border border-app bg-surface-soft
                       hover:border-app-strong hover:shadow-app
                       hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="p-2 rounded-md bg-surface text-app-accent
                             group-hover:bg-[var(--accent)] group-hover:text-white
                             transition-colors shrink-0">
              <Icon size={16} />
            </span>
            <span className="flex flex-col min-w-0 flex-1">
              <span className="text-app text-sm font-medium">{label}</span>
              <span className="text-app-muted text-[11px] font-mono truncate">{user}</span>
            </span>
            <span className="text-app-dim group-hover:text-app-accent transition-colors text-xs">↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}