import React, { useState } from 'react';
import AtomVisualizer from './components/AtomVisualizer';
import ElementDetails from './components/ElementDetails';
import { ELEMENTS } from './constants';
import { ElementData } from './types';
import { Atom as AtomIcon, ChevronDown, Search } from 'lucide-react';

const App: React.FC = () => {
  // Default to Carbon (Atomic #6)
  const [selectedElement, setSelectedElement] = useState<ElementData>(ELEMENTS[5]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col">
      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.5)]">
              <AtomIcon className="text-white w-6 h-6 animate-pulse-glow" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Atomik
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">Grade 11 Chemistry Simulator</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative group w-full max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-500" />
                </div>
                <select
                  className="appearance-none bg-slate-900 border border-slate-700 hover:border-indigo-500 text-indigo-100 py-2.5 pl-10 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer text-sm w-64 shadow-lg font-medium"
                  value={selectedElement.atomicNumber}
                  onChange={(e) => {
                    const el = ELEMENTS.find(el => el.atomicNumber === parseInt(e.target.value));
                    if(el) setSelectedElement(el);
                  }}
                >
                  {ELEMENTS.map(e => (
                    <option key={e.atomicNumber} value={e.atomicNumber}>
                      {e.atomicNumber}. {e.name} ({e.symbol})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 group-hover:text-indigo-400 transition-colors">
                  <ChevronDown size={16} />
                </div>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full min-h-[calc(100vh-8rem)]">
          
          {/* Left Column: Interactive Visualizer */}
          <div className="flex flex-col bg-slate-900/50 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden relative order-1">
             <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-slate-900 to-transparent z-10 pointer-events-none">
               <h2 className="text-slate-400 font-mono text-sm uppercase tracking-widest">Atomic Structure</h2>
             </div>
             <div className="flex-1 w-full h-full min-h-[400px]">
               <AtomVisualizer element={selectedElement} />
             </div>
          </div>

          {/* Right Column: Element Details */}
          <div className="flex flex-col order-2 h-full overflow-y-auto custom-scrollbar rounded-3xl">
              <ElementDetails element={selectedElement} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;