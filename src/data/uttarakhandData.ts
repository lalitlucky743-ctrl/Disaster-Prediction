import {
  SensorNode,
  HazardZone,
  SafeShelter,
  EvacuationRoute,
  SeismicFaultLine,
  BasemapOption,
  HistoricalWeatherEvent
} from '../types/disaster';

// OSM Basemap Gallery Options
export const BASEMAP_GALLERY: BasemapOption[] = [
  {
    id: 'osm_standard',
    name: 'OpenStreetMap Standard',
    provider: 'OpenStreetMap Foundation',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    thumbnailUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=200&auto=format&fit=crop&q=60',
    description: 'Universal crowd-sourced base map with full transport, village and settlement names.',
    category: 'standard'
  },
  {
    id: 'opentopo',
    name: 'OpenTopoMap (Relief & Contours)',
    provider: 'OpenTopoMap / OSM',
    attribution: 'Map data: &copy; OSM contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 17,
    thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&auto=format&fit=crop&q=60',
    description: 'Highland topographic relief with elevation contours—ideal for steep Himalayan mountain slopes.',
    category: 'topographic'
  },
  {
    id: 'carto_dark',
    name: 'CartoDB Dark Matter (Ops Center)',
    provider: 'CARTO / OSM',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 20,
    thumbnailUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200&auto=format&fit=crop&q=60',
    description: 'Tactical dark canvas optimized for night shifts, glowing sensor alerts and thermal overlays.',
    category: 'dark'
  },
  {
    id: 'carto_light',
    name: 'CartoDB Positron (High-Clarity)',
    provider: 'CARTO / OSM',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 20,
    thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&auto=format&fit=crop&q=60',
    description: 'Subdued minimalist design allowing multi-hazard polygon colors to stand out crisply.',
    category: 'light'
  },
  {
    id: 'esri_satellite',
    name: 'Esri World Imagery (Satellite)',
    provider: 'Esri, Maxar, Earthstar',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 18,
    thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=200&auto=format&fit=crop&q=60',
    description: 'High-res aerial satellite photography showing Himalayan glacial moraines, scree slopes and riverbeds.',
    category: 'satellite'
  }
];

