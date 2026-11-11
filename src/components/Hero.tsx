import React from 'react';
import { sound } from '../utils/audio';

interface HeroProps {
  onExploreClick: () => void;
  onSimulateAnomaly: () => void;
  onOpenHardwareModal: () => void;
  activePondName: string;
  totalBiomassKg: number;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onSimulateAnomaly,
  onOpenHardwareModal,
  activePondName,
  totalBiomassKg,
}) => {
  return (
    <section id="top" className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden border-b border-white/10">
      
      {/* Background Aerial Drone Image with Cinematic Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_aquaculture_drone_1794371982774.jpg"
          alt="Aerial drone photograph of high-tech aquaculture ponds at sunrise"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 transform animate-pulse duration-[12000ms]"
        />
        {/* Layered Gradient Overlays for Stripe/Apple grade contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
        <div className="absolute inset-0 bg-radial-at-c from-cyan-950/30 via-slate-950/60 to-slate-950/95" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 flex-1 flex flex-col justify-center">
        
        {/* Subtle unboxed kicker adhering to zero-pill rule */}
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 tracking-wider mb-6">
          <span className="uppercase tracking-widest text-emerald-400 font-semibold">Autonomous Biosecurity</span>
          <span className="text-slate-500" aria-hidden="true">·</span>
          <span>Next-Gen Dissolved Oxygen Telemetry</span>
          <span className="text-slate-500" aria-hidden="true">·</span>
          <span>Zero-Mortality Assurance</span>
        </div>

        {/* Primary Headline */}
        <h1 
          className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.08] max-w-4xl"
          style={{ textWrap: 'balance' }}
        >
          AI-Powered <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">
            Pond Intelligence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-300 font-normal max-w-2xl leading-relaxed mb-10">
          Autonomous water quality monitoring, real-time biochemical telemetry, and predictive anomaly detection. Stabilizing dissolved oxygen, pH buffers, and biofloc health before anomalies disrupt biomass yield.
        </p>

        {/* Call-to-Action Group */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onExploreClick();
            }}
            className="px-6 py-3.5 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-xl hover:from-cyan-300 hover:to-emerald-300 active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2"
          >
            <span>Explore Live Dashboard</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSimulateAnomaly();
            }}
            className="px-6 py-3.5 text-sm font-medium text-white bg-slate-900/80 hover:bg-slate-800/90 border border-white/15 hover:border-cyan-400/50 rounded-xl backdrop-blur-md transition-all flex items-center gap-2 group"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:bg-amber-300 transition-colors" />
            <span>Simulate Anomaly Stress Test</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenHardwareModal();
            }}
            className="px-5 py-3.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            Inspect IoT Buoy Fleet →
          </button>
        </div>

        {/* Quiet contextual note */}
        <div className="mt-8 flex items-center gap-3 text-xs text-slate-400">
          <span>Active Focus: <strong className="text-slate-200 font-medium">{activePondName}</strong></span>
          <span aria-hidden="true">·</span>
          <span>Total Managed Biomass: <strong className="text-cyan-300 font-mono">{(totalBiomassKg / 1000).toFixed(1)} Metric Tons</strong></span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-400">All Probes Calibrated (NIST Traceable)</span>
        </div>

      </div>

      {/* 4-Column KPI Trust Strip */}
      <div className="relative z-10 w-full bg-slate-950/70 border-t border-white/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Continuous Telemetry</span>
            <span className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums mt-0.5">
              1,280,000 <span className="text-xs text-slate-400 font-sans font-normal">Gallons Monitored</span>
            </span>
            <span className="text-[11px] text-cyan-400 mt-1">Multi-species raceways & RAS</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Dissolved Oxygen Stability</span>
            <span className="text-2xl font-bold font-mono text-emerald-400 tracking-tight tabular-nums mt-0.5">
              ±0.08 <span className="text-xs text-slate-400 font-sans font-normal">mg/L Drift</span>
            </span>
            <span className="text-[11px] text-slate-400 mt-1">Autonomous paddlewheel variable VFD</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Predictive Anomaly Shield</span>
            <span className="text-2xl font-bold font-mono text-cyan-300 tracking-tight tabular-nums mt-0.5">
              99.98% <span className="text-xs text-slate-400 font-sans font-normal">Pre-Hypoxia Catch</span>
            </span>
            <span className="text-[11px] text-slate-400 mt-1">45-minute early warning horizon</span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Telemetry Sampling</span>
            <span className="text-2xl font-bold font-mono text-white tracking-tight tabular-nums mt-0.5">
              0.04s <span className="text-xs text-slate-400 font-sans font-normal">Edge Latency</span>
            </span>
            <span className="text-[11px] text-slate-400 mt-1">Optical luminescence & LoRaWAN</span>
          </div>

        </div>
      </div>

    </section>
  );
};
