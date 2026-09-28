import React from 'react';
import { DoorOpen, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useEventData } from '../../context/EventDataContext';

export const ExitManager = () => {
  const { exits, updateExitStatus } = useEventData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono mb-2">
            <DoorOpen className="w-3.5 h-3.5" /> EXIT FLOW & GATE CONTROL
          </div>
          <h2 className="text-2xl font-black text-white">GATE STATUS CONTROL PANEL</h2>
          <p className="text-xs text-slate-400">Toggle exit gates to OPEN, CONGESTED, or BLOCKED. Live updates broadcast instantly to public safety map.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {exits.map(gate => (
          <div
            key={gate.exitId}
            className={`bg-slate-900 border rounded-3xl p-6 space-y-4 shadow-xl transition-all ${
              gate.status === 'BLOCKED' ? 'border-red-500/50 bg-red-950/10' : gate.status === 'CONGESTED' ? 'border-orange-500/40 bg-orange-950/10' : 'border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white">{gate.name}</h3>
                <p className="text-xs text-slate-400">{gate.locationName}</p>
              </div>

              <span className={`px-3 py-1 text-xs font-black rounded-full ${
                gate.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : gate.status === 'CONGESTED' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {gate.status}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 font-mono bg-slate-950 p-3 rounded-2xl border border-slate-800">
              <div>Current Crowd Flow: <strong className="text-white">{gate.currentCrowd}</strong> / {gate.capacity}</div>
              {gate.isRecommended && <span className="text-emerald-400 font-bold">★ Active Evacuation Route</span>}
            </div>

            {/* Quick Status Toggle Buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">Change Status (Real-time Broadcast):</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => updateExitStatus(gate.exitId, 'OPEN')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    gate.status === 'OPEN' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  OPEN
                </button>
                <button
                  onClick={() => updateExitStatus(gate.exitId, 'CONGESTED')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    gate.status === 'CONGESTED' ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  CONGESTED
                </button>
                <button
                  onClick={() => updateExitStatus(gate.exitId, 'BLOCKED')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    gate.status === 'BLOCKED' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  BLOCKED
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
