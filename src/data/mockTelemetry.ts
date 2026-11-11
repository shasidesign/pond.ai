import { PondInfo, TimeSeriesPoint, AnomalyEvent, AlertNotification } from '../types/telemetry';

export const INITIAL_PONDS: PondInfo[] = [
  {
    id: 'pond-alpha',
    name: 'Pond Alpha-1 (Salmon Raceway)',
    species: 'Salmo salar (Atlantic Salmon)',
    biomassKg: 42500,
    volumeM3: 3200,
    sensorBuoyId: 'AQ-BUOY-091A',
    lastSync: 'Just now (0.4s ago)',
    aeratorStatus: 'active',
    aeratorCount: 8,
    metrics: {
      healthScore: 97.4,
      dissolvedOxygen: {
        current: 7.85,
        unit: 'mg/L',
        min: 0,
        max: 14,
        optimalMin: 6.5,
        optimalMax: 9.5,
        trend24h: 2.1,
        status: 'optimal',
        statusLabel: '94% Saturation',
        history: [7.2, 7.35, 7.4, 7.5, 7.6, 7.55, 7.7, 7.75, 7.8, 7.82, 7.84, 7.85],
      },
      temperature: {
        current: 14.8,
        unit: '°C',
        min: 5,
        max: 30,
        optimalMin: 13.0,
        optimalMax: 16.5,
        trend24h: -0.4,
        status: 'optimal',
        statusLabel: 'Thermal Balance',
        history: [15.2, 15.1, 15.0, 14.9, 14.8, 14.7, 14.7, 14.8, 14.8, 14.8, 14.8, 14.8],
      },
      ph: {
        current: 7.42,
        unit: 'pH',
        min: 4,
        max: 10,
        optimalMin: 7.0,
        optimalMax: 7.8,
        trend24h: 0.2,
        status: 'optimal',
        statusLabel: 'Buffered Equilibrium',
        history: [7.38, 7.39, 7.4, 7.4, 7.41, 7.42, 7.41, 7.42, 7.43, 7.42, 7.42, 7.42],
      },
      turbidity: {
        current: 3.2,
        unit: 'NTU',
        min: 0,
        max: 25,
        optimalMin: 1.0,
        optimalMax: 6.0,
        trend24h: -4.8,
        status: 'optimal',
        statusLabel: 'High Transparency',
        history: [3.9, 3.8, 3.7, 3.6, 3.5, 3.4, 3.4, 3.3, 3.3, 3.2, 3.2, 3.2],
      },
      ammonia: {
        current: 0.015,
        unit: 'mg/L',
        min: 0,
        max: 0.5,
        optimalMin: 0.0,
        optimalMax: 0.05,
        trend24h: -1.2,
        status: 'optimal',
        statusLabel: 'Non-Toxic Trace',
        history: [0.018, 0.017, 0.017, 0.016, 0.016, 0.015, 0.015, 0.015, 0.015, 0.015, 0.015, 0.015],
      },
      salinity: {
        current: 28.4,
        unit: 'ppt',
        min: 0,
        max: 40,
        optimalMin: 26.0,
        optimalMax: 32.0,
        trend24h: 0.1,
        status: 'optimal',
        statusLabel: 'Marine Brackish',
        history: [28.2, 28.3, 28.3, 28.3, 28.4, 28.4, 28.4, 28.4, 28.4, 28.4, 28.4, 28.4],
      },
      orp: {
        current: 382,
        unit: 'mV',
        min: 100,
        max: 600,
        optimalMin: 320,
        optimalMax: 450,
        trend24h: 3.5,
        status: 'optimal',
        statusLabel: 'Strong Oxidation Capacity',
        history: [360, 365, 368, 370, 372, 375, 378, 379, 380, 381, 382, 382],
      },
    },
  },
  {
    id: 'pond-beta',
    name: 'Pond Beta-4 (Tiger Prawn Basin)',
    species: 'Penaeus monodon (Tiger Prawn)',
    biomassKg: 28900,
    volumeM3: 4500,
    sensorBuoyId: 'AQ-BUOY-104C',
    lastSync: '1.2s ago',
    aeratorStatus: 'boost',
    aeratorCount: 12,
    metrics: {
      healthScore: 91.8,
      dissolvedOxygen: {
        current: 6.15,
        unit: 'mg/L',
        min: 0,
        max: 14,
        optimalMin: 5.5,
        optimalMax: 8.5,
        trend24h: -3.4,
        status: 'warning',
        statusLabel: 'Nocturnal Drawdown',
        history: [6.8, 6.7, 6.6, 6.5, 6.4, 6.3, 6.25, 6.2, 6.18, 6.15, 6.14, 6.15],
      },
      temperature: {
        current: 28.2,
        unit: '°C',
        min: 15,
        max: 35,
        optimalMin: 26.0,
        optimalMax: 30.0,
        trend24h: 1.2,
        status: 'optimal',
        statusLabel: 'Tropical Warmth',
        history: [27.4, 27.6, 27.8, 28.0, 28.1, 28.2, 28.2, 28.2, 28.3, 28.2, 28.2, 28.2],
      },
      ph: {
        current: 7.95,
        unit: 'pH',
        min: 4,
        max: 10,
        optimalMin: 7.5,
        optimalMax: 8.3,
        trend24h: 0.6,
        status: 'optimal',
        statusLabel: 'Alkaline Saline',
        history: [7.85, 7.88, 7.9, 7.92, 7.94, 7.95, 7.96, 7.95, 7.95, 7.95, 7.95, 7.95],
      },
      turbidity: {
        current: 8.4,
        unit: 'NTU',
        min: 0,
        max: 25,
        optimalMin: 4.0,
        optimalMax: 12.0,
        trend24h: 5.8,
        status: 'optimal',
        statusLabel: 'Rich Biofloc Medium',
        history: [7.2, 7.5, 7.7, 7.9, 8.1, 8.2, 8.3, 8.3, 8.4, 8.4, 8.4, 8.4],
      },
      ammonia: {
        current: 0.042,
        unit: 'mg/L',
        min: 0,
        max: 0.5,
        optimalMin: 0.0,
        optimalMax: 0.05,
        trend24h: 4.1,
        status: 'warning',
        statusLabel: 'Moderate Nitrification Load',
        history: [0.032, 0.034, 0.036, 0.038, 0.039, 0.04, 0.041, 0.041, 0.042, 0.042, 0.042, 0.042],
      },
      salinity: {
        current: 19.8,
        unit: 'ppt',
        min: 0,
        max: 40,
        optimalMin: 15.0,
        optimalMax: 25.0,
        trend24h: -0.2,
        status: 'optimal',
        statusLabel: 'Optimal Crustacean Salinity',
        history: [20.0, 19.9, 19.9, 19.8, 19.8, 19.8, 19.8, 19.8, 19.8, 19.8, 19.8, 19.8],
      },
      orp: {
        current: 310,
        unit: 'mV',
        min: 100,
        max: 600,
        optimalMin: 280,
        optimalMax: 420,
        trend24h: -1.8,
        status: 'optimal',
        statusLabel: 'Adequate Bio-Potential',
        history: [325, 322, 320, 318, 315, 314, 312, 311, 310, 310, 310, 310],
      },
    },
  },
  {
    id: 'pond-delta',
    name: 'Hatchery Delta (Barramundi RAS)',
    species: 'Lates calcarifer (Barramundi)',
    biomassKg: 14200,
    volumeM3: 1100,
    sensorBuoyId: 'AQ-BUOY-210B',
    lastSync: '0.8s ago',
    aeratorStatus: 'active',
    aeratorCount: 6,
    metrics: {
      healthScore: 99.1,
      dissolvedOxygen: {
        current: 8.45,
        unit: 'mg/L',
        min: 0,
        max: 14,
        optimalMin: 7.0,
        optimalMax: 9.5,
        trend24h: 0.8,
        status: 'optimal',
        statusLabel: 'Supersaturated Pure DO',
        history: [8.1, 8.2, 8.3, 8.35, 8.4, 8.42, 8.44, 8.45, 8.45, 8.45, 8.45, 8.45],
      },
      temperature: {
        current: 27.5,
        unit: '°C',
        min: 15,
        max: 35,
        optimalMin: 26.5,
        optimalMax: 28.5,
        trend24h: 0.1,
        status: 'optimal',
        statusLabel: 'Precision Climate Control',
        history: [27.4, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5],
      },
      ph: {
        current: 7.55,
        unit: 'pH',
        min: 4,
        max: 10,
        optimalMin: 7.2,
        optimalMax: 7.8,
        trend24h: -0.1,
        status: 'optimal',
        statusLabel: 'Steady State Buffer',
        history: [7.56, 7.56, 7.55, 7.55, 7.55, 7.55, 7.55, 7.55, 7.55, 7.55, 7.55, 7.55],
      },
      turbidity: {
        current: 1.1,
        unit: 'NTU',
        min: 0,
        max: 25,
        optimalMin: 0.5,
        optimalMax: 3.0,
        trend24h: -8.3,
        status: 'optimal',
        statusLabel: 'Crystal Drum Filtered',
        history: [1.6, 1.5, 1.4, 1.3, 1.2, 1.2, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1],
      },
      ammonia: {
        current: 0.008,
        unit: 'mg/L',
        min: 0,
        max: 0.5,
        optimalMin: 0.0,
        optimalMax: 0.02,
        trend24h: -2.4,
        status: 'optimal',
        statusLabel: 'Zero Free Ammonia',
        history: [0.01, 0.009, 0.009, 0.008, 0.008, 0.008, 0.008, 0.008, 0.008, 0.008, 0.008, 0.008],
      },
      salinity: {
        current: 4.2,
        unit: 'ppt',
        min: 0,
        max: 40,
        optimalMin: 2.0,
        optimalMax: 8.0,
        trend24h: 0.0,
        status: 'optimal',
        statusLabel: 'Freshwater Nursery',
        history: [4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2, 4.2],
      },
      orp: {
        current: 412,
        unit: 'mV',
        min: 100,
        max: 600,
        optimalMin: 350,
        optimalMax: 480,
        trend24h: 4.2,
        status: 'optimal',
        statusLabel: 'Ozone Polished',
        history: [390, 395, 400, 404, 408, 410, 411, 412, 412, 412, 412, 412],
      },
    },
  },
];

