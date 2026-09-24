import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Carousel({ images = [], alt = 'project image' }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [images]);

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
    <div
      className="relative rounded-xl overflow-hidden border border-app
                 bg-[#0a0613] group"
      tabIndex={0}
      onKeyDown={onKey}
    >
      {/* Área da imagem: proporção 16:9, com padding interno */}
      <div className="aspect-video flex items-center justify-center p-3
                      bg-gradient-to-br from-[#0a0613] to-[#1a0e2e]">
        <img
          src={images[idx]}
          alt={`${alt} ${idx + 1}`}
          className="max-w-full max-h-full object-contain rounded-lg
                     shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          onError={(e) => { e.target.style.opacity = 0.2; }}
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2
                       w-9 h-9 rounded-full flex items-center justify-center
                       bg-black/70 text-white backdrop-blur-sm
                       opacity-0 group-hover:opacity-100 transition-opacity
                       hover:bg-black/90"
          >
            <FaChevronLeft size={12} />
          </button>

          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2
                       w-9 h-9 rounded-full flex items-center justify-center
                       bg-black/70 text-white backdrop-blur-sm
                       opacity-0 group-hover:opacity-100 transition-opacity
                       hover:bg-black/90"
          >
            <FaChevronRight size={12} />
          </button>

          <span className="absolute top-3 left-3 text-[10px] font-mono
                           px-2 py-0.5 rounded bg-black/70 text-purple-200
                           backdrop-blur-sm">
            {idx + 1} / {images.length}
          </span>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2
                          flex gap-1.5 px-2.5 py-1.5 rounded-full
                          bg-black/60 backdrop-blur-sm">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Image ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === idx ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}