import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Circle, Pause, Play, RotateCcw } from 'lucide-react';
import { MODULE_METADATA, SectionId } from '../data/neuroData';

interface OverviewSectionProps {
  completedModules: Record<string, boolean>;
  verifiedNodesCount: number;
  customLysosomeCount: number;
  onNavigate: (section: SectionId) => void;
}

const SIMULATOR_CARDS: {
  id: SectionId;
  index: string;
  title: string;
  subtitle: string;
  summary: string;
  formula: string;
}[] = [
  {
    id: 'cerebro',
    index: '01',
    title: 'Simulador Anatómico y Neuropsicofisiológico',
    subtitle: 'Corte sagital interactivo · 5 circuitos ejecutivos y límbicos',
    summary:
      'Explore la red Amígdala-vmPFC, el circuito mesolímbico VTA-Accumbens, la tríada Hipocampo-Neocórtex-Glinfático, la ACC y la corteza prefrontal dorsolateral ante escenarios reales de aula.',
    formula: 'EPD = R_obs − R_esp'
  },
  {
    id: 'olvido',
    index: '02',
    title: 'Curva del Olvido y Repaso Espaciado',
    subtitle: 'Ecuación diferencial de decaimiento exponencial mnémico',
    summary:
      'Simule en tiempo real cómo el estrés metabólico acelera la pendiente de olvido k y cómo la programación de repasos activos restablece la retención a las 24 y 168 horas.',
    formula: 'dR/dt = −k · R'
  },
  {
    id: 'lisosoma',
    index: '03',
    title: 'El Lisosoma Pedagógico: Autofagia Cognitiva',
    subtitle: 'Matriz de transformación disciplinar y poda sináptica',
    summary:
      'Convierta datos declarativos efímeros de su asignatura en conflictos cognitivos y estudios de caso orientados a competencias genéricas y deontología profesional.',
    formula: 'Dato → Conflicto → Competencia'
  },
  {
    id: 'circadiano',
    index: '04',
    title: 'Algoritmo Circadiano y Protocolo Glinfático',
    subtitle: 'Oscilador de 24 horas · Adenosina, No-REM/REM y luz azul',
    summary:
      'Evalúe el impacto cuantitativo de la privación de sueño y las pantallas nocturnas sobre la depuración metabólica, la memoria de trabajo y la estabilidad dopaminérgica D2.',
    formula: 'C_glinf = f(t_NoREM, Luz_azul)'
  }
];

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  completedModules,
  verifiedNodesCount,
  customLysosomeCount,
  onNavigate
}) => {
  // Pacer de respiración vagal 4-4-6 (ejercicio transversal del módulo)
  const [breathingActive, setBreathingActive] = useState(false);
  const [cycleSecond, setCycleSecond] = useState(0);

  useEffect(() => {
    if (!breathingActive) return;
    const timer = window.setInterval(() => {
      setCycleSecond((prev) => (prev + 1) % 14);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [breathingActive]);

  const getBreathingPhase = (sec: number) => {
    if (sec < 4) return { label: 'Inhalación diafragmática', count: 4 - sec, tone: 'text-sky-800' };
    if (sec < 8) return { label: 'Sostenimiento atencional', count: 8 - sec, tone: 'text-slate-700' };
    return { label: 'Exhalación vagal prolongada', count: 14 - sec, tone: 'text-emerald-800' };
  };

  const phase = getBreathingPhase(cycleSecond);
  const completedCount = ['cerebro', 'olvido', 'lisosoma', 'circadiano'].filter(
    (k) => completedModules[k]
  ).length;
  const progressPercent = Math.round((completedCount / 4) * 100);

  return (
    <div className="space-y-12">
      {/* Cabecera académica editorial */}
      <section className="grid grid-cols-1 gap-8 border-b border-slate-200 pb-10 lg:grid-cols-12 lg:items-stretch">
        <div className="flex flex-col justify-between space-y-6 lg:col-span-8">
          <div className="space-y-4">
            <p className="text-xs font-medium tracking-wide text-slate-500">
              {MODULE_METADATA.institution} · {MODULE_METADATA.program}
            </p>
            <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]">
              {MODULE_METADATA.moduleTitle}
            </h1>
            <p className="font-serif-prose max-w-2xl text-base leading-relaxed text-slate-700 sm:text-lg">
              Laboratorio interactivo de neuropsicofisiología aplicada a la docencia universitaria. Diseñado para analizar empíricamente la regulación emocional, el modelado diferencial del olvido, la poda sináptica curricular y la cronobiología del aprendizaje en entornos virtuales y presenciales.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-200 pt-4 text-sm text-slate-600">
            <span>
              Tutoría: <strong className="font-semibold text-slate-900">{MODULE_METADATA.tutor}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="tabular-nums">{MODULE_METADATA.totalHours} horas · {MODULE_METADATA.sessions} sesiones</span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="tabular-nums">Cohorte de {MODULE_METADATA.cohortSize} docentes</span>
          </div>
        </div>

        {/* Panel lateral derecho: Progreso persistente y regulación autonómica */}
        <aside className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 lg:col-span-4">
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Progreso en el laboratorio
              </h2>
              <span className="font-mono-data text-sm font-semibold text-sky-900">
                {progressPercent}%
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-[#0F4C81] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {completedModules.cerebro ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-300" aria-hidden="true" />
                  )}
                  Circuitos cerebrales verificados
                </span>
                <span className="font-mono-data text-slate-800">{verifiedNodesCount}/5</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {completedModules.olvido ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-300" aria-hidden="true" />
                  )}
                  Simulación dR/dt = −kR
                </span>
                <span className="font-mono-data text-slate-800">
                  {completedModules.olvido ? 'Completado' : 'Pendiente'}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {completedModules.lisosoma ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-300" aria-hidden="true" />
                  )}
                  Matriz de autofagia docente
                </span>
                <span className="font-mono-data text-slate-800">{customLysosomeCount} propios</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  {completedModules.circadiano ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-300" aria-hidden="true" />
                  )}
                  Protocolo glinfático 24 h
                </span>
                <span className="font-mono-data text-slate-800">
                  {completedModules.circadiano ? 'Completado' : 'Pendiente'}
                </span>
              </li>
            </ul>
          </div>

          {/* Ejercicio transversal de respiración consciente 4-4-6 */}
          <div className="mt-6 border-t border-slate-200 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800">
                Calibración vagal previa (4-4-6)
              </span>
              <span className="font-mono-data text-xs text-slate-500">
                {breathingActive ? `${phase.count} s` : '14 s / ciclo'}
              </span>
            </div>
            <p className={`mt-1 text-xs font-medium ${breathingActive ? phase.tone : 'text-slate-500'}`}>
              {breathingActive
                ? phase.label
                : 'Regule la reactividad amigdalina antes de iniciar la práctica.'}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setBreathingActive((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100"
              >
                {breathingActive ? (
                  <>
                    <Pause className="h-3.5 w-3.5" aria-hidden="true" /> Pausar
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" aria-hidden="true" /> Iniciar pauta
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setBreathingActive(false);
                  setCycleSecond(0);
                }}
                aria-label="Reiniciar pauta respiratoria"
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Reiniciar
              </button>
            </div>
          </div>
        </aside>
      </section>

      {/* Los 4 simuladores interactivos */}
      <section className="space-y-5">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Módulos de Simulación Neurocognitiva
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Seleccione un laboratorio interactivo para manipular variables fisiológicas y matemáticas en vivo.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('cerebro')}
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg bg-[#0F4C81] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-900 sm:self-auto"
          >
            Iniciar recorrido secuencial <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {SIMULATOR_CARDS.map((card) => {
            const isDone = completedModules[card.id];
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onNavigate(card.id)}
                className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 text-left transition-colors hover:border-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {card.index}. {card.subtitle}
                    </span>
                    <span className="font-mono-data font-medium text-slate-700">
                      {isDone ? 'Completado' : 'Disponible'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-900">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {card.summary}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="font-mono-data text-xs font-medium text-slate-500">
                    {card.formula}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-900">
                    Abrir simulador <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Competencia asociada y Resultados de Aprendizaje */}
      <section className="grid grid-cols-1 gap-8 border-t border-slate-200 pt-10 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <h2 className="text-lg font-bold text-slate-900">
            Competencia y Ejes del Módulo
          </h2>
          <p className="text-sm leading-relaxed text-slate-700">
            {MODULE_METADATA.competence}
          </p>
          <div className="divide-y divide-slate-200 border-t border-slate-200 pt-2">
            {MODULE_METADATA.thematicAxes.map((item) => (
              <div key={item.axis} className="py-3">
                <p className="text-xs font-semibold text-sky-900">
                  {item.axis} · {item.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {item.focus}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 lg:col-span-7">
          <h2 className="text-lg font-bold text-slate-900">
            Resultados de Aprendizaje Operativos
          </h2>
          <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {MODULE_METADATA.learningOutcomes.map((outcome, idx) => (
              <div key={idx} className="flex gap-4 p-5">
                <span className="font-mono-data shrink-0 text-sm font-semibold text-sky-900">
                  0{idx + 1}
                </span>
                <p className="text-sm leading-relaxed text-slate-700">{outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
