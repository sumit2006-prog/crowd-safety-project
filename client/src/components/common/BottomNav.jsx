import React from 'react';
import { Home, MapPin, Search, AlertCircle, PlusCircle } from 'lucide-react';

export const BottomNav = ({ activePage, setActivePage, onOpenReportModal, onOpenEmergencyModal }) => {
  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'near-me', label: 'Near Me', icon: Search },
    { id: 'report', label: 'Report', icon: PlusCircle, isReport: true },
    { id: 'emergency', label: 'Emergency', icon: AlertCircle, isEmergency: true }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activePage === item.id;

        if (item.isEmergency) {
          return (
            <button
              key={item.id}
              onClick={onOpenEmergencyModal}
              className="flex flex-col items-center gap-0.5 text-rose-500 font-extrabold"
            >
              <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/50 animate-pulse">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px]">Emergency</span>
            </button>
          );
        }

        if (item.isReport) {
          return (
            <button
              key={item.id}
              onClick={onOpenReportModal}
              className="flex flex-col items-center gap-0.5 text-amber-400 font-semibold"
            >
              <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px]">Report</span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
              isActive ? 'text-rose-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
