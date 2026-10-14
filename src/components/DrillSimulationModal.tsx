import React from 'react';
import { DisasterScenario } from '../types/disaster';
import { DRILL_SCENARIOS } from '../data/uttarakhandData';
import { Play, RotateCcw, AlertTriangle, Flame, ShieldAlert, Navigation } from 'lucide-react';

interface DrillSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyScenario: (scenario: DisasterScenario) => void;
  onResetToNormal: () => void;
}

export const DrillSimulationModal: React.FC<DrillSimulationModalProps> = ({
  isOpen,
  onClose,
  onApplyScenario,
  onResetToNormal
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-2xl w-full p-6 text-left overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Disaster Drill & Simulation Studio</h3>
              <p className="text-xs text-slate-400">
                Trigger real-time disaster stress tests to evaluate early warning alarms, sensor spikes and resident evacuation notifications.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Scenarios List */}
        <div className="space-y-3 mb-6">
          {DRILL_SCENARIOS.map((scenario) => {
            const isLandslide = scenario.hazardType === 'landslide';
            const isFlood = scenario.hazardType === 'flood';
            const isQuake = scenario.hazardType === 'earthquake';

            const badgeColor = isLandslide
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : isFlood
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40';

            return (
              <div
                key={scenario.id}
                className="group p-4 bg-slate-950/60 border border-slate-800 hover:border-slate-600 rounded-2xl transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${badgeColor}`}>
                        {scenario.hazardType}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        📍 {scenario.districtFocus} District
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {scenario.title}
                    </h4>
                  </div>

                  <button
                    onClick={() => {
                      onApplyScenario(scenario);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/30 transition-all shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Inject Event</span>
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-2">
                  {scenario.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <span>Targeted Resident Push Receivers: <strong>{scenario.affectedCount.toLocaleString()}</strong></span>
                  <span className="font-mono text-slate-500">Coordinates: {scenario.targetCoords.join(', ')}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with Reset Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              onResetToNormal();
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Reset All Sensors to Normal Baseline</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