// Initial Real-time Sensor Nodes across Uttarakhand
export const INITIAL_SENSORS: SensorNode[] = [
  {
    id: 'SN-CHAM-01',
    name: 'Joshimath Ward-7 Inclinometer',
    district: 'Chamoli',
    location: 'Sunil / Ravine Sector, Joshimath',
    coords: [30.557, 79.566],
    type: 'inclinometer',
    status: 'warning',
    batteryLevel: 88,
    lastUpdated: 'Just now',
    elevationMeters: 1890,
    readings: {
      label: 'Slope Shear Velocity',
      value: 3.4,
      unit: 'mm/day',
      normalMax: 1.2,
      criticalThreshold: 4.5,
      history: [1.1, 1.3, 1.5, 1.8, 2.2, 2.5, 2.8, 3.1, 3.2, 3.4]
    },
    secondaryReading: {
      label: 'Cumulative Displacement',
      value: 68.2,
      unit: 'mm'
    }
  },
  {
    id: 'SN-CHAM-02',
    name: 'Tapovan Dhauliganga River Radar',
    district: 'Chamoli',
    location: 'Tapovan Hydel Barrage, Chamoli',
    coords: [30.493, 79.626],
    type: 'river_radar',
    status: 'critical',
    batteryLevel: 94,
    lastUpdated: '1 min ago',
    elevationMeters: 1780,
    readings: {
      label: 'River Stage Level',
      value: 7.8,
      unit: 'meters',
      normalMax: 4.5,
      criticalThreshold: 7.2,
      history: [4.2, 4.4, 4.6, 5.1, 5.8, 6.4, 6.9, 7.3, 7.6, 7.8]
    },
    secondaryReading: {
      label: 'Rate of Water Rise',
      value: 3.8,
      unit: 'cm/min'
    }
  },
  {
    id: 'SN-CHAM-03',
    name: 'Chamoli-Pipalkoti Broadband Seismograph',
    district: 'Chamoli',
    location: 'Pipalkoti MCT Fault Observation Station',
    coords: [30.431, 79.431],
    type: 'seismograph',
    status: 'active',
    batteryLevel: 99,
    lastUpdated: 'Just now',
    elevationMeters: 1260,
    readings: {
      label: 'Peak Ground Accel (PGA)',
      value: 0.042,
      unit: '%g',
      normalMax: 0.05,
      criticalThreshold: 0.15,
      history: [0.01, 0.01, 0.02, 0.01, 0.03, 0.02, 0.02, 0.03, 0.04, 0.042]
    },
    secondaryReading: {
      label: 'Micro-tremor Swarm (24h)',
      value: 14,
      unit: 'events'
    }
  },
  {
    id: 'SN-RUDR-01',
    name: 'Kedarnath Mandakini Hydro-Radar',
    district: 'Rudraprayag',
    location: 'Gaurikund-Kedarnath Chute, Mandakini Valley',
    coords: [30.655, 79.066],
    type: 'river_radar',
    status: 'warning',
    batteryLevel: 82,
    lastUpdated: '2 min ago',
    elevationMeters: 2850,
    readings: {
      label: 'Water Discharge Flow',
      value: 295,
      unit: 'm³/s',
      normalMax: 180,
      criticalThreshold: 350,
      history: [140, 160, 185, 210, 230, 255, 270, 280, 290, 295]
    },
    secondaryReading: {
      label: 'Catchment Rainfall Rate',
      value: 44.5,
      unit: 'mm/hr'
    }
  },
  {
    id: 'SN-RUDR-02',
    name: 'Ukhimath Hillside Piezometer',
    district: 'Rudraprayag',
    location: 'Mansuna Slope, Ukhimath',
    coords: [30.518, 79.098],
    type: 'piezometer',
    status: 'warning',
    batteryLevel: 91,
    lastUpdated: '3 min ago',
    elevationMeters: 1420,
    readings: {
      label: 'Pore Water Pressure',
      value: 84.6,
      unit: 'kPa',
      normalMax: 60.0,
      criticalThreshold: 90.0,
      history: [50, 54, 58, 64, 69, 73, 76, 80, 82, 84.6]
    },
    secondaryReading: {
      label: 'Soil Moisture Saturation',
      value: 91.2,
      unit: '%'
    }
  },
  {
    id: 'SN-UTTK-01',
    name: 'Varunavat Parvat Slope Monitor',
    district: 'Uttarkashi',
    location: 'Varunavat Hill, Uttarkashi Town',
    coords: [30.732, 78.448],
    type: 'inclinometer',
    status: 'active',
    batteryLevel: 95,
    lastUpdated: 'Just now',
    elevationMeters: 1350,
    readings: {
      label: 'Rock Fracture Aperture',
      value: 0.9,
      unit: 'mm/day',
      normalMax: 1.5,
      criticalThreshold: 3.5,
      history: [0.4, 0.4, 0.5, 0.6, 0.6, 0.7, 0.7, 0.8, 0.8, 0.9]
    },
    secondaryReading: {
      label: 'Slope Factor of Safety',
      value: 1.42,
      unit: 'FoS'
    }
  },
  {
    id: 'SN-UTTK-02',
    name: 'Bhagirathi Catchment AWS Weather',
    district: 'Uttarkashi',
    location: 'Bhatwari AWS, Uttarkashi',
    coords: [30.812, 78.618],
    type: 'aws_weather',
    status: 'warning',
    batteryLevel: 96,
    lastUpdated: 'Just now',
    elevationMeters: 1560,
    readings: {
      label: 'Rainfall Intensity',
      value: 38.2,
      unit: 'mm/hr',
      normalMax: 20.0,
      criticalThreshold: 50.0,
      history: [12, 16, 20, 24, 28, 30, 32, 35, 37, 38.2]
    },
    secondaryReading: {
      label: '24h Cumulative Precipitation',
      value: 118.5,
      unit: 'mm'
    }
  },
  {
    id: 'SN-PITH-01',
    name: 'Dharchula-Kali River Gauge',
    district: 'Pithoragarh',
    location: 'Dharchula Transit Bridge, Kali River',
    coords: [29.851, 80.536],
    type: 'river_radar',
    status: 'active',
    batteryLevel: 89,
    lastUpdated: '4 min ago',
    elevationMeters: 920,
    readings: {
      label: 'Kali River Level',
      value: 5.2,
      unit: 'meters',
      normalMax: 6.0,
      criticalThreshold: 7.5,
      history: [3.8, 4.0, 4.2, 4.3, 4.5, 4.7, 4.9, 5.0, 5.1, 5.2]
    },
    secondaryReading: {
      label: 'Cross-Border Runoff Inflow',
      value: 320,
      unit: 'm³/s'
    }
  },
  {
    id: 'SN-NAIN-01',
    name: 'Balia Nala Subsidence Extensometer',
    district: 'Nainital',
    location: 'Balia Nala Fault Escarpment, Nainital',
    coords: [29.382, 79.467],
    type: 'inclinometer',
    status: 'warning',
    batteryLevel: 90,
    lastUpdated: 'Just now',
    elevationMeters: 1980,
    readings: {
      label: 'Ground Subsidence Rate',
      value: 2.1,
      unit: 'mm/day',
      normalMax: 1.0,
      criticalThreshold: 3.0,
      history: [0.8, 0.9, 1.1, 1.3, 1.5, 1.6, 1.8, 1.9, 2.0, 2.1]
    },
    secondaryReading: {
      label: 'Slope Tilt Angle',
      value: 41.5,
      unit: 'deg'
    }
  },
  {
    id: 'SN-TEHR-01',
    name: 'Tehri Rim Geological InSAR Station',
    district: 'Tehri Garhwal',
    location: 'Tehri Dam Left Bank Ridge',
    coords: [30.378, 78.481],
    type: 'insar_satellite',
    status: 'active',
    batteryLevel: 98,
    lastUpdated: '5 min ago',
    elevationMeters: 840,
    readings: {
      label: 'Rim Line-of-Sight Deformation',
      value: 0.4,
      unit: 'mm/month',
      normalMax: 1.2,
      criticalThreshold: 3.0,
      history: [0.3, 0.3, 0.4, 0.3, 0.4, 0.4, 0.3, 0.4, 0.4, 0.4]
    },
    secondaryReading: {
      label: 'Reservoir Level',
      value: 812.4,
      unit: 'm MSL'
    }
  },
  {
    id: 'SN-DEHR-01',
    name: 'Doon Valley MBT Seismic Sensor',
    district: 'Dehradun',
    location: 'Sahastradhara Foothills Station',
    coords: [30.385, 78.125],
    type: 'seismograph',
    status: 'active',
    batteryLevel: 97,
    lastUpdated: 'Just now',
    elevationMeters: 650,
    readings: {
      label: 'PGA Baseline',
      value: 0.012,
      unit: '%g',
      normalMax: 0.05,
      criticalThreshold: 0.12,
      history: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.012]
    },
    secondaryReading: {
      label: 'P-Wave EEW Latency',
      value: 12,
      unit: 'ms'
    }
  }
];

