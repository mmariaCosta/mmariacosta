import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { carregarLab } from '../utils/labs';

const DIFF_LABELS = {
  facil: 'Fácil', easy: 'Fácil',
  medio: 'Médio', medium: 'Médio',
  dificil: 'Difícil', hard: 'Difícil',
};

export default function LabDetail() {
  const { slug } = useParams();
  const lab = carregarLab(slug);

  if (!lab) {
    return (
      <div className="text-center py-16">
        <p className="text-app-muted font-mono text-sm mb-4">// lab não encontrado</p>
        <Link
          to="/projetos"
          className="inline-flex items-center gap-2 text-app-accent text-sm
                     hover:underline"
        >
          <FaArrowLeft size={11} /> voltar
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/projetos"
        className="inline-flex items-center gap-2 text-app-muted text-xs font-mono
                   uppercase tracking-widest mb-8 hover:text-app transition-colors"
      >
        <FaArrowLeft size={10} /> voltar
      </Link>

      <header className="mb-10 pb-8 border-b border-app">
        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest mb-4">
          <span className="text-app-accent font-bold">
            {lab.data.platform || 'LAB'}
          </span>
          <span className="text-app-dim">·</span>
          <span className="text-app-muted">{lab.data.date}</span>
          {lab.data.difficulty && (
            <>
              <span className="text-app-dim">·</span>
              <span className="text-app-muted">
                {DIFF_LABELS[lab.data.difficulty] || lab.data.difficulty}
              </span>
            </>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-app leading-tight mb-4">
          {lab.data.title}
        </h1>

        {lab.data.summary && (
          <p className="text-app-muted text-sm max-w-2xl leading-relaxed">
            {lab.data.summary}
          </p>
        )}

        {lab.data.tags && lab.data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-5">
            {lab.data.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded
                           border border-app text-app-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <article className="prose-readme max-w-3xl">
        <MarkdownRenderer content={lab.content} />
      </article>
    </div>
  );
}