import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/useTheme';

export default function VideoBackground({ opacity = 0.25 }) {
  const { theme } = useTheme();
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Adia o carregamento do vídeo pra depois do primeiro paint
  useEffect(() => {
    const load = () => setShouldLoad(true);

    // carrega 1s depois OU quando o usuário interage
    const timer = setTimeout(load, 1500);

    window.addEventListener('scroll', load, { once: true, passive: true });
    window.addEventListener('click', load, { once: true, passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', load);
      window.removeEventListener('click', load);
    };
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    const v = videoRef.current;
    if (!v) return;

    const onCanPlay = () => setReady(true);
    v.addEventListener('canplay', onCanPlay);
    v.play().catch(() => {});

    return () => v.removeEventListener('canplay', onCanPlay);
  }, [shouldLoad]);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {shouldLoad && (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          style={{ opacity: ready ? opacity : 0, transition: 'opacity 0.8s' }}
          src="/videos/hacker.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
        />
      )}

      {/* Fallback: gradiente sempre visível */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 40%, transparent 0%, var(--bg) 85%)`,
        }}
      />

      {theme === 'dark' && (
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{
            background:
              'linear-gradient(135deg, rgba(168,85,247,0.35), rgba(76,29,149,0.15) 60%, transparent)',
          }}
        />
      )}
    </div>
  );
}