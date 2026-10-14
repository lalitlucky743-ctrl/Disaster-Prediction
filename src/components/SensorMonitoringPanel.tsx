import React, { useState } from 'react';
import { SensorNode, SensorType } from '../types/disaster';
import {
  Activity,
  Droplets,
  Gauge,
  Waves,
  Radio,
  CloudRain,
  Battery,
  MapPin,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';

interface SensorMonitoringPanelProps {
  sensors: SensorNode[];
  selectedSensor: SensorNode | null;
  onSelectSensor: (sensor: SensorNode) => void;
}

export const SensorMonitoringPanel: React.FC<SensorMonitoringPanelProps> = ({
  sensors,
  selectedSensor,
  onSelectSensor
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSensors = sensors.filter((s) => {
    const matchesType = filterType === 'all' || s.type === filterType;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getSensorIcon = (type: SensorType) => {
    switch (type) {
      case 'piezometer':
        return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'inclinometer':
        return <Gauge className="w-4 h-4 text-amber-400" />;
      case 'river_radar':
        return <Waves className="w-4 h-4 text-cyan-400" />;
      case 'seismograph':
        return <Radio className="w-4 h-4 text-rose-400" />;
      case 'aws_weather':
        return <CloudRain className="w-4 h-4 text-indigo-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Real-Time IoT Sensor Telemetry
            </h3>
            <span className="text-xs text-slate-400">
              {sensors.length} Active Nodes (Piezometers, Inclinometers, Gauges & Seismographs)
            </span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search station or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Sensors</option>
            <option value="piezometer">Piezometer</option>
            <option value="inclinometer">Inclinometer</option>
            <option value="river_radar">River Radar</option>
            <option value="seismograph">Seismograph</option>
            <option value="aws_weather">AWS Weather</option>
          </select>
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto pr-1">
        {filteredSensors.map((sensor) => {
          const isSelected = selectedSensor?.id === sensor.id;
          const isCrit = sensor.status === 'critical';
          const isWarn = sensor.status === 'warning';

          const statusColor = isCrit
            ? 'text-red-400 bg-red-950/60 border-red-800'
            : isWarn
            ? 'text-amber-400 bg-amber-950/60 border-amber-800'
            : 'text-emerald-400 bg-emerald-950/60 border-emerald-800';

          const pctThreshold = Math.min(
            100,
            Math.round((sensor.readings.value / sensor.readings.criticalThreshold) * 100)
          );

          return (
            <div
              key={sensor.id}
              onClick={() => onSelectSensor(sensor)}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500 shadow-lg ring-1 ring-cyan-500/40'
                  : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700'
              }`}
            >
              {/* Card Top: Name & Status */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {getSensorIcon(sensor.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{sensor.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{sensor.id}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${statusColor}`}>
                  {sensor.status}
                </span>
              </div>

              {/* Location & Elevation */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span className="flex items-center gap-1 truncate max-w-[170px]">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">{sensor.location}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">{sensor.elevationMeters}m</span>
              </div>

              {/* Primary Reading Display */}
              <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 mb-2">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[10px] text-slate-400">{sensor.readings.label}</span>
                  <div className="text-right">
                    <span className={`text-base font-extrabold font-mono ${isCrit ? 'text-red-400' : isWarn ? 'text-amber-400' : 'text-slate-100'}`}>
                      {sensor.readings.value}
                    </span>
                    <span className="text-xs text-slate-400 font-medium ml-1">{sensor.readings.unit}</span>
                  </div>
                </div>

                {/* Progress bar towards critical threshold */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1.5">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCrit ? 'bg-red-500' : isWarn ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${pctThreshold}%` }}
                  />
                </div>

                <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                  <span>Normal: {sensor.readings.normalMax} {sensor.readings.unit}</span>
                  <span>Crit: {sensor.readings.criticalThreshold} {sensor.readings.unit}</span>
                </div>
              </div>

              {/* Sparkline History Bar Representation */}
              <div className="mb-2">
                <div className="text-[9px] text-slate-500 mb-1 flex items-center justify-between">
                  <span>Trend History (10 samples)</span>
                  <span>{isCrit ? '⚠️ Surging' : 'Stable'}</span>
                </div>
                <div className="flex items-end gap-1 h-6 w-full bg-slate-900/60 p-1 rounded border border-slate-800/80">
                  {sensor.readings.history.map((val, idx) => {
                    const heightPct = Math.max(15, Math.min(100, Math.round((val / sensor.readings.criticalThreshold) * 100)));
                    return (
                      <div
                        key={idx}
                        className={`flex-1 rounded-sm transition-all ${
                          val >= sensor.readings.criticalThreshold
                            ? 'bg-red-500'
                            : val >= sensor.readings.normalMax
                            ? 'bg-amber-400'
                            : 'bg-cyan-500/70'
                        }`}
                        style={{ height: `${heightPct}%` }}
                        title={`${val} ${sensor.readings.unit}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Card Footer: Battery & Timestamp */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                <span className="flex items-center gap-1 font-mono text-slate-400">
                  <Battery className="w-3 h-3 text-emerald-400" />
                  <span>{sensor.batteryLevel}%</span>
                </span>
                <span className="text-slate-500">Updated: {sensor.lastUpdated}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
