import React from 'react';
import { Bus, Train, Phone, AlertTriangle, ShieldCheck, Footprints, Clock } from 'lucide-react';

export default function TransitInfo() {
  const transitOptions = [
    {
      id: 'shuttle',
      name: 'Official FIFA Shuttle Bus',
      icon: <Bus className="text-emerald-600" size={20} />,
      badge: 'Highly Recommended',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      description: 'Free, dedicated transit service running continuously on match days for ticket holders.',
      route: 'Connects directly between the Stadium Outer Perimeter and Central Hubs / City Fan Zones.',
      pickup: 'Gate A (North Loop) & Gate E (South Loop) Shuttle Plazas.',
      frequency: 'Every 5 - 7 minutes. Service runs until 2 hours after final whistle.',
      safetyGuide: 'Fully secure, steward-monitored lanes. Monitored continuously by tournament security.',
    },
    {
      id: 'metro',
      name: 'Metro / Light Rail (Gold Line)',
      icon: <Train className="text-sky-600" size={20} />,
      badge: 'Fast & Secure',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      description: 'High-speed local train system with massive high-volume passenger capacity.',
      route: 'Direct connection to downtown stations and major airport terminals.',
      pickup: 'Arena Central Station (10-minute walk from West Stands Gate G).',
      frequency: 'Runs every 3 minutes. Extended hours on match days.',
      safetyGuide: 'Follow the secure, dedicated pedestrian corridor fenced and lit all the way to the station entrance.',
    },
    {
      id: 'rideshare',
      name: 'Registered Ride-Sharing (Lot C)',
      icon: <Phone className="text-indigo-600" size={20} />,
      badge: 'App Booking Only',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      description: 'Designated passenger pickup zone for digital mobile app bookings.',
      route: 'Direct door-to-door transit to your private lodging or custom locations.',
      pickup: 'Lot C (North-West Parking Annex, 6-minute walk from Gate H).',
      frequency: 'On-demand via official apps. Expect surge wait times post-match.',
      safetyGuide: 'Only match vehicles inside Lot C boundaries. Always cross-verify license plate, driver photo, and name before boarding.',
    },
  ];

  return (
    <div className="flex flex-col h-full shadow-md rounded-xl overflow-hidden" id="transit-info-panel">
      {/* Header from High Density theme */}
      <div className="p-3.5 bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-between border-b border-slate-950">
        <div className="flex items-center gap-2">
          <Bus size={14} className="text-fifa-green" />
          <span>Transit Hub Guide</span>
        </div>
        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-black tracking-wide">
          OFFICIAL DIRECTIVES
        </span>
      </div>

      <div className="p-4 bg-white border border-slate-200 border-t-0 flex-1 flex flex-col gap-4 rounded-b-xl">
        <div>
          <h2 className="font-extrabold text-slate-900 text-sm">Real-Time Transportation Options</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Approved transit terminals, secure pedestrian routes, and pickup lanes.</p>
        </div>

        {/* Critical Safety Alert */}
        <div className="bg-rose-50 border-l-4 border-rose-600 rounded p-3 flex gap-2.5">
          <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={16} />
          <div className="flex flex-col gap-0.5">
            <span className="font-black text-rose-950 text-[10px] tracking-wider uppercase">Unlicensed Cabs Warning</span>
            <p className="text-[10px] text-rose-800 leading-snug font-semibold">
              Avoid boarding private unlicensed vehicles outside the stadium ring. They present risks of payment skimming and high fees. Always board only at official, steward-marked queues.
            </p>
          </div>
        </div>

        {/* Transit Options List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {transitOptions.map((opt) => (
            <div key={opt.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between gap-3 hover:border-slate-300 transition-colors">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 bg-white rounded-md border border-slate-200 shadow-xs">
                    {opt.icon}
                  </div>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${opt.badgeColor}`}>
                    {opt.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xs">{opt.name}</h3>
                  <p className="text-[10px] text-slate-500 leading-normal mt-0.5">{opt.description}</p>
                </div>

                {/* Specs */}
                <div className="border-t border-slate-200 pt-2 mt-0.5 space-y-1.5 text-[10px]">
                  <div className="flex gap-1.5">
                    <Clock className="text-slate-400 shrink-0 mt-0.5" size={12} />
                    <div>
                      <strong className="text-slate-700 font-bold">Frequency:</strong> <span className="text-slate-600">{opt.frequency}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Footprints className="text-slate-400 shrink-0 mt-0.5" size={12} />
                    <div>
                      <strong className="text-slate-700 font-bold">Pickup:</strong> <span className="text-slate-600">{opt.pickup}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <ShieldCheck className="text-emerald-700 shrink-0 mt-0.5" size={12} />
                    <div>
                      <strong className="text-emerald-800 font-black">Corridor:</strong> <span className="text-emerald-950 font-bold">{opt.safetyGuide}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-2 rounded border border-slate-200 text-[9px] text-slate-500 leading-tight">
                <strong className="text-slate-700 block mb-0.5">Approved Route:</strong>
                {opt.route}
              </div>
            </div>
          ))}
        </div>

        {/* Safety tips box */}
        <div className="mt-auto bg-slate-50 rounded-lg p-3 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-emerald-600 shrink-0" size={15} />
            <div>
              <span className="font-bold text-slate-800 block text-[11px]">Follow Pedestrian Flow Safeguards</span>
              <p className="text-[10px] text-slate-500">Keep mobile devices secure and follow lit paths matching police directions.</p>
            </div>
          </div>
          <div className="text-slate-400 text-[9px] font-black sm:text-right uppercase tracking-wider">
            HELPLINE: +1 (800) 555-FIFA
          </div>
        </div>
      </div>
    </div>
  );
}
