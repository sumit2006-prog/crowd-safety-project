import React, { useState } from 'react';
import { Settings, Save, Shield, Calendar, MapPin } from 'lucide-react';
import { useEventData } from '../../context/EventDataContext';

export const EventSettings = () => {
  const { event, showToast } = useEventData();
  const [eventName, setEventName] = useState(event.name);
  const [expectedCrowd, setExpectedCrowd] = useState(event.expectedCrowd);

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Event configuration updated successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-black text-white">EVENT SAFETY CONFIGURATION</h2>
          <p className="text-xs text-slate-400">Configure parameters for {event.name}.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 max-w-xl text-xs">
        <div>
          <label className="block text-slate-300 font-bold mb-1">Event Name</label>
          <input type="text" value={eventName} onChange={e=>setEventName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100" />
        </div>

        <div>
          <label className="block text-slate-300 font-bold mb-1">Expected Maximum Population</label>
          <input type="number" value={expectedCrowd} onChange={e=>setExpectedCrowd(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100" />
        </div>

        <button type="submit" className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg">
          Save Settings
        </button>
      </form>
    </div>
  );
};
