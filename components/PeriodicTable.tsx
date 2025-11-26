import React from 'react';
import { ELEMENTS, CATEGORY_COLORS } from '../constants';
import { ElementData, ElementCategory } from '../types';

interface PeriodicTableProps {
  onSelect: (element: ElementData) => void;
  selectedElement: ElementData | null;
}

const PeriodicTable: React.FC<PeriodicTableProps> = ({ onSelect, selectedElement }) => {
  // Elements 57-71 are Lanthanides, usually placed below
  const lanthanides = ELEMENTS.filter(e => e.atomicNumber >= 57 && e.atomicNumber <= 71);
  // Elements 89-103 are Actinides, usually placed below
  const actinides = ELEMENTS.filter(e => e.atomicNumber >= 89 && e.atomicNumber <= 103);

  const renderCell = (element: ElementData | undefined, isPlaceholder: boolean = false, label: string = "") => {
    if (isPlaceholder) {
       return (
        <div key={`placeholder-${label}`} className="col-span-1 flex flex-col items-center justify-center text-[8px] sm:text-[10px] text-slate-600 border border-slate-800/50 rounded bg-slate-800/20">
            {label}
        </div>
       )
    }

    if (!element) return <div className="col-span-1 aspect-square"></div>;

    const isSelected = selectedElement?.atomicNumber === element.atomicNumber;
    const colorClass = CATEGORY_COLORS[element.category] || "bg-gray-500";

    return (
      <button
        key={element.symbol}
        onClick={() => onSelect(element)}
        className={`
          relative w-full aspect-[4/5] sm:aspect-square flex flex-col items-center justify-center 
          border rounded transition-all duration-200 ease-out
          ${colorClass}
          ${isSelected ? 'ring-2 ring-white scale-110 z-10 shadow-lg brightness-110' : 'opacity-80 hover:opacity-100 hover:scale-110 hover:z-20'}
        `}
      >
        <span className="absolute top-0.5 left-1 text-[6px] sm:text-[9px] opacity-80 font-mono">{element.atomicNumber}</span>
        <span className="text-xs sm:text-sm md:text-base font-bold">{element.symbol}</span>
      </button>
    );
  };

  const renderMainGrid = () => {
    const grid = [];
    // 7 Periods, 18 Groups
    for (let period = 1; period <= 7; period++) {
        for (let group = 1; group <= 18; group++) {
            const key = `p${period}-g${group}`;
            
            // Handle Lanthanide/Actinide placeholders in Group 3
            if (period === 6 && group === 3) {
                grid.push(renderCell(undefined, true, "57-71"));
                continue;
            }
            if (period === 7 && group === 3) {
                grid.push(renderCell(undefined, true, "89-103"));
                continue;
            }

            const element = ELEMENTS.find(e => e.period === period && e.group === group);
            
            // Skip actual Lanthanides/Actinides in the main grid loop as they are rendered below
            // (Note: La and Ac are sometimes in main grid, but we put whole block below for consistency with this data set logic)
            if (element && (element.atomicNumber >= 57 && element.atomicNumber <= 71)) {
                 continue; // Should have been handled by placeholder logic, but just in case
            }
            if (element && (element.atomicNumber >= 89 && element.atomicNumber <= 103)) {
                 continue;
            }

            if (element) {
                grid.push(renderCell(element));
            } else {
                grid.push(<div key={key} className="col-span-1"></div>);
            }
        }
    }
    return grid;
  };

  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <div className="min-w-[700px] p-1">
        {/* Main Grid */}
        <div className="grid grid-cols-18 gap-0.5 sm:gap-1 mb-4">
            {renderMainGrid()}
        </div>

        {/* F-Block Separator */}
        <div className="h-4"></div>

        {/* F-Block (Lanthanides & Actinides) */}
        <div className="pl-[11.11%]"> {/* Indent to align roughly with group 3 (2/18 = 11.11%) */}
            <div className="grid grid-cols-15 gap-0.5 sm:gap-1 w-[83.33%]"> {/* Width for 15 columns (15/18 = 83.33%) */}
                {lanthanides.map(e => renderCell(e))}
                {actinides.map(e => renderCell(e))}
            </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-wrap gap-2 justify-center px-4">
        {Object.entries(CATEGORY_COLORS).map(([cat, colorClass]) => (
          <div key={cat} className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${colorClass.split(' ')[0]}`}></div>
            <span className="text-[10px] sm:text-xs text-slate-400 capitalize">{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeriodicTable;