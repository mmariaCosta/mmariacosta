import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/useTheme';

export default function VideoBackground({ opacity = 0.25 }) {
  const { theme } = useTheme();
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onCanPlay = () => setReady(true);
    const onError = () => setReady(false);

    v.addEventListener('canplay', onCanPlay);
    v.addEventListener('error', onError);

    // tenta dar play (alguns navegadores bloqueiam autoplay)
    v.play().catch(() => {});

    return () => {
      v.removeEventListener('canplay', onCanPlay);
      v.removeEventListener('error', onError);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        style={{ opacity: ready ? opacity : 0, transition: 'opacity 0.8s' }}
        src="/videos/hacker.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      {/* Overlay pra casar com o tema */}
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