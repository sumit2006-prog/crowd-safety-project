import React from 'react';
import { Bell, Flame, Stethoscope, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { useEventData } from '../../context/EventDataContext';

export const LiveAlertsSidebar = () => {
  const { alerts, incidents } = useEventData();

  const getAlertIcon = (title, level) => {
    if (title.includes('FIRE') || level === 'RED') return <Flame className="w-4 h-4 text-rose-400" />;
    if (title.includes('MEDICAL') || level === 'ORANGE') return <Stethoscope className="w-4 h-4 text-orange-400" />;
    if (level === 'YELLOW') return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    return <CheckCircle className="w-4 h-4 text-emerald-400" />;
  };

  const getAlertStyle = (level) => {
    switch (level) {
      case 'RED': return 'bg-rose-950/40 border-rose-500/50 text-rose-200 shadow-glow-red';
      case 'ORANGE': return 'bg-orange-950/40 border-orange-500/50 text-orange-200';
      case 'YELLOW': return 'bg-amber-950/40 border-amber-500/50 text-amber-200';
      case 'GREEN': return 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200';
      default: return 'bg-slate-900 border-slate-800 text-slate-200';
    }
  };

  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-800 p-4 space-y-4 shrink-0 hidden lg:block overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-rose-400 animate-bounce" />
          <h3 className="text-sm font-black text-white uppercase tracking-wider">LIVE ALERTS STREAM</h3>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-mono bg-rose-500/20 text-rose-300 rounded-full font-bold">
          {alerts.length} ACTIVE
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map(alt => (
          <div
            key={alt.id}
            className={`p-3.5 rounded-2xl border transition-all space-y-1.5 ${getAlertStyle(alt.level)}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {getAlertIcon(alt.title, alt.level)}
                <span className="text-xs font-bold">{alt.title}</span>
              </div>
              <span className="text-[10px] font-mono opacity-70">
                {new Date(alt.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <p className="text-xs opacity-90 leading-relaxed">{alt.message}</p>

            <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
              <span>ZONE: {alt.zone}</span>
              <span className="font-bold uppercase tracking-wider">{alt.level} PRIORITY</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