// Active Hazard Vulnerability Zones in Uttarakhand
export const HAZARD_ZONES: HazardZone[] = [
  {
    id: 'HZ-JOSHIMATH',
    name: 'Joshimath-Helang Active Subsidence & Slide Zone',
    nameHindi: 'जोशीमठ-हेलंग भू-धंसाव एवं भूस्खलन क्षेत्र',
    district: 'Chamoli',
    hazardType: 'landslide',
    threatLevel: 'CRITICAL',
    center: [30.556, 79.564],
    polygon: [
      [30.575, 79.540],
      [30.578, 79.585],
      [30.540, 79.595],
      [30.530, 79.550],
      [30.550, 79.535]
    ],
    riskScore: 89,
    keyFactors: ['Pore water pressure spike (84 kPa)', 'NH-58 toe erosion by Alaknanda', 'Ancient moraine debris foundation'],
    vulnerablePopulation: 18500,
    activeWarningMessage: 'Red Alert: Rapid shear creep detected in Sunil and Manohar Bagh wards. Keep emergency grab bags ready.',
    lastAssessed: '5 mins ago'
  },
  {
    id: 'HZ-KEDARNATH',
    name: 'Mandakini Valley Glacial Inundation & Flash Flood Path',
    nameHindi: 'मंदाकिनी घाटी ग्लेशियल एवं बाढ़ प्रवण गलियारा',
    district: 'Rudraprayag',
    hazardType: 'flood',
    threatLevel: 'WARNING',
    center: [30.635, 79.068],
    polygon: [
      [30.730, 79.060],
      [30.725, 79.085],
      [30.580, 79.080],
      [30.540, 79.055],
      [30.550, 79.030],
      [30.680, 79.035]
    ],
    riskScore: 78,
    keyFactors: ['High catchment rainfall (44.5 mm/hr)', 'Steep hydraulic chute 1:8 gradient', 'Chorabari moraine drainage monitoring'],
    vulnerablePopulation: 12400,
    activeWarningMessage: 'Orange Alert: Mandakini river stage rising at 3.8 cm/min. Pilgrim movement restricted near riverbanks.',
    lastAssessed: '12 mins ago'
  },
  {
    id: 'HZ-CHAMOLI-SEISMIC',
    name: 'Main Central Thrust (MCT) Chamoli-Gopeshwar Seismic Cluster',
    nameHindi: 'मुख्य केंद्रीय थ्रस्ट (MCT) चमोली-गोपेश्वर भूकंपीय क्लस्टर',
    district: 'Chamoli',
    hazardType: 'earthquake',
    threatLevel: 'ADVISORY',
    center: [30.415, 79.355],
    polygon: [
      [30.520, 79.200],
      [30.530, 79.520],
      [30.340, 79.540],
      [30.320, 79.220]
    ],
    riskScore: 62,
    keyFactors: ['Tectonic strain accumulation in Seismic Zone V', 'Micro-seismic swarm 14 events/24h', 'Historical 1999 Mw 6.8 zone'],
    vulnerablePopulation: 35000,
    activeWarningMessage: 'Yellow Advisory: P-wave detector sensors primed. Earthquake early warning system active with 10-18s lead time.',
    lastAssessed: '18 mins ago'
  },
  {
    id: 'HZ-DHAULIGANGA-GLOF',
    name: 'Rishiganga-Dhauliganga Glacial Outburst (GLOF) Gorge',
    nameHindi: 'ऋषिगंगा-धौलीगंगा हिमनद विस्फोट (GLOF) क्षेत्र',
    district: 'Chamoli',
    hazardType: 'flood',
    threatLevel: 'CRITICAL',
    center: [30.490, 79.660],
    polygon: [
      [30.530, 79.620],
      [30.545, 79.720],
      [30.450, 79.730],
      [30.440, 79.630]
    ],
    riskScore: 92,
    keyFactors: ['2021 disaster baseline similarity', 'Raini village downstream surge corridor', 'Upstream hanging glacier crevasse widening'],
    vulnerablePopulation: 6200,
    activeWarningMessage: 'Red Alert: Downstream Tapovan barrage sirens armed. Sirens will auto-broadcast if rate of rise exceeds 5 cm/min.',
    lastAssessed: 'Just now'
  },
  {
    id: 'HZ-VARUNAVAT',
    name: 'Uttarkashi Varunavat Mountain Slide Face',
    nameHindi: 'उत्तरकाशी वरुणावत पर्वत ढलान',
    district: 'Uttarkashi',
    hazardType: 'landslide',
    threatLevel: 'ADVISORY',
    center: [30.730, 78.445],
    polygon: [
      [30.745, 78.430],
      [30.748, 78.465],
      [30.718, 78.460],
      [30.715, 78.435]
    ],
    riskScore: 55,
    keyFactors: ['Shattered quartzites', 'Rainfall accumulation 118mm/24h', 'Direct threat to Tambakhani and Bus Stand'],
    vulnerablePopulation: 22000,
    activeWarningMessage: 'Yellow Alert: Regular InSAR displacement check in progress. Debris barrier nets intact.',
    lastAssessed: '25 mins ago'
  },
  {
    id: 'HZ-BALIANALA',
    name: 'Nainital Balia Nala Gorge Slope Subsidence',
    nameHindi: 'नैनीताल बलिया नाला ढलान भू-धंसाव',
    district: 'Nainital',
    hazardType: 'landslide',
    threatLevel: 'WARNING',
    center: [29.380, 79.470],
    polygon: [
      [29.395, 79.455],
      [29.398, 79.485],
      [29.365, 79.480],
      [29.368, 79.452]
    ],
    riskScore: 74,
    keyFactors: ['Steep limestone scree 45° angle', 'Toe erosion by seasonal drainage', 'Threat to Rais Hotel and Mallital ridge'],
    vulnerablePopulation: 14000,
    activeWarningMessage: 'Orange Alert: Subsidence rate 2.1mm/day. Residents on south slope advised to prepare evacuation kit.',
    lastAssessed: '30 mins ago'
  }
];

