import React from 'react';
import { Zone, Gate } from '../types';
import { ShieldCheck, Info, Ticket, AlertTriangle, HelpCircle } from 'lucide-react';

interface GateFinderProps {
  selectedZone: Zone | null;
  setSelectedZone: (zone: Zone | null) => void;
  selectedGate: Gate | null;
  setSelectedGate: (gate: Gate | null) => void;
  setActiveTab: (tab: 'map' | 'chat' | 'gate' | 'transit') => void;
}

export default function GateFinder({
  selectedZone,
  setSelectedZone,
  selectedGate,
  setSelectedGate,
  setActiveTab,
}: GateFinderProps) {

  const handleSelectZone = (zone: Zone) => {
    setSelectedZone(zone);
    // Auto-map to first gate of that zone as default
    if (zone === 'North') setSelectedGate('Gate A');
    else if (zone === 'East') setSelectedGate('Gate C');
    else if (zone === 'South') setSelectedGate('Gate E');
    else if (zone === 'West') setSelectedGate('Gate G');
  };

  const zones: { name: Zone; gates: Gate[]; sections: string; category: string; colorClass: string; bgClass: string }[] = [
    { name: 'North', gates: ['Gate A', 'Gate B'], sections: 'Sections N100 - N250', category: 'Category 1 & 3', colorClass: 'text-sky-600 border-sky-200 bg-sky-50', bgClass: 'bg-sky-500' },
    { name: 'East', gates: ['Gate C', 'Gate D'], sections: 'Sections E100 - E250', category: 'Category 2 & 3', colorClass: 'text-amber-600 border-amber-200 bg-amber-50', bgClass: 'bg-amber-500' },
    { name: 'South', gates: ['Gate E', 'Gate F'], sections: 'Sections S100 - S250', category: 'Category 2 & Supporter', colorClass: 'text-emerald-600 border-emerald-200 bg-emerald-50', bgClass: 'bg-emerald-500' },
    { name: 'West', gates: ['Gate G', 'Gate H'], sections: 'Sections W100 - W250', category: 'Category 1 & VIP', colorClass: 'text-indigo-600 border-indigo-200 bg-indigo-50', bgClass: 'bg-indigo-500' },
  ];

  return (
    <div className="flex flex-col h-full shadow-md rounded-xl overflow-hidden" id="gate-finder-panel">
      {/* Header element from High Density theme */}
      <div className="p-3.5 bg-fifa-blue text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-between border-b border-fifa-blue-dark">
        <div className="flex items-center gap-2">
          <Ticket size={14} className="text-fifa-green" />
          <span>Gate Finder</span>
        </div>
        <span className="text-fifa-green font-black animate-pulse flex items-center gap-1 bg-fifa-green/15 px-2 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-fifa-green" /> LIVE MONITOR
        </span>
      </div>

      <div className="p-4 bg-white border border-slate-200 border-t-0 flex-1 flex flex-col gap-4 rounded-b-xl">
        <div>
          <h2 className="font-extrabold text-slate-900 text-sm">Ticket Zone & Safe Entrance</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Locate security check volumes and paths assigned to your seat stand.</p>
        </div>

        {/* Selector Section */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-slate-500 tracking-wider uppercase">Select Your Match Ticket Stand</label>
          <div className="grid grid-cols-2 gap-2">
            {zones.map((z) => (
              <button
                key={z.name}
                onClick={() => handleSelectZone(z.name)}
                className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between gap-1.5 cursor-pointer h-20 hover:border-fifa-green/45 ${selectedZone === z.name ? 'border-fifa-blue bg-slate-900 text-white shadow-sm ring-1 ring-fifa-green/35' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-extrabold text-xs uppercase tracking-wider">{z.name} Stand</span>
                  <span className={`w-2 h-2 rounded-full ${z.bgClass}`} />
                </div>
                <div className="flex flex-col">
                  <span className={`text-[9px] font-bold leading-none ${selectedZone === z.name ? 'text-slate-300' : 'text-slate-500'}`}>
                    {z.sections}
                  </span>
                  <span className={`text-[8px] font-extrabold tracking-wider uppercase mt-1 ${selectedZone === z.name ? 'text-fifa-green' : 'text-slate-400'}`}>
                    {z.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedZone ? (
          <div className="animate-fade-in flex flex-col gap-3">
            {/* Gate Subselector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black text-slate-500 tracking-wider uppercase">Assigned Access Gate</label>
              <div className="flex gap-2">
                {zones.find(z => z.name === selectedZone)?.gates.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGate(g)}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-extrabold transition-all cursor-pointer ${selectedGate === g ? 'bg-fifa-green text-slate-950 border-fifa-green shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket Zone High Contrast Card */}
            <div className="p-2.5 bg-blue-50/75 border-l-4 border-blue-600 rounded flex flex-col gap-0.5">
              <p className="text-[9px] uppercase font-bold text-blue-800 tracking-wider">Ticket Stand Location</p>
              <p className="text-sm font-black text-slate-900">
                ZONE {selectedZone.toUpperCase()} - {zones.find(z => z.name === selectedZone)?.sections}
              </p>
            </div>

            {/* Secure Routing Walkthrough */}
            <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-800 text-[10px] tracking-wider uppercase flex items-center gap-1">
                  <ShieldCheck size={13} className="text-fifa-blue" /> Entrance Walkthrough
                </h3>
                <button
                  onClick={() => setActiveTab('map')}
                  className="text-[10px] text-fifa-blue font-extrabold hover:underline hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
                >
                  MAP VIEW &rarr;
                </button>
              </div>

              <div className="space-y-2">
                {/* Steps */}
                <div className="flex gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-fifa-blue text-white flex items-center justify-center font-mono text-[9px] font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-[10px]">Verify assigned gate {selectedGate}</h4>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Approach the outer perimeter ring matching gate {selectedGate}.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-fifa-blue text-white flex items-center justify-center font-mono text-[9px] font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-[10px]">Secure Scanning</h4>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Empty metal items. Clear bags only. Larger items must be stored.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-fifa-blue text-white flex items-center justify-center font-mono text-[9px] font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-[10px]">RFID Access Tap</h4>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      Scan digital code to unlock turnstiles.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety advisory bottom bar */}
            <div className="bg-slate-900 text-white p-2.5 rounded-lg flex flex-col">
              <p className="text-[9px] text-fifa-green uppercase font-black tracking-wider mb-1">Safety Advisory</p>
              <p className="text-[10px] text-slate-300 leading-snug">
                Follow physical overhead signage for final stadium routing.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Ticket size={32} className="text-slate-300 mb-1.5" />
            <p className="text-xs font-black text-slate-600 uppercase tracking-wide">No Ticket Zone Selected</p>
            <p className="text-[10px] text-slate-400 mt-1 max-w-[210px] text-center leading-relaxed">
              Select your assigned ticket Stand Zone above to pinpoint your secure gate access paths.
            </p>
          </div>
        )}

        {/* FAQ Banner */}
        <div className="mt-auto pt-3 border-t border-slate-150 flex items-center gap-2 text-slate-500 text-[10px] leading-tight">
          <HelpCircle size={13} className="text-fifa-blue shrink-0" />
          <span>Need real-time routing? Ask **Navigator AI** on the next tab.</span>
        </div>
      </div>
    </div>
  );
}
