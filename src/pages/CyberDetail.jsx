import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaCalendar } from 'react-icons/fa';
import { useLanguage } from '../contexts/useLanguage';
import { useLocalItem } from '../hooks/useLocalContent';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function CyberDetail() {
  const { slug } = useParams();
  const { lang } = useLanguage();
  
  // Busca o item local
  const { item } = useLocalItem(slug, lang);

  // Se não achar o arquivo, mostra mensagem
  if (!item) {
    return (
      <div className="py-16 text-center">
        <p className="text-app-muted mb-4">
          {lang === 'pt' ? 'Conteúdo não encontrado.' : 'Content not found.'}
        </p>
        <Link to="/projetos" className="text-app-accent text-sm hover:underline">
          ← {lang === 'pt' ? 'Voltar para projetos' : 'Back to projects'}
        </Link>
      </div>
    );
  }

  const { data, content, type } = item;
  const title = data.title || slug;

  const typeLabel = type === 'writeup' ? 'Write-up' : type === 'note' ? 'Nota' : 'Lab';

  return (
    <article className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/projetos"
        className="inline-flex items-center gap-2 text-app-muted text-xs font-mono
                   hover:text-app-accent transition-colors"
      >
        <FaArrowLeft size={10} /> {lang === 'pt' ? 'voltar' : 'back'}
      </Link>

      <header className="space-y-3 border-b border-app pb-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-widest text-app-accent">
          <span>{typeLabel}</span>
          {data.date && (
            <span className="text-app-dim flex items-center gap-1.5">
              <FaCalendar size={10} /> {data.date}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-app leading-tight">
          {title}
        </h1>

        {data.summary && (
          <p className="text-app-muted text-base leading-relaxed">
            {data.summary}
          </p>
        )}
      </header>

      <section className="pt-4">
        <MarkdownRenderer content={content} />
      </section>
    </article>
  );
}