// Major Tectonic Fault Lines traversing Uttarakhand
export const TECTONIC_FAULTS: SeismicFaultLine[] = [
  {
    id: 'FAULT-MCT',
    name: 'Main Central Thrust (MCT)',
    code: 'MCT',
    description: 'Primary tectonic boundary where the Higher Himalaya is thrust over the Lesser Himalaya. Source of major seismic events.',
    depthKm: 14.2,
    slipRateMmPerYear: 18.5,
    path: [
      [30.88, 78.10],
      [30.75, 78.50],
      [30.55, 79.10],
      [30.48, 79.60],
      [30.30, 80.20],
      [30.10, 80.70]
    ]
  },
  {
    id: 'FAULT-MBT',
    name: 'Main Boundary Thrust (MBT)',
    code: 'MBT',
    description: 'Separates the Lesser Himalaya from the Sub-Himalayan Siwalik ranges. Runs south of Dehradun, Rishikesh, and Nainital.',
    depthKm: 18.0,
    slipRateMmPerYear: 12.0,
    path: [
      [30.45, 77.80],
      [30.32, 78.15],
      [30.12, 78.45],
      [29.75, 79.10],
      [29.40, 79.55],
      [29.25, 80.10]
    ]
  },
  {
    id: 'FAULT-ALAKNANDA',
    name: 'Alaknanda Fault / Tear Zone',
    code: 'AFZ',
    description: 'Cross-cutting transverse fault line across Chamoli and Rudraprayag, guiding steep river canyon incisions.',
    depthKm: 11.5,
    slipRateMmPerYear: 6.5,
    path: [
      [30.65, 79.50],
      [30.45, 79.40],
      [30.28, 79.10],
      [30.15, 78.80]
    ]
  }
];

