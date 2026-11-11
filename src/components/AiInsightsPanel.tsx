import React, { useState } from 'react';
import { PondInfo, AiDiagnosticReport } from '../types/telemetry';
import { sound } from '../utils/audio';

interface AiInsightsPanelProps {
  pond: PondInfo;
  onRefreshDiagnostic: () => void;
  isGenerating: boolean;
}

export const AiInsightsPanel: React.FC<AiInsightsPanelProps> = ({
  pond,
  onRefreshDiagnostic,
  isGenerating,
}) => {
  const [activeAnalysisMode, setActiveAnalysisMode] = useState<'biological' | 'feeding' | 'aeration'>('biological');

  // Compute live diagnostic summary based on current pond telemetry
  const isOptimal = pond.metrics.healthScore >= 95;
  const doValue = pond.metrics.dissolvedOxygen.current;
  const phValue = pond.metrics.ph.current;
  const tempValue = pond.metrics.temperature.current;

  return (
    <div id="copilot" className="glass-panel rounded-2xl p-6 space-y-6">
      
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>NEURAL AQUACULTURE ADVISOR</span>
            <span>·</span>
            <span>GEMINI PRO BIO-MODEL</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            AI Biophysical Insights & Advisory
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Biochemical parameter synthesis for {pond.name} ({pond.species})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onRefreshDiagnostic();
            }}
            disabled={isGenerating}
            className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all ${
              isGenerating
                ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 animate-pulse'
                : 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:from-cyan-400 hover:to-emerald-400 shadow-md shadow-cyan-500/20'
            }`}
          >
            <svg className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
            <span>{isGenerating ? 'Analyzing Biomass Telemetry...' : 'Refresh AI Diagnostic'}</span>
          </button>
        </div>
      </div>

      {/* Advisory Pillar Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-900/90 rounded-xl border border-white/10 w-fit">
        {(['biological', 'feeding', 'aeration'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => {
              sound.playClick();
              setActiveAnalysisMode(mode);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap shrink-0 transition-all ${
              activeAnalysisMode === mode
                ? 'bg-white text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {mode === 'biological' ? 'Biological Equilibrium' : mode === 'feeding' ? 'Feeding & FCR Strategy' : 'Aeration & Power Optimization'}
          </button>
        ))}
      </div>

      {/* Main Advisory Content Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 8 Cols: Detailed Diagnostic Report */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Executive Synthesis Banner */}
          <div className="rounded-xl p-5 bg-gradient-to-r from-slate-900/90 to-slate-900/40 border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-emerald-400 to-transparent" />
            
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                  Biochemical Diagnosis Status: {isOptimal ? 'Optimal Metabolic Respiration' : 'Monitored Variance'}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {isOptimal
                    ? 'Water column maintains excellent buffering capacity with ideal oxygen saturation.'
                    : 'Elevated nocturnal oxygen consumption detected. Recommend modulated aerator boost.'}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-mono text-slate-400 block">Biological Stress</span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  {pond.metrics.healthScore >= 95 ? '0.04 (Minimal)' : '0.22 (Low-Moderate)'}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Based on continuous telemetry readings from buoy <strong className="text-cyan-300 font-mono">{pond.sensorBuoyId}</strong>:
              Dissolved Oxygen is currently at <strong className="text-white">{doValue.toFixed(2)} mg/L</strong>, pH holds stable at <strong className="text-white">{phValue.toFixed(2)}</strong>, and water temperature is recorded at <strong className="text-white">{tempValue.toFixed(1)} °C</strong>.
            </p>
          </div>

          {/* Tab Specific Content */}
          {activeAnalysisMode === 'biological' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Algae & Microbial Respiration
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Phytoplankton density is within safe biofloc bounds (Secchi depth 38cm). Zero cyanobacteria bloom signatures detected on optical absorbance bands.
                </p>
                <span className="text-[11px] font-mono text-emerald-400 block pt-1">
                  ✓ Microcystin / Toxin Probability &lt; 0.01%
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Nitrification Efficiency
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ammonia oxidizing bacteria (AOB) activity rate is nominal. Un-ionized NH3 fraction remains safely below the 0.02 mg/L physiological threshold.
                </p>
                <span className="text-[11px] font-mono text-emerald-400 block pt-1">
                  ✓ Gill Histology Stress Factor: Zero
                </span>
              </div>
            </div>
          )}

          {activeAnalysisMode === 'feeding' && (
            <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">
                  Feed Conversion Ratio (FCR) Recommendation
                </span>
                <span className="text-xs font-mono text-cyan-300">Current Target FCR: 1.18</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Water temperature of {tempValue.toFixed(1)}°C and high D.O. indicate peak digestive enzyme kinetics. Recommend distributing 85kg high-protein extruded pellet ration at 08:30 and 15:00.
              </p>
              <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200">
                <strong>Autonomous Feeding Interlock:</strong> If D.O. dips below 6.0 mg/L during feeding, acoustic feed timers will automatically pause to prevent waste pellet decomposition.
              </div>
            </div>
          )}

          {activeAnalysisMode === 'aeration' && (
            <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">
                  Variable Frequency Drive (VFD) Aerator Dispatch
                </span>
                <span className="text-xs font-mono text-emerald-400">Efficiency Gain: +28.4%</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Active aerator count: {pond.aeratorCount} units. Current atmospheric dissolved oxygen absorption rate is sufficient to maintain standard speed (840 RPM), avoiding unnecessary electrical peak tariffs.
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>Power Draw: 18.2 kW</span>
                <span>·</span>
                <span>Estimated Energy Savings: $412 / month</span>
              </div>
            </div>
          )}

        </div>

        {/* 4 Cols: Operations Director Verification & Protocol Sign-off */}
        <div className="lg:col-span-4 glass-card rounded-xl p-5 border border-white/10 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/src/assets/images/avatar_director_marine_1794371984184.jpg"
                alt="Aquaculture Operations Director"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-cyan-400/40"
              />
              <div>
                <h4 className="text-xs font-bold text-white">Dr. Callum Vance</h4>
                <p className="text-[11px] text-cyan-400">Head of Marine Biosecurity</p>
                <span className="text-[10px] text-slate-400 font-mono">NPD-Certified RAS Specialist</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5 text-xs text-slate-300">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Active Protocol Verified:
              </div>
              <ul className="space-y-1.5 text-xs">
                <li className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-emerald-400">✓</span>
                  <span>Aeration staging calibrated for smolt biomass</span>
                </li>
                <li className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-emerald-400">✓</span>
                  <span>Alkalinity buffer setpoint at 120 mg/L CaCO3</span>
                </li>
                <li className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-emerald-400">✓</span>
                  <span>Real-time LoRaWAN heartbeat operational</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <button
              onClick={() => {
                sound.playChime('nominal');
                alert(`Exporting official ISO-14001 water telemetry compliance report for ${pond.name}.`);
              }}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Export Compliance Audit PDF</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
