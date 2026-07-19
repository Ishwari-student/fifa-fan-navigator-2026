import React, { useState } from 'react';
import { Zone, Gate, Amenity, AmenityType } from '../types';
import { MapPin, ZoomIn, ZoomOut, RotateCcw, ShieldAlert, CheckCircle2, Award } from 'lucide-react';

interface StadiumMapProps {
  selectedZone: Zone | null;
  setSelectedZone: (zone: Zone | null) => void;
  selectedGate: Gate | null;
  setSelectedGate: (gate: Gate | null) => void;
  filteredAmenityType: AmenityType | 'all';
  setFilteredAmenityType: (type: AmenityType | 'all') => void;
  isOffline: boolean;
}

// Preset amenities coordinates and descriptions
export const AMENITIES_DATA: Amenity[] = [
  { id: 'con1', name: 'Budweiser Brew House', type: 'concessions', zone: 'North', level: 'Level 1 Concourse', description: 'Official beer and soft drinks partner. Fast queues.', coordinates: { x: 380, y: 150 } },
  { id: 'con2', name: 'Americana Grill', type: 'concessions', zone: 'East', level: 'Level 1 Concourse', description: 'Hot dogs, burgers, nachos, vegetarian options.', coordinates: { x: 550, y: 280 } },
  { id: 'con3', name: 'Tacos de Mexico', type: 'concessions', zone: 'South', level: 'Level 2 Upper Deck', description: 'Authentic tacos and local street food selection.', coordinates: { x: 420, y: 440 } },
  { id: 'con4', name: 'Maple Coffee & Pretzel', type: 'concessions', zone: 'West', level: 'Level 1 Concourse', description: 'Warm beverages, pretzels, and gluten-free snacks.', coordinates: { x: 230, y: 310 } },
  
  { id: 'rest1', name: 'Main Restroom North', type: 'restrooms', zone: 'North', level: 'Level 1', description: 'All-gender restrooms, accessible stalls, baby-changing.', coordinates: { x: 440, y: 160 } },
  { id: 'rest2', name: 'East Side Facilities', type: 'restrooms', zone: 'East', level: 'Level 1 & 2', description: 'High-capacity, wheelchair accessible, well-lit.', coordinates: { x: 540, y: 240 } },
  { id: 'rest3', name: 'Main Restroom South', type: 'restrooms', zone: 'South', level: 'Level 1', description: 'Family restrooms, accessible facilities, sanitation hub.', coordinates: { x: 360, y: 440 } },
  { id: 'rest4', name: 'West Side Restrooms', type: 'restrooms', zone: 'West', level: 'Level 2', description: 'Touchless, highly sanitized, baby-changing stations.', coordinates: { x: 250, y: 350 } },
  
  { id: 'fa1', name: 'Red Cross First-Aid 1', type: 'first-aid', zone: 'North', level: 'Gate A Annex', description: 'Full emergency support, paramedics, hydration station.', coordinates: { x: 290, y: 150 } },
  { id: 'fa2', name: 'First-Aid Station South', type: 'first-aid', zone: 'South', level: 'Gate E Annex', description: 'Paramedics, basic medical supplies, emergency transport.', coordinates: { x: 500, y: 440 } },
  
  { id: 'sou1', name: 'Official FIFA Fan Shop West', type: 'souvenirs', zone: 'West', level: 'Main Plaza Gate G', description: 'Official jerseys, match-day programs, tournament merchandise.', coordinates: { x: 210, y: 260 } },
  { id: 'sou2', name: 'FIFA Souvenir Stand East', type: 'souvenirs', zone: 'East', level: 'Level 1 Plaza', description: 'Scarves, caps, country flags, and souvenir coins.', coordinates: { x: 570, y: 330 } },
];

