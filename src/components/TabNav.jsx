import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import PacMan from './PacMan';

const TABS = ['Sobre mim', 'Soft Skills', 'Hard Skills', 'Projetos', 'Formação'];

export default function TabNav({ active, onChange }) {
  const containerRef = useRef(null);
  const tabRefs = useRef([]);
  const [pacX, setPacX] = useState(0);
  const [eaten, setEaten] = useState(() => TABS.map(() => false));

  // posiciona o pac-man sobre a aba ativa
  useEffect(() => {
    const el = tabRefs.current[active];
    const container = containerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();
      setPacX(elRect.left - contRect.left + elRect.width / 2 - 11);
    }
  }, [active]);

  // marca os pontinhos "comidos" até a aba ativa
  useEffect(() => {
    setEaten(TABS.map((_, i) => i <= active));
  }, [active]);

  return (
    <div ref={containerRef} className="relative flex items-end gap-1 border-b border-purple-900/40 px-2">
      {/* Pac-Man flutuando acima da aba ativa */}
      <motion.div
        className="absolute -top-6 z-10"
        animate={{ x: pacX }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      >
        <PacMan size={22} />
      </motion.div>

      {TABS.map((tab, i) => (
        <div key={tab} className="flex items-center">
          <button
            ref={(el) => (tabRefs.current[i] = el)}
            onClick={() => onChange(i)}
            className={`relative px-4 py-2 text-sm tracking-wide transition-colors ${
              active === i
                ? 'text-purple-300'
                : 'text-purple-500/60 hover:text-purple-300'
            }`}
          >
            <span className="text-purple-700/70 mr-1">●</span>
            {tab}
            {active === i && (
              <motion.span
                layoutId="tab-underline"
                className="absolute left-0 right-0 -bottom-px h-px bg-purple-400 shadow-[0_0_8px_#a855f7]"
              />
            )}
          </button>

          {/* pontinhos entre abas — somem quando o pac-man passa */}
          {i < TABS.length - 1 && (
            <span
              className={`w-1.5 h-1.5 rounded-full mr-1 transition-opacity duration-300 ${
                eaten[i] ? 'opacity-0' : 'bg-purple-400/50'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}