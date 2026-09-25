import { useEffect, useState } from 'react';
import { getImageOverride } from './useImageStorage';

export function useImage(imageKey, fallback) {
  const [url, setUrl] = useState(() => getImageOverride(imageKey) || fallback);

  useEffect(() => {
    setUrl(getImageOverride(imageKey) || fallback);
  }, [imageKey, fallback]);

  useEffect(() => {
    const onChange = () => setUrl(getImageOverride(imageKey) || fallback);
    window.addEventListener('portfolio-image-change', onChange);
    return () => window.removeEventListener('portfolio-image-change', onChange);
  }, [imageKey, fallback]);

  return url;
}