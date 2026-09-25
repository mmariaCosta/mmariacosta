import { useRef, useState, useEffect } from 'react';
import { FaUpload, FaTrash, FaDownload, FaCopy, FaCheck } from 'react-icons/fa';
import {
  setImageOverride,
  removeImageOverride,
  notifyImageChange,
  getImageOverride,
} from '../hooks/useImageStorage';

const MAX_SIZE = 2 * 1024 * 1024;

export default function ImageUploader({ imageKey, label, fallback }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(() => getImageOverride(imageKey) || fallback);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setPreview(getImageOverride(imageKey) || fallback);
  }, [imageKey, fallback]);

  const handleFile = (file) => {
    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Por favor, escolha uma imagem');
      return;
    }

    if (file.size > MAX_SIZE) {
      setError('Imagem muito grande. Máximo 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setImageOverride(imageKey, base64);
      setPreview(base64);
      notifyImageChange();
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const remove = () => {
    removeImageOverride(imageKey);
    setPreview(fallback);
    notifyImageChange();
  };

  const download = () => {
    if (!preview) return;
    if (preview.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = preview;
      a.download = `${imageKey}.png`;
      a.click();
    } else {
      window.open(preview, '_blank');
    }
  };

  const copyBase64 = async () => {
    if (!preview || !preview.startsWith('data:')) return;
    try {
      await navigator.clipboard.writeText(preview);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Não foi possível copiar');
    }
  };

  const hasOverride = !!getImageOverride(imageKey);

  return (
    <div className="rounded-xl border border-app bg-surface-soft p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-app text-sm font-semibold">{label}</p>
          <p className="text-app-dim text-[10px] font-mono">chave: {imageKey}</p>
        </div>
        {hasOverride && (
          <span className="text-[9px] font-mono uppercase tracking-wider
                           px-2 py-0.5 rounded bg-[var(--accent)] text-white">
            sobrescrito
          </span>
        )}
      </div>

      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-lg border-2 border-dashed
                   border-app-strong hover:border-[var(--accent)]
                   transition-colors overflow-hidden"
      >
        {preview ? (
          <img
            src={preview}
            alt={label}
            className="w-full max-h-48 object-contain bg-black/20"
          />
        ) : (
          <div className="py-10 text-center">
            <FaUpload size={20} className="mx-auto mb-2 text-app-muted" />
            <p className="text-xs text-app-muted">Arraste ou clique</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
      />

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

      <div className="flex flex-wrap gap-2 mt-3">
        {preview && preview.startsWith('data:') && (
          <>
            <button
              onClick={download}
              className="flex-1 py-2 px-3 rounded-lg border border-app
                         text-app-muted text-xs flex items-center justify-center gap-1.5
                         hover:bg-surface hover:text-app transition-colors"
            >
              <FaDownload size={10} /> Baixar
            </button>
            <button
              onClick={copyBase64}
              className="flex-1 py-2 px-3 rounded-lg border border-app
                         text-app-muted text-xs flex items-center justify-center gap-1.5
                         hover:bg-surface hover:text-app transition-colors"
            >
              {copied ? <><FaCheck size={10} /> Copiado</> : <><FaCopy size={10} /> Base64</>}
            </button>
          </>
        )}
        {hasOverride && (
          <button
            onClick={remove}
            className="py-2 px-3 rounded-lg border border-red-500/40
                       text-red-400 text-xs flex items-center gap-1.5
                       hover:bg-red-500/10 transition-colors"
          >
            <FaTrash size={10} /> Remover
          </button>
        )}
      </div>
    </div>
  );
}