export default function StadiumMap({
  selectedZone,
  setSelectedZone,
  selectedGate,
  setSelectedGate,
  filteredAmenityType,
  setFilteredAmenityType,
  isOffline,
}: StadiumMapProps) {
  // Zoom & Pan states
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);

  // Map limits & actions
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.75));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedZone(null);
    setSelectedGate(null);
    setSelectedAmenity(null);
  };

  // Mouse drag handlers for panning
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Gate specifications
  const gates = [
    { name: 'Gate A' as Gate, x: 260, y: 110, zone: 'North' as Zone, description: 'VIP, Category 1 Tickets, Fast Track Security' },
    { name: 'Gate B' as Gate, x: 540, y: 110, zone: 'North' as Zone, description: 'General Admission, Category 1 & 3 Tickets' },
    { name: 'Gate C' as Gate, x: 610, y: 200, zone: 'East' as Zone, description: 'General Admission, Category 2 & 3 Tickets' },
    { name: 'Gate D' as Gate, x: 610, y: 400, zone: 'East' as Zone, description: 'Family Entrance, Wheelchair Accessible' },
    { name: 'Gate E' as Gate, x: 540, y: 490, zone: 'South' as Zone, description: 'VIP, Category 2 Tickets, Media Entrance' },
    { name: 'Gate F' as Gate, x: 260, y: 490, zone: 'South' as Zone, description: 'General Admission, Category 3 Tickets' },
    { name: 'Gate G' as Gate, x: 190, y: 400, zone: 'West' as Zone, description: 'Fan Club Entrance, Category 1 & 2 Tickets' },
    { name: 'Gate H' as Gate, x: 190, y: 200, zone: 'West' as Zone, description: 'General Admission, Supporter Club Entrance' },
  ];

  const handleGateClick = (gateName: Gate, zone: Zone) => {
    setSelectedGate(gateName);
    setSelectedZone(zone);
    setSelectedAmenity(null);
  };

  const handleZoneClick = (zone: Zone) => {
    setSelectedZone(zone);
    setSelectedGate(null);
    setSelectedAmenity(null);
  };

  const handleAmenityClick = (amenity: Amenity) => {
    setSelectedAmenity(amenity);
    setSelectedZone(amenity.zone);
    setSelectedGate(null);
  };

  // Get color for Zone highlights
  const getZoneColor = (zoneName: Zone, isActive: boolean) => {
    switch (zoneName) {
      case 'North':
        return isActive ? 'fill-sky-500/30 stroke-sky-400 stroke-2' : 'fill-sky-100/10 stroke-sky-300/45 hover:fill-sky-500/15';
      case 'East':
        return isActive ? 'fill-amber-500/30 stroke-amber-400 stroke-2' : 'fill-amber-100/10 stroke-amber-300/45 hover:fill-amber-500/15';
      case 'South':
        return isActive ? 'fill-emerald-500/30 stroke-emerald-400 stroke-2' : 'fill-emerald-100/10 stroke-emerald-300/45 hover:fill-emerald-500/15';
      case 'West':
        return isActive ? 'fill-indigo-500/30 stroke-indigo-400 stroke-2' : 'fill-indigo-100/10 stroke-indigo-300/45 hover:fill-indigo-500/15';
    }
  };

  const getAmenityColor = (type: AmenityType) => {
    switch (type) {
      case 'concessions': return 'bg-amber-500 text-white border-amber-600';
      case 'restrooms': return 'bg-indigo-500 text-white border-indigo-600';
      case 'first-aid': return 'bg-red-500 text-white border-red-600 animate-pulse';
      case 'souvenirs': return 'bg-sky-500 text-white border-sky-600';
    }
  };

  const activeAmenities = AMENITIES_DATA.filter(
    item => filteredAmenityType === 'all' || item.type === filteredAmenityType
  );

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col h-full" id="stadium-map-container">
      {/* Map Header from High Density theme */}
      <div className="p-3.5 bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-between border-b border-slate-950">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-fifa-green animate-pulse" />
          <span>Interactive Stadium Concourse</span>
        </div>
        <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-black tracking-wide">
          {isOffline ? 'OFFLINE CACHED' : 'LIVE MAP LAYERS'}
        </span>
      </div>

      {/* Map Control Bar */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Filter Badges in High Density Style */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
          <button
            onClick={() => setFilteredAmenityType('all')}
            className={`px-2.5 py-1 rounded text-[10px] font-black uppercase transition-all cursor-pointer ${filteredAmenityType === 'all' ? 'bg-fifa-blue text-white border border-fifa-blue' : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilteredAmenityType('concessions')}
            className={`px-2.5 py-1 rounded text-[10px] font-black uppercase transition-all cursor-pointer flex items-center gap-1 ${filteredAmenityType === 'concessions' ? 'bg-amber-500 text-white border border-amber-500' : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400'}`}
          >
            🍔 Concessions
          </button>
          <button
            onClick={() => setFilteredAmenityType('restrooms')}
            className={`px-2.5 py-1 rounded text-[10px] font-black uppercase transition-all cursor-pointer flex items-center gap-1 ${filteredAmenityType === 'restrooms' ? 'bg-indigo-600 text-white border border-indigo-600' : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-400'}`}
          >
            🚻 Restrooms
          </button>
          <button
            onClick={() => setFilteredAmenityType('first-aid')}
            className={`px-2.5 py-1 rounded text-[10px] font-black uppercase transition-all cursor-pointer flex items-center gap-1 ${filteredAmenityType === 'first-aid' ? 'bg-red-600 text-white border border-red-600' : 'bg-white text-slate-700 border border-slate-200 hover:border-red-400'}`}
          >
            🚨 First-Aid
          </button>
          <button
            onClick={() => setFilteredAmenityType('souvenirs')}
            className={`px-2.5 py-1 rounded text-[10px] font-black uppercase transition-all cursor-pointer flex items-center gap-1 ${filteredAmenityType === 'souvenirs' ? 'bg-sky-600 text-white border border-sky-600' : 'bg-white text-slate-700 border border-slate-200 hover:border-sky-400'}`}
          >
            🛍️ Fan Shop
          </button>
        </div>
 
        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-xs cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={13} />
          </button>
          <span className="text-[10px] font-black font-mono text-slate-600 px-1.5 w-11 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-xs cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={13} />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-xs ml-1 cursor-pointer"
            title="Reset Map View"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>
 
      {/* SVG Canvas Container */}
      <div className="relative flex-1 bg-slate-900 overflow-hidden cursor-grab active:cursor-grabbing h-[420px]" id="map-canvas-viewport">
        <svg
          className="w-full h-full select-none"
          viewBox="0 0 800 600"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Zoom/Pan Transform Group */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            
            {/* Background Atmosphere Lights */}
            <circle cx="400" cy="300" r="280" className="fill-slate-800/20" />
            
            {/* Outer Ring Pedestrian concourse */}
            <circle cx="400" cy="300" r="250" className="fill-slate-800 stroke-slate-700 stroke-[3] stroke-dasharray-[10,5]" />
            <circle cx="400" cy="300" r="210" className="fill-slate-800/80 stroke-slate-750 stroke-1" />
 
            {/* Stadium Sectors / Seating Bowl Quadrants */}
            {/* NORTH ZONE */}
            <path
              d="M 230 130 A 210 210 0 0 1 570 130 L 510 190 A 130 130 0 0 0 290 190 Z"
              className={`cursor-pointer transition-colors duration-250 ${getZoneColor('North', selectedZone === 'North')}`}
              onClick={() => handleZoneClick('North')}
            />
            {/* EAST ZONE */}
            <path
              d="M 570 130 A 210 210 0 0 1 570 470 L 510 410 A 130 130 0 0 0 510 190 Z"
              className={`cursor-pointer transition-colors duration-250 ${getZoneColor('East', selectedZone === 'East')}`}
              onClick={() => handleZoneClick('East')}
            />
            {/* SOUTH ZONE */}
            <path
              d="M 570 470 A 210 210 0 0 1 230 470 L 290 410 A 130 130 0 0 0 510 410 Z"
              className={`cursor-pointer transition-colors duration-250 ${getZoneColor('South', selectedZone === 'South')}`}
              onClick={() => handleZoneClick('South')}
            />
            {/* WEST ZONE */}
            <path
              d="M 230 470 A 210 210 0 0 1 230 130 L 290 190 A 130 130 0 0 0 290 410 Z"
              className={`cursor-pointer transition-colors duration-250 ${getZoneColor('West', selectedZone === 'West')}`}
              onClick={() => handleZoneClick('West')}
            />
 
            {/* Inner Ring Wall */}
            <circle cx="400" cy="300" r="130" className="fill-none stroke-slate-700 stroke-4" />
            
            {/* Pitch Outer Wall & Grass Bowl */}
            <rect x="310" y="220" width="180" height="160" rx="30" className="fill-slate-900 stroke-slate-700 stroke-[2]" />
            {/* The Football Pitch */}
            <rect x="320" y="235" width="160" height="130" rx="8" className="fill-emerald-800 stroke-emerald-400 stroke-[1.5]" />
            {/* Pitch Markings */}
            <line x1="400" y1="235" x2="400" y2="365" className="stroke-emerald-400/50 stroke-1" />
            <circle cx="400" cy="300" r="25" className="fill-none stroke-emerald-400/50 stroke-1" />
            <rect x="320" y="275" width="20" height="50" className="fill-none stroke-emerald-400/50 stroke-1" />
            <rect x="460" y="275" width="20" height="50" className="fill-none stroke-emerald-400/50 stroke-1" />
 
            {/* Seating Rows lines */}
            <circle cx="400" cy="300" r="185" className="fill-none stroke-slate-800/40 stroke-[2] pointer-events-none" />
            <circle cx="400" cy="300" r="160" className="fill-none stroke-slate-800/40 stroke-[2] pointer-events-none" />
 
            {/* Stadium Roof Structure ring (Outer Cover) */}
            <circle cx="400" cy="300" r="248" className="fill-none stroke-slate-950/90 stroke-[8] pointer-events-none" />
            
            {/* Compass labels */}
            <text x="400" y="80" className="fill-slate-400 font-sans text-[11px] font-semibold text-center select-none" textAnchor="middle">NORTH STAND</text>
            <text x="660" y="305" className="fill-slate-400 font-sans text-[11px] font-semibold select-none" textAnchor="middle">EAST STAND</text>
            <text x="400" y="530" className="fill-slate-400 font-sans text-[11px] font-semibold select-none" textAnchor="middle">SOUTH STAND</text>
            <text x="140" y="305" className="fill-slate-400 font-sans text-[11px] font-semibold select-none" textAnchor="middle">WEST STAND</text>
 
            {/* GATES LAYOUT (Interactive Dots) */}
            {gates.map((g) => {
              const isSelected = selectedGate === g.name;
              return (
                <g key={g.name} className="cursor-pointer" onClick={() => handleGateClick(g.name, g.zone)}>
                  {/* Outer Pulsing Aura for active selection */}
                  {isSelected && (
                    <circle cx={g.x} cy={g.y} r="22" className="fill-emerald-400/20 stroke-emerald-400 stroke-1 animate-pulse" />
                  )}
                  {/* Gate base circle */}
                  <circle
                    cx={g.x}
                    cy={g.y}
                    r="12"
                    className={`transition-colors duration-200 stroke-2 ${isSelected ? 'fill-fifa-green stroke-white' : 'fill-slate-800 stroke-slate-600 hover:stroke-slate-400'}`}
                  />
                  {/* Letter ID */}
                  <text
                    x={g.x}
                    y={g.y + 4}
                    className={`font-sans text-[10px] font-bold text-center select-none ${isSelected ? 'fill-slate-950 font-black' : 'fill-slate-300'}`}
                    textAnchor="middle"
                  >
                    {g.name.replace('Gate ', '')}
                  </text>
                </g>
              );
            })}
 
            {/* AMENITY PINS (Filterable) */}
            {activeAmenities.map((amenity) => {
              const isSelected = selectedAmenity?.id === amenity.id;
              let emoji = '🍔';
              if (amenity.type === 'restrooms') emoji = '🚻';
              if (amenity.type === 'first-aid') emoji = '🚨';
              if (amenity.type === 'souvenirs') emoji = '🛍️';
 
              return (
                <g key={amenity.id} className="cursor-pointer" onClick={() => handleAmenityClick(amenity)}>
                  {isSelected && (
                    <circle cx={amenity.coordinates.x} cy={amenity.coordinates.y} r="25" className="fill-emerald-400/20 stroke-emerald-400 stroke-1 animate-ping" style={{ animationDuration: '3s' }} />
                  )}
                  {/* Pin Circle */}
                  <circle
                    cx={amenity.coordinates.x}
                    cy={amenity.coordinates.y}
                    r="14"
                    className={`stroke-2 transition-transform duration-200 hover:scale-125 ${isSelected ? 'fill-fifa-green stroke-slate-950' : 'fill-slate-900 stroke-white/70'}`}
                  />
                  {/* Emoji Inside */}
                  <text
                    x={amenity.coordinates.x}
                    y={amenity.coordinates.y + 4}
                    className="text-[12px] select-none text-center"
                    textAnchor="middle"
                  >
                    {emoji}
                  </text>
                </g>
              );
            })}
 
            {/* Dynamic Walking Path Line (from selected Gate to selected Amenity) */}
            {selectedGate && selectedAmenity && (
              (() => {
                const startGate = gates.find(g => g.name === selectedGate);
                if (startGate) {
                  return (
                    <g>
                      <line
                        x1={startGate.x}
                        y1={startGate.y}
                        x2={selectedAmenity.coordinates.x}
                        y2={selectedAmenity.coordinates.y}
                        className="stroke-fifa-green stroke-2 stroke-dasharray-[6,4] animate-pulse"
                      />
                      {/* Midpoint Info Card Anchor */}
                      <circle cx={(startGate.x + selectedAmenity.coordinates.x)/2} cy={(startGate.y + selectedAmenity.coordinates.y)/2} r="5" className="fill-fifa-green stroke-slate-950 stroke-1" />
                    </g>
                  );
                }
                return null;
              })()
            )}
 
          </g>
        </svg>
 
        {/* Float Map Overlay Guide */}
        <div className="absolute bottom-4 left-4 bg-slate-950/85 backdrop-blur-sm p-3 rounded-xl border border-white/10 text-white max-w-xs text-xs pointer-events-none">
          <div className="font-bold text-fifa-green mb-1 uppercase tracking-wider text-[10px]">🎮 Map Navigation</div>
          <p className="text-slate-300 text-[10px]">Drag to Pan. Scroll or use controls to Zoom.</p>
          <p className="text-slate-400 text-[9px] mt-1 leading-relaxed">Tap Stand Zones, Outer Gates, or Amenity Icons to view specific safety details.</p>
        </div>
 
        {/* Mode Legend Indicator - High Density Style */}
        <div className="absolute top-4 right-4 bg-slate-950/85 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 text-white flex flex-col gap-1 text-[9px] pointer-events-none w-[110px]">
          <div className="font-extrabold text-slate-400 mb-0.5 uppercase tracking-wider">Stands</div>
          <div className="flex items-center justify-between"><span className="w-2.5 h-1.5 rounded bg-sky-500/50 border border-sky-400" /> <span className="text-slate-200">North</span></div>
          <div className="flex items-center justify-between"><span className="w-2.5 h-1.5 rounded bg-amber-500/50 border border-amber-400" /> <span className="text-slate-200">East</span></div>
          <div className="flex items-center justify-between"><span className="w-2.5 h-1.5 rounded bg-emerald-500/50 border border-emerald-400" /> <span className="text-slate-200">South</span></div>
          <div className="flex items-center justify-between"><span className="w-2.5 h-1.5 rounded bg-indigo-500/50 border border-indigo-400" /> <span className="text-slate-200">West</span></div>
        </div>
      </div>
 
      {/* Map Active Selection Drawer */}
      <div className="p-4 bg-white border-t border-slate-200 flex flex-col gap-3 min-h-[140px]" id="map-selection-drawer">
        {selectedGate ? (
          (() => {
            const gateDetails = gates.find(g => g.name === selectedGate);
            return (
              <div className="animate-fade-in flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-900 text-fifa-green text-[10px] font-black px-3 py-1 rounded border border-slate-950 uppercase tracking-wider">
                      {selectedGate} Active
                    </span>
                    <span className="text-xs text-slate-500">
                      Direct access to the <strong className="text-slate-800">{gateDetails?.zone} Zone Seating</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedGate(null)}
                    className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer font-bold uppercase tracking-wider"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-emerald-50/40 p-3 rounded-lg border border-emerald-100">
                  <div>
                    <h4 className="font-extrabold text-emerald-950 flex items-center gap-1 mb-1">
                      <CheckCircle2 size={13} className="text-emerald-700" /> Zone Entry Directives
                    </h4>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {gateDetails?.description}. Best entry for Category 1/3 tickets in Section N100 - N220. Secure baggage scanning is active at this gate.
                    </p>
                  </div>
                  <div className="border-l border-emerald-100 pl-3 flex flex-col justify-center">
                    <div className="text-[10px] text-amber-800 font-extrabold flex items-center gap-1 mb-1 bg-amber-50 px-2 py-1 rounded border border-amber-200 uppercase tracking-wider">
                      <ShieldAlert size={14} className="text-amber-600 shrink-0" />
                      <div>Overhead Signs Warning</div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                      Always prioritize physical overhead stadium signs. Never walk into exit-only lanes or staff restricted zones. Keep device in pocket while entering crowd lines.
                    </p>
                  </div>
                </div>
              </div>
            );
          })()
        ) : selectedAmenity ? (
          <div className="animate-fade-in flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">
                  {selectedAmenity.type === 'concessions' ? '🍔' : selectedAmenity.type === 'restrooms' ? '🚻' : selectedAmenity.type === 'first-aid' ? '🚨' : '🛍️'}
                </span>
                <span className="font-black text-slate-900 text-sm uppercase">{selectedAmenity.name}</span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded border border-slate-200">
                  {selectedAmenity.zone} Stand · {selectedAmenity.level}
                </span>
              </div>
              <button
                onClick={() => setSelectedAmenity(null)}
                className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer font-bold uppercase tracking-wider"
              >
                Clear Selection
              </button>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <p className="text-slate-700 font-medium">{selectedAmenity.description}</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-none uppercase font-black tracking-wider">Hours: Gates-open (3h prior) to 1h post-match</p>
              </div>
              {selectedAmenity.type === 'first-aid' ? (
                <div className="bg-red-50 p-2.5 rounded border border-red-200 text-red-800 max-w-sm">
                  <div className="font-extrabold flex items-center gap-1 text-[11px] text-red-700 uppercase tracking-wider">
                    <ShieldAlert size={13} /> Medical Emergency?
                  </div>
                  <p className="text-[10px] text-red-600 mt-0.5 font-semibold">
                    Call **+1 (800) 555-FIFA** immediately or find any nearby steward.
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded border border-emerald-100 flex items-center gap-2">
                  <Award size={15} className="text-emerald-700" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Official FIFA Partner Facility</span>
                </div>
              )}
            </div>
          </div>
        ) : selectedZone ? (
          <div className="animate-fade-in flex flex-col gap-1.5 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-slate-900 text-sm uppercase flex items-center gap-1.5">
                🏟️ Seating Bowl: {selectedZone} Zone
              </h4>
              <button
                onClick={() => setSelectedZone(null)}
                className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer font-bold uppercase tracking-wider"
              >
                Clear Selection
              </button>
            </div>
            <p className="font-medium text-slate-700">
              You have selected the **{selectedZone} Stand**. This zone is served primarily by{' '}
              {selectedZone === 'North' ? 'Gates A & B' : selectedZone === 'East' ? 'Gates C & D' : selectedZone === 'South' ? 'Gates E & F' : 'Gates G & H'}.
            </p>
            <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 font-bold uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>To see amenities in this area, use the filter buttons above (🍔 concessions, 🚻 restrooms, 🚨 first-aid).</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 py-4" id="map-instructions-state">
            <MapPin size={24} className="text-slate-300 animate-bounce mb-1.5" />
            <p className="text-xs font-black text-slate-700 uppercase tracking-wide">Tap map element for safety directives</p>
            <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider font-semibold">Coordinates are optimized for secure matchday navigation</p>
          </div>
        )}
      </div>
    </div>
  );
}
