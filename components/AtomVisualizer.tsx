import React, { useMemo } from 'react';
import { ElementData } from '../types';

interface AtomVisualizerProps {
  element: ElementData;
}

const AtomVisualizer: React.FC<AtomVisualizerProps> = ({ element }) => {
  const { shells, atomicNumber, atomicMass } = element;
  const neutronCount = Math.round(atomicMass - atomicNumber);

  const maxShellRadius = 180; 
  const nucleusRegionRadius = 40; 
  
  // 1. Generate Shells & Electrons
  const shellVisuals = useMemo(() => {
    const count = shells.length;
    return shells.map((electronCount, index) => {
      // Calculate radius
      // Distribute shells between nucleus and max radius
      const radius = nucleusRegionRadius + 30 + ((index) / (count > 0 ? count : 1)) * (maxShellRadius - nucleusRegionRadius - 30);
      
      // Speed varies by shell distance (inner faster)
      const duration = 5 + index * 4; 
      
      const electrons = [];
      for (let i = 0; i < electronCount; i++) {
        // Distribute electrons evenly around the circle
        const angle = (i / electronCount) * 360; 
        electrons.push({ angle, id: `e-${index}-${i}` });
      }

      return {
        id: `shell-${index}`,
        radius,
        duration,
        electrons
      };
    });
  }, [shells]);

  // 2. Generate Nucleus Particles (Protons + Neutrons)
  const nucleusParticles = useMemo(() => {
    const totalParticles = atomicNumber + neutronCount;
    
    // Create array of 'p' (proton) and 'n' (neutron)
    const particles = [
        ...Array(atomicNumber).fill('p'),
        ...Array(neutronCount).fill('n')
    ];

    // Shuffle them for a realistic mix
    for (let i = particles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [particles[i], particles[j]] = [particles[j], particles[i]];
    }

    // Dynamic sizing based on particle count to fit in nucleusRegionRadius
    // Area of nucleus ~ pi * R^2
    // Area of all particles ~ N * pi * r^2
    // r ~ R / sqrt(N) * packing_factor
    let particleRadius = 28 / Math.sqrt(totalParticles || 1);
    particleRadius = Math.max(2, Math.min(12, particleRadius)); // Clamp size

    // Use Phyllotaxis (Sunflower spiral) for dense packing
    return particles.map((type, i) => {
        const angle = i * 2.39996; // Golden angle in radians (~137.5 deg)
        // radius grows with sqrt(i) to maintain constant density
        const r = (particleRadius * 1.2) * Math.sqrt(i); 
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        
        return {
            id: `nuc-${i}`,
            type,
            x,
            y,
            r: particleRadius
        };
    });
  }, [atomicNumber, neutronCount]);


  return (
    <div className="relative w-full h-full flex items-center justify-center bg-radial-gradient from-slate-800 to-slate-950 overflow-hidden">
      
      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      <svg viewBox="0 0 500 500" className="w-full h-full max-w-[600px] max-h-[600px] z-10">
        <defs>
          <filter id="glow-particles" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="protonGrad">
             <stop offset="0%" stopColor="#ef4444" />
             <stop offset="100%" stopColor="#991b1b" />
          </radialGradient>
          <radialGradient id="neutronGrad">
             <stop offset="0%" stopColor="#94a3b8" />
             <stop offset="100%" stopColor="#475569" />
          </radialGradient>
          <radialGradient id="electronGrad">
             <stop offset="0%" stopColor="#60A5FA" />
             <stop offset="100%" stopColor="#2563EB" />
          </radialGradient>
        </defs>

        <g transform="translate(250, 250)">
          {/* Shell Orbits (Static Lines) */}
          {shellVisuals.map((shell) => (
             <circle 
                key={`orbit-${shell.id}`}
                r={shell.radius} 
                fill="none" 
                stroke="#475569" 
                strokeWidth="1" 
                strokeOpacity="0.3"
                strokeDasharray="4 4"
              />
          ))}

          {/* Rotating Electron Groups */}
          {shellVisuals.map((shell) => (
             <g key={`group-${shell.id}`} style={{ animation: `spin ${shell.duration}s linear infinite` }}>
                {shell.electrons.map((electron) => (
                  <g key={electron.id} transform={`rotate(${electron.angle})`}>
                    <g transform={`translate(${shell.radius}, 0)`}>
                        {/* Electron Glow */}
                        <circle r={8} fill="#3B82F6" opacity="0.4" filter="url(#glow-particles)" />
                        {/* Electron Body */}
                        <circle r={4} fill="url(#electronGrad)" />
                        {/* Negative Sign (only if size permits) */}
                        <text x="0" y="2.5" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">-</text>
                    </g>
                  </g>
                ))}
              </g>
          ))}

          {/* Nucleus Cluster (Protons & Neutrons) */}
          <g filter="url(#glow-particles)">
             {nucleusParticles.map((p) => (
                <g key={p.id} transform={`translate(${p.x}, ${p.y})`}>
                    <circle 
                        r={p.r} 
                        fill={p.type === 'p' ? 'url(#protonGrad)' : 'url(#neutronGrad)'} 
                        stroke={p.type === 'p' ? '#7f1d1d' : '#1e293b'}
                        strokeWidth={0.5}
                    />
                    {/* Add + sign for protons if they are large enough */}
                    {p.type === 'p' && p.r > 5 && (
                        <text x="0" y={p.r * 0.4} textAnchor="middle" fill="white" fontSize={p.r} fontWeight="bold">+</text>
                    )}
                </g>
             ))}
          </g>
          
        </g>
      </svg>
      
      {/* Particle Chart Overlay */}
      <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-2xl pointer-events-auto">
           <div className="flex justify-between items-center px-2 mb-2">
              <h3 className="text-slate-400 text-[10px] font-mono uppercase tracking-widest">Subatomic Composition</h3>
              <span className="text-indigo-400 font-bold text-xs">{element.name} ({element.symbol})</span>
           </div>
           
           <div className="grid grid-cols-3 gap-2">
              {/* Protons */}
              <div className="bg-slate-800/50 rounded-xl p-2 flex flex-col items-center border border-red-500/20">
                 <span className="text-red-400 font-bold text-2xl leading-none">{atomicNumber}</span>
                 <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-slate-300 text-[10px] uppercase">Protons</span>
                 </div>
                 <span className="text-red-500/60 text-[9px] font-mono">(+) Charge</span>
              </div>

              {/* Neutrons */}
              <div className="bg-slate-800/50 rounded-xl p-2 flex flex-col items-center border border-slate-500/20">
                 <span className="text-slate-300 font-bold text-2xl leading-none">{neutronCount}</span>
                 <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                    <span className="text-slate-300 text-[10px] uppercase">Neutrons</span>
                 </div>
                 <span className="text-slate-500/60 text-[9px] font-mono">(0) Charge</span>
              </div>

              {/* Electrons */}
              <div className="bg-slate-800/50 rounded-xl p-2 flex flex-col items-center border border-blue-500/20">
                 <span className="text-blue-400 font-bold text-2xl leading-none">{atomicNumber}</span>
                 <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-slate-300 text-[10px] uppercase">Electrons</span>
                 </div>
                 <span className="text-blue-500/60 text-[9px] font-mono">(-) Charge</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AtomVisualizer;