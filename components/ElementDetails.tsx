import React, { useEffect, useState } from 'react';
import { ElementData, AIInsight, ElementCategory } from '../types';
import { getElementInsight } from '../services/geminiService';
import { CATEGORY_BG_COLORS } from '../constants';
import { Atom, Scale, Info, Layers, Zap, Beaker } from 'lucide-react';

interface ElementDetailsProps {
  element: ElementData;
}

const ElementDetails: React.FC<ElementDetailsProps> = ({ element }) => {
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchInsight = async () => {
      setLoading(true);
      setInsight(null);
      const data = await getElementInsight(element);
      if (isMounted) {
        setInsight(data);
        setLoading(false);
      }
    };
    fetchInsight();
    return () => { isMounted = false; };
  }, [element]);

  const themeColor = CATEGORY_BG_COLORS[element.category] || "bg-slate-700 text-white";

  return (
    <div className="h-full flex flex-col gap-6 animate-fadeIn">
      {/* Header Card */}
      <div className={`p-6 rounded-2xl border border-white/10 ${themeColor} shadow-lg backdrop-blur-sm relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-9xl select-none pointer-events-none transform translate-x-10 -translate-y-4">
          {element.symbol}
        </div>
        
        <div className="relative z-10">
          <div className="flex items-baseline gap-4 mb-2">
            <h1 className="text-4xl font-bold">{element.name}</h1>
            <span className="text-xl opacity-75 font-mono">{element.atomicNumber}</span>
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-black/20 text-sm font-medium mb-4 backdrop-blur-md">
            {element.category}
          </div>
          <p className="max-w-md opacity-90 leading-relaxed">
            {element.summary}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={<Scale size={18} />} label="Atomic Mass" value={`${element.atomicMass} u`} />
        <StatCard icon={<Layers size={18} />} label="Configuration" value={element.electronConfiguration} monospace />
        <StatCard icon={<Zap size={18} />} label="Block" value={`${element.block}-block`} />
        <StatCard icon={<Atom size={18} />} label="Group / Period" value={`${element.group} / ${element.period}`} />
      </div>

      {/* AI Insights Section */}
      <div className="flex-1 bg-slate-800/50 rounded-2xl border border-slate-700 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-indigo-400 mb-2">
          <Beaker size={20} />
          <h3 className="font-semibold uppercase tracking-wider text-sm">Chemist's Insight (AI)</h3>
        </div>

        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-500 min-h-[150px]">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Analyzing elemental properties...</span>
          </div>
        ) : insight ? (
          <div className="space-y-4 text-sm text-slate-300">
             <div className="bg-slate-800 p-4 rounded-xl border border-slate-700/50">
               <span className="text-indigo-400 font-semibold block mb-1">Did you know?</span>
               {insight.funFact}
             </div>
             <div>
               <span className="text-slate-400 font-medium block mb-1">Real World Application:</span>
               {insight.realWorldUse}
             </div>
             <div>
               <span className="text-slate-400 font-medium block mb-1">Bonding Behavior:</span>
               {insight.bondingBehavior}
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <Info size={24} className="mb-2 opacity-50"/>
            <p>Select an API Key to view insights</p>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string | number, monospace?: boolean }> = ({ icon, label, value, monospace }) => (
  <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
    <div className="flex items-center gap-2 text-slate-400 mb-1 text-xs uppercase tracking-wide">
      {icon}
      <span>{label}</span>
    </div>
    <div className={`text-slate-100 font-medium ${monospace ? 'font-mono' : ''}`}>
      {value}
    </div>
  </div>
);

export default ElementDetails;