// Safe Emergency Shelters & High-Ground Havens
export const SAFE_SHELTERS: SafeShelter[] = [
  {
    id: 'SH-JOSH-01',
    name: 'Pipalkoti High-Ground Sports Complex Safe Haven',
    location: 'Pipalkoti, Chamoli (NH-58)',
    coords: [30.435, 79.435],
    capacity: 2500,
    currentOccupancy: 380,
    facilities: ['Emergency Medical Trauma Bed', 'Satellite VHF Link', 'Helipad Access', 'Purified RO Water', 'Solar Microgrid'],
    contactPerson: 'Capt. Rawat (SDRF Cmdr)',
    contactNumber: '+91 1372 252107',
    elevationMeters: 1340,
    status: 'open'
  },
  {
    id: 'SH-JOSH-02',
    name: 'Joshimath Army Cantonment Transit Camp',
    location: 'Upper Joshimath Ridge',
    coords: [30.565, 79.575],
    capacity: 1800,
    currentOccupancy: 950,
    facilities: ['High-Altitude Tents', 'Army Mess Rations', 'Medical Corps Unit', 'Emergency Generators'],
    contactPerson: 'Subedar M. Joshi',
    contactNumber: '+91 1372 222144',
    elevationMeters: 2050,
    status: 'open'
  },
  {
    id: 'SH-KEDAR-01',
    name: 'Ukhimath Omkareshwar Community Shelter',
    location: 'Ukhimath Hill Plateau, Rudraprayag',
    coords: [30.525, 79.105],
    capacity: 3200,
    currentOccupancy: 620,
    facilities: ['Temple Trust Hall', 'Civil Supplies Stockpile', 'Mobile Ambulance Van', 'Wireless Relay'],
    contactPerson: 'SDM Ukhimath',
    contactNumber: '+91 1364 264210',
    elevationMeters: 1480,
    status: 'open'
  },
  {
    id: 'SH-UTTK-01',
    name: 'Dharasu ITBP Disaster Relief Camp',
    location: 'Dharasu Bend, Uttarkashi',
    coords: [30.630, 78.320],
    capacity: 2000,
    currentOccupancy: 150,
    facilities: ['ITBP Logistics Depot', 'Airstrip Support', 'Telemedicine Terminal', 'Emergency Fleet'],
    contactPerson: 'Inspector N. Negi',
    contactNumber: '+91 1374 222260',
    elevationMeters: 980,
    status: 'open'
  },
  {
    id: 'SH-NAIN-01',
    name: 'Bhowali Municipal Sports Stadium',
    location: 'Bhowali Ridge, Nainital',
    coords: [29.380, 79.520],
    capacity: 4000,
    currentOccupancy: 420,
    facilities: ['Indoor Stadium Hall', 'Kitchen Rations', 'Water Storage Tanks', 'Red Cross Unit'],
    contactPerson: 'Disaster Officer Nainital',
    contactNumber: '+91 1374 252100',
    elevationMeters: 1720,
    status: 'open'
  }
];

