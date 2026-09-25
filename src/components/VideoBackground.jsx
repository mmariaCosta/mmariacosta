import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/useTheme';

export default function VideoBackground() {
  const { theme } = useTheme();
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Decide se carrega o vídeo (não carrega em mobile lento)
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlowConnection =
      connection?.effectiveType === '2g' ||
      connection?.effectiveType === 'slow-2g' ||
      connection?.saveData === true;

    // Carrega o vídeo se NÃO for mobile lento
    if (!isMobile || !isSlowConnection) {
      setShouldLoad(true);
    }
  }, []);

  // Inicia o vídeo quando o elemento existir
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
      {/* Fallback gradiente (aparece SEMPRE, mesmo com vídeo) */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--accent) 25%, transparent) 0%, var(--bg) 75%)`,
        }}
      />

      {/* Vídeo (só carrega se shouldLoad for true) */}
      {shouldLoad && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: ready ? 0.25 : 0,
            transition: 'opacity 1s',
          }}
          src="/videos/hacker.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
        />
      )}

      {/* Overlay do tema */}
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