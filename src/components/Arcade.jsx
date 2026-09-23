import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PacManGame from '../games/PacManGame';
import SnakeGame from '../games/SnakeGame';
import { useLanguage } from '../contexts/LanguageContext';

export default function Arcade({ compact = false }) {
  const { t } = useLanguage();
  const [active, setActive] = useState('pacman');

  const GAMES = [
    { id: 'pacman', label: t.arcade.pacman, component: PacManGame },
    { id: 'snake',  label: t.arcade.snake,  component: SnakeGame },
  ];

  const Active = GAMES.find((g) => g.id === active).component;

  return (
    <section className={compact ? 'py-8' : 'py-16'}>
      <div className="text-center mb-8">
        <p className="text-app-accent font-mono text-xs mb-3 tracking-widest uppercase">
          § {t.arcade.label}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-app">{t.arcade.title}</h2>
        <p className="text-app-muted mt-2 text-sm">{t.arcade.subtitle}</p>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        {GAMES.map((g) => {
          const isActive = active === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setActive(g.id)}
              className={`relative px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive ? 'text-white' : 'text-app-muted hover:text-app'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="arcade-tab"
                  className="absolute inset-0 rounded-lg"
                  style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 20px var(--glow)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative">{g.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Active />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}