import React from 'react';
import { PredictionResult } from '../types/disaster';
import { Mountain, Waves, Activity, AlertOctagon, Clock, ArrowUpRight, ShieldAlert } from 'lucide-react';

interface PredictiveRiskCardsProps {
  predictions: PredictionResult;
  onFocusHazard: (hazardType: 'landslide' | 'flood' | 'earthquake') => void;
  onTriggerAlert: (hazardType: 'landslide' | 'flood' | 'earthquake') => void;
}

export const PredictiveRiskCards: React.FC<PredictiveRiskCardsProps> = ({
  predictions,
  onFocusHazard,
  onTriggerAlert
}) => {
  const { landslide, flood, earthquake } = predictions;

  const getThreatBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">Critical Alert</span>;
      case 'WARNING':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40">Warning</span>;
      case 'ADVISORY':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">Advisory</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">Normal</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Landslide Predictive Engine */}
      <div className="relative group bg-slate-900/90 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-4 shadow-xl transition-all duration-300 backdrop-blur-md overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:bg-amber-500/10 transition-colors" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Mountain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                Landslide Engine
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Slope Instability Model</span>
            </div>
          </div>
          {getThreatBadge(landslide.status)}
        </div>

        {/* Probability Meter */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xs text-slate-400">Failure Probability</span>
            <span className="text-xl font-black text-amber-400 font-mono">{landslide.probability}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                landslide.probability >= 75 ? 'bg-red-500' : landslide.probability >= 50 ? 'bg-amber-500' : 'bg-cyan-500'
              }`}
              style={{ width: `${landslide.probability}%` }}
            />
          </div>
        </div>

        {/* Technical Scientific Parameters */}
        <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 mb-3">
          <div>
            <div className="text-slate-500">Factor of Safety (FoS)</div>
            <div className={`font-mono font-bold ${landslide.factorOfSafety < 1.0 ? 'text-red-400' : landslide.factorOfSafety < 1.25 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {landslide.factorOfSafety} <span className="text-[10px] text-slate-500 font-normal">{landslide.factorOfSafety < 1.0 ? '(Unstable)' : '(Equilibrium)'}</span>
            </div>
          </div>
          <div>
            <div className="text-slate-500">Soil Saturation</div>
            <div className="font-mono font-bold text-slate-200">{landslide.saturationPercentage}%</div>
          </div>
          <div>
            <div className="text-slate-500">Antecedent Rain (API)</div>
            <div className="font-mono font-bold text-slate-200">{landslide.antecedentPrecipitationMm} mm</div>
          </div>
          <div>
            <div className="text-slate-500">Failure Window</div>
            <div className="font-mono font-bold text-amber-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>{landslide.estimatedFailureWindowHours ? `~${landslide.estimatedFailureWindowHours}h` : 'Low Risk'}</span>
            </div>
          </div>
        </div>

        {/* Hotspot Slope & Quick Action */}
        <div className="text-[11px] text-slate-400 mb-3 line-clamp-1">
          <span className="text-slate-500">Critical: </span>
          <span className="text-slate-300 font-medium">{landslide.highestRiskSlope}</span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
          <button
            onClick={() => onFocusHazard('landslide')}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            <span>Inspect Slopes</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </button>
          <button
            onClick={() => onTriggerAlert('landslide')}
            className="flex items-center justify-center gap-1 py-1.5 px-2.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 text-xs font-bold rounded-lg transition-all"
            title="Send Push Alert for Landslide Risk"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Push Alert</span>
          </button>
        </div>
      </div>

      {/* 2. Flash Flood & GLOF Predictive Engine */}
      <div className="relative group bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 rounded-2xl p-4 shadow-xl transition-all duration-300 backdrop-blur-md overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-full pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Waves className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                Flood & GLOF Engine
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Hydrodynamic Surge Model</span>
            </div>
          </div>
          {getThreatBadge(flood.status)}
        </div>

        {/* Probability Meter */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xs text-slate-400">Surge Probability</span>
            <span className="text-xl font-black text-cyan-400 font-mono">{flood.probability}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                flood.probability >= 75 ? 'bg-red-500' : flood.probability >= 50 ? 'bg-cyan-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${flood.probability}%` }}
            />
          </div>
        </div>

        {/* Technical Scientific Parameters */}
        <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 mb-3">
          <div>
            <div className="text-slate-500">River Stage Height</div>
            <div className="font-mono font-bold text-slate-200">
              {flood.currentStageMeters} m <span className="text-[10px] text-slate-500">/ {flood.dangerLevelMeters}m</span>
            </div>
          </div>
          <div>
            <div className="text-slate-500">Rate of Rise</div>
            <div className={`font-mono font-bold ${flood.surgeRateCmPerMin >= 3.0 ? 'text-red-400' : 'text-cyan-400'}`}>
              +{flood.surgeRateCmPerMin} cm/min
            </div>
          </div>
          <div>
            <div className="text-slate-500">Catchment Rainfall</div>
            <div className="font-mono font-bold text-slate-200">{flood.upstreamRainRateMmHr} mm/hr</div>
          </div>
          <div>
            <div className="text-slate-500">Surge Wave Arrival</div>
            <div className="font-mono font-bold text-cyan-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{flood.downstreamPeakEtaMinutes ? `~${flood.downstreamPeakEtaMinutes} min` : 'Safe Level'}</span>
            </div>
          </div>
        </div>

        {/* Critical Basin & Quick Action */}
        <div className="text-[11px] text-slate-400 mb-3 line-clamp-1">
          <span className="text-slate-500">Basin: </span>
          <span className="text-slate-300 font-medium">{flood.highestRiskBasin}</span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
          <button
            onClick={() => onFocusHazard('flood')}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            <span>Inspect Basins</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </button>
          <button
            onClick={() => onTriggerAlert('flood')}
            className="flex items-center justify-center gap-1 py-1.5 px-2.5 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/40 text-xs font-bold rounded-lg transition-all"
            title="Send Push Alert for Flash Flood"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Push Alert</span>
          </button>
        </div>
      </div>

      {/* 3. Earthquake Early Warning & Seismicity Engine */}
      <div className="relative group bg-slate-900/90 border border-slate-800 hover:border-rose-500/60 rounded-2xl p-4 shadow-xl transition-all duration-300 backdrop-blur-md overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-bl-full pointer-events-none group-hover:bg-rose-500/10 transition-colors" />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                Earthquake & EEW
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">P-Wave Seismicity Engine</span>
            </div>
          </div>
          {getThreatBadge(earthquake.status)}
        </div>

        {/* Probability Meter */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-xs text-slate-400">Seismic Probability</span>
            <span className="text-xl font-black text-rose-400 font-mono">{earthquake.probability}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                earthquake.probability >= 70 ? 'bg-red-500' : earthquake.probability >= 45 ? 'bg-rose-500' : 'bg-slate-600'
              }`}
              style={{ width: `${earthquake.probability}%` }}
            />
          </div>
        </div>

        {/* Technical Scientific Parameters */}
        <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 mb-3">
          <div>
            <div className="text-slate-500">Peak Ground Accel (PGA)</div>
            <div className="font-mono font-bold text-slate-200">{earthquake.peakGroundAccelerationG} %g</div>
          </div>
          <div>
            <div className="text-slate-500">24h Swarm Count</div>
            <div className="font-mono font-bold text-rose-300">{earthquake.swarmFrequencyPerDay} events</div>
          </div>
          <div>
            <div className="text-slate-500">Latest Micro-Mag</div>
            <div className="font-mono font-bold text-slate-200">M{earthquake.latestMicroMag}</div>
          </div>
          <div>
            <div className="text-slate-500">EEW Lead Time</div>
            <div className="font-mono font-bold text-emerald-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" />
              <span>{earthquake.eewLeadTimeSeconds}s advance</span>
            </div>
          </div>
        </div>

        {/* Fault Focus & Quick Action */}
        <div className="text-[11px] text-slate-400 mb-3 line-clamp-1">
          <span className="text-slate-500">Fault: </span>
          <span className="text-slate-300 font-medium">{earthquake.dominantFault}</span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
          <button
            onClick={() => onFocusHazard('earthquake')}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            <span>Inspect Faults</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </button>
          <button
            onClick={() => onTriggerAlert('earthquake')}
            className="flex items-center justify-center gap-1 py-1.5 px-2.5 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-slate-950 border border-rose-500/40 text-xs font-bold rounded-lg transition-all"
            title="Send Push Alert for Earthquake"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Push Alert</span>
          </button>
        </div>
      </div>
    </div>
  );
};
