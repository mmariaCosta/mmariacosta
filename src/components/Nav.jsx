import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import SegmentedToggle from './SegmentedToggle';

export default function Nav() {
  const { lang, setLang, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const LINKS = [
    { to: '/',            label: t.nav.home },
    { to: '/soft-skills', label: t.nav.soft },
    { to: '/hard-skills', label: t.nav.hard },
    { to: '/projetos',    label: t.nav.projects },
    { to: '/formacao',    label: t.nav.education },
  ];

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md border-b border-app"
            style={{ backgroundColor: 'var(--surface)' }}>
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 group shrink-0">
          <span className="w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 10px var(--glow)' }} />
          <span className="font-mono text-app font-semibold">mmariacosta</span>
          <span className="text-app-muted font-mono text-sm hidden sm:inline">.dev</span>
        </NavLink>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                `relative px-3 py-1.5 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'text-app'
                    : 'text-app-muted hover:text-app'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute left-1/2 -translate-x-1/2 -bottom-1
                                 w-1 h-1 rounded-full"
                      style={{
                        backgroundColor: 'var(--accent)',
                        boxShadow: '0 0 8px var(--glow)',
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Toggles */}
        <div className="flex items-center gap-2 shrink-0">
          <SegmentedToggle
            ariaLabel="language"
            value={lang}
            onChange={setLang}
            options={[
              { value: 'pt', label: 'PT' },
              { value: 'en', label: 'EN' },
            ]}
          />
          <SegmentedToggle
            ariaLabel="theme"
            value={theme}
            onChange={setTheme}
            options={[
              { value: 'light', icon: <FaSun size={11} /> },
              { value: 'dark',  icon: <FaMoon size={11} /> },
            ]}
          />
        </div>
      </div>

      {/* Nav mobile (embaixo) */}
      <nav className="md:hidden flex items-center justify-center gap-1 pb-2 px-2 overflow-x-auto">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              `px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
                isActive ? 'text-app bg-surface-soft' : 'text-app-muted'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}