// Verified Evacuation Corridors
export const EVACUATION_ROUTES: EvacuationRoute[] = [
  {
    id: 'EV-01',
    name: 'Joshimath Sunil Ward -> Pipalkoti Safe Corridor',
    fromZone: 'HZ-JOSHIMATH',
    toShelter: 'SH-JOSH-01',
    path: [
      [30.556, 79.564],
      [30.520, 79.520],
      [30.480, 79.480],
      [30.435, 79.435]
    ],
    status: 'caution',
    distanceKm: 21.4,
    estTimeMinutes: 45
  },
  {
    id: 'EV-02',
    name: 'Gaurikund -> Ukhimath High Plateau Bypass',
    fromZone: 'HZ-KEDARNATH',
    toShelter: 'SH-KEDAR-01',
    path: [
      [30.590, 79.030],
      [30.560, 79.060],
      [30.535, 79.090],
      [30.525, 79.105]
    ],
    status: 'clear',
    distanceKm: 14.8,
    estTimeMinutes: 32
  },
  {
    id: 'EV-03',
    name: 'Raini Village -> Joshimath Upper Ridge Corridor',
    fromZone: 'HZ-DHAULIGANGA-GLOF',
    toShelter: 'SH-JOSH-02',
    path: [
      [30.490, 79.660],
      [30.510, 79.620],
      [30.540, 79.590],
      [30.565, 79.575]
    ],
    status: 'caution',
    distanceKm: 12.2,
    estTimeMinutes: 28
  }
];

// Historical Weather & Disaster Analogues for Pattern Matching
export const HISTORICAL_DISASTERS: HistoricalWeatherEvent[] = [
  {
    year: 2013,
    title: 'Kedarnath Valley Disaster & Cloudburst Event',
    dateRange: 'June 16-17, 2013',
    description: 'Catastrophic cloudburst coupled with sudden Chorabari glacial lake breach. Mandakini and Alaknanda basins experienced devastating hydraulic surge.',
    peakRainfall24hMm: 375,
    triggerMechanism: 'Multiple Cloudbursts + Orographic Monsoon Convergence + Glacial Lake Moraine Outburst',
    impactSummary: 'Over 5,700 fatalities; widespread debris torrents across Kedarnath, Rambara, and downstream valleys.',
    analogSimilarityScore: 74
  },
  {
    year: 2021,
    title: 'Chamoli GLOF & Rock-Ice Avalanche (Rishiganga)',
    dateRange: 'February 7, 2021',
    description: 'Massive hanging rock and ice wedge detachment from Ronti peak (5,600m) triggered a flash flood surge through Rishiganga and Dhauliganga valleys.',
    peakRainfall24hMm: 45,
    triggerMechanism: 'Hanging Glacier Detachment + Thermal Stress Freeze-Thaw + High-velocity Hydrodynamic Slurry',
    impactSummary: 'Tapovan hydel project inundated; 204 casualties; catastrophic scour in steep canyon.',
    analogSimilarityScore: 82
  },
  {
    year: 1999,
    title: 'Chamoli Mw 6.8 Earthquake',
    dateRange: 'March 29, 1999',
    description: 'Rupture along the Main Central Thrust (MCT) with focal depth 15km. Widespread secondary slope failures and rockfalls throughout Chamoli and Rudraprayag.',
    peakRainfall24hMm: 0,
    triggerMechanism: 'Underthrusting of the Indian Plate along Main Central Thrust (MCT)',
    impactSummary: 'Over 100 lives lost, widespread crack development across Joshimath, Gopeshwar, and Pipalkoti hillside dwellings.',
    analogSimilarityScore: 61
  },
  {
    year: 1991,
    title: 'Uttarkashi Mw 6.8 Earthquake',
    dateRange: 'October 20, 1991',
    description: 'Shallow crustal seismic rupture in the Bhagirathi river basin causing immense landslide blockages along Gangotri road.',
    peakRainfall24hMm: 0,
    triggerMechanism: 'Bhagirathi Tear Fault / MCT Conjugate Zone Rupture',
    impactSummary: 'Over 700 dead, hundreds of mountain slopes destabilized leading to subsequent monsoon slides.',
    analogSimilarityScore: 48
  }
];

