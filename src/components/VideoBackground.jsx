import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function VideoBackground({
  sources = [
    '/videos/hacker.mp4'
  ],
}) {
  const { theme } = useTheme();
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
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-1000 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ opacity: 'var(--video-opacity)' }}
        src={sources[idx]}
        autoPlay loop muted playsInline
        onError={handleError}
      />

      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 40%, var(--video-overlay) 0%, var(--bg) 100%)`,
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