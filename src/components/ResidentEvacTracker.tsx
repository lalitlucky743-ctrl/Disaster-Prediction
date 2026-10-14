import React from 'react';
import { SAFE_SHELTERS } from '../data/uttarakhandData';
import { Shield, Phone, Users, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';

interface ResidentEvacTrackerProps {
  onFocusShelter: (coords: [number, number]) => void;
}

export const ResidentEvacTracker: React.FC<ResidentEvacTrackerProps> = ({ onFocusShelter }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              Safe Havens & Emergency Shelters
            </h3>
            <span className="text-xs text-slate-400">
              Verified high-ground evacuation points with medical & satellite links
            </span>
          </div>
        </div>

        {/* Emergency Helplines Pill */}
        <div className="hidden sm:flex items-center gap-3 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-mono">
          <span className="text-slate-400 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>USDMA:</span> <strong className="text-white">1070</strong>
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-400">
            <span>SDRF:</span> <strong className="text-white">112</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SAFE_SHELTERS.map((shelter) => {
          const occupancyPct = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
          const isHigh = occupancyPct >= 80;

          return (
            <div
              key={shelter.id}
              className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{shelter.name}</h4>
                  <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                    {shelter.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">{shelter.location}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-500 font-mono">{shelter.elevationMeters}m</span>
                </div>

                {/* Capacity Progress */}
                <div className="bg-slate-900 rounded-lg p-2 border border-slate-800 mb-2">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Occupancy</span>
                    <span className="font-mono font-bold text-slate-200">
                      {shelter.currentOccupancy} / {shelter.capacity} ({occupancyPct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isHigh ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                </div>

                {/* Facilities Tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {shelter.facilities.slice(0, 3).map((fac, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded text-[9px] bg-slate-900 text-slate-400 border border-slate-800"
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px]">
                <span className="text-slate-400 truncate max-w-[130px]">
                  {shelter.contactPerson}
                </span>
                <button
                  onClick={() => onFocusShelter(shelter.coords)}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  Locate on Map
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
