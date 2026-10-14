import { SensorNode, PredictionResult, ThreatLevel } from '../types/disaster';

/**
 * Landslide Predictive Assessment using modified Caine Empirical Threshold
 * and Infinite Slope Stability Model (Factor of Safety - FoS).
 */
export function calculateLandslidePrediction(sensors: SensorNode[]): PredictionResult['landslide'] {
  const inclinometers = sensors.filter(s => s.type === 'inclinometer');
  const piezometers = sensors.filter(s => s.type === 'piezometer');
  const weatherSensors = sensors.filter(s => s.type === 'aws_weather');

  // Max slope shear displacement rate (mm/day)
  const maxDisplacementRate = Math.max(
    ...inclinometers.map(s => s.readings.value),
    1.2
  );

  // Max pore water pressure (kPa)
  const maxPorePressure = Math.max(
    ...piezometers.map(s => s.readings.value),
    50
  );

  // Max 24h precipitation (mm)
  const maxRain24h = Math.max(
    ...weatherSensors.map(s => s.secondaryReading?.value || s.readings.value),
    60
  );

  // Factor of Safety (FoS) estimation:
  // FoS = 1.0 is equilibrium failure point; < 1.0 is active failure; > 1.3 is stable
  // Higher pore pressure and displacement decreases FoS
  const baseFoS = 1.85;
  const porePressureImpact = (maxPorePressure / 100) * 0.65;
  const shearImpact = (maxDisplacementRate / 5) * 0.55;
  const rainImpact = (maxRain24h / 200) * 0.40;

  let factorOfSafety = Math.max(0.72, +(baseFoS - porePressureImpact - shearImpact - rainImpact).toFixed(2));

  // Landslide Probability (0 - 100%)
  let probability = 15;
  if (factorOfSafety <= 0.95) {
    probability = 94;
  } else if (factorOfSafety <= 1.10) {
    probability = 82;
  } else if (factorOfSafety <= 1.25) {
    probability = 65;
  } else if (factorOfSafety <= 1.40) {
    probability = 42;
  } else {
    probability = Math.min(30, Math.round((1 - (factorOfSafety - 1.4) / 0.6) * 30));
  }

  // Estimated Failure Window in hours
  let failureWindowHours: number | null = null;
  if (factorOfSafety < 1.0) {
    failureWindowHours = 1.5;
  } else if (factorOfSafety < 1.15) {
    failureWindowHours = 4.0;
  } else if (factorOfSafety < 1.30) {
    failureWindowHours = 12.0;
  }

  let status: ThreatLevel = 'NORMAL';
  if (probability >= 80 || factorOfSafety < 1.05) status = 'CRITICAL';
  else if (probability >= 60 || factorOfSafety < 1.20) status = 'WARNING';
  else if (probability >= 35) status = 'ADVISORY';

  return {
    probability,
    factorOfSafety,
    antecedentPrecipitationMm: Math.round(maxRain24h * 1.35),
    saturationPercentage: Math.min(99, Math.round(maxPorePressure * 1.05)),
    estimatedFailureWindowHours: failureWindowHours,
    highestRiskSlope: 'Joshimath-Helang Sector (Ward 5/7 Ravine) & NH-58 Toe',
    status
  };
}

/**
 * Flash Flood & GLOF (Glacial Lake Outburst Flood) Hydrodynamic Predictive Assessment
 */
