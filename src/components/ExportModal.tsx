import React, { useMemo, useState } from 'react';
import { Check, Copy, Download, X } from 'lucide-react';
import { LysosomeEntry } from '../data/neuroData';
import { buildSelfContainedHtml, buildStructuredJson } from '../utils/exportBundle';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  customEntries: LysosomeEntry[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  customEntries
}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'json'>('html');
  const [copied, setCopied] = useState(false);

  const htmlCode = useMemo(() => buildSelfContainedHtml(customEntries), [customEntries]);
  const jsonCode = useMemo(() => buildStructuredJson(customEntries), [customEntries]);

  if (!isOpen) return null;

  const currentCode = activeTab === 'html' ? htmlCode : jsonCode;
  const filename =
    activeTab === 'html'
      ? 'del-cerebro-al-aula-cecar-2026-2.html'
      : 'datos-neurocognitivos-cecar-2026-2.json';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], {
      type: activeTab === 'html' ? 'text/html;charset=utf-8' : 'application/json;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
    >
      <div className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* Cabecera */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div>
            <h2 id="export-modal-title" className="text-base font-bold text-slate-900">
              Entregables Portables: HTML5 Auto-contenido y JSON Estructurado
            </h2>
            <p className="text-xs text-slate-600">
              Código listo para incrustar en Moodle / GitHub Pages (sin internet) o importar en Canva y Genially.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana de exportación"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pestañas y acciones */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-6 py-3">
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setActiveTab('html')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === 'html'
                  ? 'bg-[#0F4C81] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. HTML5 / CSS3 / JS / SVG único
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('json')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === 'json'
                  ? 'bg-[#0F4C81] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Objeto JSON (Canva / Genially)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" /> Copiado
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" /> Copiar código
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F4C81] px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-900"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Descargar {activeTab === 'html' ? '.html' : '.json'}
            </button>
          </div>
        </div>

        {/* Vista previa del código */}
        <div className="flex-1 overflow-auto bg-slate-950 p-5">
          <pre className="font-mono-data text-xs leading-relaxed text-slate-200">
            <code>{currentCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
