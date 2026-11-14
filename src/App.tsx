import { useEffect, useState } from 'react';
import { TopBar } from './components/TopBar';
import { OverviewSection } from './components/OverviewSection';
import { BrainSimulator } from './components/BrainSimulator';
import { ForgettingCurveSimulator } from './components/ForgettingCurveSimulator';
import { LysosomeMatrix } from './components/LysosomeMatrix';
import { CircadianSimulator } from './components/CircadianSimulator';
import { ClosingAndBibliography } from './components/ClosingAndBibliography';
import { ExportModal } from './components/ExportModal';
import { BRAIN_HOTSPOTS, LysosomeEntry, SectionId } from './data/neuroData';

const STORAGE_KEY = 'cecar_neurodidactica_2026_2_state';

interface PersistedState {
  verifiedNodes: Record<string, boolean>;
  olvidoCompleted: boolean;
  circadianoCompleted: boolean;
  customEntries: LysosomeEntry[];
  prunedMap: Record<string, boolean>;
  synthesisNote: string;
}

const DEFAULT_STATE: PersistedState = {
  verifiedNodes: {},
  olvidoCompleted: false,
  circadianoCompleted: false,
  customEntries: [],
  prunedMap: {},
  synthesisNote: ''
};

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('inicio');
  const [exportOpen, setExportOpen] = useState(false);

  const [state, setState] = useState<PersistedState>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return { ...DEFAULT_STATE, ...JSON.parse(raw) };
      }
    } catch {
      // Silencio seguro si el almacenamiento local está restringido
    }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignorar errores de cuota de almacenamiento
    }
  }, [state]);

  const handleSelectSection = (section: SectionId) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVerifyNode = (nodeId: string) => {
    setState((prev) => ({
      ...prev,
      verifiedNodes: { ...prev.verifiedNodes, [nodeId]: true }
    }));
  };

  const handleAddCustomEntry = (entry: LysosomeEntry) => {
    setState((prev) => ({
      ...prev,
      customEntries: [entry, ...prev.customEntries]
    }));
  };

  const handleDeleteCustomEntry = (id: string) => {
    setState((prev) => ({
      ...prev,
      customEntries: prev.customEntries.filter((e) => e.id !== id)
    }));
  };

  const handleTogglePrune = (id: string) => {
    setState((prev) => ({
      ...prev,
      prunedMap: { ...prev.prunedMap, [id]: !prev.prunedMap[id] }
    }));
  };

  const verifiedNodesCount = BRAIN_HOTSPOTS.filter(
    (n) => state.verifiedNodes[n.id]
  ).length;
  const prunedCount = Object.values(state.prunedMap).filter(Boolean).length;

  const completedModules: Record<string, boolean> = {
    cerebro: verifiedNodesCount >= 3,
    olvido: state.olvidoCompleted,
    lisosoma: state.customEntries.length > 0 || prunedCount >= 2,
    circadiano: state.circadianoCompleted
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <TopBar
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
        onOpenExport={() => setExportOpen(true)}
      />

      <main className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 sm:py-10">
        {activeSection === 'inicio' && (
          <OverviewSection
            completedModules={completedModules}
            verifiedNodesCount={verifiedNodesCount}
            customLysosomeCount={state.customEntries.length}
            onNavigate={handleSelectSection}
          />
        )}

        {activeSection === 'cerebro' && (
          <BrainSimulator
            verifiedNodes={state.verifiedNodes}
            onVerifyNode={handleVerifyNode}
          />
        )}

        {activeSection === 'olvido' && (
          <ForgettingCurveSimulator
            isCompleted={state.olvidoCompleted}
            onComplete={() =>
              setState((prev) => ({ ...prev, olvidoCompleted: true }))
            }
          />
        )}

        {activeSection === 'lisosoma' && (
          <LysosomeMatrix
            customEntries={state.customEntries}
            onAddCustomEntry={handleAddCustomEntry}
            onDeleteCustomEntry={handleDeleteCustomEntry}
            prunedMap={state.prunedMap}
            onTogglePrune={handleTogglePrune}
          />
        )}

        {activeSection === 'circadiano' && (
          <CircadianSimulator
            isCompleted={state.circadianoCompleted}
            onComplete={() =>
              setState((prev) => ({ ...prev, circadianoCompleted: true }))
            }
          />
        )}

        {activeSection === 'bibliografia' && (
          <ClosingAndBibliography
            completedModules={completedModules}
            verifiedNodesCount={verifiedNodesCount}
            customLysosomeCount={state.customEntries.length}
            synthesisNote={state.synthesisNote}
            onSaveSynthesis={(text) =>
              setState((prev) => ({ ...prev, synthesisNote: text }))
            }
            onOpenExport={() => setExportOpen(true)}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1320px] flex-col justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6">
          <span>
            Diplomado de Formación en Docencia Universitaria · CECAR 2026-2 (Sincelejo) · Mg. Amaury Chagui Hernández
          </span>
          <button
            type="button"
            onClick={() => handleSelectSection('bibliografia')}
            className="self-start font-medium text-sky-900 hover:underline sm:self-auto"
          >
            Ver referentes APA y cierre metacognitivo
          </button>
        </div>
      </footer>

      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        customEntries={state.customEntries}
      />
    </div>
  );
}
