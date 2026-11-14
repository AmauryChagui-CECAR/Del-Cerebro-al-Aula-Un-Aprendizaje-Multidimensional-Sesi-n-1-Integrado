import {
  APA_REFERENCES,
  BRAIN_HOTSPOTS,
  LYSOSOME_PRESETS,
  LysosomeEntry,
  MODULE_METADATA
} from '../data/neuroData';

export function buildStructuredJson(customEntries: LysosomeEntry[]): string {
  const forgettingSampleTable = [0, 2, 4, 6, 12, 24, 48, 72, 168].map((h) => {
    const kBase = 0.0805;
    const baseRetention = Number((100 * Math.exp(-kBase * h)).toFixed(1));
    const spacedRetention = Number(
      (
        100 *
        Math.exp(
          -(kBase * Math.pow(0.56, h >= 60 ? 4 : h >= 24 ? 3 : h >= 8 ? 2 : h >= 2 ? 1 : 0)) *
            (h >= 60 ? h - 60 : h >= 24 ? h - 24 : h >= 8 ? h - 8 : h >= 2 ? h - 2 : h)
        )
      ).toFixed(1)
    );
    return {
      tiempoHoras: h,
      retencionSinRepasoPorcentaje: baseRetention,
      retencionRepasoEspaciadoPorcentaje: spacedRetention
    };
  });

  const payload = {
    esquema: 'cecar-neurodidactica-2026-2',
    compatibilidadImportacion: ['Canva Gráficos', 'Genially Embed / Datos', 'Moodle SCORM/HTML'],
    modulo: MODULE_METADATA,
    simuladorCerebralSagital: {
      viewBox: '0 0 760 540',
      estados: ['Regulación Cortical (Nominal)', 'Secuestro Amigdalino / Fatiga (Crítico)'],
      nodos: BRAIN_HOTSPOTS
    },
    curvaOlvidoEbbinghaus: {
      ecuacionDiferencial: 'dR/dt = -k * R',
      solucionAnalitica: 'R(t) = R0 * exp(-k * t)',
      parametros: {
        estresRango: [0, 100],
        frecuenciaRepasosRango: [0, 5],
        factorAplanamientoSinaptico: 0.56,
        intervalosRepasoHoras: [2, 8, 24, 60, 108]
      },
      tablaReferenciaCanvaGenially: forgettingSampleTable
    },
    matrizLisosomaPedagogico: {
      columnas: [
        'Basura Reutilizable (Dato memorístico a podar)',
        'Procesamiento Lisosomal (Conflicto cognitivo / Estudio de caso)',
        'Componente Reciclado (Competencia genérica duradera)'
      ],
      ejemplosPorArea: LYSOSOME_PRESETS,
      aportesDocentePersonalizados: customEntries
    },
    algoritmoCircadianoGlinfatico: {
      horizonteHoras: 24,
      variablesEntrada: {
        horasSuenoRango: [3.0, 9.5],
        luzAzulNocturnaMinutosRango: [0, 240],
        consistenciaDespertar: 'boolean',
        siestaEstrategica20Min: 'boolean'
      },
      fasesEvaluadas: ['No-REM (Consolidación hipocampo-neocortical y depuración adenosina)', 'REM (Integración semántica y metacognición)'],
      indicadoresSalida: ['Depuración Adenosina (%)', 'Memoria de Trabajo dlPFC', 'Estabilidad Dopaminérgica D2']
    },
    referenciasAPA7: APA_REFERENCES
  };

  return JSON.stringify(payload, null, 2);
}

