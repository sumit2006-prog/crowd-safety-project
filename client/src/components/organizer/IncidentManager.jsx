import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, ShieldCheck, UserCheck, AlertOctagon, Filter, Clock } from 'lucide-react';
import { useEventData } from '../../context/EventDataContext';

export const IncidentManager = () => {
  const { incidents, responders, updateIncidentVerification, updateIncidentStatus } = useEventData();
  const [filter, setFilter] = useState('UNVERIFIED'); // UNVERIFIED, VERIFIED, ALL
  const [selectedResponder, setSelectedResponder] = useState({});

  const filteredIncidents = filter === 'ALL'
    ? incidents
    : incidents.filter(i => i.verificationStatus === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-mono mb-2">
            <AlertTriangle className="w-3.5 h-3.5" /> INCIDENT VERIFICATION & DISPATCH
          </div>
          <h2 className="text-2xl font-black text-white">PUBLIC REPORTS QUEUE</h2>
          <p className="text-xs text-slate-400">Verify citizen submitted reports, detect duplicates, and dispatch tactical emergency teams.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          {['UNVERIFIED', 'VERIFIED', 'ALL'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                filter === tab ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab} ({incidents.filter(i => tab === 'ALL' ? true : i.verificationStatus === tab).length})
            </button>
          ))}
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.map(inc => (
          <div
            key={inc.incidentId}
            className={`bg-slate-900 border rounded-3xl p-6 transition-all space-y-4 shadow-xl ${
              inc.verificationStatus === 'UNVERIFIED'
                ? 'border-amber-500/40 bg-amber-950/10'
                : inc.verificationStatus === 'VERIFIED'
                ? 'border-emerald-500/30'
                : 'border-slate-800'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-white">{inc.incidentId}</span>
                <span className={`px-3 py-1 text-xs font-extrabold rounded-full ${
                  inc.type === 'Fire' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : inc.type === 'Medical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                }`}>
                  {inc.type}
                </span>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                  {inc.severity} SEVERITY
                </span>

                {inc.isDuplicateFlagged && (
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full flex items-center gap-1">
                    <AlertOctagon className="w-3 h-3" /> Duplicate Suspected
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span>📍 {inc.locationName} ({inc.zone})</span>
                <span>⏱ {new Date(inc.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>

            <p className="text-sm text-slate-200 font-medium">{inc.description}</p>

            {/* Status & Action Control Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="text-xs text-slate-300 space-y-1">
                <div>Verification Status: <strong className={inc.verificationStatus === 'VERIFIED' ? 'text-emerald-400' : 'text-amber-400'}>{inc.verificationStatus}</strong></div>
                <div>Incident Progress: <strong className="text-sky-400">{inc.status}</strong></div>
                {inc.assignedResponderName && <div>Assigned Team: <strong className="text-purple-400">{inc.assignedResponderName}</strong></div>}
              </div>

              <div className="flex flex-wrap items-center gap-2 justify-end">
                {inc.verificationStatus === 'UNVERIFIED' && (
                  <>
                    <button
                      onClick={() => updateIncidentVerification(inc.incidentId, 'REJECTED')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4 text-rose-400" /> Reject
                    </button>
                    <button
                      onClick={() => updateIncidentVerification(inc.incidentId, 'VERIFIED')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg"
                    >
                      <CheckCircle className="w-4 h-4" /> VERIFY & BROADCAST
                    </button>
                  </>
                )}

                {inc.verificationStatus === 'VERIFIED' && inc.status !== 'Resolved' && (
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <select
                      value={selectedResponder[inc.incidentId] || ''}
                      onChange={(e) => setSelectedResponder({ ...selectedResponder, [inc.incidentId]: e.target.value })}
                      className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                    >
                      <option value="">Select Available Responder...</option>
                      {responders.filter(r => r.status === 'AVAILABLE').map(r => (
                        <option key={r.responderId} value={r.responderId}>{r.team} - {r.name}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => {
                        const rId = selectedResponder[inc.incidentId];
                        if (rId) updateIncidentVerification(inc.incidentId, 'VERIFIED', rId);
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl"
                    >
                      Assign
                    </button>

                    <button
                      onClick={() => updateIncidentStatus(inc.incidentId, 'Resolved')}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl"
                    >
                      Mark Resolved
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredIncidents.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-2 text-slate-400">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto opacity-50" />
            <p className="text-sm font-bold text-white">No incidents in this queue</p>
            <p className="text-xs">All reports in this category have been processed or resolved.</p>
          </div>
        )}
      </div>
    </div>
  );
};
