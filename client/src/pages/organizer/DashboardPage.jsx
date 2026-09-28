import React, { useState } from 'react';
import { OrganizerSidebar } from '../../components/organizer/OrganizerSidebar';
import { LiveAlertsSidebar } from '../../components/organizer/LiveAlertsSidebar';
import { IncidentManager } from '../../components/organizer/IncidentManager';
import { CrowdMonitor } from '../../components/organizer/CrowdMonitor';
import { ExitManager } from '../../components/organizer/ExitManager';
import { ResponderTracker } from '../../components/organizer/ResponderTracker';
import { AnalyticsDashboard } from '../../components/organizer/AnalyticsDashboard';
import { FacilityManager } from '../../components/organizer/FacilityManager';
import { EventSettings } from '../../components/organizer/EventSettings';
import { MissingPersonSection } from '../../components/public/MissingPersonSection';
import { LiveMap } from '../../components/map/LiveMap';
import { DemoModeController } from '../../components/common/DemoModeController';
import { useEventData } from '../../context/EventDataContext';
import { useAuth } from '../../context/AuthContext';
import { Shield, Users, AlertTriangle, ShieldAlert, DoorOpen, Activity, Bell, LogOut } from 'lucide-react';

export const OrganizerDashboardPage = ({ setActivePage }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { event, incidents, responders, alerts } = useEventData();
  const { user, logout } = useAuth();

  const openIncidentsCount = incidents.filter(i => i.status !== 'Resolved').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">

      {/* Organizer Top Navigation Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black text-white leading-none">{event.name}</h1>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">● COMMAND CENTER OPERATIONAL</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Activity className="w-4 h-4 text-sky-400 animate-pulse" />
            <span className="text-slate-300 font-mono">Live Sync Engine</span>
          </div>

          <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
            <div className="text-right">
              <div className="font-bold text-white">{user.name}</div>
              <div className="text-[10px] text-rose-400 font-mono">{user.role}</div>
            </div>
            <button
              onClick={() => {
                logout();
                setActivePage('home');
              }}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Menu */}
        <OrganizerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Central Workspace Area */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6 max-h-[calc(100vh-4rem)]">

          {/* Overview Dashboard Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1 shadow-xl">
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase">People in Event</div>
                  <div className="text-3xl font-black text-white">{event.currentCrowd.toLocaleString()}</div>
                  <div className="text-[11px] text-slate-400">Capacity: {event.expectedCrowd.toLocaleString()}</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1 shadow-xl">
                  <div className="text-xs font-mono font-bold text-amber-400 uppercase">Active Alerts</div>
                  <div className="text-3xl font-black text-amber-400">{alerts.filter(a => a.active).length}</div>
                  <div className="text-[11px] text-slate-400">High / Critical Priority</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1 shadow-xl">
                  <div className="text-xs font-mono font-bold text-sky-400 uppercase">Responders Fleet</div>
                  <div className="text-3xl font-black text-sky-400">18 / 24</div>
                  <div className="text-[11px] text-slate-400">Medical, Fire & Security</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1 shadow-xl">
                  <div className="text-xs font-mono font-bold text-rose-400 uppercase">Open Incidents</div>
                  <div className="text-3xl font-black text-rose-400">{openIncidentsCount}</div>
                  <div className="text-[11px] text-slate-400">{incidents.filter(i => i.verificationStatus === 'UNVERIFIED').length} Unverified</div>
                </div>
              </div>

              {/* Large Central Live Command Map */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-2xl space-y-2">
                <div className="px-3 py-1 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold">TACTICAL GROUND CONTROL MAP</span>
                  <span className="text-emerald-400">● LIVE MAP ENGINE ACTIVE</span>
                </div>
                <div className="h-[480px] w-full rounded-2xl overflow-hidden">
                  <LiveMap fullScreen={false} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'admin-map' && (
            <div className="h-[calc(100vh-8rem)]">
              <LiveMap fullScreen={true} />
            </div>
          )}

          {activeTab === 'incidents' && <IncidentManager />}
          {activeTab === 'crowd' && <CrowdMonitor />}
          {activeTab === 'exits' && <ExitManager />}
          {activeTab === 'missing-admin' && <MissingPersonSection />}
          {activeTab === 'responders' && <ResponderTracker />}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'facilities' && <FacilityManager />}
          {activeTab === 'settings' && <EventSettings />}

        </main>

        {/* Right Live Alerts Sidebar Stream */}
        <LiveAlertsSidebar />

      </div>

      {/* Floating Demo Mode Controller Widget */}
      <DemoModeController />

    </div>
  );
};