// Multi-year Monsoon Precipitation Baseline (Uttarakhand normals mm/month)
export const MONSOON_CLIMATOLOGY = [
  { month: 'May (Pre-Monsoon)', normalRainfallMm: 68, current2026RainfallMm: 85, alertThresholdMm: 110 },
  { month: 'June (Onset)', normalRainfallMm: 172, current2026RainfallMm: 230, alertThresholdMm: 260 },
  { month: 'July (Peak)', normalRainfallMm: 420, current2026RainfallMm: 512, alertThresholdMm: 550 },
  { month: 'August (Peak)', normalRainfallMm: 390, current2026RainfallMm: 468, alertThresholdMm: 520 },
  { month: 'September (Retreat)', normalRainfallMm: 185, current2026RainfallMm: 245, alertThresholdMm: 280 }
];

// Pre-configured Disaster Drill Scenarios
export const DRILL_SCENARIOS = [
  {
    id: 'SCENARIO-CLOUDBURST-KEDARNATH',
    title: 'Extreme Cloudburst Over Kedarnath Valley (Mandakini River Surge)',
    description: 'Simulates a sudden localized 85mm/hr cloudburst at 3,100m elevation. River stage spikes by 4.2m and triggers Mandakini flash flood sirens.',
    hazardType: 'flood' as const,
    districtFocus: 'Rudraprayag',
    affectedCount: 16800,
    targetCoords: [30.655, 79.066] as [number, number]
  },
  {
    id: 'SCENARIO-LANDSLIDE-JOSHIMATH',
    title: 'Joshimath Ward-7 Rapid Slope Subsidence & Toe Collapse',
    description: 'Pore pressure spikes to 94 kPa; borehole shear strain accelerates to 6.8 mm/day on NH-58 slope corridor.',
    hazardType: 'landslide' as const,
    districtFocus: 'Chamoli',
    affectedCount: 21500,
    targetCoords: [30.557, 79.566] as [number, number]
  },
  {
    id: 'SCENARIO-EARTHQUAKE-MCT',
    title: 'Mw 6.4 MCT Rupture near Pipalkoti (P-Wave EEW Alert)',
    description: 'Simulates primary P-wave detection on Chamoli broadband seismometers with PGA 0.22%g, providing 14 seconds early warning for downstream towns.',
    hazardType: 'earthquake' as const,
    districtFocus: 'Chamoli',
    affectedCount: 48000,
    targetCoords: [30.431, 79.431] as [number, number]
  },
  {
    id: 'SCENARIO-GLOF-DHAULIGANGA',
    title: 'Glacial Lake Moraine Outburst at Rishiganga (GLOF)',
    description: 'Simulates sudden glacial moraine breach releasing 1.8M m³ of water-debris slurry towards Tapovan barrage.',
    hazardType: 'flood' as const,
    districtFocus: 'Chamoli',
    affectedCount: 8900,
    targetCoords: [30.493, 79.626] as [number, number]
  }
];
