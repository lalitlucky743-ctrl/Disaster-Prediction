import React, { useState } from 'react';
import { PushAlert, HazardType, ThreatLevel } from '../types/disaster';
import {
  Bell,
  Send,
  Volume2,
  VolumeX,
  Smartphone,
  CheckCircle2,
  Radio,
  Users,
  ShieldAlert,
  Clock,
  Sparkles
} from 'lucide-react';
import { requestPushPermission, getPushPermissionStatus } from '../utils/notificationService';
import { playEmergencySiren, stopEmergencySiren } from '../utils/audioAlert';

interface PushNotificationManagerProps {
  alerts: PushAlert[];
  onBroadcastAlert: (alertData: Partial<PushAlert>) => void;
  permissionStatus: NotificationPermission;
  onRefreshPermission: () => void;
}

export const PushNotificationManager: React.FC<PushNotificationManagerProps> = ({
  alerts,
  onBroadcastAlert,
  permissionStatus,
  onRefreshPermission
}) => {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [selectedHazard, setSelectedHazard] = useState<HazardType>('landslide');
  const [selectedSeverity, setSelectedSeverity] = useState<ThreatLevel>('CRITICAL');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Chamoli');
  const [titleEnglish, setTitleEnglish] = useState<string>('Joshimath Ward-7: Immediate Evacuation Order');
  const [titleHindi, setTitleHindi] = useState<string>('जोशीमठ वार्ड 7: तुरंत सुरक्षित स्थल की ओर जाएं');
  const [messageEnglish, setMessageEnglish] = useState<string>('High-velocity slope displacement (3.8mm/day) & pore pressure surge detected. Move to Pipalkoti High-Ground Shelter immediately.');
  const [messageHindi, setMessageHindi] = useState<string>('भूस्खलन सेंसर में अत्यधिक हलचल दर्ज। तुरंत पीपलकोटी सुरक्षित शिविर की ओर प्रस्थान करें।');
  const [isSirenTesting, setIsSirenTesting] = useState(false);
  const [selectedResidentAlert, setSelectedResidentAlert] = useState<PushAlert | null>(alerts[0] || null);

  const districtsList = ['Chamoli', 'Rudraprayag', 'Uttarkashi', 'Pithoragarh', 'Tehri Garhwal', 'Nainital', 'Dehradun'];

  const handleRequestPermission = async () => {
    await requestPushPermission();
    onRefreshPermission();
  };

  const handleToggleSirenTest = () => {
    if (isSirenTesting) {
      stopEmergencySiren();
      setIsSirenTesting(false);
    } else {
      setIsSirenTesting(true);
      playEmergencySiren(4);
      setTimeout(() => setIsSirenTesting(false), 4000);
    }
  };

  const handlePresetSelect = (hazard: HazardType) => {
    setSelectedHazard(hazard);
    if (hazard === 'landslide') {
      setTitleEnglish('Landslide Alert: Active Slope Rupture Imminent');
      setTitleHindi('भूस्खलन चेतावनी: ढलान विस्थापन खतरा');
      setMessageEnglish('Continuous shear acceleration detected on mountain slopes. Avoid highway cuts and riverside terraces.');
      setMessageHindi('सड़क व ढलानों पर भूस्खलन की गंभीर आशंका। सुरक्षित पक्के भवनों व राहत शिविरों में जाएं।');
      setSelectedSeverity('CRITICAL');
    } else if (hazard === 'flood') {
      setTitleEnglish('Flash Flood & GLOF Surge Warning: River Basin Breach');
      setTitleHindi('बाढ़ व हिमनद विस्फोट चेतावनी: नदी तट तुरंत छोड़ें');
      setMessageEnglish('Upstream river stage rising at 4.2cm/min. Evacuate low-lying riverbeds to higher elevation within 20 mins.');
      setMessageHindi('नदी का जलस्तर तेजी से बढ़ रहा है। अगले 20 मिनट में नदी के किनारे खाली कर सुरक्षित ऊंचाई पर जाएं।');
      setSelectedSeverity('CRITICAL');
    } else if (hazard === 'earthquake') {
      setTitleEnglish('Earthquake Early Warning: Primary P-Wave Detected');
      setTitleHindi('भूकंप पूर्व चेतावनी: प्राथमिक तरंगे दर्ज');
      setMessageEnglish('MCT fault rupture detected. Strong shaking expected in 12-18 seconds. Drop, Cover, and Hold on.');
      setMessageHindi('भूकंप के झटके अपेक्षित। तुरंत खुले मैदान में जाएं या मजबूत मेज के नीचे शरण लें।');
      setSelectedSeverity('WARNING');
    }
  };

  const handleSubmitBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    onBroadcastAlert({
      hazardType: selectedHazard,
      severity: selectedSeverity,
      title: titleEnglish,
      titleHindi: titleHindi,
      message: messageEnglish,
      messageHindi: messageHindi,
      affectedDistricts: [selectedDistrict],
      targetedResidents: selectedDistrict === 'Chamoli' ? 18500 : 14200,
      evacuationRoutes: ['National Highway Corridor North', 'District Emergency Haven'],
      recommendedAction: selectedHazard === 'flood' ? 'Move to verified high ground immediately.' : 'Move to open grounds / registered shelter.'
    });
    setIsComposerOpen(false);
  };

  const activeAlert = selectedResidentAlert || alerts[0];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      {/* Header with Permission Status & Broadcast Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">
                Resident Push Notification Network
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-400 border border-red-800">
                <Radio className="w-3 h-3 animate-pulse" />
                Cell Broadcast & Web Push
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Immediate multi-channel alerts to affected citizens & tourist pilgrims across Uttarakhand
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Siren Test Button */}
          <button
            onClick={handleToggleSirenTest}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isSirenTesting
                ? 'bg-red-600 text-white border-red-500 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Test Civil Defense Audio Siren"
          >
            {isSirenTesting ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span>{isSirenTesting ? 'Siren Active...' : 'Test Siren'}</span>
          </button>

          {/* Browser Permission Badge / Button */}
          {permissionStatus !== 'granted' ? (
            <button
              onClick={handleRequestPermission}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-600/20 transition-all"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Enable Browser Push</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-950/60 text-emerald-300 border border-emerald-700/60 rounded-xl text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Browser Push Enabled</span>
            </div>
          )}

          {/* Dispatch Composer Button */}
          <button
            onClick={() => setIsComposerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/30 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast Alert</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Resident Phone Simulation + Recent Dispatches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive Resident Smartphone Simulator (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>Live Affected Resident Screen (Simulation)</span>
          </div>

          {/* Phone Frame */}
          <div className="relative w-full max-w-[280px] bg-slate-900 border-4 border-slate-700 rounded-[36px] shadow-2xl p-3 overflow-hidden">
            {/* Phone Notch & Speaker */}
            <div className="flex justify-center mb-3">
              <div className="w-20 h-4 bg-slate-800 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-900 mr-2"></div>
                <div className="w-8 h-1 bg-slate-700 rounded-full"></div>
              </div>
            </div>

            {/* Lock Screen Time */}
            <div className="text-center mb-4">
              <div className="text-3xl font-extralight text-white font-mono">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>

            {/* Urgent Notification Banner */}
            {activeAlert ? (
              <div className="bg-red-950/90 border border-red-500/80 rounded-2xl p-3 shadow-lg text-left backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-400">
                      Uttarakhand Disaster Alert
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">Just now</span>
                </div>

                <div className="text-xs font-bold text-white mb-1 leading-snug">
                  {activeAlert.title}
                </div>
                <div className="text-[11px] text-amber-200 font-medium mb-1.5 leading-snug">
                  {activeAlert.titleHindi}
                </div>

                <div className="text-[10px] text-slate-300 mb-2 leading-relaxed line-clamp-3">
                  {activeAlert.message}
                </div>

                {/* Direct Action Chips on Resident Phone */}
                <div className="space-y-1.5 pt-2 border-t border-red-800/60">
                  <div className="text-[9px] font-semibold text-emerald-400 flex items-center gap-1">
                    <span>🛡️ Safe Evac Haven:</span>
                    <span className="truncate">{activeAlert.evacuationRoutes?.[0] || 'Nearest High Ground'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-700 text-slate-300">
                    <span>USDMA Helpline: <strong>1070 / 112</strong></span>
                    <span className="text-cyan-400 font-bold">ACKNOWLEDGED</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                No active critical alert dispatched yet.
              </div>
            )}

            {/* Phone Home Bar */}
            <div className="flex justify-center mt-6 mb-1">
              <div className="w-24 h-1 bg-slate-600 rounded-full"></div>
            </div>
          </div>

          <div className="mt-3 text-center text-[10px] text-slate-400">
            Push alerts are sent over Cellular Towers (CAP/Cell Broadcast) and Browser Web Push API.
          </div>
        </div>

        {/* Right: Broadcast Registry & Active Alerts (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Recent Alert Broadcast History ({alerts.length})</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Avg Delivery Time: 1.4s</span>
            </div>

            <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
              {alerts.map((alert) => {
                const isSelected = activeAlert?.id === alert.id;
                const isCrit = alert.severity === 'CRITICAL';
                return (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedResidentAlert(alert)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-500/40'
                        : 'bg-slate-950/50 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isCrit ? 'bg-red-500 animate-pulse' : 'bg-amber-400'}`} />
                        <span className="text-xs font-bold text-white line-clamp-1">{alert.title}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                        isCrit ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                      {alert.message}
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-slate-300 font-medium">
                          <Users className="w-3 h-3 text-cyan-400" />
                          <span>{alert.targetedResidents.toLocaleString()} residents</span>
                        </span>
                        <span className="text-emerald-400 font-mono font-bold">
                          {alert.deliveryRate}% delivered
                        </span>
                      </div>
                      <span className="font-mono text-slate-500">
                        {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Preset Alert Dispatch Buttons */}
          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Quick One-Click Dispatch Templates:
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  handlePresetSelect('landslide');
                  setIsComposerOpen(true);
                }}
                className="py-1.5 px-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-[11px] font-semibold text-center transition-colors"
              >
                ⛰️ Landslide Slide Alert
              </button>
              <button
                onClick={() => {
                  handlePresetSelect('flood');
                  setIsComposerOpen(true);
                }}
                className="py-1.5 px-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg text-[11px] font-semibold text-center transition-colors"
              >
                🌊 Flood / GLOF Alert
              </button>
              <button
                onClick={() => {
                  handlePresetSelect('earthquake');
                  setIsComposerOpen(true);
                }}
                className="py-1.5 px-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-[11px] font-semibold text-center transition-colors"
              >
                ⚡ Earthquake EEW Alert
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Composer Modal */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-[2000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-lg w-full p-6 text-left overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/40">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Broadcast Emergency Push Alert</h3>
                  <p className="text-xs text-slate-400">Target immediate cell towers & browser push receivers</p>
                </div>
              </div>
              <button
                onClick={() => setIsComposerOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitBroadcast} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Hazard Category</label>
                  <select
                    value={selectedHazard}
                    onChange={(e) => handlePresetSelect(e.target.value as HazardType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-red-500"
                  >
                    <option value="landslide">⛰️ Landslide / Slope Subsidence</option>
                    <option value="flood">🌊 Flash Flood / GLOF</option>
                    <option value="earthquake">📉 Earthquake (MCT Fault)</option>
                    <option value="multi-hazard">⚠️ Multi-Hazard Complex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target District</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-red-500"
                  >
                    {districtsList.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Threat Severity</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['ADVISORY', 'WARNING', 'CRITICAL'] as ThreatLevel[]).map((sev) => (
                    <button
                      type="button"
                      key={sev}
                      onClick={() => setSelectedSeverity(sev)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedSeverity === sev
                          ? sev === 'CRITICAL' ? 'bg-red-600 text-white shadow-md' : 'bg-amber-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">English Notification Title</label>
                <input
                  type="text"
                  value={titleEnglish}
                  onChange={(e) => setTitleEnglish(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hindi Notification Title (हिंदी शीर्षक)</label>
                <input
                  type="text"
                  value={titleHindi}
                  onChange={(e) => setTitleHindi(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">English Resident Action Directive</label>
                <textarea
                  value={messageEnglish}
                  onChange={(e) => setMessageEnglish(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Hindi Resident Action Directive (हिंदी संदेश)</label>
                <textarea
                  value={messageHindi}
                  onChange={(e) => setMessageHindi(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-[11px] text-red-200">
                <strong>Warning:</strong> Broadcasting this will trigger real audio sirens, fire native browser notifications to connected devices, and log in SDRF emergency registry.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Immediate Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
