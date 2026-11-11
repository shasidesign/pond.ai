export interface MetricReading {
  current: number;
  unit: string;
  min: number;
  max: number;
  optimalMin: number;
  optimalMax: number;
  trend24h: number; // percentage change
  status: 'optimal' | 'warning' | 'critical';
  statusLabel: string;
  history: number[]; // recent 12 data points for sparkline
}

export interface PondMetrics {
  healthScore: number; // 0 - 100
  dissolvedOxygen: MetricReading;
  temperature: MetricReading;
  ph: MetricReading;
  turbidity: MetricReading;
  ammonia: MetricReading;
  salinity: MetricReading;
  orp: MetricReading; // Oxidation-Reduction Potential (mV)
}

export interface TimeSeriesPoint {
  timestamp: string;
  timeLabel: string;
  dissolvedOxygen: number;
  temperature: number;
  ph: number;
  turbidity: number;
  healthScore: number;
  predictedDO?: number;
  predictedUpper?: number;
  predictedLower?: number;
  isAnomaly?: boolean;
}

export interface AnomalyEvent {
  id: string;
  timestamp: string;
  pondId: string;
  parameter: string;
  severity: 'critical' | 'warning' | 'info';
  detectedValue: string;
  threshold: string;
  rootCause: string;
  impactScore: number;
  recommendedAction: string;
  status: 'active' | 'mitigating' | 'resolved';
}

export interface PondInfo {
  id: string;
  name: string;
  species: string;
  biomassKg: number;
  volumeM3: number;
  sensorBuoyId: string;
  lastSync: string;
  aeratorStatus: 'active' | 'standby' | 'boost';
  aeratorCount: number;
  metrics: PondMetrics;
}

export interface AlertNotification {
  id: string;
  pondName: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'nominal';
  actionTaken?: string;
  isRead: boolean;
}

export interface AiDiagnosticReport {
  timestamp: string;
  overallAssessment: string;
  biologicalStressIndex: 'Low (0.04)' | 'Moderate (0.28)' | 'Elevated (0.64)' | 'Severe (0.91)';
  aerationOptimization: string;
  feedingRecommendation: string;
  stratificationRisk: string;
  actionItems: string[];
}
