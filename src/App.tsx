import React, { useState, useEffect } from 'react';
import { Zone, Gate, AmenityType } from './types';
import StadiumMap from './components/StadiumMap';
import GateFinder from './components/GateFinder';
import TransitInfo from './components/TransitInfo';
import AIChat from './components/AIChat';
import OnboardingOverlay from './components/OnboardingOverlay';
import {
  MapPin,
  Ticket,
  Bus,
  MessageSquare,
  ShieldAlert,
  Info,
  Award,
  Globe,
  HelpCircle,
  WifiOff,
  Phone,
  CheckCircle,
  X
} from 'lucide-react';

export default function App() {
  // Navigation & Interactive states
  const [activeTab, setActiveTab] = useState<'map' | 'gate' | 'transit' | 'chat'>('map');
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedGate, setSelectedGate] = useState<Gate | null>(null);
  const [filteredAmenityType, setFilteredAmenityType] = useState<AmenityType | 'all'>('all');
  
  // Offline & Onboarding States
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);

  // Trigger Onboarding automatically for first-time visitors
  useEffect(() => {
    const hasSeen = localStorage.getItem('has_seen_fifa_onboarding');
    if (!hasSeen) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('has_seen_fifa_onboarding', 'true');
  };

  const triggerResetAll = () => {
    setSelectedZone(null);
    setSelectedGate(null);
    setFilteredAmenityType('all');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800" id="app-root">
      
      {/* Sticky High-Contrast Emergency Alert Banner */}
      <div 
        className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all text-center"
        onClick={() => setShowEmergencyModal(true)}
        id="emergency-alert-banner"
      >
        <span className="bg-white text-rose-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-extrabold animate-pulse">
          ALERT
        </span>
        <span>Medical or Security Emergency inside the stadium? Click here immediately. Helpline: +1 (800) 555-FIFA</span>
      </div>

      {/* Persistent Global Navigation Header */}
      <header className="bg-fifa-blue text-white shadow-md border-b border-fifa-blue-dark sticky top-0 z-40" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand Element */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-fifa-green flex items-center justify-center font-black text-slate-950 shadow-md shadow-emerald-500/20 italic text-xl">
              F
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-xl tracking-tight uppercase leading-none">
                  FIFA Fan Navigator <span className="text-fifa-green">2026</span>
                </h1>
                <span className="text-[9px] bg-fifa-green/20 text-fifa-green font-extrabold px-2 py-0.5 rounded-full border border-fifa-green/30 tracking-wider">
                  HIGH DENSITY LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium tracking-wide mt-0.5">Secure Multilingual Concourse & Gate Companion</p>
            </div>
          </div>

          {/* Quick Header Controls */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            
            {/* Live Flag Translator / Indicator */}
            <div className="flex bg-white/10 rounded-lg p-1 text-[10px] font-extrabold tracking-wide uppercase">
              <span className="bg-white text-fifa-blue px-2.5 py-1 rounded shadow-sm">EN</span>
              <span className="px-2.5 py-1 opacity-70 text-white">ES</span>
              <span className="px-2.5 py-1 opacity-70 text-white">FR</span>
              <span className="px-2.5 py-1 opacity-70 text-white">AR</span>
              <span className="px-2.5 py-1 opacity-70 text-white">JA</span>
            </div>

            {/* Offline Mode Toggle Switch */}
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
              <span className="text-[11px] font-bold text-slate-300">Offline Mode</span>
              <button
                onClick={() => setIsOffline(!isOffline)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isOffline ? 'bg-fifa-green' : 'bg-slate-600'}`}
                id="offline-mode-toggle"
                title="Toggle offline map and local helper mode"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isOffline ? 'translate-x-4' : 'translate-x-0'}`}
                />
              </button>
            </div>

            {/* How to Use Help Trigger */}
            <button
              onClick={() => setShowOnboarding(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#001C4F] hover:bg-[#002b7a] text-white rounded-lg border border-white/20 transition-colors text-[11px] font-bold cursor-pointer"
              title="Open onboarding instructions"
            >
              <HelpCircle size={14} className="text-fifa-green" />
              <span>How To Use</span>
            </button>

            {/* Header Help Tag */}
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="bg-rose-600 hover:bg-rose-700 px-3.5 py-1.5 rounded-md font-extrabold animate-pulse flex items-center gap-1.5 text-xs text-white border border-rose-500 cursor-pointer shadow-sm"
            >
              <ShieldAlert size={14} />
              <span>HELP: +1-800-FIFA</span>
            </button>
          </div>
        </div>
      </header>

      {/* Offline Alert Sticky Bar */}
      {isOffline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs font-bold text-center border-b border-amber-600 flex items-center justify-center gap-2 animate-fade-in">
          <WifiOff size={14} className="shrink-0" />
          <span>OFFLINE FALLBACK ACTIVATED &bull; Satellite coordinates and AI Assistant are running in local-secured storage mode.</span>
        </div>
      )}

      {/* Main App Dashboard Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6" id="dashboard-main-view">
        
        {/* Mobile-Only Tab Selectors (Hidden on Large Screens) */}
        <div className="lg:hidden flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 mb-4 shadow-sm" id="mobile-tabs-container">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border-b-2 ${activeTab === 'map' ? 'bg-fifa-blue text-white border-fifa-green shadow-xs' : 'text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-200'}`}
          >
            <MapPin size={14} /> Map
          </button>
          <button
            onClick={() => setActiveTab('gate')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border-b-2 ${activeTab === 'gate' ? 'bg-fifa-blue text-white border-fifa-green shadow-xs' : 'text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-200'}`}
          >
            <Ticket size={14} /> Gate Finder
          </button>
          <button
            onClick={() => setActiveTab('transit')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border-b-2 ${activeTab === 'transit' ? 'bg-fifa-blue text-white border-fifa-green shadow-xs' : 'text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-200'}`}
          >
            <Bus size={14} /> Transit
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border-b-2 ${activeTab === 'chat' ? 'bg-fifa-blue text-white border-fifa-green shadow-xs' : 'text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-200'}`}
          >
            <MessageSquare size={14} /> AI Chat
          </button>
        </div>

        {/* Desktop-Precision Grid (Map always active on left, Sub-tools change on right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1: The Interactive Stadium Map (Visible on Desktop always, or on Map tab on mobile) */}
          <div className={`lg:col-span-7 ${activeTab === 'map' ? 'block' : 'hidden lg:block'}`} id="desktop-map-viewport">
            <StadiumMap
              selectedZone={selectedZone}
              setSelectedZone={setSelectedZone}
              selectedGate={selectedGate}
              setSelectedGate={setSelectedGate}
              filteredAmenityType={filteredAmenityType}
              setFilteredAmenityType={setFilteredAmenityType}
              isOffline={isOffline}
            />
          </div>

          {/* COLUMN 2: Subtools Panel (Varies on desktop based on selectors; shows active tab content on mobile) */}
          <div className={`lg:col-span-5 flex flex-col gap-5 ${activeTab !== 'map' ? 'block' : 'hidden lg:flex'}`} id="desktop-tools-viewport">
            
            {/* Desktop-Only Tab Selectors on top of subtools */}
            <div className="hidden lg:flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm" id="desktop-tool-tabs">
              <button
                onClick={() => setActiveTab('gate')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border-b-2 ${activeTab === 'gate' || activeTab === 'map' ? 'bg-fifa-blue text-white border-fifa-green shadow-xs' : 'text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-200'}`}
              >
                <Ticket size={14} /> Gate Finder
              </button>
              <button
                onClick={() => setActiveTab('transit')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border-b-2 ${activeTab === 'transit' ? 'bg-fifa-blue text-white border-fifa-green shadow-xs' : 'text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-200'}`}
              >
                <Bus size={14} /> Transit Options
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border-b-2 ${activeTab === 'chat' ? 'bg-fifa-blue text-white border-fifa-green shadow-xs' : 'text-slate-600 hover:bg-slate-50 border-transparent hover:border-slate-200'}`}
              >
                <MessageSquare size={14} /> Navigator AI
              </button>
            </div>

            {/* Render Active Tab / Sub-component */}
            <div className="flex-1">
              {(activeTab === 'gate' || (activeTab === 'map' && window.innerWidth >= 1024)) && (
                <GateFinder
                  selectedZone={selectedZone}
                  setSelectedZone={setSelectedZone}
                  selectedGate={selectedGate}
                  setSelectedGate={setSelectedGate}
                  setActiveTab={setActiveTab}
                />
              )}
              {activeTab === 'transit' && (
                <TransitInfo />
              )}
              {activeTab === 'chat' && (
                <AIChat
                  isOffline={isOffline}
                  onTriggerOnboarding={() => setShowOnboarding(true)}
                  selectedZone={selectedZone}
                  selectedGate={selectedGate}
                />
              )}
            </div>

          </div>

        </div>

      </main>

      {/* Persistent Stadium Safety Quick Indicators Footer */}
      <footer className="bg-white border-t border-slate-150 py-6 mt-auto text-xs text-slate-500" id="global-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <Award size={15} className="text-emerald-600" />
            <span className="font-bold text-slate-700">FIFA Fan Safety & Privacy Charter 2026</span>
            <span className="text-slate-300">|</span>
            <span>Zero Data Logging &bull; SSL Encrypted</span>
          </div>

          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
              <ShieldAlert size={12} /> Seek Physical Signage
            </span>
            <span>Emergency Matchday Center: **+1 (800) 555-FIFA**</span>
          </div>

        </div>
      </footer>

      {/* Emergency Assistance Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4" id="emergency-modal">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-4 border-rose-600 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2 text-rose-600">
                <ShieldAlert size={20} />
                <h3 className="font-black tracking-tight text-lg uppercase">Emergency Medical & Security</h3>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-center">
                <div className="text-[10px] uppercase font-extrabold text-rose-600 tracking-wider">stadium helpline number</div>
                <div className="text-2xl font-black text-rose-950 mt-1 flex items-center justify-center gap-1.5 select-all">
                  <Phone size={20} className="text-rose-600" />
                  <span>+1 (800) 555-FIFA</span>
                </div>
                <div className="text-xs text-rose-800 font-bold mt-1">(+1 800-555-3432)</div>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed space-y-2">
                <p className="font-bold text-slate-800">Please do not hesitate to act immediately:</p>
                <div className="flex gap-2 items-start">
                  <span className="text-rose-600 font-extrabold mt-0.5">&bull;</span>
                  <p><strong>Find a Steward</strong>: Locate any physical stadium steward, crew, or security guard wearing the neon World Cup vests immediately. They can request emergency medics with instant radios.</p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-rose-600 font-extrabold mt-0.5">&bull;</span>
                  <p><strong>Explain clearly</strong>: Give them your exact Section number (e.g. North Concourse Section N105) and current Gate.</p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-rose-600 font-extrabold mt-0.5">&bull;</span>
                  <p><strong>Unreliable network</strong>: If your cell network drops, use the stadium public landline boxes positioned next to any First Aid clinic.</p>
                </div>
              </div>

              <button
                onClick={() => setShowEmergencyModal(false)}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-md mt-2 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle size={15} />
                I Understand, Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Onboarding Wizard Overlay */}
      {showOnboarding && (
        <OnboardingOverlay onClose={handleCloseOnboarding} />
      )}

    </div>
  );
}