export function buildSelfContainedHtml(customEntries: LysosomeEntry[]): string {
  const embeddedData = {
    hotspots: BRAIN_HOTSPOTS,
    presets: LYSOSOME_PRESETS,
    customEntries,
    references: APA_REFERENCES
  };
  const safeJson = JSON.stringify(embeddedData).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Del Cerebro al Aula · Simulador Neurodidáctico CECAR 2026-2</title>
  <style>
    :root {
      --bg: #F8FAFC;
      --surface: #FFFFFF;
      --surface-alt: #F1F5F9;
      --border: #E2E8F0;
      --text: #0F172A;
      --muted: #475569;
      --accent: #0F4C81;
      --accent-light: #0284C7;
      --ok: #047857;
      --warn: #B45309;
      --crit: #B91C1C;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
    }
    header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 14px 20px;
      position: sticky;
      top: 0;
      z-index: 20;
    }
    .header-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .brand { font-weight: 700; font-size: 16px; color: var(--text); }
    .meta { font-size: 12px; color: var(--muted); }
    nav { display: flex; flex-wrap: wrap; gap: 6px; }
    .tab-btn {
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--muted);
      padding: 7px 12px;
      border-radius: 7px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .tab-btn.active {
      background: var(--accent);
      border-color: var(--accent);
      color: #FFFFFF;
    }
    main { max-width: 1200px; margin: 0 auto; padding: 24px 20px 48px; }
    .panel { display: none; }
    .panel.active { display: block; }
    .grid-2 {
      display: grid;
      grid-template-columns: 1.35fr 1fr;
      gap: 20px;
      align-items: start;
    }
    @media (max-width: 900px) { .grid-2 { grid-template-columns: 1fr; } }
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 18px;
    }
    .mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-variant-numeric: tabular-nums;
    }
    h1, h2, h3 { margin: 0 0 8px 0; line-height: 1.25; }
    h2 { font-size: 20px; }
    h3 { font-size: 16px; }
    p { margin: 0 0 10px 0; font-size: 13.5px; color: var(--muted); }
    .btn {
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
      padding: 7px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn.primary { background: var(--accent); color: #fff; border-color: var(--accent); }
    .btn-row { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
    .metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      border-top: 1px solid var(--border);
      padding-top: 12px;
      margin-top: 12px;
    }
    @media (max-width: 640px) { .metrics { grid-template-columns: repeat(2, 1fr); } }
    .metric-label { font-size: 11px; color: var(--muted); }
    .metric-val { font-size: 15px; font-weight: 700; color: var(--text); }
    label { display: flex; justify-content: space-between; font-size: 12px; font-weight: 600; margin-bottom: 4px; }
    input[type="range"] { width: 100%; margin-bottom: 14px; }
    input[type="text"], textarea {
      width: 100%;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 7px 10px;
      font-size: 12px;
      font-family: inherit;
      margin-bottom: 8px;
    }
    table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
    th, td {
      border: 1px solid var(--border);
      padding: 10px;
      text-align: left;
      vertical-align: top;
    }
    th { background: var(--surface-alt); font-size: 12px; }
    .pruned { background: #ECFDF5; }
    .strike { text-decoration: line-through; color: #94A3B8; }
    svg { width: 100%; height: auto; display: block; background: #F8FAFC; border: 1px solid #F1F5F9; border-radius: 8px; }
  </style>
</head>
<body>
  <header>
    <div class="header-inner">
      <div>
        <div class="brand">Del Cerebro al Aula · CECAR 2026-2</div>
        <div class="meta">Diplomado en Docencia Universitaria · Tutor: Mg. Amaury Chagui Hernández</div>
      </div>
      <nav role="tablist">
        <button class="tab-btn active" data-tab="cerebro">1. Cerebro SVG</button>
        <button class="tab-btn" data-tab="olvido">2. Curva Olvido</button>
        <button class="tab-btn" data-tab="lisosoma">3. Lisosoma</button>
        <button class="tab-btn" data-tab="circadiano">4. Circadiano</button>
      </nav>
    </div>
  </header>

  <main>
    <!-- 1. SIMULADOR ANATÓMICO -->
    <section id="panel-cerebro" class="panel active">
      <div class="btn-row" id="brain-mode-bar">
        <button class="btn primary" id="mode-regulado">Regulación Cortical (Nominal)</button>
        <button class="btn" id="mode-desregulado">Secuestro / Fatiga (Crítico)</button>
      </div>
      <div class="btn-row" id="brain-node-buttons"></div>
      <div class="grid-2">
        <div class="card">
          <svg id="brain-svg" viewBox="0 0 760 540" aria-label="Mapa sagital del cerebro"></svg>
        </div>
        <div class="card" id="brain-inspector"></div>
      </div>
    </section>

    <!-- 2. CURVA DEL OLVIDO -->
    <section id="panel-olvido" class="panel">
      <div class="grid-2">
        <div class="card">
          <svg id="forgetting-svg" viewBox="0 0 760 390" aria-label="Curva diferencial del olvido"></svg>
          <div class="metrics" id="forgetting-metrics"></div>
        </div>
        <div class="card">
          <h2>Modelo dR/dt = −k · R</h2>
          <p>Manipule el estrés metabólico (modula k) y la frecuencia de repasos activos (reinicia R al 100% y aplana k).</p>
          <label for="stress-range">Nivel de Estrés / Carga Metabólica <span class="mono" id="stress-val">35%</span></label>
          <input type="range" id="stress-range" min="0" max="100" step="5" value="35" />
          <label for="review-range">Frecuencia de Repaso Espaciado <span class="mono" id="review-val">3 repasos</span></label>
          <input type="range" id="review-range" min="0" max="5" step="1" value="3" />
          <p id="forgetting-diagnosis"></p>
        </div>
      </div>
    </section>

    <!-- 3. LISOSOMA PEDAGÓGICO -->
    <section id="panel-lisosoma" class="panel">
      <div class="card" style="margin-bottom: 16px;">
        <h2>El Lisosoma Pedagógico: Autofagia Neurocognitiva</h2>
        <p>Transformación de datos memorísticos aislados en competencias genéricas duraderas mediante conflicto cognitivo.</p>
        <div class="btn-row" id="discipline-tabs"></div>
        <div style="overflow-x:auto;">
          <table>
            <thead>
              <tr>
                <th>Asignatura</th>
                <th>1. Basura Reutilizable</th>
                <th>2. Procesamiento Lisosomal</th>
                <th>3. Componente Reciclado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody id="lysosome-tbody"></tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <h3>Agregar dato de su asignatura</h3>
        <input type="text" id="new-subject" placeholder="Asignatura universitaria" />
        <textarea id="new-basura" rows="2" placeholder="1. Basura Reutilizable (dato memorístico efímero)"></textarea>
        <textarea id="new-lisosoma" rows="2" placeholder="2. Procesamiento Lisosomal (reto o estudio de caso)"></textarea>
        <textarea id="new-reciclado" rows="2" placeholder="3. Componente Reciclado (competencia genérica)"></textarea>
        <button class="btn primary" id="add-lysosome-btn">Ejecutar poda e incorporar</button>
      </div>
    </section>

    <!-- 4. ALGORITMO CIRCADIANO -->
    <section id="panel-circadiano" class="panel">
      <div class="grid-2">
        <div class="card">
          <svg id="circadian-svg" viewBox="0 0 760 370" aria-label="Oscilador circadiano 24 horas"></svg>
          <div class="metrics" id="circadian-metrics"></div>
        </div>
        <div class="card">
          <h2>Protocolo Glinfático (24 h)</h2>
          <p>Evalúa la depuración de adenosina, integridad No-REM/REM y tono dopaminérgico D2.</p>
          <label for="sleep-range">Horas de sueño nocturno <span class="mono" id="sleep-val">7.5 h</span></label>
          <input type="range" id="sleep-range" min="3" max="9.5" step="0.5" value="7.5" />
          <label for="blue-range">Pantallas / luz azul nocturna <span class="mono" id="blue-val">30 min</span></label>
          <input type="range" id="blue-range" min="0" max="240" step="15" value="30" />
          <div id="circadian-alert" style="padding:12px;border-radius:8px;border:1px solid var(--border);font-size:13px;"></div>
        </div>
      </div>
    </section>
  </main>

  <script>
    const DATA = ${safeJson};
    let brainMode = 'regulado';
    let selectedNodeId = DATA.hotspots[0].id;
    let selectedDiscipline = 'Ingeniería';
    const prunedState = {};

    // Navegación
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
      });
    });

    // 1. SIMULADOR CEREBRAL
    function renderBrain() {
      const color = brainMode === 'regulado' ? '#0284C7' : '#DC2626';
      const node = DATA.hotspots.find(n => n.id === selectedNodeId) || DATA.hotspots[0];

      document.getElementById('mode-regulado').className = 'btn ' + (brainMode === 'regulado' ? 'primary' : '');
      document.getElementById('mode-desregulado').className = 'btn ' + (brainMode === 'desregulado' ? 'primary' : '');

      const btnWrap = document.getElementById('brain-node-buttons');
      btnWrap.innerHTML = '';
      DATA.hotspots.forEach(n => {
        const b = document.createElement('button');
        b.className = 'btn ' + (n.id === node.id ? 'primary' : '');
        b.textContent = n.code + ' · ' + n.shortLabel;
        b.onclick = () => { selectedNodeId = n.id; renderBrain(); };
        btnWrap.appendChild(b);
      });

      const svg = document.getElementById('brain-svg');
      const c = node.coordinates;
      let hotspotsSvg = '';
      DATA.hotspots.forEach(n => {
        const active = n.id === node.id;
        hotspotsSvg += '<g transform="translate(' + n.coordinates.x + ',' + n.coordinates.y + ')" style="cursor:pointer" data-id="' + n.id + '">' +
          '<circle r="' + (active ? 22 : 16) + '" fill="' + (active ? color : '#FFFFFF') + '" stroke="' + (active ? '#0F172A' : '#475569') + '" stroke-width="2"></circle>' +
          '<text text-anchor="middle" dy="4" font-size="10.5" font-weight="700" font-family="monospace" fill="' + (active ? '#FFFFFF' : '#0F172A') + '">' + n.code + '</text>' +
          '</g>';
      });

      svg.innerHTML =
        '<path d="M 128 290 C 118 190, 175 95, 355 82 C 515 70, 632 150, 632 258 C 632 332, 578 378, 495 384 C 455 386, 430 356, 392 346 C 345 334, 290 345, 225 344 C 168 343, 134 322, 128 290 Z" fill="#E2E8F0" stroke="#64748B" stroke-width="2.4"/>' +
        '<path d="M 488 364 C 552 355, 616 382, 608 434 C 600 475, 536 488, 488 462 C 462 446, 464 374, 488 364 Z" fill="#E2E8F0" stroke="#64748B" stroke-width="2"/>' +
        '<path d="M 392 332 C 425 330, 456 352, 468 395 L 478 500 L 424 500 L 414 415 C 402 385, 384 362, 392 332 Z" fill="#F1F5F9" stroke="#64748B" stroke-width="2"/>' +
        '<path d="M 244 238 C 266 176, 368 158, 458 192 C 492 206, 510 238, 495 256 C 482 270, 466 250, 444 232 C 378 198, 294 206, 268 250 C 254 270, 234 260, 244 238 Z" fill="#FFFFFF" stroke="#475569" stroke-width="2"/>' +
        '<ellipse cx="395" cy="264" rx="46" ry="28" fill="#F8FAFC" stroke="#64748B" stroke-width="1.8"/>' +
        '<path d="M ' + c.x + ' ' + c.y + ' Q ' + ((c.x + c.targetX) / 2) + ' ' + (Math.min(c.y, c.targetY) - 34) + ' ' + c.targetX + ' ' + c.targetY + '" fill="none" stroke="' + color + '" stroke-width="3" stroke-dasharray="6 4"/>' +
        hotspotsSvg;

      svg.querySelectorAll('g[data-id]').forEach(g => {
        g.addEventListener('click', () => { selectedNodeId = g.getAttribute('data-id'); renderBrain(); });
      });

      const mech = brainMode === 'regulado' ? node.regulatedMechanism : node.dysregulatedMechanism;
      document.getElementById('brain-inspector').innerHTML =
        '<div class="meta mono">' + node.code + ' · ' + node.neurotransmitters + '</div>' +
        '<h3>' + node.title + '</h3>' +
        '<p><strong>' + (brainMode === 'regulado' ? 'Estado Regulado:' : 'Estado Desregulado:') + '</strong> ' + mech + '</p>' +
        '<p><strong>Aplicación Universitaria:</strong> ' + node.universityApplication + '</p>' +
        '<p class="mono" style="color:#0F4C81">' + node.differentialModel + '</p>';
    }
    document.getElementById('mode-regulado').onclick = () => { brainMode = 'regulado'; renderBrain(); };
    document.getElementById('mode-desregulado').onclick = () => { brainMode = 'desregulado'; renderBrain(); };
    renderBrain();

    // 2. CURVA DEL OLVIDO
    function renderForgetting() {
      const stress = Number(document.getElementById('stress-range').value);
      const reviews = Number(document.getElementById('review-range').value);
      document.getElementById('stress-val').textContent = stress + '%';
      document.getElementById('review-val').textContent = reviews + (reviews === 1 ? ' repaso' : ' repasos');

      const k0 = 0.042 + 0.0011 * stress;
      const schedule = [2, 8, 24, 60, 108].slice(0, reviews);
      const H = 168, W = 760, HT = 390, padL = 54, padR = 24, padT = 26, padB = 42;
      const pW = W - padL - padR, pH = HT - padT - padB;
      const tx = t => padL + (t / H) * pW;
      const ty = r => padT + ((100 - r) / 100) * pH;

      const evalSpaced = t => {
        let last = 0, st = 0;
        schedule.forEach((rv, i) => { if (t >= rv) { last = rv; st = i + 1; } });
        const kEff = k0 * Math.pow(0.56, st);
        return { r: 100 * Math.exp(-kEff * Math.max(0, t - last)), kEff };
      };

      let baseD = '', spD = '';
      for (let i = 0; i <= 168; i++) {
        const rb = 100 * Math.exp(-k0 * i);
        baseD += (i === 0 ? 'M ' : ' L ') + tx(i).toFixed(1) + ' ' + ty(rb).toFixed(1);
        if (i > 0 && schedule.includes(i)) {
          const prev = evalSpaced(i - 0.001);
          spD += ' L ' + tx(i).toFixed(1) + ' ' + ty(prev.r).toFixed(1);
        }
        const sp = evalSpaced(i);
        spD += (i === 0 ? 'M ' : ' L ') + tx(i).toFixed(1) + ' ' + ty(sp.r).toFixed(1);
      }

      let grid = '';
      [0, 25, 50, 75, 100].forEach(v => {
        grid += '<line x1="' + padL + '" y1="' + ty(v) + '" x2="' + (W - padR) + '" y2="' + ty(v) + '" stroke="#E2E8F0"/>' +
          '<text x="' + (padL - 8) + '" y="' + (ty(v) + 4) + '" text-anchor="end" font-size="11" fill="#64748B">' + v + '%</text>';
      });
      [0, 24, 48, 72, 96, 120, 144, 168].forEach(h => {
        grid += '<line x1="' + tx(h) + '" y1="' + padT + '" x2="' + tx(h) + '" y2="' + (HT - padB) + '" stroke="#E2E8F0"/>' +
          '<text x="' + tx(h) + '" y="' + (HT - padB + 16) + '" text-anchor="middle" font-size="11" fill="#64748B">' + h + 'h</text>';
      });

      document.getElementById('forgetting-svg').innerHTML = grid +
        '<path d="' + baseD + '" fill="none" stroke="#DC2626" stroke-width="2" stroke-dasharray="6 4"/>' +
        '<path d="' + spD + '" fill="none" stroke="#0F4C81" stroke-width="3"/>';

      const r24 = evalSpaced(24).r;
      const r168 = evalSpaced(168).r;
      const kEff = k0 * Math.pow(0.56, reviews);
      document.getElementById('forgetting-metrics').innerHTML =
        '<div><div class="metric-label">Retención 24 h</div><div class="metric-val mono">' + r24.toFixed(1) + '%</div></div>' +
        '<div><div class="metric-label">Retención 7 días</div><div class="metric-val mono">' + r168.toFixed(1) + '%</div></div>' +
        '<div><div class="metric-label">Constante k efectiva</div><div class="metric-val mono">' + kEff.toFixed(4) + ' h⁻¹</div></div>' +
        '<div><div class="metric-label">Vida media t₁/₂</div><div class="metric-val mono">' + (Math.LN2 / kEff).toFixed(1) + ' h</div></div>';
      document.getElementById('forgetting-diagnosis').textContent =
        'Sin repaso activo a las 24 h solo persiste ' + (100 * Math.exp(-k0 * 24)).toFixed(1) + '% de la información.';
    }
    document.getElementById('stress-range').oninput = renderForgetting;
    document.getElementById('review-range').oninput = renderForgetting;
    renderForgetting();

    // 3. LISOSOMA PEDAGÓGICO
    const allCustom = [...(DATA.customEntries || [])];
    function renderLysosome() {
      const tabs = document.getElementById('discipline-tabs');
      tabs.innerHTML = '';
      Object.keys(DATA.presets).forEach(d => {
        const b = document.createElement('button');
        b.className = 'btn ' + (d === selectedDiscipline ? 'primary' : '');
        b.textContent = d;
        b.onclick = () => { selectedDiscipline = d; renderLysosome(); };
        tabs.appendChild(b);
      });

      const rows = [...allCustom.filter(x => x.discipline === selectedDiscipline), ...DATA.presets[selectedDiscipline]];
      const tbody = document.getElementById('lysosome-tbody');
      tbody.innerHTML = '';
      rows.forEach(item => {
        const tr = document.createElement('tr');
        const isPruned = !!prunedState[item.id];
        if (isPruned) tr.className = 'pruned';
        tr.innerHTML = '<td><strong>' + item.subject + '</strong></td>' +
          '<td class="' + (isPruned ? 'strike' : '') + '">' + item.basuraReutilizable + '</td>' +
          '<td>' + item.procesamientoLisosomal + '</td>' +
          '<td><strong>' + item.componenteReciclado + '</strong></td>' +
          '<td><button class="btn ' + (isPruned ? '' : 'primary') + '">' + (isPruned ? 'Reciclado' : 'Podar') + '</button></td>';
        tr.querySelector('button').onclick = () => { prunedState[item.id] = !prunedState[item.id]; renderLysosome(); };
        tbody.appendChild(tr);
      });
    }
    document.getElementById('add-lysosome-btn').onclick = () => {
      const subject = document.getElementById('new-subject').value.trim();
      const basura = document.getElementById('new-basura').value.trim();
      const lisosoma = document.getElementById('new-lisosoma').value.trim();
      const reciclado = document.getElementById('new-reciclado').value.trim();
      if (!subject || !basura || !lisosoma || !reciclado) return;
      const id = 'c-' + Date.now();
      allCustom.unshift({ id, discipline: selectedDiscipline, subject, basuraReutilizable: basura, procesamientoLisosomal: lisosoma, componenteReciclado: reciclado });
      prunedState[id] = true;
      document.getElementById('new-subject').value = '';
      document.getElementById('new-basura').value = '';
      document.getElementById('new-lisosoma').value = '';
      document.getElementById('new-reciclado').value = '';
      renderLysosome();
    };
    renderLysosome();

    // 4. ALGORITMO CIRCADIANO
    function renderCircadian() {
      const sleepH = Number(document.getElementById('sleep-range').value);
      const blueM = Number(document.getElementById('blue-range').value);
      document.getElementById('sleep-val').textContent = sleepH.toFixed(1) + ' h';
      document.getElementById('blue-val').textContent = blueM + ' min';

      const adClear = Math.min(99, Math.max(18, Math.round((Math.min(sleepH, 8.5) / 8) * 92 * (1 - (blueM / 240) * 0.28))));
      const rem = Math.min(100, Math.max(10, Math.round((Math.max(0, sleepH - 3.2) / 4.3) * 96 - blueM * 0.1)));
      const wm = Math.min(98, Math.max(22, Math.round(0.45 * adClear + 0.35 * rem + 19)));
      const d2 = Math.min(98, Math.max(20, Math.round(92 * Math.min(1, (sleepH / 8) * (1 - (blueM / 240) * 0.34)) - (blueM / 240) * 18)));

      const sleepStart = 24 - sleepH;
      const W = 760, HT = 370, padL = 54, padR = 24, padT = 26, padB = 42;
      const pW = W - padL - padR, pH = HT - padT - padB;
      const tx = t => padL + (t / 24) * pW;
      const ty = v => padT + ((100 - v) / 100) * pH;

      let adD = '', daD = '';
      for (let i = 0; i <= 48; i++) {
        const t = i * 0.5;
        let ad = t <= sleepStart
          ? Math.min(96, 15 + (100 - adClear) * 0.45 + (t / Math.max(12, sleepStart)) * 68)
          : (100 - adClear) + (83 - (100 - adClear)) * Math.exp(-2.8 * ((t - sleepStart) / sleepH));
        let da = 58 + 24 * Math.sin(((t - 1.5 - (blueM / 60) * 0.65) / 24) * 2 * Math.PI);
        if (t > sleepStart) da = Math.max(14, da - ((t - sleepStart) / sleepH) * 28);
        adD += (i === 0 ? 'M ' : ' L ') + tx(t).toFixed(1) + ' ' + ty(ad).toFixed(1);
        daD += (i === 0 ? 'M ' : ' L ') + tx(t).toFixed(1) + ' ' + ty(da).toFixed(1);
      }

      document.getElementById('circadian-svg').innerHTML =
        '<rect x="' + tx(sleepStart) + '" y="' + padT + '" width="' + (tx(24) - tx(sleepStart)) + '" height="' + pH + '" fill="#0284C7" fill-opacity="0.10"/>' +
        '<path d="' + adD + '" fill="none" stroke="#D97706" stroke-width="2.5"/>' +
        '<path d="' + daD + '" fill="none" stroke="#0F4C81" stroke-width="2.8"/>';

      document.getElementById('circadian-metrics').innerHTML =
        '<div><div class="metric-label">Depuración Adenosina</div><div class="metric-val mono">' + adClear + '%</div></div>' +
        '<div><div class="metric-label">Integridad REM</div><div class="metric-val mono">' + rem + '%</div></div>' +
        '<div><div class="metric-label">Memoria Trabajo dlPFC</div><div class="metric-val mono">' + wm + '/100</div></div>' +
        '<div><div class="metric-label">Estabilidad D2</div><div class="metric-val mono">' + d2 + '/100</div></div>';

      const status = wm < 55 ? 'DÉFICIT CRÍTICO: Acumulación de adenosina y supresión REM.' : wm < 78 ? 'ALERTA METABÓLICA: Reducción moderada de estabilidad D2.' : 'NOMINAL: Limpieza glinfática y consolidación preservadas.';
      document.getElementById('circadian-alert').textContent = status;
    }
    document.getElementById('sleep-range').oninput = renderCircadian;
    document.getElementById('blue-range').oninput = renderCircadian;
    renderCircadian();
  </script>
</body>
</html>`;
}
