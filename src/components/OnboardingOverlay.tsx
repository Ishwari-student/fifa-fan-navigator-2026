import React from 'react';
import { Map, ToggleLeft, ShieldAlert, CheckCircle, Info, Landmark } from 'lucide-react';

interface OnboardingOverlayProps {
  onClose: () => void;
  lang?: string; // Optional: support translated text if requested
}

export default function OnboardingOverlay({ onClose }: OnboardingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4" id="onboarding-modal-root">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-scale-up" id="onboarding-modal-card">
        {/* Banner header styled with High Density navy and green accents */}
        <div className="bg-slate-900 px-6 py-7 text-white relative border-b-4 border-fifa-green">
          <div className="absolute top-4 right-4 bg-white/10 text-white/80 font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-white/10 uppercase tracking-wide">
            v2.6
          </div>
          
          <div className="flex items-center gap-2 text-fifa-green mb-1 font-black text-xs tracking-widest uppercase">
            <Landmark size={14} /> FIFA FAN NAVIGATOR 2026
          </div>
          <h2 className="text-lg font-black tracking-tight leading-tight uppercase">Welcome to the Tournament!</h2>
          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed font-semibold">
            Your secure, multilingual AI companion engineered to guide you through gates, amenities, and transit paths safely.
          </p>
        </div>

        {/* 3 Step Guide Container */}
        <div className="p-6 flex flex-col gap-5">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
            Quick 3-Step Setup Guide
          </div>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100 font-extrabold text-xs">
                1
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-wide">
                  &ldquo;Where to go&rdquo; · Interactive Map
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Look at the main <strong className="text-slate-700">Interactive Map</strong> tab. It displays seating quadrants, live concessions, restrooms, and security gate boundaries clearly.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100 font-extrabold text-xs">
                2
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-wide">
                  &ldquo;What to open&rdquo; · Gate Finder
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Tap the <strong className="text-slate-700">&apos;Gate Finder&apos;</strong> or <strong className="text-slate-700">&apos;Transit Options&apos;</strong> panels on your screen. Use them to pinpoint direct entrances and official transit pickup points.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-100 font-extrabold text-xs">
                3
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-xs uppercase tracking-wide">
                  &ldquo;Safe Browsing Check&rdquo; · Privacy
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Allow your phone&apos;s location access so the map can guide you accurately. Rest assured, your location data is processed locally. Also, <strong className="text-slate-700">always keep your eyes on your physical surroundings</strong> while walking.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy statement */}
          <div className="bg-slate-50 p-3 rounded border border-slate-200 text-[10px] text-slate-500 flex gap-2 items-start mt-1">
            <Info size={13} className="text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Offline Capable</strong>: This application is optimized for jammed stadium networks. You can toggle Offline Mode in the menu bar to use local maps and guides without cellular data.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-slate-950 text-white font-black py-3 px-4 rounded text-xs transition-all shadow-md mt-2 flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
          >
            <CheckCircle size={14} className="text-fifa-green" />
            Got it, Let&apos;s Navigate!
          </button>
        </div>
      </div>
    </div>
  );
}
