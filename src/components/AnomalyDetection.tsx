import React from 'react';
import { AnomalyEvent, TimeSeriesPoint } from '../types/telemetry';
import { sound } from '../utils/audio';

interface AnomalyDetectionProps {
  anomalies: AnomalyEvent[];
  forecastData: TimeSeriesPoint[];
  onTriggerAnomalyPreset: (type: 'hypoxia' | 'phDrop' | 'turbidity') => void;
  onMitigateAnomaly: (id: string) => void;
  isSimulatingStress: boolean;
}

export const AnomalyDetection: React.FC<AnomalyDetectionProps> = ({
  anomalies,
  forecastData,
  onTriggerAnomalyPreset,
  onMitigateAnomaly,
  isSimulatingStress,
}) => {
  const chartWidth = 720;
  const chartHeight = 200;
  const paddingX = 35;
  const paddingY = 25;

  const yMin = 4.0;
  const yMax = 10.0;
  const yRange = yMax - yMin;

  const getX = (idx: number) => paddingX + (idx / (forecastData.length - 1)) * (chartWidth - paddingX * 2);
  const getY = (val: number) => chartHeight - paddingY - ((val - yMin) / yRange) * (chartHeight - paddingY * 2);

  // Confidence Envelope polygon path
  const envelopePointsUpper = forecastData.map((d, i) => `${getX(i).toFixed(1)},${getY(d.predictedUpper || d.dissolvedOxygen + 0.4).toFixed(1)}`);
  const envelopePointsLower = forecastData.slice().reverse().map((d, i) => {
    const origIdx = forecastData.length - 1 - i;
    return `${getX(origIdx).toFixed(1)},${getY(d.predictedLower || d.dissolvedOxygen - 0.4).toFixed(1)}`;
  });
  const envelopePath = `M ${envelopePointsUpper.join(' L ')} L ${envelopePointsLower.join(' L ')} Z`;

  // Actual/Predicted line
  const trendPoints = forecastData.map((d, i) => `${getX(i).toFixed(1)},${getY(d.dissolvedOxygen).toFixed(1)}`);
  const trendLine = `M ${trendPoints.join(' L ')}`;

  return (
    <div id="anomalies" className="space-y-6">
      
      {/* Header and Interactive Injection Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>PREDICTIVE INFERENCE ENGINE</span>
            <span>·</span>
            <span>AUTONOMOUS FORECASTING</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            AI Anomaly Detection & Predictive Defense
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Biophysical time-series forecasting detecting pre-hypoxic respiratory stress and ionic imbalances before biomass damage occurs.
          </p>
        </div>

        {/* Anomaly Stress Test Injection Bar */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/90 border border-white/10 rounded-xl">
          <span className="text-[11px] font-mono text-slate-400 px-2 uppercase">Inject Test Stress:</span>
          
          <button
            onClick={() => {
              sound.playChime('alert');
              onTriggerAnomalyPreset('hypoxia');
            }}
            disabled={isSimulatingStress}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              isSimulatingStress
                ? 'bg-rose-950/60 text-rose-300 border border-rose-500/50 animate-pulse cursor-not-allowed'
                : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
            }`}
          >
            Hypoxia Crash
          </button>

          <button
            onClick={() => {
              sound.playChime('alert');
              onTriggerAnomalyPreset('phDrop');
            }}
            disabled={isSimulatingStress}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 transition-all"
          >
            pH Acid Shock
          </button>

          <button
            onClick={() => {
              sound.playChime('alert');
              onTriggerAnomalyPreset('turbidity');
            }}
            disabled={isSimulatingStress}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 transition-all"
          >
            Biofloc Spike
          </button>
        </div>
      </div>

      {/* Grid: Predictive Forecast Canvas + Active Anomaly Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 7 Cols Predictive Trajectory Envelope */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
                6-Hour Dissolved Oxygen Predictive Trajectory
              </h3>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                98.8% Confidence Band
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Continuous neural projection integrating diurnal phytoplankton respiration, solar irradiance, and active aeration output.
            </p>
          </div>

          {/* SVG Forecast Envelope */}
          <div className="relative w-full h-[220px]">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="envelopeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.03" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[4.0, 6.0, 8.0, 10.0].map((v) => (
                <g key={v}>
                  <line
                    x1={paddingX}
                    y1={getY(v)}
                    x2={chartWidth - paddingX}
                    y2={getY(v)}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="3 3"
                  />
                  <text x={paddingX - 8} y={getY(v) + 3} textAnchor="end" className="text-[9px] fill-slate-500 font-mono">
                    {v.toFixed(1)}
                  </text>
                </g>
              ))}

              {/* Safe baseline horizontal line (6.5 mg/L) */}
              <line
                x1={paddingX}
                y1={getY(6.5)}
                x2={chartWidth - paddingX}
                y2={getY(6.5)}
                stroke="#10B981"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.6"
              />
              <text x={chartWidth - paddingX} y={getY(6.5) - 6} textAnchor="end" className="text-[9px] fill-emerald-400 font-mono">
                Min Biological Safe Baseline: 6.5 mg/L
              </text>

              {/* Shaded Confidence Envelope */}
              <path d={envelopePath} fill="url(#envelopeGrad)" />

              {/* Predicted DO Path */}
              <path
                d={trendLine}
                fill="none"
                stroke="#06B6D4"
                strokeWidth="2.5"
                strokeDasharray="5 3"
              />

              {/* Data points */}
              {forecastData.map((d, i) => (
                <circle
                  key={i}
                  cx={getX(i)}
                  cy={getY(d.dissolvedOxygen)}
                  r="3.5"
                  fill={d.isAnomaly ? '#EF4444' : '#06B6D4'}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-cyan-400/30 border border-cyan-400" />
              <span>Projected Respiratory Consumption Model</span>
            </span>
            <span className="font-mono text-cyan-300">Mean Squared Error: 0.014</span>
          </div>
        </div>

        {/* Right: 5 Cols Active Anomaly Events & Mitigation */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-semibold text-white">
              Detected Anomaly Incidents ({anomalies.length})
            </h3>
            <span className="text-xs text-slate-400 font-mono">Auto-Resolving</span>
          </div>

          {anomalies.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center text-slate-400">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-200">All Parameters In Equilibrium</p>
              <p className="text-xs mt-1 text-slate-400">No biophysical anomalies detected in the last 24 hours.</p>
            </div>
          ) : (
            anomalies.map((anom) => (
              <div
                key={anom.id}
                className="glass-card rounded-xl p-4 border border-white/10 hover:border-cyan-500/40 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        anom.severity === 'critical' ? 'bg-rose-500' : anom.severity === 'warning' ? 'bg-amber-400' : 'bg-cyan-400'
                      }`} />
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                        {anom.parameter}
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                      Detected: <strong className="text-rose-300">{anom.detectedValue}</strong> ({anom.threshold})
                    </span>
                  </div>

                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-medium ${
                    anom.status === 'resolved' 
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                  }`}>
                    {anom.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-slate-400">Root Cause:</strong> {anom.rootCause}
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-cyan-300">
                    Impact: <strong className="font-mono text-white">{anom.impactScore}/100</strong>
                  </span>

                  {anom.status !== 'resolved' && (
                    <button
                      onClick={() => {
                        sound.playChime('success');
                        onMitigateAnomaly(anom.id);
                      }}
                      className="px-3 py-1 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Deploy Countermeasure
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