export function generateTimeSeriesData(timeframe: '1H' | '24H' | '7D' | '30D', basePond: PondInfo): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  const now = new Date();

  let count = 24;
  let stepMinutes = 60;

  if (timeframe === '1H') {
    count = 20;
    stepMinutes = 3;
  } else if (timeframe === '24H') {
    count = 24;
    stepMinutes = 60;
  } else if (timeframe === '7D') {
    count = 28;
    stepMinutes = 360; // 6 hours
  } else if (timeframe === '30D') {
    count = 30;
    stepMinutes = 1440; // 1 day
  }

  const baseDO = basePond.metrics.dissolvedOxygen.current;
  const baseTemp = basePond.metrics.temperature.current;
  const basePH = basePond.metrics.ph.current;
  const baseTurb = basePond.metrics.turbidity.current;

  for (let i = count - 1; i >= 0; i--) {
    const t = new Date(now.getTime() - i * stepMinutes * 60 * 1000);
    const hour = t.getHours();
    
    // Natural diurnal sinusoidal wave: DO drops at night due to respiration, peaks in afternoon due to sun/photosynthesis
    const diurnalDO = Math.sin((hour - 8) * (Math.PI / 12)) * 0.9;
    const diurnalTemp = Math.sin((hour - 14) * (Math.PI / 12)) * 0.8;
    const noiseDO = (Math.sin(i * 1.7) * 0.12);

    const doVal = Number(Math.max(4.2, baseDO + diurnalDO + noiseDO).toFixed(2));
    const tempVal = Number((baseTemp + diurnalTemp + (Math.sin(i * 2.3) * 0.1)).toFixed(1));
    const phVal = Number((basePH + (Math.sin(hour * 0.25) * 0.12)).toFixed(2));
    const turbVal = Number(Math.max(1.0, baseTurb + (Math.sin(i * 0.8) * 0.3)).toFixed(1));

    // Calculate score
    const health = Number(Math.min(100, Math.max(70, 100 - Math.abs(doVal - 8.0) * 4 - Math.abs(phVal - 7.5) * 8 - (turbVal > 6 ? (turbVal - 6) * 3 : 0))).toFixed(1));

    let timeLabel = '';
    if (timeframe === '1H') {
      timeLabel = t.toLocaleTimeString([], { minute: '2-digit', second: '2-digit' });
    } else if (timeframe === '24H') {
      timeLabel = `${hour.toString().padStart(2, '0')}:00`;
    } else {
      timeLabel = `${t.getMonth() + 1}/${t.getDate()}`;
    }

    // Predictive trajectory for last 6 hours
    const isFuture = i < 4;
    const predictedDO = isFuture ? Number((doVal + 0.15).toFixed(2)) : undefined;
    const predictedUpper = isFuture ? Number((doVal + 0.55).toFixed(2)) : undefined;
    const predictedLower = isFuture ? Number((doVal - 0.35).toFixed(2)) : undefined;

    points.push({
      timestamp: t.toISOString(),
      timeLabel,
      dissolvedOxygen: doVal,
      temperature: tempVal,
      ph: phVal,
      turbidity: turbVal,
      healthScore: health,
      predictedDO,
      predictedUpper,
      predictedLower,
      isAnomaly: i === 7 && basePond.id === 'pond-beta', // Anomaly point in Beta
    });
  }

  return points;
}

