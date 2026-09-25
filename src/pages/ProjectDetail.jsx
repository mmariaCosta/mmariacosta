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
    <div className="space-y-6">
      <Link
        to="/projetos"
        className="inline-flex items-center gap-2 text-app-muted text-xs font-mono
                   hover:text-app-accent transition-colors"
      >
        <FaArrowLeft size={10} /> {t.projectDetail.back}
      </Link>

      {/* Header + meta */}
      <section className="grid md:grid-cols-4 gap-3">
        <div className="md:col-span-3 p-6 md:p-8 min-h-[160px] flex flex-col justify-between
                        rounded-2xl border border-app bg-surface-soft">
          <div>
            <p className="text-app-dim font-mono text-[10px] uppercase tracking-widest mb-2">
              Projeto
            </p>
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
          </div>
        </div>

        {/* Meta cards... */}
      </section>

      {/* ⬇️⬇️⬇️ AQUI VAI A IMAGEM DE CAPA (antes do carrossel) ⬇️⬇️⬇️ */}
      <div className="rounded-xl overflow-hidden border border-app
                      bg-[#0a0613] shadow-app">
        <img
          src={project.cover}
          alt={project.name}
          width="800"
          height="450"
          fetchPriority="high"
          decoding="async"
          className="w-full h-auto"
        />
      </div>
      {/* ⬆️⬆️⬆️ FIM DA IMAGEM DE CAPA ⬆️⬆️⬆️ */}

      {/* Carrossel */}
      {images.length > 0 && (
        <div className="rounded-xl overflow-hidden border border-app bg-surface-soft">
          <Carousel images={images} alt={project.name} />
        </div>
      )}

      {/* README */}
      {readmeHtml && (
        <div className="rounded-2xl border border-app bg-surface-soft p-6 md:p-8">
          <p className="text-app-dim font-mono text-[10px] uppercase tracking-widest mb-5">
            {t.projectDetail.readme}
          </p>
          <div
            className="prose-readme"
            dangerouslySetInnerHTML={{ __html: readmeHtml }}
          />
        </div>
      )}
    </div>
  );
}