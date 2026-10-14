import React, { useState, useEffect, useCallback, Component, ErrorInfo, ReactNode } from 'react';
import {
  SensorNode,
  HazardZone,
  PushAlert,
  DisasterScenario,
  ThreatLevel
} from './types/disaster';
import { INITIAL_SENSORS, HAZARD_ZONES } from './data/uttarakhandData';
import { getConsolidatedPredictions } from './utils/predictiveEngines';
import { dispatchPushAlert, getPushPermissionStatus, requestPushPermission } from './utils/notificationService';
import { Navbar } from './components/Navbar';
import { OsmMap } from './components/OsmMap';
import { PredictiveRiskCards } from './components/PredictiveRiskCards';
import { PushNotificationManager } from './components/PushNotificationManager';
import { HistoricalWeatherPanel } from './components/HistoricalWeatherPanel';
import { SensorMonitoringPanel } from './components/SensorMonitoringPanel';
import { ResidentEvacTracker } from './components/ResidentEvacTracker';
import { DrillSimulationModal } from './components/DrillSimulationModal';
import { AiSynthesisModal } from './components/AiSynthesisModal';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Disaster Sentinel Error Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mb-4 text-3xl font-black">
            ⚠️
          </div>
          <h1 className="text-xl font-bold mb-2">Uttarakhand Disaster Sentinel</h1>
          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            The emergency early warning system encountered a display notice: {this.state.error?.message || 'Recovering state'}.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg"
          >
            Reload Early Warning System
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainApp() {
  const [sensors, setSensors] = useState<SensorNode[]>(INITIAL_SENSORS);
  const [selectedSensor, setSelectedSensor] = useState<SensorNode | null>(null);
  const [focusedCoords, setFocusedCoords] = useState<[number, number] | null>(null);

  const [alerts, setAlerts] = useState<PushAlert[]>([
    {
      id: 'ALERT-UK-8841',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      hazardType: 'landslide',
      severity: 'CRITICAL',
      title: 'Joshimath Ward-7: Urgent Slope Failure Warning',
      titleHindi: 'जोशीमठ वार्ड 7: तुरंत सुरक्षित स्थल की ओर जाएं',
      message: 'Extensometer shear velocity reached 3.4mm/day with high pore pressure. Unstable slope movement observed near NH-58 toe.',
      messageHindi: 'एनएच-58 पर सेंसर में भारी हलचल दर्ज की गई है। सतर्क रहें और ढलानों से दूर रहें।',
      affectedDistricts: ['Chamoli'],
      targetedResidents: 18500,
      deliveryRate: 98.7,
      evacuationRoutes: ['Pipalkoti Sports Complex High-Ground Haven'],
      recommendedAction: 'Move away from cracked structures; gather emergency kit; proceed to Pipalkoti Shelter.',
      soundAlertTriggered: true,
      acknowledgedCount: 14210
    },
    {
      id: 'ALERT-UK-8820',
      timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
      hazardType: 'flood',
      severity: 'WARNING',
      title: 'Mandakini River Basin: Flash Flood Advisory',
      titleHindi: 'मंदाकिनी नदी घाटी: जलस्तर वृद्धि चेतावनी',
      message: 'Upstream hydro radar reports 295 m³/s discharge flow. River stage rising at 3.8cm/min towards Gaurikund.',
      messageHindi: 'मंदाकिनी नदी का जलस्तर बढ़ रहा है। नदी तटों के समीप न जाएं।',
      affectedDistricts: ['Rudraprayag'],
      targetedResidents: 12400,
      deliveryRate: 99.1,
      evacuationRoutes: ['Ukhimath Omkareshwar Shelter Corridor'],
      recommendedAction: 'Stay at least 150m above river bank level.',
      soundAlertTriggered: false,
      acknowledgedCount: 10980
    }
  ]);

  const [isDrillModalOpen, setIsDrillModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');

  // Compute live multi-hazard predictions safely
  const predictions = getConsolidatedPredictions(sensors);

  // Derive consolidated threat level
  const threatLevels: ThreatLevel[] = [
    predictions.landslide.status,
    predictions.flood.status,
    predictions.earthquake.status
  ];
  let overallThreatLevel: ThreatLevel = 'NORMAL';
  if (threatLevels.includes('CRITICAL')) overallThreatLevel = 'CRITICAL';
  else if (threatLevels.includes('WARNING')) overallThreatLevel = 'WARNING';
  else if (threatLevels.includes('ADVISORY')) overallThreatLevel = 'ADVISORY';

  // Check browser notification permission on load
  useEffect(() => {
    try {
      setPermissionStatus(getPushPermissionStatus());
    } catch {
      setPermissionStatus('denied');
    }
  }, []);

  // Live telemetry pulse: simulated subtle micro-variations in sensor telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prevSensors) =>
        prevSensors.map((sensor) => {
          const delta = (Math.random() - 0.48) * 0.08;
          let newValue = +(sensor.readings.value + delta).toFixed(2);
          if (newValue < 0) newValue = 0;

          const newHistory = [...sensor.readings.history.slice(1), newValue];

          return {
            ...sensor,
            lastUpdated: 'Just now',
            readings: {
              ...sensor.readings,
              value: newValue,
              history: newHistory
            }
          };
        })
      );
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Broadcast Alert handler
  const handleBroadcastAlert = useCallback(async (alertData: Partial<PushAlert>) => {
    const newAlert: PushAlert = {
      id: `ALERT-UK-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      hazardType: alertData.hazardType || 'multi-hazard',
      severity: alertData.severity || 'CRITICAL',
      title: alertData.title || 'Urgent Uttarakhand Disaster Alert',
      titleHindi: alertData.titleHindi || 'उत्तराखंड आपदा चेतावनी जारी',
      message: alertData.message || 'Sensor threshold breach. Follow immediate evacuation procedure.',
      messageHindi: alertData.messageHindi || 'सेंसर चेतावनी स्तर पार। तुरंत सुरक्षित स्थल पर जाएं।',
      affectedDistricts: alertData.affectedDistricts || ['Chamoli'],
      targetedResidents: alertData.targetedResidents || 16500,
      deliveryRate: +(98 + Math.random() * 1.8).toFixed(1),
      evacuationRoutes: alertData.evacuationRoutes || ['High-Ground Emergency Corridor'],
      recommendedAction: alertData.recommendedAction || 'Evacuate to nearest shelter.',
      soundAlertTriggered: !isMuted,
      acknowledgedCount: Math.round((alertData.targetedResidents || 16500) * 0.78)
    };

    setAlerts((prev) => [newAlert, ...prev]);
    await dispatchPushAlert(newAlert, !isMuted);
  }, [isMuted]);

  // Apply Disaster Drill Scenario
  const handleApplyScenario = useCallback((scenario: DisasterScenario) => {
    setFocusedCoords(scenario.targetCoords);

    setSensors((prevSensors) =>
      prevSensors.map((sensor) => {
        if (scenario.hazardType === 'flood' && sensor.type === 'river_radar') {
          return {
            ...sensor,
            status: 'critical',
            readings: {
              ...sensor.readings,
              value: 7.9,
              history: [...sensor.readings.history.slice(1), 7.9]
            },
            secondaryReading: {
              label: 'Rate of Water Rise',
              value: 4.8,
              unit: 'cm/min'
            }
          };
        } else if (scenario.hazardType === 'landslide' && sensor.type === 'inclinometer') {
          return {
            ...sensor,
            status: 'critical',
            readings: {
              ...sensor.readings,
              value: 4.6,
              history: [...sensor.readings.history.slice(1), 4.6]
            }
          };
        } else if (scenario.hazardType === 'earthquake' && sensor.type === 'seismograph') {
          return {
            ...sensor,
            status: 'critical',
            readings: {
              ...sensor.readings,
              value: 0.18,
              history: [...sensor.readings.history.slice(1), 0.18]
            }
          };
        }
        return sensor;
      })
    );

    handleBroadcastAlert({
      hazardType: scenario.hazardType,
      severity: 'CRITICAL',
      title: `DRILL EVENT: ${scenario.title}`,
      titleHindi: `आपदा अभ्यास: ${scenario.districtFocus} में तत्काल चेतावनी`,
      message: `${scenario.description} Evacuate immediately according to the Disaster Management Plan.`,
      messageHindi: `सेंसर थ्रेसहोल्ड पार। सभी निवासी तुरंत निकटतम सुरक्षित शिविर की ओर प्रस्थान करें।`,
      affectedDistricts: [scenario.districtFocus],
      targetedResidents: scenario.affectedCount
    });
  }, [handleBroadcastAlert]);

  // Reset to normal
  const handleResetToNormal = useCallback(() => {
    setSensors(INITIAL_SENSORS);
    setFocusedCoords([30.3165, 79.15]);
  }, []);

  // Quick alert from map polygon click
  const handleQuickAlertFromZone = useCallback((zone: HazardZone) => {
    handleBroadcastAlert({
      hazardType: zone.hazardType,
      severity: zone.threatLevel,
      title: `${zone.name}: Emergency Evacuation Alert`,
      titleHindi: `${zone.nameHindi}: त्वरित निष्क्रमण चेतावनी`,
      message: zone.activeWarningMessage,
      messageHindi: 'तुरंत सुरक्षित ऊंचाई वाले स्थानों पर जाएं व एसडीआरएफ निर्देशों का पालन करें।',
      affectedDistricts: [zone.district],
      targetedResidents: zone.vulnerablePopulation
    });
    setFocusedCoords(zone.center);
  }, [handleBroadcastAlert]);

  // Focus map when clicking hazard card
  const handleFocusHazard = (hazardType: 'landslide' | 'flood' | 'earthquake') => {
    const match = HAZARD_ZONES.find((z) => z.hazardType === hazardType);
    if (match) {
      setFocusedCoords(match.center);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        threatLevel={overallThreatLevel}
        onOpenDrillModal={() => setIsDrillModalOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        permissionStatus={permissionStatus}
        onRequestPermission={async () => {
          const perm = await requestPushPermission();
          setPermissionStatus(perm);
        }}
      />

      {/* Main Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Row 1: Three Dedicated Predictive Risk Engines */}
        <section aria-label="Hazard Predictive Engines">
          <PredictiveRiskCards
            predictions={predictions}
            onFocusHazard={handleFocusHazard}
            onTriggerAlert={(type) => {
              const zone = HAZARD_ZONES.find((z) => z.hazardType === type) || HAZARD_ZONES[0];
              handleQuickAlertFromZone(zone);
            }}
          />
        </section>

        {/* Row 2: OpenStreetMap Basemap Gallery & Interactive Map */}
        <section aria-label="Geospatial Map and OSM Basemap Gallery" className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Uttarakhand Multi-Hazard Spatial Intelligence • OSM Basemap Gallery
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Center: 30.3165°N, 79.1500°E (Zone V High Seismic & Mountain Risk)
            </span>
          </div>

          <div className="h-[520px] sm:h-[580px] w-full">
            <OsmMap
              sensors={sensors}
              selectedSensor={selectedSensor}
              onSelectSensor={(sensor) => setSelectedSensor(sensor)}
              onTriggerQuickAlert={handleQuickAlertFromZone}
              focusedCoords={focusedCoords}
            />
          </div>
        </section>

        {/* Row 3: Push Notification System + Historical Weather Patterns */}
        <section aria-label="Push Notifications & Historical Weather Patterns">
          <div className="space-y-6">
            <PushNotificationManager
              alerts={alerts}
              onBroadcastAlert={handleBroadcastAlert}
              permissionStatus={permissionStatus}
              onRefreshPermission={() => setPermissionStatus(getPushPermissionStatus())}
            />

            <HistoricalWeatherPanel
              onLoadHistoricalAnalogue={(event) => {
                if (event.year === 2013) {
                  const scenario = {
                    id: 'SCENARIO-KEDAR-2013',
                    title: 'Kedarnath 2013 Analogue Cloudburst Surge',
                    description: 'Simulates 375mm extreme rainfall match with Mandakini river flood wave.',
                    hazardType: 'flood' as const,
                    districtFocus: 'Rudraprayag',
                    affectedCount: 28000,
                    targetCoords: [30.655, 79.066] as [number, number]
                  };
                  handleApplyScenario(scenario);
                } else if (event.year === 2021) {
                  const scenario = {
                    id: 'SCENARIO-CHAMOLI-2021',
                    title: 'Chamoli 2021 Analogue GLOF Surge',
                    description: 'Simulates rock-ice wedge avalanche at Ronti peak with Dhauliganga surge.',
                    hazardType: 'flood' as const,
                    districtFocus: 'Chamoli',
                    affectedCount: 9500,
                    targetCoords: [30.493, 79.626] as [number, number]
                  };
                  handleApplyScenario(scenario);
                } else {
                  handleApplyScenario({
                    id: 'SCENARIO-QUAKE-1999',
                    title: 'Chamoli 1999 MCT Earthquake Analogue',
                    description: 'Simulates rupture along Main Central Thrust with PGA 0.22%g.',
                    hazardType: 'earthquake' as const,
                    districtFocus: 'Chamoli',
                    affectedCount: 42000,
                    targetCoords: [30.431, 79.431] as [number, number]
                  });
                }
              }}
            />
          </div>
        </section>

        {/* Row 4: Real-time IoT Sensor Telemetry + Safe Shelters Tracker */}
        <section aria-label="Sensor Telemetry and Safe Havens" className="space-y-6">
          <SensorMonitoringPanel
            sensors={sensors}
            selectedSensor={selectedSensor}
            onSelectSensor={(sensor) => {
              setSelectedSensor(sensor);
              setFocusedCoords(sensor.coords);
            }}
          />

          <ResidentEvacTracker
            onFocusShelter={(coords) => setFocusedCoords(coords)}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Uttarakhand Disaster Sentinel</span>
            <span>•</span>
            <span>State Emergency Operations Centre (SEOC), Dehradun</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>OpenStreetMap Cartography</span>
            <span>•</span>
            <span>CAP Protocol v1.2</span>
            <span>•</span>
            <span className="text-cyan-400">Emergency Helpline: 1070 / 112</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <DrillSimulationModal
        isOpen={isDrillModalOpen}
        onClose={() => setIsDrillModalOpen(false)}
        onApplyScenario={handleApplyScenario}
        onResetToNormal={handleResetToNormal}
      />

      <AiSynthesisModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        predictions={predictions}
        onBroadcastFromAi={(title, titleHindi, msg, msgHindi) => {
          handleBroadcastAlert({
            hazardType: 'multi-hazard',
            severity: 'CRITICAL',
            title,
            titleHindi,
            message: msg,
            messageHindi: msgHindi,
            affectedDistricts: ['Chamoli', 'Rudraprayag']
          });
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
