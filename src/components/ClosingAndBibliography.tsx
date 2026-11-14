import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ExternalLink, FileCode2, Save } from 'lucide-react';
import { APA_REFERENCES } from '../data/neuroData';

interface ClosingAndBibliographyProps {
  completedModules: Record<string, boolean>;
  verifiedNodesCount: number;
  customLysosomeCount: number;
  synthesisNote: string;
  onSaveSynthesis: (text: string) => void;
  onOpenExport: () => void;
}

export const ClosingAndBibliography: React.FC<ClosingAndBibliographyProps> = ({
  completedModules,
  verifiedNodesCount,
  customLysosomeCount,
  synthesisNote,
  onSaveSynthesis,
  onOpenExport
}) => {
  const [draftNote, setDraftNote] = useState(synthesisNote);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSynthesis(draftNote);
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-10">
      {/* Cierre metacognitivo y síntesis de aprendizajes */}
      <section className="grid grid-cols-1 gap-6 border-b border-slate-200 pb-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <p className="text-xs font-medium text-slate-500">
            05. Cierre de Aprendizajes · Transferencia Docente CECAR 2026-2
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Síntesis Neurodidáctica y Compromiso Deontológico
          </h2>
          <p className="font-serif-prose text-sm leading-relaxed text-slate-700">
            El rediseño de una asignatura universitaria exige articular contención afectiva (vmPFC), dosificación de retos dopaminérgicos, programación de recuperación activa para contrarrestar la curva exponencial del olvido y protección del ciclo circadiano del estudiante.
          </p>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-xs font-semibold text-slate-900">
              Registro acumulado de la sesión
            </h3>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-slate-500">Nodos cerebrales validados</dt>
                <dd className="font-mono-data mt-0.5 text-base font-bold text-slate-900">
                  {verifiedNodesCount} / 5
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Curva dR/dt = −kR</dt>
                <dd className="font-mono-data mt-0.5 text-base font-bold text-slate-900">
                  {completedModules.olvido ? 'Verificado' : 'Pendiente'}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Casos propios en Lisosoma</dt>
                <dd className="font-mono-data mt-0.5 text-base font-bold text-slate-900">
                  {customLysosomeCount}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Protocolo Glinfático</dt>
                <dd className="font-mono-data mt-0.5 text-base font-bold text-slate-900">
                  {completedModules.circadiano ? 'Verificado' : 'Pendiente'}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={onOpenExport}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F4C81] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-900"
            >
              <FileCode2 className="h-4 w-4" aria-hidden="true" />
              Abrir exportador HTML5 y JSON (Moodle / Canva / Genially)
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSave}
          className="flex flex-col justify-between space-y-4 rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7"
        >
          <div className="space-y-2">
            <label htmlFor="synthesis-textarea" className="block text-sm font-bold text-slate-900">
              Bitácora metacognitiva para la Tarea 1 (Estudio de Caso Neurocientífico)
            </label>
            <p className="text-xs leading-relaxed text-slate-600">
              Redacte su planteamiento preliminar sobre el sujeto de estudio seleccionado en su práctica docente, especificando las variables atencionales, emocionales y mnémicas observadas. El texto se conserva localmente en este navegador.
            </p>
            <textarea
              id="synthesis-textarea"
              rows={7}
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder="Describa la situación problémica del caso, los circuitos neurobiológicos comprometidos y la estrategia de poda sináptica o repaso espaciado propuesta..."
              className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm leading-relaxed text-slate-900 focus:border-sky-700 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-emerald-800">
              {savedNotice && (
                <span className="inline-flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Síntesis almacenada localmente.
                </span>
              )}
            </span>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
            >
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Guardar síntesis local
            </button>
          </div>
        </form>
      </section>

      {/* Referentes Bibliográficos APA 7.ª Edición */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-sky-900" aria-hidden="true" />
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Referentes Bibliográficos Científicos (Normas APA 7.ª ed.)
          </h2>
        </div>

        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {APA_REFERENCES.map((ref) => (
            <article key={ref.id} className="space-y-1.5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-sky-900">{ref.topic}</span>
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-slate-700 underline decoration-slate-300 underline-offset-2 hover:text-sky-900"
                >
                  {ref.accessLabel}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
              <p className="text-sm font-medium text-slate-900">{ref.citation}</p>
              <p className="text-xs leading-relaxed text-slate-600">{ref.summary}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
