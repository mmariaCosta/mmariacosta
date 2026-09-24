import { Link, useParams } from 'react-router-dom';
import {
  FaArrowLeft, FaGithub, FaStar, FaCodeBranch,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { useGithubProject } from '../hooks/useGithubProject';
import { useLanguage } from '../contexts/useLanguage';
import Carousel from '../components/Carousel';

export default function ProjectDetail() {
  const { name } = useParams();
  const { t } = useLanguage();
  const { project, readmeHtml, images, loading, error } = useGithubProject(name);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <p className="text-app-muted text-sm animate-pulse">
          {t.projectDetail.loading} ⏳
        </p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="py-16 text-center">
        <p className="text-red-400 mb-4">{t.projectDetail.error}</p>
        <Link to="/projetos" className="text-app-accent text-sm hover:underline">
          ← {t.projectDetail.back}
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto">
      <Link
        to="/projetos"
        className="inline-flex items-center gap-2 text-app-muted text-xs font-mono
                   hover:text-app-accent transition-colors mb-6"
      >
        <FaArrowLeft size={10} /> {t.projectDetail.back}
      </Link>

      {/* Carrossel (ou nada se não tiver imagens) */}
      {images.length > 0 && (
        <div className="mb-6">
          <Carousel images={images} alt={project.name} />
        </div>
      )}

      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-app font-mono break-all">
          <span className="text-app-dim">&lt;</span>
          {project.name}
          <span className="text-app-dim">/&gt;</span>
        </h1>
        {project.description && (
          <p className="text-app-muted mt-3 text-sm leading-relaxed">
            {project.description}
          </p>
        )}
      </header>

      <section className="flex flex-wrap items-center gap-3 mb-8
                          text-xs text-app-muted">
        {project.language && (
          <span className="px-2 py-1 rounded border border-app font-mono">
            {project.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <FaStar size={10} /> {project.stars}
        </span>
        <span className="flex items-center gap-1">
          <FaCodeBranch size={10} /> {project.forks}
        </span>
      </section>

      <section className="flex flex-wrap gap-3 mb-10">
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                     text-white text-sm font-medium transition-all hover:-translate-y-0.5"
          style={{ backgroundColor: 'var(--accent)', boxShadow: '0 0 16px var(--glow)' }}
        >
          <FaGithub size={14} /> {t.projectDetail.viewRepo}
        </a>

        {project.homepage && (
          <a
            href={project.homepage}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                       border border-app-strong text-app text-sm
                       hover:bg-surface-soft hover:-translate-y-0.5 transition-all"
          >
            <FaExternalLinkAlt size={12} /> {t.projectDetail.viewLive}
          </a>
        )}
      </section>

      {project.topics.length > 0 && (
        <section className="mb-10">
          <div className="flex flex-wrap gap-2">
            {project.topics.map((topic) => (
              <span
                key={topic}
                className="text-xs px-2.5 py-1 rounded-md border border-app
                           bg-surface-soft text-app-muted font-mono"
              >
                #{topic}
              </span>
            ))}
          </div>
        </section>
      )}

      {readmeHtml && (
        <section className="mt-10 pt-8 border-t border-app">
          <h2 className="text-sm font-mono uppercase tracking-widest
                         text-app-muted mb-5">
            {t.projectDetail.readme}
          </h2>
          <div
            className="prose-readme"
            dangerouslySetInnerHTML={{ __html: readmeHtml }}
          />
        </section>
      )}
    </article>
  );
}