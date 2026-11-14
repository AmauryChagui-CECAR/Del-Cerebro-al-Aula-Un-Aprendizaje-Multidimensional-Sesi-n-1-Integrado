import React, { useMemo, useState } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface ForgettingCurveSimulatorProps {
  isCompleted: boolean;
  onComplete: () => void;
}

const REVIEW_HOURS = [2, 8, 24, 60, 108];

export const ForgettingCurveSimulator: React.FC<ForgettingCurveSimulatorProps> = ({
  isCompleted,
  onComplete
}) => {
  const [stressLoad, setStressLoad] = useState<number>(35);
  const [reviewCount, setReviewCount] = useState<number>(3);
  const [horizonHours, setHorizonHours] = useState<24 | 168>(168);
  const [hoverHour, setHoverHour] = useState<number | null>(24);

  // Constante de olvido base k0 (h^-1) modulada por estrés / carga metabólica
  const k0 = useMemo(() => 0.042 + 0.0011 * stressLoad, [stressLoad]);

  // Factor de aplanamiento sináptico tras cada repaso activo
  const decayFactor = 0.56;

  // Cálculo de la trayectoria con y sin repaso espaciado
  const simulation = useMemo(() => {
    const activeReviews = REVIEW_HOURS.slice(0, reviewCount).filter(
      (h) => h <= horizonHours
    );

    const evaluateBaseline = (t: number) => 100 * Math.exp(-k0 * t);

    const evaluateSpaced = (t: number): { r: number; kEff: number; stage: number } => {
      let lastReset = 0;
      let stage = 0;
      for (let i = 0; i < activeReviews.length; i++) {
        if (t >= activeReviews[i]) {
          lastReset = activeReviews[i];
          stage = i + 1;
        }
      }
      const kEff = k0 * Math.pow(decayFactor, stage);
      const dt = Math.max(0, t - lastReset);
      const r = 100 * Math.exp(-kEff * dt);
      return { r, kEff, stage };
    };

    const steps = horizonHours === 24 ? 96 : 168;
    const pointsBaseline: { t: number; r: number }[] = [];
    const pointsSpaced: { t: number; r: number; kEff: number }[] = [];

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * horizonHours;
      // Insertar salto vertical limpio justo antes de cada reinicio para visualizar el repaso
      if (i > 0) {
        const prevT = ((i - 1) / steps) * horizonHours;
        for (const revT of activeReviews) {
          if (revT > prevT && revT <= t) {
            const preRev = evaluateSpaced(revT - 0.001);
            pointsSpaced.push({ t: revT, r: preRev.r, kEff: preRev.kEff });
          }
        }
      }
      const sp = evaluateSpaced(t);
      pointsBaseline.push({ t, r: evaluateBaseline(t) });
      pointsSpaced.push({ t, r: sp.r, kEff: sp.kEff });
    }

    const at24Base = evaluateBaseline(24);
    const at24Spaced = evaluateSpaced(24).r;
    const at168Base = evaluateBaseline(168);
    const at168Spaced = evaluateSpaced(168).r;
    const finalKEff = k0 * Math.pow(decayFactor, activeReviews.length);
    const halfLife = Math.LN2 / finalKEff;

    return {
      activeReviews,
      pointsBaseline,
      pointsSpaced,
      at24Base,
      at24Spaced,
      at168Base,
      at168Spaced,
      finalKEff,
      halfLife,
      evaluateBaseline,
      evaluateSpaced
    };
  }, [k0, reviewCount, horizonHours]);

  // Geometría SVG
  const width = 760;
  const height = 390;
  const pad = { top: 28, right: 28, bottom: 48, left: 56 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const toX = (t: number) => pad.left + (t / horizonHours) * plotW;
  const toY = (r: number) => pad.top + ((100 - r) / 100) * plotH;

  const baselinePath = simulation.pointsBaseline
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${toX(p.t).toFixed(1)} ${toY(p.r).toFixed(1)}`)
    .join(' ');

  const spacedPath = simulation.pointsSpaced
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${toX(p.t).toFixed(1)} ${toY(p.r).toFixed(1)}`)
    .join(' ');

  const inspectedHour = hoverHour !== null ? Math.min(horizonHours, Math.max(0, hoverHour)) : 24;
  const inspectedBase = simulation.evaluateBaseline(inspectedHour);
  const inspectedSpaced = simulation.evaluateSpaced(inspectedHour);
  const instantaneousRate = -inspectedSpaced.kEff * inspectedSpaced.r;

  const xTicks =
    horizonHours === 24 ? [0, 4, 8, 12, 16, 20, 24] : [0, 24, 48, 72, 96, 120, 144, 168];

  const handleSvgPointer = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * width;
    const t = ((relX - pad.left) / plotW) * horizonHours;
    if (t >= 0 && t <= horizonHours) {
      setHoverHour(Math.round(t * 2) / 2);
    }
  };

  const handleApplyAndMark = () => {
    onComplete();
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-medium text-slate-500">
            02. Simulador Matemático · Ecuación Diferencial de Ebbinghaus
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Curva del Olvido y Repaso Espaciado
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div
            role="group"
            aria-label="Horizonte temporal de simulación"
            className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1"
          >
            <button
              type="button"
              onClick={() => {
                setHorizonHours(24);
                setHoverHour(12);
              }}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                horizonHours === 24
                  ? 'bg-white text-sky-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Primeras 24 h
            </button>
            <button
              type="button"
              onClick={() => {
                setHorizonHours(168);
                setHoverHour(24);
              }}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                horizonHours === 168
                  ? 'bg-white text-sky-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ciclo 168 h (7 días)
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setStressLoad(35);
              setReviewCount(3);
              setHorizonHours(168);
              setHoverHour(24);
            }}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Restablecer
          </button>
        </div>
      </div>

      {/* Layout de dos zonas: Gráfica SVG (62%) + Controles y Modelo (38%) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Escenario SVG */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 lg:col-span-7">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 font-medium text-slate-700">
                <span className="inline-block h-0.5 w-5 bg-[#0F4C81]" aria-hidden="true" />
                Con repaso espaciado
              </span>
              <span className="inline-flex items-center gap-2 font-medium text-slate-500">
                <span className="inline-block h-0.5 w-5 border-t-2 border-dashed border-red-600" aria-hidden="true" />
                Sin repaso (olvido pasivo)
              </span>
            </div>
            <span className="font-mono-data text-slate-600">
              t = {inspectedHour} h · R = {inspectedSpaced.r.toFixed(1)}%
            </span>
          </div>

          <svg
            viewBox={`0 0 ${width} ${height}`}
            onMouseMove={handleSvgPointer}
            onClick={handleSvgPointer}
            className="h-auto w-full cursor-crosshair select-none rounded-lg border border-slate-100 bg-slate-50"
            role="img"
            aria-label="Gráfica diferencial de retención de memoria frente al tiempo en horas"
          >
            {/* Banda de retención operativa (>= 70%) */}
            <rect
              x={pad.left}
              y={toY(100)}
              width={plotW}
              height={toY(70) - toY(100)}
              fill="#059669"
              fillOpacity="0.06"
            />
            <line
              x1={pad.left}
              y1={toY(70)}
              x2={width - pad.right}
              y2={toY(70)}
              stroke="#059669"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <text
              x={width - pad.right - 4}
              y={toY(70) - 5}
              textAnchor="end"
              fontSize="10"
              fill="#047857"
              fontFamily="IBM Plex Mono, monospace"
            >
              Umbral consolidación (70%)
            </text>

            {/* Grilla */}
            {[0, 25, 50, 75, 100].map((val) => (
              <g key={`y-${val}`}>
                <line
                  x1={pad.left}
                  y1={toY(val)}
                  x2={width - pad.right}
                  y2={toY(val)}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <text
                  x={pad.left - 8}
                  y={toY(val) + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#64748B"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {val}%
                </text>
              </g>
            ))}

            {xTicks.map((t) => (
              <g key={`x-${t}`}>
                <line
                  x1={toX(t)}
                  y1={pad.top}
                  x2={toX(t)}
                  y2={height - pad.bottom}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <text
                  x={toX(t)}
                  y={height - pad.bottom + 18}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#64748B"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {t}h
                </text>
              </g>
            ))}

            {/* Etiquetas de ejes */}
            <text
              x={pad.left + plotW / 2}
              y={height - 8}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="600"
              fill="#334155"
            >
              Tiempo transcurrido tras la sesión de estudio (horas)
            </text>

            {/* Curva sin repaso (decaimiento puro) */}
            <path
              d={baselinePath}
              fill="none"
              stroke="#DC2626"
              strokeWidth="2"
              strokeDasharray="6 4"
            />

            {/* Curva con repaso espaciado */}
            <path
              d={spacedPath}
              fill="none"
              stroke="#0F4C81"
              strokeWidth="3"
              strokeLinejoin="round"
            />

            {/* Puntos de repaso activo */}
            {simulation.activeReviews.map((revT, idx) => (
              <g key={`rev-${revT}`} transform={`translate(${toX(revT)}, ${toY(100)})`}>
                <circle r="4.5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1.5" />
                <text
                  y="-9"
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="600"
                  fill="#0369A1"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  R{idx + 1}
                </text>
              </g>
            ))}

            {/* Línea de inspección */}
            <line
              x1={toX(inspectedHour)}
              y1={pad.top}
              x2={toX(inspectedHour)}
              y2={height - pad.bottom}
              stroke="#475569"
              strokeWidth="1"
            />
            <circle
              cx={toX(inspectedHour)}
              cy={toY(inspectedBase)}
              r="4.5"
              fill="#DC2626"
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            <circle
              cx={toX(inspectedHour)}
              cy={toY(inspectedSpaced.r)}
              r="5.5"
              fill="#0F4C81"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          </svg>

          {/* Lectura instantánea del cursor */}
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-4">
            <div>
              <p className="text-[11px] text-slate-500">Retención a 24 h</p>
              <p className="font-mono-data text-base font-bold text-sky-900">
                {simulation.at24Spaced.toFixed(1)}%
              </p>
              <p className="font-mono-data text-[11px] text-red-700">
                Base: {simulation.at24Base.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Retención a 7 días</p>
              <p className="font-mono-data text-base font-bold text-sky-900">
                {simulation.at168Spaced.toFixed(1)}%
              </p>
              <p className="font-mono-data text-[11px] text-red-700">
                Base: {simulation.at168Base.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Pendiente efectiva k</p>
              <p className="font-mono-data text-base font-bold text-slate-900">
                {simulation.finalKEff.toFixed(4)} h⁻¹
              </p>
              <p className="font-mono-data text-[11px] text-slate-500">
                k₀ = {k0.toFixed(4)} h⁻¹
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Vida media mnémica</p>
              <p className="font-mono-data text-base font-bold text-emerald-800">
                {simulation.halfLife.toFixed(1)} h
              </p>
              <p className="font-mono-data text-[11px] text-slate-500">
                dR/dt = {instantaneousRate.toFixed(2)}%/h
              </p>
            </div>
          </div>
        </div>

        {/* Panel de Control y Análisis Diferencial */}
        <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 lg:col-span-5">
          {/* Fórmula */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold text-slate-700">
              Modelo de Decaimiento Exponencial
            </p>
            <p className="font-mono-data mt-1 text-base font-semibold text-slate-900">
              dR/dt = −k · R &nbsp;⇒&nbsp; R(t) = 100 · e^(−k·t)
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              La velocidad de pérdida mnémica es directamente proporcional a la cantidad de información aún retenida (R) y modulada por la constante biológica k.
            </p>
          </div>

          {/* Slider 1: Estrés / Carga Metabólica */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="stress-slider" className="font-semibold text-slate-900">
                Nivel de Estrés / Carga Metabólica (modula k)
              </label>
              <span className="font-mono-data font-bold text-slate-900">{stressLoad}%</span>
            </div>
            <input
              id="stress-slider"
              type="range"
              min={0}
              max={100}
              step={5}
              value={stressLoad}
              onChange={(e) => setStressLoad(Number(e.target.value))}
              className="neuro-slider w-full"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>0% (Sueño íntegro)</span>
              <span>50% (Carga media)</span>
              <span>100% (Trasnocho / Distrés)</span>
            </div>
          </div>

          {/* Slider 2: Frecuencia de Repaso Espaciado */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="review-slider" className="font-semibold text-slate-900">
                Frecuencia de Repaso Espaciado (recuperación activa)
              </label>
              <span className="font-mono-data font-bold text-sky-900">
                {reviewCount} {reviewCount === 1 ? 'repaso' : 'repasos'}
              </span>
            </div>
            <input
              id="review-slider"
              type="range"
              min={0}
              max={5}
              step={1}
              value={reviewCount}
              onChange={(e) => setReviewCount(Number(e.target.value))}
              className="neuro-slider w-full"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>0 (Sin repaso)</span>
              <span>3 (2h · 8h · 24h)</span>
              <span>5 (Hasta 108h)</span>
            </div>
          </div>

          {/* Interpretación neurodidáctica dinámica */}
          <div className="space-y-2 border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-700">
            <p className="font-semibold text-slate-900">
              Diagnóstico de Consolidación Sináptica
            </p>
            {reviewCount === 0 ? (
              <p className="text-red-800">
                Alerta de decaimiento: Sin evocación activa, a las 24 horas la retención cae a{' '}
                <strong className="font-mono-data">{simulation.at24Base.toFixed(1)}%</strong>. La memoria de corto plazo dependiente del hipocampo sufre depuración acelerada antes de transferirse al neocórtex.
              </p>
            ) : (
              <p>
                Con <strong className="font-mono-data">{reviewCount}</strong> sesiones de recuperación activa, la constante efectiva desciende de{' '}
                <span className="font-mono-data">{k0.toFixed(3)} h⁻¹</span> a{' '}
                <span className="font-mono-data font-semibold text-sky-900">
                  {simulation.finalKEff.toFixed(3)} h⁻¹
                </span>
                , elevando la vida media del trazado mnémico a{' '}
                <span className="font-mono-data font-semibold text-emerald-800">
                  {simulation.halfLife.toFixed(1)} horas
                </span>
                .
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleApplyAndMark}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors ${
              isCompleted
                ? 'border border-emerald-300 bg-emerald-50 text-emerald-900'
                : 'bg-[#0F4C81] text-white hover:bg-sky-900'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {isCompleted
              ? 'Simulación diferencial registrada en progreso'
              : 'Registrar comprensión del modelo dR/dt = −kR'}
          </button>
        </div>
      </div>
    </div>
  );
};
