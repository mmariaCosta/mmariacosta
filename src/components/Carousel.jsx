import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaChevronLeft, FaChevronRight, FaTimes, FaSearchPlus } from 'react-icons/fa';

export default function Carousel({ images = [], alt = 'project image' }) {
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    setIdx(0);
  }, [images]);

  // Trava o scroll do body quando o lightbox está aberto
  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [lightbox]);

  // Fecha com ESC
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video rounded-xl border border-app bg-[#0a0613]
                      flex items-center justify-center">
        <p className="text-app-dim font-mono text-xs">// no preview available</p>
      </div>
    );
  }

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  const onKey = (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  return (
    <>
      {/* CARROSSEL INLINE */}
      <div
        className="relative rounded-xl overflow-hidden border border-app
                   bg-[#0a0613] group"
        tabIndex={0}
        onKeyDown={onKey}
      >
        {/* Área da imagem — 16:9 com padding e centralização */}
        <div className="aspect-video flex items-center justify-center
                        bg-gradient-to-br from-[#0a0613] to-[#1a0e2e]">
          <img
            src={images[idx]}
            alt={`${alt} ${idx + 1}`}
            width="800"
            height="450"
            loading="lazy"
            decoding="async"
            onClick={() => setLightbox(true)}
            className="max-w-full max-h-full object-contain rounded-lg
                       cursor-zoom-in transition-transform duration-300
                       group-hover:scale-[1.02]"
            onError={(e) => { e.target.style.opacity = 0.2; }}
          />
        </div>

        {/* Ícone de zoom no canto */}
        <button
          onClick={() => setLightbox(true)}
          aria-label="Ampliar imagem"
          className="absolute top-3 right-3 w-8 h-8 rounded-full
                     flex items-center justify-center
                     bg-black/60 text-white backdrop-blur-sm
                     opacity-0 group-hover:opacity-100 transition-opacity
                     hover:bg-black/80"
        >
          <FaSearchPlus size={11} />
        </button>

        {/* Botão anterior */}
        {images.length > 1 && (
          <button
            onClick={prev}
            aria-label="Imagem anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2
                       w-9 h-9 rounded-full flex items-center justify-center
                       bg-black/60 text-white backdrop-blur-sm
                       opacity-0 group-hover:opacity-100 transition-opacity
                       hover:bg-black/80"
          >
            <FaChevronLeft size={11} />
          </button>
        )}

        {/* Botão próximo */}
        {images.length > 1 && (
          <button
            onClick={next}
            aria-label="Próxima imagem"
            className="absolute right-3 top-1/2 -translate-y-1/2
                       w-9 h-9 rounded-full flex items-center justify-center
                       bg-black/60 text-white backdrop-blur-sm
                       opacity-0 group-hover:opacity-100 transition-opacity
                       hover:bg-black/80"
          >
            <FaChevronRight size={11} />
          </button>
        )}

        {/* Contador */}
        {images.length > 1 && (
          <span className="absolute top-3 left-3 text-[10px] font-mono
                           px-2 py-0.5 rounded bg-black/60 text-purple-200
                           backdrop-blur-sm">
            {idx + 1} / {images.length}
          </span>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2
                          flex gap-1.5 px-2.5 py-1.5 rounded-full
                          bg-black/60 backdrop-blur-sm">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Imagem ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === idx ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX (renderiza em portal, fora da hierarquia) */}
      {lightbox && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          onClick={() => setLightbox(false)}
        >
          {/* Fechar */}
          <button
            onClick={() => setLightbox(false)}
            aria-label="Fechar"
            className="absolute top-5 right-5 w-11 h-11 rounded-full
                       flex items-center justify-center
                       bg-white/10 text-white backdrop-blur-sm
                       hover:bg-white/20 transition-colors z-10"
          >
            <FaTimes size={16} />
          </button>

          {/* Contador */}
          {images.length > 1 && (
            <span className="absolute top-6 left-6 text-sm font-mono
                             text-white/80 z-10">
              {idx + 1} / {images.length}
            </span>
          )}

          {/* Anterior */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Anterior"
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2
                         w-12 h-12 rounded-full flex items-center justify-center
                         bg-white/10 text-white backdrop-blur-sm
                         hover:bg-white/20 transition-colors z-10"
            >
              <FaChevronLeft size={16} />
            </button>
          )}

          {/* Próxima */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Próxima"
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2
                         w-12 h-12 rounded-full flex items-center justify-center
                         bg-white/10 text-white backdrop-blur-sm
                         hover:bg-white/20 transition-colors z-10"
            >
              <FaChevronRight size={16} />
            </button>
          )}

          {/* Imagem ampliada */}
          <img
            src={images[idx]}
            alt={`${alt} ${idx + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[92vw] max-h-[88vh] object-contain rounded-lg
                       shadow-2xl"
          />

          {/* Dots no lightbox */}
          {images.length > 1 && (
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2
                         flex gap-2 px-3 py-2 rounded-full
                         bg-white/10 backdrop-blur-sm z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Imagem ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === idx ? 'bg-white w-6' : 'bg-white/40 w-2 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
}