import { useEffect, useRef, useState } from 'react';

/**
 * Fundo com vídeo em loop.
 * Aceita um array de URLs — tenta o primeiro, cai no segundo se falhar.
 */
export default function VideoBackground({
  sources = [
    '/videos/hacker.mp4'
  ],
  opacity = 0.35,
}) {
  const [idx, setIdx] = useState(0);
  const [ready, setReady] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onCanPlay = () => setReady(true);
    v.addEventListener('canplay', onCanPlay);
    return () => v.removeEventListener('canplay', onCanPlay);
  }, []);

  const handleError = () => {
    if (idx < sources.length - 1) setIdx(idx + 1);
  };

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-1000 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ opacity }}
        src={sources[idx]}
        autoPlay
        loop
        muted
        playsInline
        onError={handleError}
      />

      {/* overlay roxa pra casar com o tema */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(10,6,19,0.45) 0%, rgba(10,6,19,0.9) 75%)',
        }}
      />
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          background:
            'linear-gradient(135deg, rgba(168,85,247,0.35), rgba(76,29,149,0.15) 60%, transparent)',
        }}
      />
    </div>
  );
}