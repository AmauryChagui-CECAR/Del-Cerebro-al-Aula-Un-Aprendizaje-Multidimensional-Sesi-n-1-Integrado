import React from 'react';
import { SectionId } from '../data/neuroData';

interface TopBarProps {
  activeSection: SectionId;
  onSelectSection: (section: SectionId) => void;
  onOpenExport: () => void;
}

const NAV_ITEMS: { id: SectionId; label: string }[] = [
  { id: 'inicio', label: 'Encuadre' },
  { id: 'cerebro', label: 'Cerebro SVG' },
  { id: 'olvido', label: 'Curva Olvido' },
  { id: 'lisosoma', label: 'Lisosoma' },
  { id: 'circadiano', label: 'Circadiano' },
  { id: 'bibliografia', label: 'Referencias' }
];

export const TopBar: React.FC<TopBarProps> = ({
  activeSection,
  onSelectSection,
  onOpenExport
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:gap-8">
        {/* Zona 1: Marca tipográfica en una sola línea */}
        <button
          type="button"
          onClick={() => onSelectSection('inicio')}
          className="shrink-0 whitespace-nowrap text-left text-base font-bold tracking-tight text-slate-900 hover:text-sky-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700 sm:text-lg"
        >
          Del Cerebro al Aula
        </button>

        {/* Zona 2: Enlaces de navegación en una sola línea */}
        <nav
          aria-label="Navegación de simuladores neurodidácticos"
          className="hidden items-center gap-5 md:flex lg:gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSection(item.id)}
                className={`relative shrink-0 whitespace-nowrap py-1 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-700 ${
                  isActive
                    ? 'text-sky-900'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[13px] h-0.5 bg-sky-800"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zona 3: Acción primaria única */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onOpenExport}
            className="whitespace-nowrap shrink-0 rounded-lg bg-[#0F4C81] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 sm:text-sm"
          >
            Exportar HTML / JSON
          </button>
        </div>
      </div>

      {/* Navegación compacta móvil (una sola fila con desplazamiento horizontal suave) */}
      <nav
        aria-label="Navegación móvil"
        className="flex items-center gap-4 overflow-x-auto border-t border-slate-100 px-4 py-2 md:hidden"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              className={`shrink-0 whitespace-nowrap pb-0.5 text-xs font-medium transition-colors ${
                isActive
                  ? 'border-b-2 border-sky-800 text-sky-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
