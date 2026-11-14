import React, { useState } from 'react';
import { CheckCircle2, Plus, Scissors, Trash2 } from 'lucide-react';
import { DisciplineKey, LYSOSOME_PRESETS, LysosomeEntry } from '../data/neuroData';

interface LysosomeMatrixProps {
  customEntries: LysosomeEntry[];
  onAddCustomEntry: (entry: LysosomeEntry) => void;
  onDeleteCustomEntry: (id: string) => void;
  prunedMap: Record<string, boolean>;
  onTogglePrune: (id: string) => void;
}

const DISCIPLINES: DisciplineKey[] = [
  'Ingeniería',
  'Derecho',
  'Medicina',
  'Psicología',
  'Educación'
];

export const LysosomeMatrix: React.FC<LysosomeMatrixProps> = ({
  customEntries,
  onAddCustomEntry,
  onDeleteCustomEntry,
  prunedMap,
  onTogglePrune
}) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<DisciplineKey>('Ingeniería');
  const [subject, setSubject] = useState('');
  const [basura, setBasura] = useState('');
  const [lisosoma, setLisosoma] = useState('');
  const [reciclado, setReciclado] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const visibleEntries = [
    ...customEntries.filter((e) => e.discipline === selectedDiscipline),
    ...LYSOSOME_PRESETS[selectedDiscipline]
  ];

  const prunedInDiscipline = visibleEntries.filter((e) => prunedMap[e.id]).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !basura.trim() || !lisosoma.trim() || !reciclado.trim()) {
      setFormError('Complete los cuatro campos académicos antes de ejecutar la poda sináptica.');
      return;
    }
    const newEntry: LysosomeEntry = {
      id: `custom-${Date.now()}`,
      discipline: selectedDiscipline,
      subject: subject.trim(),
      basuraReutilizable: basura.trim(),
      procesamientoLisosomal: lisosoma.trim(),
      componenteReciclado: reciclado.trim(),
      neurobiologicalMechanism:
        'Transformación declarativa diseñada por el docente participante: poda de datos memorísticos y consolidación de competencia transferible.',
      isCustom: true
    };
    onAddCustomEntry(newEntry);
    onTogglePrune(newEntry.id);
    setSubject('');
    setBasura('');
    setLisosoma('');
    setReciclado('');
    setFormError(null);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-medium text-slate-500">
            03. Matriz Dinámica · Poda Sináptica y Reciclaje Curricular
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            El Lisosoma Pedagógico: Autofagia Neurocognitiva
          </h2>
        </div>

        {/* Selector de área profesional */}
        <div
          role="tablist"
          aria-label="Área profesional universitaria"
          className="flex flex-wrap gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1"
        >
          {DISCIPLINES.map((disc) => {
            const active = selectedDiscipline === disc;
            return (
              <button
                key={disc}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedDiscipline(disc)}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-white text-sky-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {disc}
              </button>
            );
          })}
        </div>
      </div>

      {/* Esquema SVG del flujo autofágico */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <span>
            Mecanismo celular homólogo: la célula degrada proteínas obsoletas para sintetizar nueva estructura funcional.
          </span>
          <span className="font-mono-data font-semibold text-sky-900">
            Podas ejecutadas en {selectedDiscipline}: {prunedInDiscipline}/{visibleEntries.length}
          </span>
        </div>

        <svg
          viewBox="0 0 880 118"
          className="h-auto w-full select-none"
          role="img"
          aria-label="Flujo de autofagia neurocognitiva en tres etapas: Basura reutilizable, Procesamiento lisosomal y Componente reciclado"
        >
          <defs>
            <marker
              id="lysArrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#0F4C81" />
            </marker>
          </defs>

          {/* Paso 1 */}
          <rect x="8" y="14" width="248" height="90" rx="8" fill="#FEF2F2" stroke="#FECACA" />
          <text x="24" y="38" fontSize="11" fontWeight="700" fill="#991B1B" fontFamily="IBM Plex Mono, monospace">
            FASE 1 · SATURACIÓN
          </text>
          <text x="24" y="58" fontSize="13" fontWeight="700" fill="#0F172A">
            Basura Reutilizable
          </text>
          <text x="24" y="78" fontSize="11" fill="#475569">
            Datos aislados memorizados a corto plazo
          </text>

          <line x1="262" y1="59" x2="306" y2="59" stroke="#0F4C81" strokeWidth="2" markerEnd="url(#lysArrow)" />

          {/* Paso 2 */}
          <rect x="314" y="14" width="252" height="90" rx="8" fill="#FFFBEB" stroke="#FDE68A" />
          <text x="330" y="38" fontSize="11" fontWeight="700" fill="#92400E" fontFamily="IBM Plex Mono, monospace">
            FASE 2 · DEGRADACIÓN ACTIVA
          </text>
          <text x="330" y="58" fontSize="13" fontWeight="700" fill="#0F172A">
            Procesamiento Lisosomal
          </text>
          <text x="330" y="78" fontSize="11" fill="#475569">
            Conflicto cognitivo, reto o caso clínico/jurídico
          </text>

          <line x1="572" y1="59" x2="616" y2="59" stroke="#0F4C81" strokeWidth="2" markerEnd="url(#lysArrow)" />

          {/* Paso 3 */}
          <rect x="624" y="14" width="248" height="90" rx="8" fill="#ECFDF5" stroke="#A7F3D0" />
          <text x="640" y="38" fontSize="11" fontWeight="700" fill="#065F46" fontFamily="IBM Plex Mono, monospace">
            FASE 3 · CONSOLIDACIÓN
          </text>
          <text x="640" y="58" fontSize="13" fontWeight="700" fill="#0F172A">
            Componente Reciclado
          </text>
          <text x="640" y="78" fontSize="11" fill="#475569">
            Competencia genérica y criterio deontológico
          </text>
        </svg>
      </div>

      {/* Matriz interactiva de 3 columnas */}
      <div className="space-y-4">
        <div className="hidden grid-cols-12 gap-4 px-4 text-xs font-semibold text-slate-600 lg:grid">
          <div className="col-span-3">1. Basura Reutilizable (Dato a podar)</div>
          <div className="col-span-4">2. Procesamiento Lisosomal (Conflicto / Caso)</div>
          <div className="col-span-3">3. Componente Reciclado (Competencia)</div>
          <div className="col-span-2 text-right">Poda Sináptica</div>
        </div>

        <div className="space-y-3">
          {visibleEntries.map((entry) => {
            const isPruned = !!prunedMap[entry.id];
            return (
              <article
                key={entry.id}
                className={`rounded-xl border p-4 transition-colors sm:p-5 ${
                  isPruned
                    ? 'border-emerald-300 bg-emerald-50/40'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 text-xs">
                  <span className="font-semibold text-slate-900">
                    {entry.subject} · {entry.discipline}
                  </span>
                  <div className="flex items-center gap-3">
                    {entry.isCustom && (
                      <button
                        type="button"
                        onClick={() => onDeleteCustomEntry(entry.id)}
                        className="inline-flex items-center gap-1 text-red-700 hover:underline"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Eliminar
                      </button>
                    )}
                    <span className="font-mono-data text-slate-500">
                      {isPruned ? 'RECICLADO' : 'PENDIENTE DE PODA'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
                  <div className="lg:col-span-3">
                    <p className="mb-1 text-[11px] font-semibold text-red-800 lg:hidden">
                      Basura Reutilizable
                    </p>
                    <p
                      className={`text-xs leading-relaxed ${
                        isPruned ? 'text-slate-400 line-through' : 'text-slate-700'
                      }`}
                    >
                      {entry.basuraReutilizable}
                    </p>
                  </div>

                  <div className="lg:col-span-4">
                    <p className="mb-1 text-[11px] font-semibold text-amber-800 lg:hidden">
                      Procesamiento Lisosomal
                    </p>
                    <p className="text-xs leading-relaxed text-slate-700">
                      {entry.procesamientoLisosomal}
                    </p>
                  </div>

                  <div className="lg:col-span-3">
                    <p className="mb-1 text-[11px] font-semibold text-emerald-800 lg:hidden">
                      Componente Reciclado
                    </p>
                    <p className="text-xs font-medium leading-relaxed text-slate-900">
                      {entry.componenteReciclado}
                    </p>
                  </div>

                  <div className="flex flex-col items-stretch justify-end lg:col-span-2 lg:items-end">
                    <button
                      type="button"
                      onClick={() => onTogglePrune(entry.id)}
                      className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                        isPruned
                          ? 'border border-emerald-600 bg-white text-emerald-800 hover:bg-emerald-50'
                          : 'bg-[#0F4C81] text-white hover:bg-sky-900'
                      }`}
                    >
                      {isPruned ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Reciclado
                        </>
                      ) : (
                        <>
                          <Scissors className="h-3.5 w-3.5" aria-hidden="true" />
                          Ejecutar poda
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                  Mecanismo: {entry.neurobiologicalMechanism}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      {/* Formulario para que el docente ingrese su propia asignatura */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Constructor Docente: Poda Sináptica en su Asignatura ({selectedDiscipline})
            </h3>
            <p className="text-xs text-slate-600">
              Ingrese los datos reales de su curso para generar su matriz personalizada e incluirla en la exportación JSON/HTML.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <label htmlFor="lys-subject" className="block text-xs font-semibold text-slate-800">
              Asignatura universitaria
            </label>
            <input
              id="lys-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ej. Bioética Clínica"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-sky-700 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="lys-basura" className="block text-xs font-semibold text-slate-800">
              1. Basura Reutilizable (dato efímero)
            </label>
            <textarea
              id="lys-basura"
              rows={2}
              value={basura}
              onChange={(e) => setBasura(e.target.value)}
              placeholder="Dato memorístico que se olvida tras el examen..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-sky-700 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="lys-lisosoma" className="block text-xs font-semibold text-slate-800">
              2. Procesamiento Lisosomal (reto/caso)
            </label>
            <textarea
              id="lys-lisosoma"
              rows={2}
              value={lisosoma}
              onChange={(e) => setLisosoma(e.target.value)}
              placeholder="Conflicto cognitivo o estudio de caso real..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-sky-700 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="lys-reciclado" className="block text-xs font-semibold text-slate-800">
              3. Componente Reciclado (competencia)
            </label>
            <textarea
              id="lys-reciclado"
              rows={2}
              value={reciclado}
              onChange={(e) => setReciclado(e.target.value)}
              placeholder="Pensamiento crítico, deontología, resolución..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-sky-700 focus:outline-none"
            />
          </div>
        </div>

        {formError && <p className="text-xs font-medium text-red-700">{formError}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0F4C81] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-900"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Incorporar y ejecutar poda en matriz
          </button>
        </div>
      </form>
    </div>
  );
};
