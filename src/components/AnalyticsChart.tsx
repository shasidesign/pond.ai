import React, { useState } from 'react';
import { TimeSeriesPoint } from '../types/telemetry';
import { sound } from '../utils/audio';

interface AnalyticsChartProps {
  data: TimeSeriesPoint[];
  timeframe: '1H' | '24H' | '7D' | '30D';
  setTimeframe: (tf: '1H' | '24H' | '7D' | '30D') => void;
  selectedMetric: string;
  setSelectedMetric: (m: string) => void;
  pondName: string;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  data,
  timeframe,
  setTimeframe,
  selectedMetric,
  setSelectedMetric,
  pondName,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Metric configurations
  const metricConfigs: Record<string, { label: string; unit: string; color: string; stopColor: string; minSafe: number; maxSafe: number; yMin: number; yMax: number }> = {
    dissolvedOxygen: {
      label: 'Dissolved Oxygen',
      unit: 'mg/L',
      color: '#06B6D4', // Cyan
      stopColor: '#0891B2',
      minSafe: 6.5,
      maxSafe: 9.5,
      yMin: 4.0,
      yMax: 10.0,
    },
    temperature: {
      label: 'Water Temperature',
      unit: '°C',
      color: '#F59E0B', // Amber
      stopColor: '#D97706',
      minSafe: 13.0,
      maxSafe: 17.0,
      yMin: 10.0,
      yMax: 22.0,
    },
    ph: {
      label: 'pH Equilibrium',
      unit: 'pH',
      color: '#10B981', // Emerald
      stopColor: '#059669',
      minSafe: 7.2,
      maxSafe: 7.8,
      yMin: 6.5,
      yMax: 8.5,
    },
    turbidity: {
      label: 'Turbidity (Light Penetration)',
      unit: 'NTU',
      color: '#818CF8', // Indigo
      stopColor: '#6366F1',
      minSafe: 1.0,
      maxSafe: 6.0,
      yMin: 0.0,
      yMax: 12.0,
    },
    healthScore: {
      label: 'Composite Biosecurity Score',
      unit: '/100',
      color: '#10B981',
      stopColor: '#06B6D4',
      minSafe: 85,
      maxSafe: 100,
      yMin: 70,
      yMax: 100,
    },
  };

  const currentConfig = metricConfigs[selectedMetric] || metricConfigs.dissolvedOxygen;

  // Chart dimension definitions
  const chartWidth = 900;
  const chartHeight = 280;
  const paddingX = 40;
  const paddingY = 24;

  const yMin = currentConfig.yMin;
  const yMax = currentConfig.yMax;
  const yRange = yMax - yMin;

