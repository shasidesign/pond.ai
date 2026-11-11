import React from 'react';
import { PondMetrics, MetricReading } from '../types/telemetry';
import { sound } from '../utils/audio';

interface MetricCardsProps {
  metrics: PondMetrics;
  pondName: string;
  onSelectMetric: (metricKey: string) => void;
  selectedMetricKey: string;
}

// Mini SVG Sparkline generator
const Sparkline: React.FC<{ data: number[]; color: string; height?: number }> = ({ data, color, height = 32 }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const padding = 2;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <svg className="w-full overflow-visible" height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {/* subtle dot on latest point */}
      {data.length > 0 && (
        <circle
          cx={(width - padding).toFixed(1)}
          cy={(height - padding - ((data[data.length - 1] - min) / range) * (height - padding * 2)).toFixed(1)}
          r="3"
          fill={color}
        />
      )}
    </svg>
  );
};

export const MetricCards: React.FC<MetricCardsProps> = ({
  metrics,
  pondName,
  onSelectMetric,
  selectedMetricKey,
}) => {
  const [showSecondary, setShowSecondary] = React.useState(false);

  // Status badge styling
  const getStatusBadge = (status: 'optimal' | 'warning' | 'critical', label: string) => {
    if (status === 'critical') {
      return (
        <span className="text-[11px] font-medium text-rose-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          {label}
        </span>
      );
    }
    if (status === 'warning') {
      return (
        <span className="text-[11px] font-medium text-amber-300 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          {label}
        </span>
      );
    }
    return (
      <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        {label}
      </span>
    );
  };

  const renderCard = (
    key: string,
    title: string,
    reading: MetricReading,
    color: string,
    icon: React.ReactNode,
    unitDisplay?: string,
    targetRange?: string
  ) => {
    const isSelected = selectedMetricKey === key;

    return (
      <div
        key={key}
        onClick={() => {
          sound.playClick();
          onSelectMetric(key);
        }}
        className={`group relative cursor-pointer rounded-2xl p-5 transition-all duration-200 glass-card glass-card-hover ${
          isSelected 
            ? 'border-cyan-400/60 ring-1 ring-cyan-400/30 shadow-lg shadow-cyan-950/50' 
            : 'hover:border-white/20'
        }`}
      >
        {/* Subtle top indicator bar */}
        <div 
          className="absolute top-0 left-6 right-6 h-[2px] rounded-full transition-opacity opacity-0 group-hover:opacity-100"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        />

        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ backgroundColor: `${color}18`, color }}
            >
              {icon}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                {title}
              </h3>
              <span className="text-[11px] text-slate-400 font-normal">
                Target: {targetRange || `${reading.optimalMin}–${reading.optimalMax} ${reading.unit}`}
              </span>
            </div>
          </div>
          {getStatusBadge(reading.status, reading.statusLabel)}
        </div>

        {/* Current Reading Big Numeric Display */}
        <div className="mt-2 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono tracking-tight text-white tabular-nums">
              {reading.current.toFixed(reading.unit === '°C' || reading.unit === 'NTU' ? 1 : 2)}
            </span>
            <span className="text-xs font-mono text-slate-400 uppercase font-medium">
              {unitDisplay || reading.unit}
            </span>
          </div>

          {/* 24h Trend */}
          <div className="flex items-center gap-1 text-xs font-mono tabular-nums">
            {reading.trend24h > 0 ? (
              <span className="text-emerald-400 flex items-center">
                ↑ +{reading.trend24h.toFixed(1)}%
              </span>
            ) : reading.trend24h < 0 ? (
              <span className="text-rose-400 flex items-center">
                ↓ {reading.trend24h.toFixed(1)}%
              </span>
            ) : (
              <span className="text-slate-400">0.0%</span>
            )}
          </div>
        </div>

        {/* Micro Sparkline */}
        <div className="mt-4 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-1">
            <span>24h Trajectory</span>
            <span>Live Trend</span>
          </div>
          <Sparkline data={reading.history} color={color} height={28} />
        </div>

        {/* Range Progress Bar */}
        <div className="mt-3">
          <div className="h-1.5 w-full bg-slate-800/80 rounded-full overflow-hidden relative">
            {/* Safety band */}
            <div 
              className="absolute top-0 bottom-0 bg-emerald-500/20"
              style={{
                left: `${((reading.optimalMin - reading.min) / (reading.max - reading.min)) * 100}%`,
                width: `${((reading.optimalMax - reading.optimalMin) / (reading.max - reading.min)) * 100}%`,
              }}
            />
            {/* Current marker */}
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(0, ((reading.current - reading.min) / (reading.max - reading.min)) * 100))}%`,
                backgroundColor: color,
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Water Health Score Card with circular gauge
  const renderHealthScoreCard = () => {
    const score = metrics.healthScore;
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const isSelected = selectedMetricKey === 'healthScore';

    return (
      <div
        onClick={() => {
          sound.playClick();
          onSelectMetric('healthScore');
        }}
        className={`group relative cursor-pointer rounded-2xl p-5 transition-all duration-200 glass-card glass-card-hover flex flex-col justify-between ${
          isSelected 
            ? 'border-emerald-400/60 ring-1 ring-emerald-400/30 shadow-lg shadow-emerald-950/50' 
            : 'hover:border-white/20'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                Water Health Score
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">Composite Biosecurity Index</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
            {score >= 95 ? 'Prime' : score >= 85 ? 'Nominal' : 'Guarded'}
          </span>
        </div>

        {/* Circular SVG Gauge */}
        <div className="my-3 flex items-center justify-between">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="7"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#scoreGradient)"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold font-mono tracking-tight text-white tabular-nums">
                {score.toFixed(1)}
              </span>
              <span className="text-[9px] text-slate-400 uppercase font-mono">/100</span>
            </div>
          </div>

          <div className="flex-1 pl-4 space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Biomass Risk</span>
              <span className="font-mono text-emerald-400 font-medium">0.02 (Minimal)</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Stability Margin</span>
              <span className="font-mono text-cyan-300 font-medium">98.4%</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Microbial Balance</span>
              <span className="font-mono text-slate-200 font-medium">Optimal</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 pt-2 border-t border-white/5 flex items-center justify-between">
          <span>Active Baselines: <strong className="text-slate-200">Aeration VFD Active</strong></span>
          <span className="text-cyan-400 group-hover:underline">Deep Analysis →</span>
        </div>
      </div>
    );
  };

  return (
    <div id="telemetry" className="space-y-6">
      
      {/* Section Header with Pond Context and View Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>LIVE TELEMETRY STREAM</span>
            <span>·</span>
            <span>SENSOR POLLING 3,000ms</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Live Water Quality Indices
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Calibrated telemetry streaming from optical multi-parameter probes in <strong className="text-slate-200">{pondName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              setShowSecondary(!showSecondary);
            }}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-white/10 hover:border-cyan-400/40 bg-slate-900/60 text-slate-300 hover:text-white transition-colors"
          >
            {showSecondary ? 'Show Primary Metrics' : 'Toggle Secondary Probes (Ammonia, Salinity, ORP)'}
          </button>
        </div>
      </div>

      {/* Primary 5 Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Water Health Score */}
        {renderHealthScoreCard()}

        {/* 2. Dissolved Oxygen (DO) */}
        {renderCard(
          'dissolvedOxygen',
          'Dissolved Oxygen',
          metrics.dissolvedOxygen,
          '#06B6D4',
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>,
          'mg/L'
        )}

        {/* 3. Water Temperature */}
        {renderCard(
          'temperature',
          'Water Temp',
          metrics.temperature,
          '#F59E0B',
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
          </svg>,
          '°C'
        )}

        {/* 4. pH Equilibrium */}
        {renderCard(
          'ph',
          'pH Level',
          metrics.ph,
          '#10B981',
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
          </svg>,
          'pH'
        )}

        {/* 5. Turbidity */}
        {renderCard(
          'turbidity',
          'Turbidity',
          metrics.turbidity,
          '#818CF8',
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>,
          'NTU'
        )}
      </div>

      {/* Secondary Parameters Expansion */}
      {showSecondary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {renderCard(
            'ammonia',
            'Total Ammonia Nitrogen',
            metrics.ammonia,
            '#F43F5E',
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>,
            'mg/L NH3'
          )}
          {renderCard(
            'salinity',
            'Water Salinity',
            metrics.salinity,
            '#38BDF8',
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
              <path d="M2 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
            </svg>,
            'ppt'
          )}
          {renderCard(
            'orp',
            'Oxidation-Reduction (ORP)',
            metrics.orp,
            '#A855F7',
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>,
            'mV'
          )}
        </div>
      )}

    </div>
  );
};
