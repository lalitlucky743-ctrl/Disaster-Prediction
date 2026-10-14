import React from 'react';
import { ThreatLevel } from '../types/disaster';
import {
  ShieldAlert,
  Flame,
  Bot,
  Volume2,
  VolumeX,
  Bell,
  Activity,
  Layers
} from 'lucide-react';

interface NavbarProps {
  threatLevel: ThreatLevel;
  onOpenDrillModal: () => void;
  onOpenAiModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  permissionStatus: NotificationPermission;
  onRequestPermission: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  threatLevel,
  onOpenDrillModal,
  onOpenAiModal,
  isMuted,
  onToggleMute,
  permissionStatus,
  onRequestPermission
}) => {
  const getThreatStyle = (level: ThreatLevel) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse';
      case 'WARNING':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'ADVISORY':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <header className="sticky top-0 z-[1100] bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-600/30 border border-white/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                  <span>Uttarakhand Disaster Sentinel</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                  DEWS v2.6
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Landslide • Flash Flood & GLOF • Earthquake EEW • OSM Gallery
              </p>
            </div>
          </div>

          {/* Mobile Threat Badge */}
          <div className="md:hidden">
            <span className={`px-2.5 py-1 rounded-xl text-xs font-black uppercase border ${getThreatStyle(threatLevel)}`}>
              {threatLevel}
            </span>
          </div>
        </div>

        {/* Center / Right Action Controls */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
          {/* Desktop State Threat Badge */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">State Threat Level:</span>
            <span className={`px-2 py-0.5 rounded-lg text-[11px] font-black uppercase border ${getThreatStyle(threatLevel)}`}>
              {threatLevel}
            </span>
          </div>

          {/* Siren Audio Mute/Unmute */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-xl border text-xs font-medium transition-all ${
              isMuted
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                : 'bg-red-950/60 border-red-800 text-red-400 hover:bg-red-900/60'
            }`}
            title={isMuted ? 'Emergency Siren Muted' : 'Emergency Siren Armed'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Browser Push Permission Toggle */}
          {permissionStatus !== 'granted' && (
            <button
              onClick={onRequestPermission}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-800/60 rounded-xl text-xs font-semibold transition-all"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Enable Push</span>
            </button>
          )}

          {/* Disaster Drill Simulation Studio Button */}
          <button
            onClick={onOpenDrillModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/10"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Simulate Drill</span>
          </button>

          {/* Gemini AI Synthesis Button */}
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/20"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Risk Briefing</span>
          </button>
        </div>
      </div>
    </header>
  );
};
