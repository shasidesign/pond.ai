import React from 'react';
import { sound } from '../utils/audio';

interface NavbarProps {
  activeTab: 'overview' | 'telemetry' | 'anomalies' | 'copilot';
  setActiveTab: (tab: 'overview' | 'telemetry' | 'anomalies' | 'copilot') => void;
  onOpenHardwareModal: () => void;
  onTriggerDiagnostic: () => void;
  isSimulating: boolean;
  setIsSimulating: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenHardwareModal,
  onTriggerDiagnostic,
  isSimulating,
  setIsSimulating,
}) => {
  const [audioMuted, setAudioMuted] = React.useState(false);

  const toggleAudio = () => {
    const next = !audioMuted;
    setAudioMuted(next);
    sound.enabled = !next;
    if (!next) sound.playClick();
  };

  const handleTabClick = (tab: 'overview' | 'telemetry' | 'anomalies' | 'copilot') => {
    sound.playClick();
    setActiveTab(tab);
    if (tab === 'overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(tab);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Brand Wordmark */}
        <a 
          href="#top" 
          onClick={(e) => { e.preventDefault(); handleTabClick('overview'); }}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-emerald-400 p-[1px] shadow-sm shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12c.6 0 1.2-.4 1.4-1 1.1-2.9 3.8-5 7-5 4.4 0 8 3.6 8 8 0 1.7-.5 3.3-1.4 4.6" />
                <circle cx="12" cy="12" r="2.5" fill="#10B981" />
              </svg>
            </div>
          </div>
          <span className="font-semibold tracking-tight text-slate-100 group-hover:text-cyan-300 transition-colors">
            AquaPulse<span className="text-cyan-400">.ai</span>
          </span>
        </a>

        {/* Zone 2: 4 Clean Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => handleTabClick('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'overview' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Overview
            {activeTab === 'overview' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>
          
          <button
            onClick={() => handleTabClick('telemetry')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'telemetry' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Live Telemetry
            {activeTab === 'telemetry' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleTabClick('anomalies')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'anomalies' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Anomaly Detection
            {activeTab === 'anomalies' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleTabClick('copilot')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'copilot' ? 'text-cyan-400 font-semibold' : 'hover:text-white'
            }`}
          >
            Biochemical AI
            {activeTab === 'copilot' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => { sound.playClick(); onOpenHardwareModal(); }}
            className="whitespace-nowrap shrink-0 text-slate-400 hover:text-slate-200 transition-colors py-1"
          >
            Sensor Buoys
          </button>
        </nav>

        {/* Zone 3: Single Primary Action & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Telemetry Stream Live Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setIsSimulating(prev => !prev);
            }}
            title={isSimulating ? "Live Telemetry Feed Streaming" : "Telemetry Paused"}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-300 bg-slate-900/80 border border-white/10 rounded-lg hover:border-cyan-500/40 transition-colors"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isSimulating ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>{isSimulating ? 'LIVE 3s' : 'PAUSED'}</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleAudio}
            aria-label={audioMuted ? "Unmute UI Feedback" : "Mute UI Feedback"}
            className="p-2 text-slate-400 hover:text-white rounded-lg border border-white/5 hover:border-white/15 bg-slate-900/40 transition-colors"
          >
            {audioMuted ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            )}
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => {
              sound.playClick();
              onTriggerDiagnostic();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-lg hover:from-cyan-300 hover:to-emerald-300 active:scale-[0.98] transition-all shadow-md shadow-cyan-500/20 whitespace-nowrap shrink-0"
          >
            Run AI Diagnostic
          </button>
        </div>

      </div>
    </header>
  );
};
