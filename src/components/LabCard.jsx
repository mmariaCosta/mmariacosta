import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const DIFF_COLORS = {
  facil:   '#4ade80',
  easy:    '#4ade80',
  medio:   '#fbbf24',
  medium:  '#fbbf24',
  dificil: '#f87171',
  hard:    '#f87171',
};

const DIFF_LABELS = {
  facil: 'Fácil', easy: 'Fácil',
  medio: 'Médio', medium: 'Médio',
  dificil: 'Difícil', hard: 'Difícil',
};

export default function LabCard({ lab }) {
  const color = DIFF_COLORS[lab.data.difficulty] || '#4ade80';
  const label = DIFF_LABELS[lab.data.difficulty] || lab.data.difficulty;

  return (
    <Link
      to={`/labs/${lab.slug}`}
      className="group relative overflow-hidden rounded-xl border border-app
                 bg-surface-soft backdrop-blur-sm p-5 transition-all duration-200
                 hover:-translate-y-0.5 hover:border-app-strong flex flex-col min-h-[180px]"
      style={{ borderColor: `color-mix(in srgb, ${color} 25%, var(--border))` }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px]"
        style={{
          background: color,
          boxShadow: `0 0 12px color-mix(in srgb, ${color} 60%, transparent)`,
        }}
      />

      <div className="relative flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest">
          <span className="font-bold" style={{ color }}>
            {lab.data.platform || 'LAB'}
          </span>
          <span className="text-app-dim">·</span>
          <span className="text-app-muted">{lab.data.date || ''}</span>
          <span
            className="ml-auto px-2 py-0.5 rounded-md text-[10px]"
            style={{
              color,
              background: `color-mix(in srgb, ${color} 15%, transparent)`,
            }}
          >
            {label}
          </span>
        </div>

        <h3 className="text-app font-bold text-base leading-tight mt-4 mb-2
                       group-hover:text-app-accent transition-colors line-clamp-2">
          {lab.data.title}
        </h3>

        {lab.data.summary && (
          <p className="text-app-muted text-xs leading-relaxed line-clamp-3 flex-1">
            {lab.data.summary}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-app">
          {lab.data.category && (
            <span className="text-[10px] font-mono text-app-dim">
              {lab.data.category}
            </span>
          )}
          <FaArrowRight
            size={9}
            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color }}
          />
        </div>
      </div>
    </Link>
  );
}