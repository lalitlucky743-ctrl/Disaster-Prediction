import React, { useState } from 'react';
import { HistoricalWeatherEvent } from '../types/disaster';
import {
  HISTORICAL_DISASTERS,
  MONSOON_CLIMATOLOGY
} from '../data/uttarakhandData';
import {
  History,
  CloudRain,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';

interface HistoricalWeatherPanelProps {
  onLoadHistoricalAnalogue?: (event: HistoricalWeatherEvent) => void;
}

export const HistoricalWeatherPanel: React.FC<HistoricalWeatherPanelProps> = ({
  onLoadHistoricalAnalogue
}) => {
  const [selectedEvent, setSelectedEvent] = useState<HistoricalWeatherEvent>(HISTORICAL_DISASTERS[0]);
  const [activeTab, setActiveTab] = useState<'analogues' | 'climatology'>('analogues');

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Historical Weather Patterns & Disaster Analogues
            </h3>
            <p className="text-xs text-slate-400">
              Pattern matching current IoT telemetry against catastrophic Himalayan historical baselines
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('analogues')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'analogues'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Disaster Benchmarks
          </button>
          <button
            onClick={() => setActiveTab('climatology')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'climatology'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monsoon Climatology
          </button>
        </div>
      </div>

      {activeTab === 'analogues' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Disaster Event List (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Historical Calamities
            </div>
            {HISTORICAL_DISASTERS.map((evt) => {
              const isSelected = selectedEvent.year === evt.year;
              return (
                <div
                  key={evt.year}
                  onClick={() => setSelectedEvent(evt)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500 shadow-md ring-1 ring-purple-500/40'
                      : 'bg-slate-950/50 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white line-clamp-1">{evt.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700">
                      {evt.year}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{evt.dateRange}</span>
                    </span>
                    <span className="text-amber-400 font-mono font-semibold">
                      {evt.analogSimilarityScore}% Analogy Match
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Disaster In-depth Analysis (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
                  Disaster Case Study #{selectedEvent.year}
                </span>
                <span className="text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                  {selectedEvent.analogSimilarityScore}% Current Telemetry Match
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-2 leading-snug">
                {selectedEvent.title}
              </h4>

              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                {selectedEvent.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">24h Peak Downpour</div>
                  <div className="text-sm font-extrabold text-cyan-400 font-mono mt-0.5">
                    {selectedEvent.peakRainfall24hMm > 0 ? `${selectedEvent.peakRainfall24hMm} mm` : 'Seismic (Tectonic)'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Trigger Mechanism</div>
                  <div className="text-xs font-semibold text-slate-200 mt-0.5 line-clamp-1">
                    {selectedEvent.triggerMechanism}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-red-950/30 border border-red-900/60 rounded-xl text-xs text-red-200 mb-2">
                <strong>Catastrophic Consequence: </strong>
                {selectedEvent.impactSummary}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Predictive Early Alert Threshold: <strong>70% Analogy</strong></span>
              {onLoadHistoricalAnalogue && (
                <button
                  onClick={() => onLoadHistoricalAnalogue(selectedEvent)}
                  className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold"
                >
                  <span>Apply Pattern to Live Model</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Monsoon Climatology Charts */
        <div className="space-y-4">
          <div className="text-xs text-slate-400">
            Comparison of multi-year historical monsoon normals against current 2026 precipitation and critical debris-flow alert thresholds:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {MONSOON_CLIMATOLOGY.map((month) => {
              const isOverAlert = month.current2026RainfallMm >= month.alertThresholdMm;
              const percentOfThreshold = Math.min(100, Math.round((month.current2026RainfallMm / month.alertThresholdMm) * 100));

              return (
                <div key={month.month} className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-300 line-clamp-1 mb-2">
                    {month.month}
                  </div>

                  {/* Progress bar comparison */}
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Normal:</span>
                      <span className="text-slate-300 font-mono">{month.normalRainfallMm} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">2026 Live:</span>
                      <span className={`font-mono font-bold ${isOverAlert ? 'text-red-400' : 'text-cyan-400'}`}>
                        {month.current2026RainfallMm} mm
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-500">Alert Trigger:</span>
                      <span className="text-amber-400 font-mono">{month.alertThresholdMm} mm</span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full ${isOverAlert ? 'bg-red-500' : 'bg-cyan-500'}`}
                        style={{ width: `${percentOfThreshold}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Current seasonal precipitation is trending <strong>+22% above</strong> the 30-year IMD Himalayan baseline.</span>
            </span>
            <span className="text-amber-400 font-bold">Heightened Slope Pore-Pressure</span>
          </div>
        </div>
      )}
    </div>
  );
};
