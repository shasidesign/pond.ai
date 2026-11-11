import React from 'react';
import { sound } from '../utils/audio';

interface HardwareBuoyModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeBuoyId: string;
}

export const HardwareBuoyModal: React.FC<HardwareBuoyModalProps> = ({
  isOpen,
  onClose,
  activeBuoyId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel rounded-2xl border border-white/15 p-6 sm:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Close Hardware Modal"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>PHYSICAL TELEMETRY HARDWARE SPECIFICATION</span>
            <span>·</span>
            <span>NIST TRACEABLE</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            AquaSense Mod-4 Smart Telemetry Buoy
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Autonomous multi-parameter optical and electrochemical water monitoring station assigned to Buoy <span className="text-cyan-300 font-mono font-semibold">{activeBuoyId}</span>.
          </p>
        </div>

        {/* Visual Showcase: Dual Photography */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          <div className="relative rounded-xl overflow-hidden border border-white/10 group">
            <img
              src="/src/assets/images/pond_telemetry_buoy_1794371983347.jpg"
              alt="AquaSense Mod-4 Smart Telemetry Buoy deployed in pond water"
              referrerPolicy="no-referrer"
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-xs">
              <span className="font-semibold text-white block">Field Deployment: In-Pond Buoy</span>
              <span className="text-[11px] text-cyan-300">Submerged optical luminescent DO & pH probe cluster</span>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-white/10 group">
            <img
              src="/src/assets/images/smart_aquaculture_facility_1794371984731.jpg"
              alt="Modern Recirculating Aquaculture System (RAS) facility"
              referrerPolicy="no-referrer"
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-xs">
              <span className="font-semibold text-white block">Facility Integration: RAS Hub</span>
              <span className="text-[11px] text-emerald-300">Automated biofiltration and dissolved ozone recovery</span>
            </div>
          </div>

        </div>

        {/* Probe Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-cyan-400 block uppercase">Optical D.O. Probe</span>
            <h4 className="text-xs font-bold text-white">Luminescence Lifetime</h4>
            <p className="text-[11px] text-slate-300 leading-normal">
              Zero membrane degradation. No electrolyte refill required. ±0.1 mg/L precision across 0–20 mg/L.
            </p>
            <span className="text-[10px] text-emerald-400 font-mono block">Status: Calibrated (99.8%)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 block uppercase">Glass pH Electrode</span>
            <h4 className="text-xs font-bold text-white">Differential Gel-Filled</h4>
            <p className="text-[11px] text-slate-300 leading-normal">
              Integrated motorized wiper sweeps probe head every 15 minutes to eliminate biofloc fouling.
            </p>
            <span className="text-[10px] text-emerald-400 font-mono block">Status: Wiper Active</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-indigo-400 block uppercase">Nephelometric Turbidity</span>
            <h4 className="text-xs font-bold text-white">90° Light Scatter</h4>
            <p className="text-[11px] text-slate-300 leading-normal">
              Infrared LED source (860nm) complies with ISO 7027 standards. Unaffected by pond algae hue.
            </p>
            <span className="text-[10px] text-emerald-400 font-mono block">Status: Clean Chamber</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono text-amber-400 block uppercase">Telemetry Uplink</span>
            <h4 className="text-xs font-bold text-white">LoRaWAN + LTE-M</h4>
            <p className="text-[11px] text-slate-300 leading-normal">
              15km marine range LoRa gateway with automatic fallback to satellite / cellular band.
            </p>
            <span className="text-[10px] text-emerald-400 font-mono block">Uptime: 99.994%</span>
          </div>

        </div>

        {/* Power & Diagnostics Footer */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Battery: 98% (Solar Harvesting Active)
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300 font-mono">Signal: -68 dBm (Strong)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playChime('nominal');
                alert(`Triggering diagnostic self-test and anti-fouling wiper cycle for ${activeBuoyId}.`);
              }}
              className="px-3 py-1.5 font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
            >
              Run Hardware Self-Test
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-3 py-1.5 font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
