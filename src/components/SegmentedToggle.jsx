import { motion } from 'framer-motion';

export default function SegmentedToggle({ options, value, onChange, ariaLabel }) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex items-center p-0.5 rounded-lg
                 border border-app bg-surface-soft backdrop-blur-sm"
    >
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.value)}
            className={`relative px-2.5 py-1 text-xs font-medium rounded-md
                        transition-colors flex items-center gap-1 ${
                          isActive ? 'text-white' : 'text-app-muted hover:text-app'
                        }`}
          >
            {isActive && (
              <motion.span
                layoutId={`seg-${ariaLabel}`}
                className="absolute inset-0 rounded-md"
                style={{
                  backgroundColor: 'var(--accent)',
                  boxShadow: '0 0 12px var(--glow)',
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-1">
              {opt.icon}
              {opt.label && <span>{opt.label}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}