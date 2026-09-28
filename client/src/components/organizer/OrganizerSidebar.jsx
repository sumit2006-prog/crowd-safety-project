import React from 'react';
import { LayoutDashboard, MapPin, AlertTriangle, Users, DoorOpen, UserCheck, Bell, Building2, BarChart3, Settings, ShieldAlert } from 'lucide-react';

export const OrganizerSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'admin-map', label: 'Live Map', icon: MapPin },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle, badge: 'VERIFY' },
    { id: 'crowd', label: 'Crowd Monitoring', icon: Users },
    { id: 'exits', label: 'Exits Management', icon: DoorOpen },
    { id: 'missing-admin', label: 'Missing Persons', icon: UserCheck },
    { id: 'responders', label: 'Responders Track', icon: ShieldAlert },
    { id: 'alerts', label: 'Alert System', icon: Bell },
    { id: 'facilities', label: 'Facilities', icon: Building2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Event Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 shrink-0 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-4">
        <div className="px-3 py-2 bg-slate-950 rounded-2xl border border-slate-800">
          <div className="text-[10px] font-mono font-bold text-rose-500 uppercase tracking-widest">COMMAND CONTROL CENTER</div>
          <div className="text-sm font-black text-white">Central Festival 2026</div>
        </div>

        <nav className="space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[9px] bg-rose-500/20 text-rose-300 rounded-full border border-rose-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
        <div>System Version: v2.6-PROD</div>
        <div className="text-emerald-400 font-mono font-bold">● LIVE SOCKET ENGINE READY</div>
      </div>
    </aside>
  );
};
