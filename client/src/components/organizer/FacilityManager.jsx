import React from 'react';
import { Building2, Plus, Phone, MapPin } from 'lucide-react';
import { useEventData } from '../../context/EventDataContext';

export const FacilityManager = () => {
  const { facilities } = useEventData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono mb-2">
            <Building2 className="w-3.5 h-3.5" /> FACILITY & RESOURCE REGISTRY
          </div>
          <h2 className="text-2xl font-black text-white">MAP INFRASTRUCTURE MANAGEMENT</h2>
          <p className="text-xs text-slate-400">Configure medical posts, fire hydrants, security command points, and public services.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilities.map(fac => (
          <div key={fac.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-sky-400">{fac.type}</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full">{fac.status}</span>
            </div>
            <h3 className="text-base font-bold text-white">{fac.name}</h3>
            <p className="text-xs text-slate-400">{fac.address}</p>
            <div className="text-xs text-slate-300 font-mono pt-2 border-t border-slate-800">
              📞 Contact: {fac.phone}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
