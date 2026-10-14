export type HazardType = 'landslide' | 'flood' | 'earthquake' | 'multi-hazard';
export type ThreatLevel = 'NORMAL' | 'ADVISORY' | 'WARNING' | 'CRITICAL';
export type SensorType = 'piezometer' | 'inclinometer' | 'river_radar' | 'seismograph' | 'aws_weather' | 'insar_satellite';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface SensorNode {
  id: string;
  name: string;
  district: string;
  location: string;
  coords: [number, number];
  type: SensorType;
  status: 'active' | 'warning' | 'critical' | 'offline';
  batteryLevel: number;
  lastUpdated: string;
  readings: {
    label: string;
    value: number;
    unit: string;
    normalMax: number;
    criticalThreshold: number;
    history: number[]; // recent 10 data points
  };
  secondaryReading?: {
    label: string;
    value: number;
    unit: string;
  };
  elevationMeters: number;
}

export interface HazardZone {
  id: string;
  name: string;
  nameHindi: string;
  district: string;
  hazardType: HazardType;
  threatLevel: ThreatLevel;
  center: [number, number];
  polygon: [number, number][]; // coordinates for Leaflet polygon
  riskScore: number; // 0-100
  keyFactors: string[];
  vulnerablePopulation: number;
  activeWarningMessage: string;
  lastAssessed: string;
}

export interface SafeShelter {
  id: string;
  name: string;
  location: string;
  coords: [number, number];
  capacity: number;
  currentOccupancy: number;
  facilities: string[];
  contactPerson: string;
  contactNumber: string;
  elevationMeters: number;
  status: 'open' | 'standby' | 'full';
}

export interface EvacuationRoute {
  id: string;
  name: string;
  fromZone: string;
  toShelter: string;
  path: [number, number][];
  status: 'clear' | 'caution' | 'blocked';
  distanceKm: number;
  estTimeMinutes: number;
}

export interface SeismicFaultLine {
  id: string;
  name: string;
  code: string; // MCT, MBT, HFT, etc.
  description: string;
  depthKm: number;
  slipRateMmPerYear: number;
  path: [number, number][];
}

export interface BasemapOption {
  id: string;
  name: string;
  provider: string;
  attribution: string;
  url: string;
  subdomains?: string[];
  maxZoom: number;
  thumbnailUrl: string;
  description: string;
  category: 'standard' | 'topographic' | 'dark' | 'light' | 'satellite';
}

export interface PushAlert {
  id: string;
  timestamp: string;
  hazardType: HazardType;
  severity: ThreatLevel;
  title: string;
  titleHindi: string;
  message: string;
  messageHindi: string;
  affectedDistricts: string[];
  targetedResidents: number;
  deliveryRate: number;
  evacuationRoutes: string[];
  recommendedAction: string;
  soundAlertTriggered: boolean;
  acknowledgedCount: number;
}

export interface HistoricalWeatherEvent {
  year: number;
  title: string;
  dateRange: string;
  description: string;
  peakRainfall24hMm: number;
  triggerMechanism: string;
  impactSummary: string;
  analogSimilarityScore: number; // 0-100% current match
}

export interface PredictionResult {
  landslide: {
    probability: number;
    factorOfSafety: number;
    antecedentPrecipitationMm: number;
    saturationPercentage: number;
    estimatedFailureWindowHours: number | null;
    highestRiskSlope: string;
    status: ThreatLevel;
  };
  flood: {
    probability: number;
    surgeRateCmPerMin: number;
    currentStageMeters: number;
    dangerLevelMeters: number;
    upstreamRainRateMmHr: number;
    downstreamPeakEtaMinutes: number | null;
    highestRiskBasin: string;
    status: ThreatLevel;
  };
  earthquake: {
    probability: number;
    swarmFrequencyPerDay: number;
    peakGroundAccelerationG: number;
    dominantFault: string;
    eewLeadTimeSeconds: number;
    latestMicroMag: number;
    status: ThreatLevel;
  };
}

export interface DisasterScenario {
  id: string;
  title: string;
  description: string;
  hazardType: HazardType;
  districtFocus: string;
  affectedCount: number;
  targetCoords: [number, number];
}
