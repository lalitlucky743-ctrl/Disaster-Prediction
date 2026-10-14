import React from 'react';
import { BasemapOption } from '../types/disaster';
import { BASEMAP_GALLERY } from '../data/uttarakhandData';
import { Layers, Check, Mountain, Moon, Sun, Globe, Map } from 'lucide-react';

interface BasemapGalleryProps {
  currentBasemapId: string;
  onSelectBasemap: (basemap: BasemapOption) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const BasemapGallerySelector: React.FC<BasemapGalleryProps> = ({
  currentBasemapId,
  onSelectBasemap,
  isOpen,
  onToggle
}) => {
  const current = BASEMAP_GALLERY.find(b => b.id === currentBasemapId) || BASEMAP_GALLERY[0];

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'topographic': return <Mountain className="w-4 h-4 text-emerald-400" />;
      case 'dark': return <Moon className="w-4 h-4 text-purple-400" />;
      case 'light': return <Sun className="w-4 h-4 text-amber-400" />;
      case 'satellite': return <Globe className="w-4 h-4 text-blue-400" />;
      default: return <Map className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="relative z-[1000]">
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900/90 hover:bg-slate-800 text-slate-100 rounded-xl border border-slate-700/80 shadow-2xl backdrop-blur-md transition-all group"
        title="OpenStreetMap Basemap Gallery"
      >
        <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
          <Layers className="w-3.5 h-3.5" />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">OSM Basemap Gallery</div>
          <div className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">{current.name}</div>
        </div>
        <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-700/50">
          {BASEMAP_GALLERY.length}
        </span>
      </button>

      {/* Gallery Dropdown / Modal */}
      {isOpen && (
        <div className="absolute top-12 left-0 w-80 sm:w-96 bg-slate-900/95 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-xl p-4 z-[1001] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">OpenStreetMap Basemap Gallery</h3>
            </div>
            <button
              onClick={onToggle}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            Select high-precision cartography for steep Himalayan valleys, glacial crests and tectonic faults.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
            {BASEMAP_GALLERY.map((option) => {
              const isSelected = option.id === currentBasemapId;
              return (
                <div
                  key={option.id}
                  onClick={() => {
                    onSelectBasemap(option);
                    onToggle();
                  }}
                  className={`group relative flex flex-col p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                      : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  {/* Thumbnail Banner */}
                  <div className="relative w-full h-20 rounded-lg overflow-hidden mb-2 bg-slate-950">
                    <img
                      src={option.thumbnailUrl}
                      alt={option.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    <div className="absolute top-1.5 left-1.5 bg-slate-900/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-300 flex items-center gap-1 border border-slate-700/60">
                      {getIcon(option.category)}
                      <span className="capitalize">{option.category}</span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {option.name}
                    </span>
                    {option.id === 'osm_standard' && (
                      <span className="shrink-0 text-[8px] font-black uppercase px-1.5 py-0.2 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 tracking-wider">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                    {option.description}
                  </div>

                  <div className="mt-2 text-[10px] text-slate-500 font-mono truncate">
                    Provider: {option.provider}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Center: 30.31°N, 79.15°E (Uttarakhand)</span>
            <span className="text-cyan-400 font-mono">OSM Protocol</span>
          </div>
        </div>
      )}
    </div>
  );
};
