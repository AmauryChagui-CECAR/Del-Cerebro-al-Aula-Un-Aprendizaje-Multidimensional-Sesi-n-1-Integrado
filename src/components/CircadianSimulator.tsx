import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Moon, ShieldAlert } from 'lucide-react';

interface CircadianSimulatorProps {
  isCompleted: boolean;
  onComplete: () => void;
}

export const CircadianSimulator: React.FC<CircadianSimulatorProps> = ({
  isCompleted,
  onComplete
}) => {
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [blueLightMinutes, setBlueLightMinutes] = useState<number>(30);
  const [consistentWake, setConsistentWake] = useState<boolean>(true);
  const [strategicNap, setStrategicNap] = useState<boolean>(false);

  // Motor fisiológico de 24 horas (eje 0..24h desde las 06:00 AM hasta las 06:00 AM del día siguiente)
  const metrics = useMemo(() => {
    // Ventana de sueño dentro de las 24 h (al final del ciclo: 24 - sleepHours .. 24)
    const sleepStart = 24 - sleepHours;
    const midSleep = sleepStart + sleepHours / 2;

    // Retraso de fase melatonina por exposición nocturna a luz azul
    const melatoninDelayHours = (blueLightMinutes / 60) * 0.65;
    const effectiveSleepQuality = Math.max(
      0.25,
      Math.min(
        1,
        (sleepHours / 8) *
          (1 - (blueLightMinutes / 240) * 0.34) *
          (consistentWake ? 1 : 0.88)
      )
    );

    // Depuración de adenosina (%) durante fase No-REM
    const rawClearance =
      (Math.min(sleepHours, 8.5) / 8) *
      92 *
      (1 - (blueLightMinutes / 240) * 0.28) +
      (strategicNap ? 8 : 0);
    const adenosineClearance = Math.min(99, Math.max(18, Math.round(rawClearance)));

    // Integridad No-REM (primera mitad) y REM (segunda mitad)
    const noRemIntegrity = Math.min(
      100,
      Math.max(20, Math.round((Math.min(sleepHours, 4.5) / 4.2) * 95 - blueLightMinutes * 0.14))
    );
    const remIntegrity = Math.min(
      100,
      Math.max(
        10,
        Math.round((Math.max(0, sleepHours - 3.2) / 4.3) * 96 - blueLightMinutes * 0.1)
      )
    );

    // Memoria de trabajo dlPFC y estabilidad dopaminérgica D2 al día siguiente
    const workingMemoryIndex = Math.min(
      98,
      Math.max(
        22,
        Math.round(
          0.45 * adenosineClearance +
            0.35 * remIntegrity +
            0.2 * (consistentWake ? 95 : 70)
        )
      )
    );

    const dopamineD2Stability = Math.min(
      98,
      Math.max(
        20,
        Math.round(
          92 * effectiveSleepQuality -
            (blueLightMinutes / 240) * 18 +
            (consistentWake ? 6 : -6)
        )
      )
    );

    // Generación de curvas horarias (49 puntos cada 0.5h desde 0h = 06:00)
    const points: {
      t: number;
      adenosine: number;
      dopamineAlert: number;
    }[] = [];

    for (let i = 0; i <= 48; i++) {
      const t = i * 0.5;
      // Presión de adenosina (sube en vigilia, cae en siesta y durante el sueño No-REM)
      let ad = 15 + (100 - adenosineClearance) * 0.45;
      if (t <= sleepStart) {
        const wakeRatio = t / Math.max(12, sleepStart);
        ad = Math.min(96, ad + wakeRatio * 68);
        if (strategicNap && t >= 8 && t <= 9) {
          ad = Math.max(20, ad - 11);
        } else if (strategicNap && t > 9) {
          ad = Math.max(22, ad - 6);
        }
      } else {
        const sleepProgress = (t - sleepStart) / Math.max(1, sleepHours);
        const peakAtSleep = Math.min(
          96,
          15 + (100 - adenosineClearance) * 0.45 + 68
        );
        const residual = 100 - adenosineClearance;
        ad = residual + (peakAtSleep - residual) * Math.exp(-2.8 * sleepProgress);
      }

      // Alerta circadiana + sensibilidad D2
      let da =
        58 +
        24 * Math.sin(((t - 1.5 - melatoninDelayHours) / 24) * 2 * Math.PI) -
        (t >= 7.5 && t <= 9.5 ? 7 : 0);

      // Modulación por deuda previa y picos artificiales de pantalla nocturna
      da = da * (0.68 + 0.32 * effectiveSleepQuality);
      if (blueLightMinutes > 0 && t >= sleepStart - blueLightMinutes / 60 && t <= sleepStart) {
        da = Math.min(94, da + (blueLightMinutes / 240) * 24);
      }
      if (t > sleepStart) {
        da = Math.max(14, da - ((t - sleepStart) / sleepHours) * 28);
      }

      points.push({
        t,
        adenosine: Math.min(98, Math.max(8, ad)),
        dopamineAlert: Math.min(98, Math.max(10, da))
      });
    }

    let status: 'nominal' | 'alerta' | 'critico' = 'nominal';
    if (workingMemoryIndex < 55 || adenosineClearance < 55) {
      status = 'critico';
    } else if (workingMemoryIndex < 78 || blueLightMinutes >= 90) {
      status = 'alerta';
    }

    return {
      sleepStart,
      midSleep,
      adenosineClearance,
      noRemIntegrity,
      remIntegrity,
      workingMemoryIndex,
      dopamineD2Stability,
      points,
      status
    };
  }, [sleepHours, blueLightMinutes, consistentWake, strategicNap]);

  // Geometría SVG
  const width = 760;
  const height = 370;
  const pad = { top: 30, right: 26, bottom: 48, left: 54 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const toX = (t: number) => pad.left + (t / 24) * plotW;
  const toY = (val: number) => pad.top + ((100 - val) / 100) * plotH;

  const adenosinePath = metrics.points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${toX(p.t).toFixed(1)} ${toY(p.adenosine).toFixed(1)}`)
    .join(' ');

  const dopaminePath = metrics.points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${toX(p.t).toFixed(1)} ${toY(p.dopamineAlert).toFixed(1)}`)
    .join(' ');

  const formatHourLabel = (offset: number) => {
    const hour = (6 + offset) % 24;
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-medium text-slate-500">
            04. Algoritmo Circadiano · Oscilador de 24 Horas y Limpieza Glinfática
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Protocolo Glinfático e Higiene del Sueño
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          {metrics.status === 'nominal' && (
            <span className="inline-flex items-center gap-1.5 text-emerald-800">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              DIAGNÓSTICO: NOMINAL (Depuración glinfática íntegra)
            </span>
          )}
          {metrics.status === 'alerta' && (
            <span className="inline-flex items-center gap-1.5 text-amber-800">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              DIAGNÓSTICO: ALERTA METABÓLICA (Supresión parcial de melatonina)
            </span>
          )}
          {metrics.status === 'critico' && (
            <span className="inline-flex items-center gap-1.5 text-red-700">
              <ShieldAlert className="h-4 w-4" aria-hidden="true" />
              DIAGNÓSTICO: DÉFICIT CRÍTICO (Adenosina residual y desensibilización D2)
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Gráfica 24h SVG */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 lg:col-span-7">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2 font-medium text-slate-700">
                <span className="inline-block h-0.5 w-5 bg-[#0F4C81]" aria-hidden="true" />
                Alerta Circadiana y Tono D2
              </span>
              <span className="inline-flex items-center gap-2 font-medium text-slate-700">
                <span className="inline-block h-0.5 w-5 bg-amber-600" aria-hidden="true" />
                Presión de Adenosina
              </span>
            </div>
            <span className="font-mono-data text-slate-500">
              Ventana sueño: {formatHourLabel(Math.round(metrics.sleepStart))} – 06:00
            </span>
          </div>

          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-auto w-full select-none rounded-lg border border-slate-100 bg-slate-50"
            role="img"
            aria-label="Oscilador circadiano de 24 horas mostrando presión de adenosina, tono dopaminérgico y fases No-REM y REM"
          >
            {/* Banda de sueño No-REM (primera mitad) */}
            <rect
              x={toX(metrics.sleepStart)}
              y={pad.top}
              width={toX(metrics.midSleep) - toX(metrics.sleepStart)}
              height={plotH}
              fill="#0284C7"
              fillOpacity="0.10"
            />
            <text
              x={(toX(metrics.sleepStart) + toX(metrics.midSleep)) / 2}
              y={pad.top + 14}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="700"
              fill="#0369A1"
              fontFamily="IBM Plex Mono, monospace"
            >
              No-REM
            </text>

            {/* Banda de sueño REM (segunda mitad) */}
            <rect
              x={toX(metrics.midSleep)}
              y={pad.top}
              width={toX(24) - toX(metrics.midSleep)}
              height={plotH}
              fill="#059669"
              fillOpacity="0.10"
            />
            <text
              x={(toX(metrics.midSleep) + toX(24)) / 2}
              y={pad.top + 14}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="700"
              fill="#047857"
              fontFamily="IBM Plex Mono, monospace"
            >
              REM
            </text>

            {/* Banda de exposición a luz azul nocturna */}
            {blueLightMinutes > 0 && (
              <rect
                x={toX(Math.max(0, metrics.sleepStart - blueLightMinutes / 60))}
                y={pad.top}
                width={toX(metrics.sleepStart) - toX(Math.max(0, metrics.sleepStart - blueLightMinutes / 60))}
                height={plotH}
                fill="#DC2626"
                fillOpacity="0.11"
              />
            )}

            {/* Grilla horizontal */}
            {[0, 25, 50, 75, 100].map((v) => (
              <g key={`cy-${v}`}>
                <line
                  x1={pad.left}
                  y1={toY(v)}
                  x2={width - pad.right}
                  y2={toY(v)}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <text
                  x={pad.left - 8}
                  y={toY(v) + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="#64748B"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {v}%
                </text>
              </g>
            ))}

            {/* Eje temporal de 24 horas */}
            {[0, 4, 8, 12, 16, 20, 24].map((offset) => (
              <g key={`cx-${offset}`}>
                <line
                  x1={toX(offset)}
                  y1={pad.top}
                  x2={toX(offset)}
                  y2={height - pad.bottom}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <text
                  x={toX(offset)}
                  y={height - pad.bottom + 18}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#64748B"
                  fontFamily="IBM Plex Mono, monospace"
                >
                  {formatHourLabel(offset)}
                </text>
              </g>
            ))}

            <text
              x={pad.left + plotW / 2}
              y={height - 8}
              textAnchor="middle"
              fontSize="11.5"
              fontWeight="600"
              fill="#334155"
            >
              Ciclo de 24 horas (desde despertar matutino hasta cierre del descanso)
            </text>

            {/* Curva de Adenosina */}
            <path
              d={adenosinePath}
              fill="none"
              stroke="#D97706"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Curva de Alerta / Dopamina */}
            <path
              d={dopaminePath}
              fill="none"
              stroke="#0F4C81"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
          </svg>

          {/* Indicadores fisiológicos tabulares */}
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-4">
            <div>
              <p className="text-[11px] text-slate-500">Depuración Adenosina</p>
              <p className="font-mono-data text-base font-bold text-slate-900">
                {metrics.adenosineClearance}%
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Fases No-REM / REM</p>
              <p className="font-mono-data text-base font-bold text-sky-900">
                {metrics.noRemIntegrity}% / {metrics.remIntegrity}%
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Memoria Trabajo (dlPFC)</p>
              <p className="font-mono-data text-base font-bold text-slate-900">
                {metrics.workingMemoryIndex}/100
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Estabilidad D2</p>
              <p className="font-mono-data text-base font-bold text-slate-900">
                {metrics.dopamineD2Stability}/100
              </p>
            </div>
          </div>
        </div>

        {/* Panel de Entrada y Diagnóstico Personalizado */}
        <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 lg:col-span-5">
          {/* Control 1: Horas de sueño */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="sleep-hours-slider" className="font-semibold text-slate-900">
                Horas de sueño nocturno
              </label>
              <span className="font-mono-data font-bold text-sky-900">
                {sleepHours.toFixed(1)} h
              </span>
            </div>
            <input
              id="sleep-hours-slider"
              type="range"
              min={3}
              max={9.5}
              step={0.5}
              value={sleepHours}
              onChange={(e) => setSleepHours(Number(e.target.value))}
              className="neuro-slider w-full"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>3.0 h (Trasnocho severo)</span>
              <span>7.5–8.0 h (Óptimo)</span>
              <span>9.5 h</span>
            </div>
          </div>

          {/* Control 2: Luz azul nocturna */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="bluelight-slider" className="font-semibold text-slate-900">
                Exposición a pantallas / luz azul antes de dormir
              </label>
              <span className="font-mono-data font-bold text-red-700">
                {blueLightMinutes} min
              </span>
            </div>
            <input
              id="bluelight-slider"
              type="range"
              min={0}
              max={240}
              step={15}
              value={blueLightMinutes}
              onChange={(e) => setBlueLightMinutes(Number(e.target.value))}
              className="neuro-slider w-full"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>0 min</span>
              <span>120 min</span>
              <span>240 min (4 h)</span>
            </div>
          </div>

          {/* Toggles de mitigación circadiana */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setConsistentWake((prev) => !prev)}
              aria-pressed={consistentWake}
              className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                consistentWake
                  ? 'border-sky-700 bg-sky-50 text-sky-950'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              <span className="block font-semibold">Despertar fijo (±1 h)</span>
              <span className="text-[11px]">Anclaje del núcleo supraquiasmático</span>
            </button>

            <button
              type="button"
              onClick={() => setStrategicNap((prev) => !prev)}
              aria-pressed={strategicNap}
              className={`rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                strategicNap
                  ? 'border-sky-700 bg-sky-50 text-sky-950'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              <span className="block font-semibold">Siesta estratégica (20 min)</span>
              <span className="text-[11px]">Depuración parcial de adenosina</span>
            </button>
          </div>

          {/* Lectura clínica personalizada */}
          <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-700">
            <p className="flex items-center gap-1.5 font-semibold text-slate-900">
              <Moon className="h-3.5 w-3.5 text-sky-800" aria-hidden="true" />
              Interpretación Neuropsicofisiológica
            </p>
            {sleepHours < 6 ? (
              <p>
                La restricción a <strong className="font-mono-data">{sleepHours.toFixed(1)} h</strong> amputa el último bloque REM de la madrugada, reduciendo la integración semántica al{' '}
                <strong className="font-mono-data">{metrics.remIntegrity}%</strong> y dejando residuos de adenosina que deterioran la memoria operativa en la corteza prefrontal dorsolateral.
              </p>
            ) : (
              <p>
                La ventana de <strong className="font-mono-data">{sleepHours.toFixed(1)} h</strong> preserva la arquitectura bifásica No-REM/REM, habilitando la limpieza glinfática del espacio intersticial y la recalibración de receptores dopaminérgicos D2.
              </p>
            )}
            {blueLightMinutes >= 60 && (
              <p className="text-red-800">
                Exposición lumínica nocturna de <strong className="font-mono-data">{blueLightMinutes} min</strong>: las células ganglionares fotosensibles retrasan la secreción pineal de melatonina, reduciendo la profundidad de ondas lentas y propiciando fatiga atencional diurna.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onComplete}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors ${
              isCompleted
                ? 'border border-emerald-300 bg-emerald-50 text-emerald-900'
                : 'bg-[#0F4C81] text-white hover:bg-sky-900'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            {isCompleted
              ? 'Diagnóstico circadiano registrado'
              : 'Registrar diagnóstico glinfático en progreso'}
          </button>
        </div>
      </div>
    </div>
  );
};
