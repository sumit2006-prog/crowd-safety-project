import React from 'react';
import { Users, TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, Camera, Cpu } from 'lucide-react';
import { useEventData } from '../../context/EventDataContext';

export const CrowdMonitor = () => {
  const { zones, event } = useEventData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono mb-2">
            <Cpu className="w-3.5 h-3.5" /> AI / YOLO CAM MONITORING ARCHITECTURE READY
          </div>
          <h2 className="text-2xl font-black text-white">REAL-TIME CROWD DENSITY & HEATMAP</h2>
          <p className="text-xs text-slate-400">Total Event Population: <strong className="text-white">{event.currentCrowd}</strong> / {event.expectedCrowd} Capacity</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-xs text-slate-300 font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>8 Video Feed Stream Processors Online</span>
        </div>
      </div>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {zones.map(zone => {
          const isCritical = zone.status === 'CRITICAL';
          const isWarning = zone.status === 'WARNING';

          return (
            <div
              key={zone.code}
              className={`bg-slate-900 border rounded-3xl p-5 space-y-4 shadow-xl transition-all ${
                isCritical
                  ? 'border-red-500/50 bg-red-950/20 shadow-glow-red'
                  : isWarning
                  ? 'border-orange-500/40 bg-orange-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-400">{zone.code}</span>
                  <h3 className="text-base font-black text-white leading-tight">{zone.name}</h3>
                </div>
                <span className={`px-2.5 py-1 text-[10px] font-black rounded-full ${
                  isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/30' : isWarning ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {zone.status}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Capacity Density</span>
                  <span className={isCritical ? 'text-red-400 font-black' : isWarning ? 'text-orange-400' : 'text-emerald-400'}>
                    {zone.densityPercentage}%
                  </span>
                </div>

                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isCritical ? 'bg-red-500' : isWarning ? 'bg-orange-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${zone.densityPercentage}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400 font-mono">
                <div>Count: <strong className="text-white">{zone.currentCrowd}</strong> / {zone.capacity}</div>
                <div className="flex items-center gap-1 font-bold">
                  {zone.trend === 'INCREASING' ? <TrendingUp className="w-3.5 h-3.5 text-rose-400" /> : <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{zone.trend}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
