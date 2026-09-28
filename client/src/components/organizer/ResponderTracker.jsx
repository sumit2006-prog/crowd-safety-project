import React from 'react';
import { ShieldAlert, Stethoscope, Flame, Phone, MapPin, CheckCircle, Clock } from 'lucide-react';
import { useEventData } from '../../context/EventDataContext';

export const ResponderTracker = () => {
  const { responders, event } = useEventData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-mono mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> LIVE RESPONDER TRACKING
          </div>
          <h2 className="text-2xl font-black text-white">TACTICAL UNITS FLEET</h2>
          <p className="text-xs text-slate-400">Total Active Personnel: <strong className="text-white">{responders.length} Teams</strong> ({responders.filter(r => r.status === 'AVAILABLE').length} Available)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {responders.map(resp => {
          const isMedical = resp.type === 'Medical';
          const isFire = resp.type === 'Fire';

          return (
            <div
              key={resp.responderId}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">{resp.responderId}</span>
                <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                  resp.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : resp.status === 'RESPONDING' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 animate-pulse' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                }`}>
                  {resp.status}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  {isMedical ? <Stethoscope className="w-4 h-4 text-sky-400" /> : isFire ? <Flame className="w-4 h-4 text-orange-400" /> : <ShieldAlert className="w-4 h-4 text-purple-400" />}
                  <h3 className="text-base font-bold text-white">{resp.name}</h3>
                </div>
                <p className="text-xs text-slate-400">{resp.team} • {resp.type} Response</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl space-y-1 text-xs font-mono border border-slate-800">
                <div className="text-slate-400">📞 Phone: <span className="text-slate-200">{resp.phone}</span></div>
                <div className="text-slate-400">📍 GPS: <span className="text-slate-300">{resp.lat.toFixed(4)}, {resp.lng.toFixed(4)}</span></div>
                {resp.currentAssignment && (
                  <div className="text-rose-400 font-bold">🚨 Assignment: {resp.currentAssignment}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