export const INITIAL_ANOMALIES: AnomalyEvent[] = [
  {
    id: 'anom-102',
    timestamp: '18 minutes ago',
    pondId: 'pond-beta',
    parameter: 'Dissolved Oxygen (DO)',
    severity: 'warning',
    detectedValue: '5.92 mg/L',
    threshold: '< 6.00 mg/L minimum baseline',
    rootCause: 'Transient mechanical belt slip on Paddlewheel Aerator #4 during high biomass respiration cycle.',
    impactScore: 68,
    recommendedAction: 'Engage Auxiliary Submersible Jet Injector #2 and verify electrical phase draw.',
    status: 'active',
  },
  {
    id: 'anom-099',
    timestamp: '2 hours ago',
    pondId: 'pond-alpha',
    parameter: 'pH Buffering Equilibrium',
    severity: 'info',
    detectedValue: '7.68 pH',
    threshold: '> 7.65 pH diurnal ceiling',
    rootCause: 'Intense afternoon sunlight accelerated photosynthetic carbon dioxide uptake by micro-algae.',
    impactScore: 32,
    recommendedAction: 'Nominal physiological swing. Maintain standard bicarbonate dosing schedule.',
    status: 'resolved',
  },
  {
    id: 'anom-094',
    timestamp: '6 hours ago',
    pondId: 'pond-beta',
    parameter: 'Turbidity Flux',
    severity: 'warning',
    detectedValue: '9.4 NTU',
    threshold: '> 8.5 NTU biofloc limit',
    rootCause: 'Prawn bottom-foraging frenzy following 14:00 scheduled automated pellet distribution.',
    impactScore: 54,
    recommendedAction: 'Temporarily attenuate feeding hopper rate by 15% and increase skim baffle overflow.',
    status: 'resolved',
  },
];

export const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: 'alt-01',
    pondName: 'Pond Beta-4',
    title: 'Aerator #4 Velocity Drift',
    description: 'RPM dipped to 740 (standard: 920 RPM). Secondary aeration automatically boosted.',
    timestamp: '14 min ago',
    severity: 'warning',
    isRead: false,
  },
  {
    id: 'alt-02',
    pondName: 'Hatchery Delta',
    title: 'Biofilter Backwash Cycle Completed',
    description: 'Automated 120s pressurized air scour completed. ORP rebound to 412 mV verified.',
    timestamp: '42 min ago',
    severity: 'nominal',
    isRead: false,
  },
  {
    id: 'alt-03',
    pondName: 'Pond Alpha-1',
    title: 'Oxygen Super-Saturation Peak',
    description: 'DO reached 7.85 mg/L (94% saturation). Pure oxygen injection valve throttled down 18%.',
    timestamp: '1 hour ago',
    severity: 'nominal',
    isRead: true,
  },
];
