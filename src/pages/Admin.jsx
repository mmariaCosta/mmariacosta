import { useState } from 'react';
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import ImageUploader from '../components/ImageUploader';
import {
  listOverrides,
  removeImageOverride,
  notifyImageChange,
  clearAllOverrides,
} from '../hooks/useImageStorage';
import { usePortfolioData } from '../hooks/usePortfolioData';

const IMAGE_SLOTS = [
  { key: 'cat', label: 'Gatinho (Home)', fallbackFrom: (p) => p?.images?.cat },
];

export default function Admin() {
  const { profile } = usePortfolioData();
  const [refresh, setRefresh] = useState(0);
  const overrides = listOverrides();
  const overrideKeys = Object.keys(overrides);

  const handleClearAll = () => {
    if (!confirm('Apagar todas as imagens sobrescritas?')) return;
    clearAllOverrides();
    notifyImageChange();
    setRefresh((r) => r + 1);
  };

  const handleRemoveOne = (key) => {
    removeImageOverride(key);
    notifyImageChange();
    setRefresh((r) => r + 1);
  };

  return (
    <div className="space-y-8">
      <div className="p-4 rounded-xl border-2 border-dashed border-app-strong
                      bg-surface-soft flex items-start gap-3">
        <FaExclamationTriangle className="text-yellow-400 shrink-0 mt-0.5" size={16} />
        <div className="flex-1">
          <p className="text-app font-mono text-xs uppercase tracking-widest mb-1">
            Página de administração
          </p>
          <p className="text-app-muted text-xs leading-relaxed">
            As imagens sobrescritas ficam salvas <strong>apenas no seu navegador</strong>.
            Pra valer em produção:
          </p>
          <ol className="text-app-muted text-xs mt-2 space-y-1 list-decimal list-inside">
            <li>Upload → clicar em <strong>Baixar</strong></li>
            <li>Mover pra <code className="font-mono">public/images/</code></li>
            <li>Atualizar em <code className="font-mono">profile.json</code></li>
          </ol>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-bold text-app mb-4">Imagens</h2>
        <div className="grid sm:grid-cols-2 gap-4" key={refresh}>
          {IMAGE_SLOTS.map((slot) => (
            <ImageUploader
              key={slot.key}
              imageKey={slot.key}
              label={slot.label}
              fallback={slot.fallbackFrom(profile)}
            />
          ))}
        </div>
      </section>

      {overrideKeys.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-app">
              Sobrescritos ({overrideKeys.length})
            </h2>
            <button
              onClick={handleClearAll}
              className="text-red-400 text-xs flex items-center gap-1.5 hover:underline"
            >
              <FaTrash size={10} /> Limpar tudo
            </button>
          </div>

          <ul className="space-y-2">
            {overrideKeys.map((k) => (
              <li
                key={k}
                className="flex items-center gap-3 p-3 rounded-lg border border-app bg-surface-soft"
              >
                <img
                  src={overrides[k]}
                  alt={k}
                  className="w-10 h-10 rounded-md object-cover bg-black/20"
                />
                <span className="flex-1 text-app text-sm font-mono truncate">{k}</span>
                <button
                  onClick={() => handleRemoveOne(k)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  <FaTrash size={11} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}