  const getX = (index: number) => {
    return paddingX + (index / (data.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (value: number) => {
    const clamped = Math.max(yMin, Math.min(yMax, value));
    return chartHeight - paddingY - ((clamped - yMin) / yRange) * (chartHeight - paddingY * 2);
  };

  // Generate SVG path strings
  const points = data.map((d, i) => {
    const val = (d as unknown as Record<string, number>)[selectedMetric] ?? d.dissolvedOxygen;
    return `${getX(i).toFixed(1)},${getY(val).toFixed(1)}`;
  });

  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `${linePath} L ${getX(data.length - 1).toFixed(1)},${(chartHeight - paddingY).toFixed(1)} L ${getX(0).toFixed(1)},${(chartHeight - paddingY).toFixed(1)} Z`;

  // Safe zone rect coordinates
  const safeZoneTop = getY(currentConfig.maxSafe);
  const safeZoneBottom = getY(currentConfig.minSafe);
  const safeZoneHeight = Math.max(0, safeZoneBottom - safeZoneTop);

  const activePoint = hoverIndex !== null && data[hoverIndex] ? data[hoverIndex] : data[data.length - 1];
  const activeValue = activePoint ? (activePoint as unknown as Record<string, number>)[selectedMetric] : 0;

  return (
    <div className="glass-panel rounded-2xl p-6 relative">
      
      {/* Header with Title and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>CONTINUOUS MULTI-VARIATE TIME SERIES</span>
            <span>·</span>
            <span>{pondName}</span>
          </div>
          <div className="flex items-baseline gap-3">
            <h3 className="text-xl font-bold tracking-tight text-white">
              {currentConfig.label}
            </h3>
            <span className="text-2xl font-bold font-mono tracking-tight text-cyan-400 tabular-nums">
              {activeValue.toFixed(currentConfig.unit === '°C' || currentConfig.unit === 'NTU' ? 1 : 2)}{' '}
              <span className="text-sm font-sans font-normal text-slate-400">{currentConfig.unit}</span>
            </span>
          </div>
        </div>

        {/* Timeframe Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-white/10">
            {(['dissolvedOxygen', 'temperature', 'ph', 'turbidity', 'healthScore'] as const).map((mKey) => (
              <button
                key={mKey}
                onClick={() => {
                  sound.playClick();
                  setSelectedMetric(mKey);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
                  selectedMetric === mKey
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mKey === 'dissolvedOxygen' ? 'D.O.' : mKey === 'temperature' ? 'Temp' : mKey === 'ph' ? 'pH' : mKey === 'turbidity' ? 'Turbidity' : 'Health'}
              </button>
            ))}
          </div>

          {/* Timeframe Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-white/10">
            {(['1H', '24H', '7D', '30D'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  sound.playClick();
                  setTimeframe(tf);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
                  timeframe === tf
                    ? 'bg-white text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart Viewport */}
      <div className="relative w-full h-[300px] overflow-hidden select-none">
        
        {/* Scrubber Tooltip when hovering */}
        {hoverIndex !== null && activePoint && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 rounded-lg bg-slate-900/95 border border-cyan-400/40 shadow-xl backdrop-blur-md text-xs font-mono"
            style={{
              left: `${(getX(hoverIndex) / chartWidth) * 100}%`,
              top: `${(getY(activeValue) / chartHeight) * 100}%`,
            }}
          >
            <div className="text-[10px] text-slate-400">{activePoint.timeLabel}</div>
            <div className="text-white font-bold text-sm">
              {activeValue.toFixed(2)} {currentConfig.unit}
            </div>
            <div className="text-[10px] text-emerald-400">
              Safe Zone: {currentConfig.minSafe}–{currentConfig.maxSafe} {currentConfig.unit}
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * chartWidth;
            const step = (chartWidth - paddingX * 2) / (data.length - 1);
            const index = Math.round((relX - paddingX) / step);
            if (index >= 0 && index < data.length) {
              setHoverIndex(index);
            }
          }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={currentConfig.color} stopOpacity="0.32" />
              <stop offset="90%" stopColor={currentConfig.stopColor} stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={currentConfig.color} />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = paddingY + pct * (chartHeight - paddingY * 2);
            const val = yMax - pct * yRange;
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[9px] fill-slate-500 font-mono"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* Safe Threshold Band */}
          <rect
            x={paddingX}
            y={safeZoneTop}
            width={chartWidth - paddingX * 2}
            height={safeZoneHeight}
            fill="rgba(16, 185, 129, 0.05)"
            stroke="rgba(16, 185, 129, 0.2)"
            strokeDasharray="3 3"
          />

          {/* Area Fill */}
          <path d={areaPath} fill="url(#areaGradient)" />

          {/* Telemetry Line */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Scrubber vertical guide line */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={paddingY}
                x2={getX(hoverIndex)}
                y2={chartHeight - paddingY}
                stroke="rgba(6, 182, 212, 0.6)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(activeValue)}
                r="5"
                fill="#06B6D4"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Time axis labels */}
          {data.map((d, i) => {
            if (i % Math.ceil(data.length / 6) === 0 || i === data.length - 1) {
              return (
                <text
                  key={i}
                  x={getX(i)}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {d.timeLabel}
                </text>
              );
            }
            return null;
          })}
        </svg>
      </div>

      {/* Chart Footer with Safe Band Legend and Context */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/40" />
            <span>Optimal Biological Safety Envelope ({currentConfig.minSafe}–{currentConfig.maxSafe} {currentConfig.unit})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-cyan-400" />
            <span>Real-Time Sensor Track</span>
          </div>
        </div>

        <div className="font-mono text-[11px] text-slate-400">
          NIST Calibrated Probe · Sampling rate 10Hz
        </div>
      </div>

    </div>
  );
};
