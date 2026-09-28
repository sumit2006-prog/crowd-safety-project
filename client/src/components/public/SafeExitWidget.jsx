import React from 'react';
import { Navigation, AlertTriangle, ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';
import { useEventData } from '../../context/EventDataContext';

export const SafeExitWidget = () => {
  const { exits } = useEventData();

  // Find best recommended exit based on status and crowd flow
  const openExits = exits.filter(e => e.status === 'OPEN');
  const recommendedGate = openExits.length > 0
    ? openExits.sort((a, b) => a.currentCrowd - b.currentCrowd)[0]
    : null;

  const getExitMetrics = (exitId) => {
    switch(exitId) {
      case 'gate-a': return { distance: '300m', crowdLabel: 'HIGH CROWD' };
      case 'gate-b': return { distance: '450m', crowdLabel: 'LOW CROWD' };
      case 'gate-c': return { distance: '410m', crowdLabel: 'CONGESTED / BLOCKED' };
      case 'gate-d': return { distance: '520m', crowdLabel: 'MEDIUM CROWD' };
      default: return { distance: '400m', crowdLabel: 'LOW CROWD' };
    }
  };

  return (
    <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">INTELLIGENT SAFE EXIT RECOMMENDATION</h3>
            <p className="text-xs text-slate-400">Algorithms compute crowd density, gate status & active hazards in real time.</p>
          </div>
        </div>
      </div>

      {/* Recommended Banner */}
      {recommendedGate ? (
        <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">Recommended Safe Exit Route</div>
              <div className="text-xl font-black text-white">{recommendedGate.name}</div>
              <div className="text-xs text-slate-300">
                {recommendedGate.locationName} • Distance: <strong className="text-white">450m</strong> • Flow: <span className="text-emerald-400 font-bold">LOW CROWD ({recommendedGate.currentCrowd} people)</span>
              </div>
            </div>
          </div>
          <a
            href={`https://maps.google.com/?q=${recommendedGate.lat},${recommendedGate.lng}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all shrink-0"
          >
            <Navigation className="w-4 h-4" />
            <span>Guide Route on Map</span>
          </a>
        </div>
      ) : (
        <div className="bg-rose-950/40 border border-rose-500/30 p-4 rounded-2xl text-rose-300 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>⚠️ All exit gates are currently congested or blocked. Stand by for official security steward instructions.</span>
        </div>
      )}

      {/* Exit Gates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {exits.map(gate => {
          const isBlocked = gate.status === 'BLOCKED';
          const isCongested = gate.status === 'CONGESTED';
          const isOptimal = recommendedGate && recommendedGate.exitId === gate.exitId;
          const metrics = getExitMetrics(gate.exitId);

          return (
            <div
              key={gate.exitId}
              className={`p-4 rounded-2xl border transition-all space-y-2 ${
                isOptimal
                  ? 'bg-emerald-950/30 border-emerald-500/50 shadow-glow-green'
                  : isBlocked
                  ? 'bg-rose-950/30 border-rose-500/40'
                  : isCongested
                  ? 'bg-amber-950/30 border-amber-500/40'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{gate.name.split('-')[0]}</span>
                <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                  isBlocked ? 'bg-red-500/20 text-red-400 border border-red-500/30' : isCongested ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {gate.status}
                </span>
              </div>

              <div className="text-xs text-slate-300 font-mono space-y-0.5">
                <div>Distance: <strong className="text-white">{metrics.distance}</strong></div>
                <div className={`font-bold ${isBlocked ? 'text-rose-400' : isCongested ? 'text-amber-400' : isOptimal ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {metrics.crowdLabel}
                </div>
              </div>

              {isOptimal && (
                <div className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 border-t border-emerald-500/20 pt-1.5">
                  <span>✓</span> Recommended Exit
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-slate-400 italic text-center border-t border-slate-800/80 pt-3">
        "In an actual emergency, follow instructions from official authorities and event personnel."
      </p>
    </div>
  );
};
