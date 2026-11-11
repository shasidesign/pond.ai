import { useState, useEffect, useMemo, useCallback } from 'react';
import { PondInfo, AnomalyEvent, AlertNotification } from './types/telemetry';
import { INITIAL_PONDS, generateTimeSeriesData, INITIAL_ANOMALIES, INITIAL_ALERTS } from './data/mockTelemetry';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PondSelector } from './components/PondSelector';
import { MetricCards } from './components/MetricCards';
import { AnalyticsChart } from './components/AnalyticsChart';
import { AnomalyDetection } from './components/AnomalyDetection';
import { AlertCenter } from './components/AlertCenter';
import { AiInsightsPanel } from './components/AiInsightsPanel';
import { HardwareBuoyModal } from './components/HardwareBuoyModal';
import { Footer } from './components/Footer';
import { sound } from './utils/audio';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<'overview' | 'telemetry' | 'anomalies' | 'copilot'>('overview');
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);

  // Pond Data State
  const [ponds, setPonds] = useState<PondInfo[]>(INITIAL_PONDS);
  const [selectedPondId, setSelectedPondId] = useState<string>('pond-alpha');
  const [selectedMetricKey, setSelectedMetricKey] = useState<string>('dissolvedOxygen');
  const [timeframe, setTimeframe] = useState<'1H' | '24H' | '7D' | '30D'>('24H');

  // Anomalies and Alerts
  const [anomalies, setAnomalies] = useState<AnomalyEvent[]>(INITIAL_ANOMALIES);
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);

  // Simulation & AI Generating State
  const [isSimulating, setIsSimulating] = useState(true);
  const [isSimulatingStress, setIsSimulatingStress] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Active Pond
  const activePond = useMemo(() => {
    return ponds.find((p) => p.id === selectedPondId) || ponds[0];
  }, [ponds, selectedPondId]);

  // Total biomass calculation
  const totalBiomassKg = useMemo(() => {
    return ponds.reduce((acc, curr) => acc + curr.biomassKg, 0);
  }, [ponds]);

  // Time series chart data
  const chartData = useMemo(() => {
    return generateTimeSeriesData(timeframe, activePond);
  }, [timeframe, activePond]);

  // Real-time micro-fluctuations (3-second tick engine)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setPonds((prevPonds) => {
        return prevPonds.map((pond) => {
          // If this pond is currently undergoing an injected stress test, let that handle it
          if (pond.id === selectedPondId && isSimulatingStress) {
            return pond;
          }

          // Generate subtle random micro-jitter (±0.02 DO, ±0.03 pH, ±0.05 Temp)
          const deltaDO = (Math.random() - 0.49) * 0.04;
          const deltaTemp = (Math.random() - 0.5) * 0.05;
          const deltaPH = (Math.random() - 0.5) * 0.02;
          const deltaTurb = (Math.random() - 0.5) * 0.06;

          const newDO = Math.max(4.0, Math.min(12.0, pond.metrics.dissolvedOxygen.current + deltaDO));
          const newTemp = Math.max(10.0, Math.min(32.0, pond.metrics.temperature.current + deltaTemp));
          const newPH = Math.max(6.5, Math.min(8.5, pond.metrics.ph.current + deltaPH));
          const newTurb = Math.max(0.5, Math.min(20.0, pond.metrics.turbidity.current + deltaTurb));

          // Update histories
          const updateHist = (hist: number[], val: number) => [...hist.slice(1), val];

          return {
            ...pond,
            metrics: {
              ...pond.metrics,
              dissolvedOxygen: {
                ...pond.metrics.dissolvedOxygen,
                current: Number(newDO.toFixed(2)),
                history: updateHist(pond.metrics.dissolvedOxygen.history, Number(newDO.toFixed(2))),
              },
              temperature: {
                ...pond.metrics.temperature,
                current: Number(newTemp.toFixed(1)),
                history: updateHist(pond.metrics.temperature.history, Number(newTemp.toFixed(1))),
              },
              ph: {
                ...pond.metrics.ph,
                current: Number(newPH.toFixed(2)),
                history: updateHist(pond.metrics.ph.history, Number(newPH.toFixed(2))),
              },
              turbidity: {
                ...pond.metrics.turbidity,
                current: Number(newTurb.toFixed(1)),
                history: updateHist(pond.metrics.turbidity.history, Number(newTurb.toFixed(1))),
              },
            },
          };
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isSimulating, selectedPondId, isSimulatingStress]);

  // Handler: Anomaly stress test simulation
  const handleTriggerAnomalyPreset = useCallback((type: 'hypoxia' | 'phDrop' | 'turbidity') => {
    setIsSimulatingStress(true);

    if (type === 'hypoxia') {
      // Rapid DO crash to 4.8 mg/L
      setPonds((prev) =>
        prev.map((p) => {
          if (p.id !== selectedPondId) return p;
          return {
            ...p,
            metrics: {
              ...p.metrics,
              healthScore: 78.4,
              dissolvedOxygen: {
                ...p.metrics.dissolvedOxygen,
                current: 4.82,
                status: 'critical',
                statusLabel: 'Acute Hypoxia Risk (< 5.0 mg/L)',
                trend24h: -18.4,
                history: [...p.metrics.dissolvedOxygen.history.slice(1), 4.82],
              },
            },
          };
        })
      );

      const newAnomaly: AnomalyEvent = {
        id: `anom-${Date.now()}`,
        timestamp: 'Just now',
        pondId: selectedPondId,
        parameter: 'Critical Dissolved Oxygen Deficit',
        severity: 'critical',
        detectedValue: '4.82 mg/L',
        threshold: '< 6.00 mg/L emergency floor',
        rootCause: 'Simulated primary power trip on aerators 1–4 combined with night-time biological oxygen demand.',
        impactScore: 92,
        recommendedAction: 'Engage Auxiliary Submersible Oxygen Diffusers and switch emergency generator bus.',
        status: 'active',
      };
      setAnomalies((prev) => [newAnomaly, ...prev]);

      const newAlert: AlertNotification = {
        id: `alt-${Date.now()}`,
        pondName: activePond.name,
        title: 'ACUTE HYPOXIA DETECTED',
        description: 'Dissolved oxygen plummeted below safety threshold to 4.82 mg/L. Biomass respiration threatened.',
        timestamp: 'Just now',
        severity: 'critical',
        isRead: false,
      };
      setAlerts((prev) => [newAlert, ...prev]);
    } else if (type === 'phDrop') {
      setPonds((prev) =>
        prev.map((p) => {
          if (p.id !== selectedPondId) return p;
          return {
            ...p,
            metrics: {
              ...p.metrics,
              healthScore: 84.2,
              ph: {
                ...p.metrics.ph,
                current: 6.78,
                status: 'warning',
                statusLabel: 'Acid Runoff Drift',
                trend24h: -7.5,
                history: [...p.metrics.ph.history.slice(1), 6.78],
              },
            },
          };
        })
      );

      const newAnomaly: AnomalyEvent = {
        id: `anom-${Date.now()}`,
        timestamp: 'Just now',
        pondId: selectedPondId,
        parameter: 'pH Buffering Acidification',
        severity: 'warning',
        detectedValue: '6.78 pH',
        threshold: '< 7.00 pH minimum baseline',
        rootCause: 'High stormwater surface runoff flushing unbuffered acidic rainwater into the raceway.',
        impactScore: 71,
        recommendedAction: 'Automate calcium carbonate slurry dispenser at 12 kg/hr to restabilize alkalinity.',
        status: 'active',
      };
      setAnomalies((prev) => [newAnomaly, ...prev]);
    } else {
      // Turbidity spike
      setPonds((prev) =>
        prev.map((p) => {
          if (p.id !== selectedPondId) return p;
          return {
            ...p,
            metrics: {
              ...p.metrics,
              turbidity: {
                ...p.metrics.turbidity,
                current: 14.5,
                status: 'warning',
                statusLabel: 'Suspended Solids High',
                trend24h: 38.0,
                history: [...p.metrics.turbidity.history.slice(1), 14.5],
              },
            },
          };
        })
      );
    }

    // Release stress lock after 20 seconds
    setTimeout(() => {
      setIsSimulatingStress(false);
    }, 20000);
  }, [selectedPondId, activePond]);

  // Handler: Mitigate anomaly
  const handleMitigateAnomaly = useCallback((id: string) => {
    sound.playChime('success');
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved' } : a))
    );

    // Restore pond health
    setPonds((prev) =>
      prev.map((p) => {
        if (p.id !== selectedPondId) return p;
        return {
          ...p,
          metrics: {
            ...p.metrics,
            healthScore: 96.8,
            dissolvedOxygen: {
              ...p.metrics.dissolvedOxygen,
              current: 7.65,
              status: 'optimal',
              statusLabel: 'Restabilized Post-Purge',
              trend24h: 1.5,
              history: [...p.metrics.dissolvedOxygen.history.slice(1), 7.65],
            },
            ph: {
              ...p.metrics.ph,
              current: 7.45,
              status: 'optimal',
              statusLabel: 'Neutral Buffer Restored',
              history: [...p.metrics.ph.history.slice(1), 7.45],
            },
            turbidity: {
              ...p.metrics.turbidity,
              current: 3.4,
              status: 'optimal',
              statusLabel: 'Clarified',
              history: [...p.metrics.turbidity.history.slice(1), 3.4],
            },
          },
        };
      })
    );
    setIsSimulatingStress(false);
  }, [selectedPondId]);

  // Handler: Refresh AI Diagnostic
  const handleRefreshDiagnostic = useCallback(() => {
    setIsGeneratingAi(true);
    sound.playClick();

    setTimeout(() => {
      setIsGeneratingAi(false);
      sound.playChime('success');
    }, 1800);
  }, []);

  // Alert handlers
  const handleDismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleClearAllAlerts = () => {
    setAlerts([]);
  };

  const handleTakeAlertAction = (id: string, actionName: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, actionTaken: actionName } : a))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 1. Header Navigation Bar (3-Zone Contract) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenHardwareModal={() => setIsHardwareModalOpen(true)}
        onTriggerDiagnostic={handleRefreshDiagnostic}
        isSimulating={isSimulating}
        setIsSimulating={setIsSimulating}
      />

      {/* 2. Full-Screen Photorealistic Hero Section */}
      <Hero
        onExploreClick={() => {
          setActiveTab('telemetry');
          document.getElementById('telemetry')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onSimulateAnomaly={() => {
          setActiveTab('anomalies');
          document.getElementById('anomalies')?.scrollIntoView({ behavior: 'smooth' });
          handleTriggerAnomalyPreset('hypoxia');
        }}
        onOpenHardwareModal={() => setIsHardwareModalOpen(true)}
        activePondName={activePond.name}
        totalBiomassKg={totalBiomassKg}
      />

      {/* 3. Pond Basin Switcher Ribbon */}
      <PondSelector
        ponds={ponds}
        selectedPondId={selectedPondId}
        onSelectPond={(id) => {
          setSelectedPondId(id);
          setIsSimulatingStress(false);
        }}
      />

      {/* 4. Main Dashboard Work Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        
        {/* Section A: Live Water Quality Cards (The 5 Metrics) */}
        <MetricCards
          metrics={activePond.metrics}
          pondName={activePond.name}
          onSelectMetric={(key) => setSelectedMetricKey(key)}
          selectedMetricKey={selectedMetricKey}
        />

        {/* Section B: Real-Time Analytics & Historical Trends Charts */}
        <AnalyticsChart
          data={chartData}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          selectedMetric={selectedMetricKey}
          setSelectedMetric={setSelectedMetricKey}
          pondName={activePond.name}
        />

        {/* Section C: Predictive Anomaly Detection Engine */}
        <AnomalyDetection
          anomalies={anomalies.filter((a) => a.pondId === selectedPondId || a.pondId === 'all')}
          forecastData={chartData}
          onTriggerAnomalyPreset={handleTriggerAnomalyPreset}
          onMitigateAnomaly={handleMitigateAnomaly}
          isSimulatingStress={isSimulatingStress}
        />

        {/* Section D: Alert Center */}
        <AlertCenter
          alerts={alerts}
          onDismissAlert={handleDismissAlert}
          onClearAll={handleClearAllAlerts}
          onTakeAction={handleTakeAlertAction}
        />

        {/* Section E: AI Biophysical Insights & Advisory Panel */}
        <AiInsightsPanel
          pond={activePond}
          onRefreshDiagnostic={handleRefreshDiagnostic}
          isGenerating={isGeneratingAi}
        />

      </main>

      {/* 5. Physical Sensor Buoy & RAS Facility Inspector Modal */}
      <HardwareBuoyModal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
        activeBuoyId={activePond.sensorBuoyId}
      />

      {/* 6. Enterprise Footer */}
      <Footer />

    </div>
  );
}
