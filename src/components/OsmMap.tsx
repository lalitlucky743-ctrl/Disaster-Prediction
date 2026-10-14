import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  SensorNode,
  HazardZone,
  SafeShelter,
  EvacuationRoute,
  SeismicFaultLine,
  BasemapOption
} from '../types/disaster';
import { BasemapGallerySelector } from './BasemapGallerySelector';
import {
  BASEMAP_GALLERY,
  HAZARD_ZONES,
  TECTONIC_FAULTS,
  SAFE_SHELTERS,
  EVACUATION_ROUTES
} from '../data/uttarakhandData';
import {
  Activity,
  AlertTriangle,
  Shield,
  Radio,
  Eye,
  Crosshair,
  Maximize2
} from 'lucide-react';

interface OsmMapProps {
  sensors: SensorNode[];
  selectedSensor: SensorNode | null;
  onSelectSensor: (sensor: SensorNode | null) => void;
  onTriggerQuickAlert: (zone: HazardZone) => void;
  focusedCoords?: [number, number] | null;
}

export const OsmMap: React.FC<OsmMapProps> = ({
  sensors,
  selectedSensor,
  onSelectSensor,
  onTriggerQuickAlert,
  focusedCoords
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layersGroupRef = useRef<{ [key: string]: L.LayerGroup }>({});

  const [activeBasemap, setActiveBasemap] = useState<BasemapOption>(BASEMAP_GALLERY[2]); // CartoDB Dark Matter default for high-contrast emergency ops
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Layer Toggles
  const [layerVisibility, setLayerVisibility] = useState({
    hazards: true,
    sensors: true,
    faults: true,
    shelters: true,
    routes: true,
  });

  // Center of Uttarakhand State
  const UTTARAKHAND_CENTER: [number, number] = [30.3165, 79.15];
  const DEFAULT_ZOOM = 8;

  // Initialize Map safely
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Guard against previous instance or react strict-mode re-mount
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    if ((mapContainerRef.current as any)._leaflet_id) {
      delete (mapContainerRef.current as any)._leaflet_id;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: UTTARAKHAND_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: true
      });

      // Custom Zoom Control top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Initial Tile Layer
      const tile = L.tileLayer(activeBasemap.url, {
        attribution: activeBasemap.attribution,
        maxZoom: activeBasemap.maxZoom,
        subdomains: activeBasemap.subdomains || ['a', 'b', 'c']
      }).addTo(map);

      tileLayerRef.current = tile;
      mapInstanceRef.current = map;

      // Initialize Layer Groups
      layersGroupRef.current = {
        hazards: L.layerGroup().addTo(map),
        faults: L.layerGroup().addTo(map),
        shelters: L.layerGroup().addTo(map),
        routes: L.layerGroup().addTo(map),
        sensors: L.layerGroup().addTo(map)
      };

      // Force recalculation of map viewport size after CSS layout settles
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 200);
    } catch (err: any) {
      console.error('Failed to initialize Leaflet Map:', err);
      setMapError(err?.message || 'Map failed to load');
    }

    // Cleanup
    return () => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      } catch (e) {
        // cleanup ignore
      }
    };
  }, []);

  // Update Basemap Layer when activeBasemap changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    try {
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }

      const newTile = L.tileLayer(activeBasemap.url, {
        attribution: activeBasemap.attribution,
        maxZoom: activeBasemap.maxZoom,
        subdomains: activeBasemap.subdomains || ['a', 'b', 'c']
      }).addTo(map);

      newTile.bringToBack();
      tileLayerRef.current = newTile;
    } catch (e) {
      console.warn('Basemap switch error:', e);
    }
  }, [activeBasemap]);

  // Pan to focused coords if supplied
  useEffect(() => {
    if (focusedCoords && mapInstanceRef.current) {
      try {
        mapInstanceRef.current.flyTo(focusedCoords, 11, {
          duration: 1.5
        });
      } catch (e) {
        // ignore
      }
    }
  }, [focusedCoords]);

  // Render & Update Static Geospatial Layers (Hazards, Faults, Shelters, Routes)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    try {
      const { hazards, faults, shelters, routes } = layersGroupRef.current;
      if (!hazards || !faults || !shelters || !routes) return;

      // 1. Hazard Zones
      hazards.clearLayers();
      if (layerVisibility.hazards) {
        HAZARD_ZONES.forEach((zone) => {
          const color =
            zone.threatLevel === 'CRITICAL'
              ? '#ef4444'
              : zone.threatLevel === 'WARNING'
              ? '#f59e0b'
              : '#06b6d4';

          const polygon = L.polygon(zone.polygon, {
            color: color,
            weight: 2,
            opacity: 0.85,
            fillColor: color,
            fillOpacity: zone.threatLevel === 'CRITICAL' ? 0.35 : 0.22,
            dashArray: zone.threatLevel === 'CRITICAL' ? '4, 4' : undefined
          });

          const popupContent = `
            <div style="font-family: inherit; font-size: 12px; color: #0f172a; min-width: 240px; padding: 2px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-weight: 700; color: #0f172a; font-size: 13px;">${zone.name}</span>
                <span style="background: ${color}20; color: ${color}; font-weight: 700; font-size: 10px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                  ${zone.threatLevel}
                </span>
              </div>
              <div style="color: #475569; font-size: 11px; margin-bottom: 6px;">${zone.nameHindi}</div>
              <div style="background: #f1f5f9; padding: 6px 8px; border-radius: 6px; margin-bottom: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                  <span style="color: #64748b;">Risk Index:</span>
                  <span style="font-weight: 700; color: ${color};">${zone.riskScore}%</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #64748b;">Vulnerable Residents:</span>
                  <span style="font-weight: 600; color: #1e293b;">${zone.vulnerablePopulation.toLocaleString()}</span>
                </div>
              </div>
              <div style="font-size: 11px; color: #334155; margin-bottom: 8px; line-height: 1.3;">
                <strong>Active Advisory:</strong> ${zone.activeWarningMessage}
              </div>
              <button id="alert-btn-${zone.id}" style="width: 100%; background: #ef4444; color: white; border: none; border-radius: 6px; padding: 6px 10px; font-weight: 600; font-size: 11px; cursor: pointer;">
                🚨 Broadcast Push Alert to Residents
              </button>
            </div>
          `;

          polygon.bindPopup(popupContent);
          polygon.on('popupopen', () => {
            const btn = document.getElementById(`alert-btn-${zone.id}`);
            if (btn) {
              btn.onclick = () => {
                onTriggerQuickAlert(zone);
              };
            }
          });

          hazards.addLayer(polygon);
        });
      }

      // 2. Fault Lines
      faults.clearLayers();
      if (layerVisibility.faults) {
        TECTONIC_FAULTS.forEach((fault) => {
          const polyline = L.polyline(fault.path, {
            color: '#e11d48',
            weight: 3.5,
            opacity: 0.8,
            dashArray: '8, 6'
          });

          polyline.bindPopup(`
            <div style="font-family: inherit; font-size: 12px; color: #0f172a; min-width: 200px;">
              <div style="font-weight: 700; font-size: 13px; color: #e11d48;">${fault.name} (${fault.code})</div>
              <p style="font-size: 11px; color: #475569; margin: 4px 0 8px;">${fault.description}</p>
              <div style="background: #f8fafc; padding: 6px; border-radius: 4px; font-size: 11px;">
                <div><strong>Depth:</strong> ${fault.depthKm} km</div>
                <div><strong>Slip Rate:</strong> ${fault.slipRateMmPerYear} mm/year</div>
              </div>
            </div>
          `);
          faults.addLayer(polyline);
        });
      }

      // 3. Shelters
      shelters.clearLayers();
      if (layerVisibility.shelters) {
        SAFE_SHELTERS.forEach((shelter) => {
          const shelterIcon = L.divIcon({
            className: 'custom-shelter-marker',
            html: `
              <div style="
                width: 28px;
                height: 28px;
                background: #10b981;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid white;
                box-shadow: 0 4px 10px rgba(0,0,0,0.35);
                font-size: 14px;
              ">
                🛡️
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          const marker = L.marker(shelter.coords, { icon: shelterIcon });
          marker.bindPopup(`
            <div style="font-family: inherit; font-size: 12px; color: #0f172a; min-width: 220px;">
              <div style="font-weight: 700; font-size: 13px; color: #059669;">${shelter.name}</div>
              <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${shelter.location}</div>
              <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 6px; border-radius: 6px; margin-bottom: 6px;">
                <div style="display: flex; justify-content: space-between;">
                  <span>Capacity:</span>
                  <strong>${shelter.currentOccupancy} / ${shelter.capacity}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Elevation:</span>
                  <strong>${shelter.elevationMeters} m MSL</strong>
                </div>
              </div>
              <div style="font-size: 11px;">
                <strong>Emergency Officer:</strong> ${shelter.contactPerson} (${shelter.contactNumber})
              </div>
            </div>
          `);
          shelters.addLayer(marker);
        });
      }

      // 4. Evacuation Routes
      routes.clearLayers();
      if (layerVisibility.routes) {
        EVACUATION_ROUTES.forEach((route) => {
          const routeLine = L.polyline(route.path, {
            color: route.status === 'clear' ? '#10b981' : '#f59e0b',
            weight: 4,
            opacity: 0.75,
            dashArray: '6, 6'
          });

          routeLine.bindPopup(`
            <div style="font-family: inherit; font-size: 12px; color: #0f172a;">
              <strong>${route.name}</strong>
              <div style="font-size: 11px; color: #64748b;">Distance: ${route.distanceKm} km | Est. Travel Time: ${route.estTimeMinutes} min</div>
              <div style="margin-top: 4px; font-weight: 600; color: ${route.status === 'clear' ? '#059669' : '#d97706'}; text-transform: uppercase;">
                Status: ${route.status}
              </div>
            </div>
          `);
          routes.addLayer(routeLine);
        });
      }
    } catch (e) {
      console.warn('Geospatial layer render error:', e);
    }
  }, [layerVisibility, onTriggerQuickAlert]);

  // Update Dynamic Sensor Nodes Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    try {
      const sensorsLayer = layersGroupRef.current.sensors;
      if (!sensorsLayer) return;

      sensorsLayer.clearLayers();
      if (!layerVisibility.sensors) return;

      sensors.forEach((sensor) => {
        const isCritical = sensor.status === 'critical';
        const isWarning = sensor.status === 'warning';

        const statusColor = isCritical
          ? '#ef4444'
          : isWarning
          ? '#f59e0b'
          : '#10b981';

        let iconEmoji = '📡';
        if (sensor.type === 'piezometer') iconEmoji = '💧';
        if (sensor.type === 'inclinometer') iconEmoji = '📐';
        if (sensor.type === 'river_radar') iconEmoji = '🌊';
        if (sensor.type === 'seismograph') iconEmoji = '📉';
        if (sensor.type === 'aws_weather') iconEmoji = '🌧️';

        const isSelected = selectedSensor?.id === sensor.id;

        const sensorIcon = L.divIcon({
          className: 'custom-sensor-marker',
          html: `
            <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
              <div style="
                position: relative;
                width: ${isSelected ? '34px' : '28px'};
                height: ${isSelected ? '34px' : '28px'};
                background: ${statusColor};
                border: ${isSelected ? '3px solid #38bdf8' : '2px solid white'};
                border-radius: 50%;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 13px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                transition: all 0.2s ease;
              ">
                ${iconEmoji}
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker(sensor.coords, { icon: sensorIcon });

        const popupHtml = `
          <div style="font-family: inherit; font-size: 12px; color: #0f172a; min-width: 250px;">
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
              <span style="font-weight: 700; font-size: 13px;">${sensor.name}</span>
              <span style="font-size: 10px; background: ${statusColor}20; color: ${statusColor}; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
                ${sensor.status.toUpperCase()}
              </span>
            </div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
              📍 ${sensor.location} (${sensor.district}) | Elev: ${sensor.elevationMeters}m
            </div>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; margin-bottom: 8px;">
              <div style="font-size: 11px; color: #64748b;">${sensor.readings.label}</div>
              <div style="font-size: 18px; font-weight: 800; color: ${statusColor};">
                ${sensor.readings.value} <span style="font-size: 12px; font-weight: 500;">${sensor.readings.unit}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 10px; color: #64748b; margin-top: 4px;">
                <span>Normal Max: ${sensor.readings.normalMax} ${sensor.readings.unit}</span>
                <span>Crit Threshold: ${sensor.readings.criticalThreshold} ${sensor.readings.unit}</span>
              </div>
            </div>
            ${sensor.secondaryReading ? `
              <div style="font-size: 11px; color: #475569; margin-bottom: 6px; display: flex; justify-content: space-between;">
                <span>${sensor.secondaryReading.label}:</span>
                <strong>${sensor.secondaryReading.value} ${sensor.secondaryReading.unit}</strong>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 4px;">
              <span>Battery: ${sensor.batteryLevel}%</span>
              <span>Telemetry: ${sensor.lastUpdated}</span>
            </div>
          </div>
        `;

        marker.bindPopup(popupHtml);
        marker.on('click', () => {
          onSelectSensor(sensor);
        });

        sensorsLayer.addLayer(marker);
      });
    } catch (e) {
      console.warn('Sensors update error:', e);
    }
  }, [sensors, selectedSensor, layerVisibility.sensors, onSelectSensor]);

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.flyTo(UTTARAKHAND_CENTER, DEFAULT_ZOOM, { duration: 1 });
        onSelectSensor(null);
      } catch (e) {
        // ignore
      }
    }
  };

  return (
    <div className="relative w-full h-full min-h-[480px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {mapError && (
        <div className="absolute inset-0 z-50 bg-slate-900/90 flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle className="w-10 h-10 text-amber-400 mb-2" />
          <h3 className="text-sm font-bold text-white mb-1">Map Display Notice</h3>
          <p className="text-xs text-slate-400 max-w-sm mb-4">{mapError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold"
          >
            Reload Interface
          </button>
        </div>
      )}

      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[480px] z-0" />

      {/* Top Left: Basemap Gallery & Layer Toggles Header */}
      <div className="absolute top-4 left-4 z-[999] flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <BasemapGallerySelector
          currentBasemapId={activeBasemap.id}
          onSelectBasemap={(basemap) => setActiveBasemap(basemap)}
          isOpen={isGalleryOpen}
          onToggle={() => setIsGalleryOpen(!isGalleryOpen)}
        />

        {/* Quick View Control Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-xl">
          <button
            onClick={handleResetView}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Reset to Uttarakhand Overview"
          >
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span>State Center</span>
          </button>
        </div>
      </div>

      {/* Bottom Floating: Quick Layer Filter Pills */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-[999] flex flex-wrap items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-700/80 shadow-2xl">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
          Layers:
        </div>

        <button
          onClick={() => setLayerVisibility(v => ({ ...v, hazards: !v.hazards }))}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            layerVisibility.hazards
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Hazards</span>
        </button>

        <button
          onClick={() => setLayerVisibility(v => ({ ...v, sensors: !v.sensors }))}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            layerVisibility.sensors
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>IoT Sensors ({sensors.length})</span>
        </button>

        <button
          onClick={() => setLayerVisibility(v => ({ ...v, faults: !v.faults }))}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            layerVisibility.faults
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
              : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-rose-400" />
          <span>MCT/MBT Faults</span>
        </button>

        <button
          onClick={() => setLayerVisibility(v => ({ ...v, shelters: !v.shelters }))}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            layerVisibility.shelters
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Safe Shelters</span>
        </button>
      </div>

      {/* Map Legend Overlay (Top Right beneath Leaflet zoom) */}
      <div className="hidden lg:block absolute top-16 right-4 z-[990] bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 shadow-2xl text-[11px] text-slate-300 w-44">
        <div className="font-bold text-slate-100 uppercase tracking-wider mb-2 text-[10px] flex items-center justify-between">
          <span>Hazard Legend</span>
          <Eye className="w-3 h-3 text-cyan-400" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span>Critical Alert (Red)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Warning (Orange)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
            <span>Advisory (Cyan)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-0.5 bg-rose-500 border-t-2 border-dashed border-rose-400"></span>
            <span>Tectonic Thrust Fault</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px]">🛡️</span>
            <span>High-Ground Safe Camp</span>
          </div>
        </div>
      </div>
    </div>
  );
};
