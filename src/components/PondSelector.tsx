import React from 'react';
import { PondInfo } from '../types/telemetry';
import { sound } from '../utils/audio';

interface PondSelectorProps {
  ponds: PondInfo[];
  selectedPondId: string;
  onSelectPond: (pondId: string) => void;
}

export const PondSelector: React.FC<PondSelectorProps> = ({
  ponds,
  selectedPondId,
  onSelectPond,
}) => {
  return (
    <div className="w-full bg-slate-900/60 border-y border-white/5 backdrop-blur-md py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Section Label */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            Active Pond Basin:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {ponds.map((pond) => {
              const isSelected = pond.id === selectedPondId;
              const isWarning = pond.metrics.healthScore < 95;

              return (
                <button
                  key={pond.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectPond(pond.id);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap shrink-0 transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400/50 text-white shadow-sm shadow-cyan-950/60 ring-1 ring-cyan-400/20'
                      : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    isWarning ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                  <span className="font-semibold">{pond.name.split(' ')[0]} {pond.name.split(' ')[1]}</span>
                  <span className="text-[10px] font-mono opacity-60">
                    ({pond.metrics.healthScore.toFixed(0)}/100)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Basin Quick Biomass & Aerator Status */}
        {(() => {
          const currentPond = ponds.find((p) => p.id === selectedPondId) || ponds[0];
          return (
            <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="text-slate-500">Species:</span>
                <span className="text-slate-200 font-sans italic">{currentPond.species.split('(')[0]}</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5">
                <span className="text-slate-500">Biomass:</span>
                <span className="text-cyan-300 font-bold">{(currentPond.biomassKg / 1000).toFixed(1)} MT</span>
              </span>
              <span className="text-slate-600">·</span>
              <span className="flex items-center gap-1.5">
                <span className="text-slate-500">Aeration:</span>
                <span className="text-emerald-400 capitalize">{currentPond.aeratorCount} Units ({currentPond.aeratorStatus})</span>
              </span>
            </div>
          );
        })()}

      </div>
    </div>
  );
};