export function calculateFloodPrediction(sensors: SensorNode[]): PredictionResult['flood'] {
  const riverRadars = sensors.filter(s => s.type === 'river_radar');
  const weatherSensors = sensors.filter(s => s.type === 'aws_weather');

  const maxRiverStage = Math.max(...riverRadars.map(s => s.readings.value), 4.0);
  const maxRateOfRise = Math.max(...riverRadars.map(s => s.secondaryReading?.value || 0.8), 0.8);
  const maxRainRate = Math.max(...weatherSensors.map(s => s.readings.value), 18.0);

  // Hydraulic Surge Probability
  let probability = 20;
  if (maxRateOfRise > 3.5 || maxRiverStage > 7.0) {
    probability = 91;
  } else if (maxRateOfRise > 2.0 || maxRiverStage > 5.5) {
    probability = 74;
  } else if (maxRateOfRise > 1.2 || maxRainRate > 30) {
    probability = 52;
  } else {
    probability = Math.min(35, Math.round((maxRiverStage / 6.0) * 30));
  }

  let status: ThreatLevel = 'NORMAL';
  if (probability >= 80 || maxRateOfRise >= 3.2) status = 'CRITICAL';
  else if (probability >= 60 || maxRateOfRise >= 2.0) status = 'WARNING';
  else if (probability >= 35) status = 'ADVISORY';

  // ETA of flood surge wave to nearest downstream bottleneck settlement
  let downstreamEtaMinutes: number | null = null;
  if (probability >= 50) {
    // Hydraulic wave travel speed ~ 8-12 m/s in steep Himalayan canyon
    downstreamEtaMinutes = Math.max(15, Math.round(45 - maxRateOfRise * 7));
  }

  return {
    probability,
    surgeRateCmPerMin: +maxRateOfRise.toFixed(1),
    currentStageMeters: +maxRiverStage.toFixed(1),
    dangerLevelMeters: 6.5,
    upstreamRainRateMmHr: +maxRainRate.toFixed(1),
    downstreamPeakEtaMinutes: downstreamEtaMinutes,
    highestRiskBasin: 'Alaknanda & Dhauliganga Confluence (Tapovan-Vishnuprayag)',
    status
  };
}

/**
 * Earthquake Early Warning (EEW) & Seismic Swarm Assessment
 */
export function calculateEarthquakePrediction(sensors: SensorNode[]): PredictionResult['earthquake'] {
  const seismographs = sensors.filter(s => s.type === 'seismograph');

  const maxPGA = Math.max(...seismographs.map(s => s.readings.value), 0.015);
  const totalSwarm = seismographs.reduce((sum, s) => sum + (s.secondaryReading?.value || 10), 0);

  // Probability of moderate-to-severe seismic rupture
  let probability = 25;
  if (maxPGA >= 0.15) {
    probability = 88;
  } else if (maxPGA >= 0.08) {
    probability = 68;
  } else if (maxPGA >= 0.04 || totalSwarm > 25) {
    probability = 48;
  } else {
    probability = Math.min(30, Math.round((totalSwarm / 30) * 25));
  }

  let status: ThreatLevel = 'NORMAL';
  if (probability >= 75 || maxPGA >= 0.12) status = 'CRITICAL';
  else if (probability >= 55 || maxPGA >= 0.06) status = 'WARNING';
  else if (probability >= 35) status = 'ADVISORY';

  // Lead time for P-wave to S-wave propagation to foothills (Dehradun / Rishikesh)
  // Distance ~ 120km, Vp ~ 6 km/s, Vs ~ 3.5 km/s => Lead time ~ 14 seconds
  const eewLeadTimeSeconds = Math.max(6, Math.round(22 - maxPGA * 40));

  return {
    probability,
    swarmFrequencyPerDay: totalSwarm,
    peakGroundAccelerationG: +maxPGA.toFixed(3),
    dominantFault: 'Main Central Thrust (MCT) Chamoli Wedge',
    eewLeadTimeSeconds,
    latestMicroMag: +(2.4 + (maxPGA * 15)).toFixed(1),
    status
  };
}

/**
 * Master multi-hazard prediction aggregator
 */
export function getConsolidatedPredictions(sensors: SensorNode[]): PredictionResult {
  return {
    landslide: calculateLandslidePrediction(sensors),
    flood: calculateFloodPrediction(sensors),
    earthquake: calculateEarthquakePrediction(sensors)
  };
}
