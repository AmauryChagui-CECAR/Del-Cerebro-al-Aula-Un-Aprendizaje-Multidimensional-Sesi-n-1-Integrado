import React, { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { BRAIN_HOTSPOTS, BrainHotspot } from '../data/neuroData';

interface BrainSimulatorProps {
  verifiedNodes: Record<string, boolean>;
  onVerifyNode: (nodeId: string) => void;
}

type PhysiologyMode = 'regulado' | 'desregulado';

export const BrainSimulator: React.FC<BrainSimulatorProps> = ({
  verifiedNodes,
  onVerifyNode
}) => {
  const [selectedId, setSelectedId] = useState<string>(BRAIN_HOTSPOTS[0].id);
  const [mode, setMode] = useState<PhysiologyMode>('regulado');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [epdRound, setEpdRound] = useState<'reto' | 'trampa'>('reto');
  const [epdAnswer, setEpdAnswer] = useState<string>('');
  const [epdFeedback, setEpdFeedback] = useState<string | null>(null);

  const activeNode: BrainHotspot =
    BRAIN_HOTSPOTS.find((n) => n.id === selectedId) || BRAIN_HOTSPOTS[0];

  const handleSelectHotspot = (id: string) => {
    setSelectedId(id);
    setSelectedOption(null);
    setEpdFeedback(null);
    setEpdAnswer('');
  };

  const handleAnswerVerification = (idx: number) => {
    setSelectedOption(idx);
    if (idx === activeNode.verificationQuestion.correctIndex) {
      onVerifyNode(activeNode.id);
    }
  };

  const handleEpdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = epdAnswer.trim().toLowerCase();
    if (!cleaned) return;
    if (epdRound === 'reto') {
      if (cleaned.includes('lápiz') || cleaned.includes('lapiz') || cleaned.includes('negro') || cleaned.includes('digital') || cleaned.includes('alumna')) {
        setEpdFeedback(
          'EPD Positivo (+ΔDA): Resolución exitosa por pensamiento lateral. La recompensa anticipada confirma el esfuerzo prefrontal y sostiene la atención.'
        );
      } else {
        setEpdFeedback(
          'Aproximación válida para debate: el estudiante trajo un lápiz o respondió en formato digital sin incumplir la norma del bolígrafo azul.'
        );
      }
    } else {
      if (cleaned === '5' || cleaned.includes('5 min')) {
        setEpdFeedback(
          'Control inhibitorio exitoso en dlPFC: evitó el heurístico automático de proporcionalidad directa (100 min). Procesamiento en paralelo.'
        );
      } else {
        setEpdFeedback(
          'Error de Predicción Negativo (−ΔDA): El cerebro respondió por economía cognitiva automática ("100 minutos"). Cada software trabaja en paralelo en 5 minutos. Observe la sensación de frustración momentánea.'
        );
      }
    }
  };

  const isRegulated = mode === 'regulado';
  const pathwayColor = isRegulated ? '#0284C7' : '#DC2626';

  return (
    <div className="space-y-6">
      {/* Encabezado del simulador */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-medium text-slate-500">
            01. Simulador Anatómico y Neuropsicofisiológico · Corte Sagital Medial
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Circuitos Cerebrales del Aprendizaje Universitario
          </h2>
        </div>

        {/* Control de estado fisiológico */}
        <div
          role="group"
          aria-label="Estado neurofisiológico del aula"
          className="inline-flex shrink-0 items-center rounded-lg border border-slate-200 bg-slate-100 p-1"
        >
          <button
            type="button"
            onClick={() => setMode('regulado')}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              isRegulated
                ? 'bg-white text-sky-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
            Regulación Cortical (Nominal)
          </button>
          <button
            type="button"
            onClick={() => setMode('desregulado')}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              !isRegulated
                ? 'bg-white text-red-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-red-600" aria-hidden="true" />
            Secuestro / Fatiga (Crítico)
          </button>
        </div>
      </div>

      {/* Selector rápido de nodos para accesibilidad por teclado y móvil */}
      <div className="flex flex-wrap gap-2">
        {BRAIN_HOTSPOTS.map((node) => {
          const active = node.id === activeNode.id;
          const verified = !!verifiedNodes[node.id];
          return (
            <button
              key={node.id}
              type="button"
              onClick={() => handleSelectHotspot(node.id)}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                active
                  ? 'border-[#0F4C81] bg-[#0F4C81] text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="font-mono-data">{node.code}</span>
              <span>{node.shortLabel}</span>
              {verified && (
                <CheckCircle2
                  className={`h-3.5 w-3.5 ${active ? 'text-emerald-200' : 'text-emerald-700'}`}
                  aria-label="Verificado"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Layout de dos zonas: Escenario SVG (60%) + Inspector Conceptual (40%) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Zona Izquierda: Mapa Sagital SVG Nativo */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 lg:col-span-7">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-medium text-slate-500">
              Vista sagital medial · Haga clic en cualquier nodo para inspeccionar vías sinápticas
            </span>
            <span
              className={`inline-flex items-center gap-1.5 font-mono-data font-semibold ${
                isRegulated ? 'text-emerald-800' : 'text-red-700'
              }`}
            >
              <Activity className="h-3.5 w-3.5" aria-hidden="true" />
              {isRegulated ? 'ESTADO: NOMINAL (vmPFC/dlPFC activas)' : 'ESTADO: ALERTA (Cortisol / Economía ciega)'}
            </span>
          </div>

          <div className="relative w-full overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
            <svg
              viewBox="0 0 760 540"
              className="h-auto w-full select-none"
              role="img"
              aria-label="Diagrama anatómico sagital interactivo del cerebro humano con cinco circuitos neurodidácticos"
            >
              <defs>
                <radialGradient id="brainCortexGrad" cx="45%" cy="40%" r="60%">
                  <stop offset="0%" stopColor="#F8FAFC" />
                  <stop offset="70%" stopColor="#E2E8F0" />
                  <stop offset="100%" stopColor="#CBD5E1" />
                </radialGradient>
                <radialGradient id="limbicGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={pathwayColor} stopOpacity="0.22" />
                  <stop offset="100%" stopColor={pathwayColor} stopOpacity="0" />
                </radialGradient>
                <marker
                  id="arrowSignal"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill={pathwayColor} />
                </marker>
              </defs>

              {/* Grilla técnica sutil */}
              <g stroke="#E2E8F0" strokeWidth="0.8" opacity="0.7">
                {[100, 200, 300, 400, 500, 600].map((x) => (
                  <line key={`vx-${x}`} x1={x} y1={24} x2={x} y2={516} />
                ))}
                {[100, 200, 300, 400].map((y) => (
                  <line key={`hy-${y}`} x1={24} y1={y} x2={736} y2={y} />
                ))}
              </g>

              {/* Contorno craneal referencial */}
              <path
                d="M 105 320 C 90 210, 145 75, 345 58 C 535 42, 665 135, 665 268 C 665 360, 610 420, 520 445 L 485 505 L 395 505 L 385 415 C 330 400, 275 375, 200 375 C 145 375, 114 352, 105 320 Z"
                fill="none"
                stroke="#CBD5E1"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Parénquima cortical sagital */}
              <path
                d="M 128 290 C 118 190, 175 95, 355 82 C 515 70, 632 150, 632 258 C 632 332, 578 378, 495 384 C 455 386, 430 356, 392 346 C 345 334, 290 345, 225 344 C 168 343, 134 322, 128 290 Z"
                fill="url(#brainCortexGrad)"
                stroke="#64748B"
                strokeWidth="2.4"
              />

              {/* Surcos corticales anatómicos */}
              <g fill="none" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round">
                <path d="M 178 215 C 210 185, 255 190, 280 155" />
                <path d="M 218 138 C 258 128, 292 145, 325 110" />
                <path d="M 355 95 C 378 130, 360 170, 392 195" />
                <path d="M 435 98 C 462 135, 440 180, 475 215" />
                <path d="M 520 125 C 542 162, 515 205, 558 240" />
                <path d="M 575 190 C 598 228, 575 275, 535 305" />
                <path d="M 155 270 C 195 262, 235 282, 272 260" />
              </g>

              {/* Cerebelo con arbor vitae */}
              <path
                d="M 488 364 C 552 355, 616 382, 608 434 C 600 475, 536 488, 488 462 C 462 446, 464 374, 488 364 Z"
                fill="#E2E8F0"
                stroke="#64748B"
                strokeWidth="2"
              />
              <g fill="none" stroke="#94A3B8" strokeWidth="1.3">
                <path d="M 498 418 C 528 408, 556 392, 582 396" />
                <path d="M 498 418 C 534 422, 565 424, 592 426" />
                <path d="M 498 418 C 530 440, 555 452, 576 456" />
              </g>

              {/* Tronco encefálico (Mesencéfalo, Puente, Bulbo) */}
              <path
                d="M 392 332 C 425 330, 456 352, 468 395 L 478 500 L 424 500 L 414 415 C 402 385, 384 362, 392 332 Z"
                fill="#EDE9FE"
                fillOpacity="0.45"
                stroke="#64748B"
                strokeWidth="2"
              />

              {/* Cuerpo Calloso y Giro Cingulado */}
              <path
                d="M 244 238 C 266 176, 368 158, 458 192 C 492 206, 510 238, 495 256 C 482 270, 466 250, 444 232 C 378 198, 294 206, 268 250 C 254 270, 234 260, 244 238 Z"
                fill="#FFFFFF"
                stroke="#475569"
                strokeWidth="2"
              />

              {/* Corteza Cingulada Anterior (arco sobre cuerpo calloso) */}
              <path
                d="M 218 232 C 242 152, 344 128, 434 152"
                fill="none"
                stroke={activeNode.id === 'acc-posner' ? pathwayColor : '#94A3B8'}
                strokeWidth={activeNode.id === 'acc-posner' ? '6' : '3'}
                strokeLinecap="round"
                opacity="0.7"
              />

              {/* Tálamo */}
              <ellipse
                cx="395"
                cy="264"
                rx="46"
                ry="28"
                fill="#F1F5F9"
                stroke="#64748B"
                strokeWidth="1.8"
              />

              {/* Arco Hipocampal y Fórnix */}
              <path
                d="M 332 288 C 350 242, 418 242, 432 282 C 440 306, 405 322, 378 308"
                fill="none"
                stroke={activeNode.id === 'hippocampus-glymphatic' ? pathwayColor : '#64748B'}
                strokeWidth={activeNode.id === 'hippocampus-glymphatic' ? '5' : '2.5'}
                strokeLinecap="round"
              />

              {/* Canales perivasculares glinfáticos (activos en neocórtex cuando está regulado) */}
              <g
                stroke={activeNode.id === 'hippocampus-glymphatic' ? '#059669' : '#94A3B8'}
                strokeWidth="1.5"
                opacity={activeNode.id === 'hippocampus-glymphatic' ? '0.9' : '0.35'}
                fill="none"
              >
                <path d="M 480 120 Q 492 152 475 182" className={isRegulated ? 'motion-pulse-path' : ''} />
                <path d="M 538 145 Q 528 178 510 202" className={isRegulated ? 'motion-pulse-path' : ''} />
                <path d="M 390 105 Q 402 142 394 176" className={isRegulated ? 'motion-pulse-path' : ''} />
              </g>

              {/* Halo del circuito seleccionado */}
              <circle
                cx={activeNode.coordinates.x}
                cy={activeNode.coordinates.y}
                r="42"
                fill="url(#limbicGlow)"
              />

              {/* Vía axonal animada del circuito activo */}
              <path
                d={`M ${activeNode.coordinates.x} ${activeNode.coordinates.y} Q ${(activeNode.coordinates.x + activeNode.coordinates.targetX) / 2} ${Math.min(activeNode.coordinates.y, activeNode.coordinates.targetY) - 34} ${activeNode.coordinates.targetX} ${activeNode.coordinates.targetY}`}
                fill="none"
                stroke={pathwayColor}
                strokeWidth="3"
                markerEnd="url(#arrowSignal)"
                className="motion-pulse-path"
              />

              {/* Nodos clicables (Hotspots) */}
              {BRAIN_HOTSPOTS.map((node) => {
                const isSelected = node.id === activeNode.id;
                const isVerified = !!verifiedNodes[node.id];
                const { x, y } = node.coordinates;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${x}, ${y})`}
                    onClick={() => handleSelectHotspot(node.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectHotspot(node.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Seleccionar circuito ${node.title}`}
                    aria-pressed={isSelected}
                    className="cursor-pointer focus:outline-none"
                  >
                    <circle
                      r={isSelected ? 22 : 16}
                      fill={isSelected ? pathwayColor : '#FFFFFF'}
                      stroke={isSelected ? '#0F172A' : isVerified ? '#059669' : '#475569'}
                      strokeWidth={isSelected ? 2.5 : 2}
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      fontSize="10.5"
                      fontWeight="700"
                      fontFamily="IBM Plex Mono, monospace"
                      fill={isSelected ? '#FFFFFF' : '#0F172A'}
                    >
                      {node.code}
                    </text>
                  </g>
                );
              })}

              {/* Leyenda anatómica discreta dentro del lienzo */}
              <g fontSize="10.5" fill="#475569" fontFamily="Plus Jakarta Sans, sans-serif">
                <text x="128" y="372">Anterior (Prefrontal)</text>
                <text x="546" y="352">Posterior (Occipital)</text>
                <text x="515" y="495">Cerebelo</text>
                <text x="358" y="518">Tronco Encefálico</text>
              </g>
            </svg>
          </div>

          {/* Ecuación asociada y referencia temática */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-600">
            <span>{activeNode.caseReference}</span>
            <span className="font-mono-data font-medium text-slate-900">
              {activeNode.differentialModel}
            </span>
          </div>
        </div>

        {/* Zona Derecha: Inspector Neuropsicofisiológico y Mini-Laboratorios */}
        <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 lg:col-span-5">
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono-data font-semibold text-sky-900">
                Circuito {activeNode.code}
              </span>
              <span>{activeNode.neurotransmitters}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {activeNode.title}
            </h3>
            <p className="text-xs font-medium text-slate-600">
              {activeNode.circuitType}
            </p>
          </div>

          {/* Mecanismo según el estado seleccionado */}
          <div className="space-y-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-900">
                {isRegulated
                  ? 'Dinámica en Estado Regulado (Nominal)'
                  : 'Dinámica en Desregulación / Secuestro (Crítico)'}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                {isRegulated ? activeNode.regulatedMechanism : activeNode.dysregulatedMechanism}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-900">
                Transferencia al Aula Universitaria
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">
                {activeNode.universityApplication}
              </p>
            </div>
          </div>

          {/* Experimento EPD integrado cuando se inspecciona VTA-Accumbens */}
          {activeNode.id === 'vta-accumbens' && (
            <div className="space-y-3 rounded-lg border border-sky-200 bg-sky-50/50 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-sky-950">
                  Taller Vivencial EPD (2 Rondas)
                </span>
                <div className="inline-flex rounded-md border border-sky-200 bg-white p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEpdRound('reto');
                      setEpdFeedback(null);
                      setEpdAnswer('');
                    }}
                    className={`rounded px-2 py-0.5 font-medium ${
                      epdRound === 'reto' ? 'bg-[#0F4C81] text-white' : 'text-slate-600'
                    }`}
                  >
                    Ronda 1: Reto
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEpdRound('trampa');
                      setEpdFeedback(null);
                      setEpdAnswer('');
                    }}
                    className={`rounded px-2 py-0.5 font-medium ${
                      epdRound === 'trampa' ? 'bg-[#0F4C81] text-white' : 'text-slate-600'
                    }`}
                  >
                    Ronda 2: Trampa IA
                  </button>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-slate-700">
                {epdRound === 'reto'
                  ? 'Regla: «Quien no traiga bolígrafo azul no presenta el examen». Un estudiante llega sin bolígrafo azul, pero el docente, cumpliendo la regla sin excepciones, le permite presentarlo. ¿Cómo es posible?'
                  : 'Prueba de economía cognitiva: Si 5 modelos de IA tardan 5 minutos en redactar 5 ensayos, ¿cuántos minutos tardarán 100 modelos en redactar 100 ensayos?'}
              </p>

              <form onSubmit={handleEpdSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={epdAnswer}
                  onChange={(e) => setEpdAnswer(e.target.value)}
                  placeholder={epdRound === 'reto' ? 'Ej. Trajo un lápiz...' : 'Ej. 5 o 100'}
                  className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-sky-700 focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-md bg-[#0F4C81] px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-900"
                >
                  Evaluar
                </button>
              </form>

              {epdFeedback && (
                <p className="text-xs leading-relaxed font-medium text-sky-950">
                  {epdFeedback}
                </p>
              )}
            </div>
          )}

          {/* Verificación situacional por circuito */}
          <div className="space-y-3 border-t border-slate-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900">
                Verificación de Juicio Situacional
              </span>
              {verifiedNodes[activeNode.id] && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Validado
                </span>
              )}
            </div>
            <p className="text-xs leading-relaxed text-slate-700">
              {activeNode.verificationQuestion.prompt}
            </p>
            <div className="space-y-2">
              {activeNode.verificationQuestion.options.map((option, idx) => {
                const isChosen = selectedOption === idx;
                const isCorrect = idx === activeNode.verificationQuestion.correctIndex;
                let borderStyle = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50';
                if (isChosen) {
                  borderStyle = isCorrect
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950'
                    : 'border-red-500 bg-red-50 text-red-950';
                }
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAnswerVerification(idx)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-xs leading-snug transition-colors ${borderStyle}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {selectedOption !== null && (
              <p
                className={`text-xs leading-relaxed ${
                  selectedOption === activeNode.verificationQuestion.correctIndex
                    ? 'text-emerald-800'
                    : 'text-red-700'
                }`}
              >
                {selectedOption === activeNode.verificationQuestion.correctIndex
                  ? `Correcto. ${activeNode.verificationQuestion.rationale}`
                  : 'Revise la interacción funcional del circuito en el panel superior e intente nuevamente.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
