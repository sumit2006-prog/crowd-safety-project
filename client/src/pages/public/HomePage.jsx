import React from 'react';
import { MapPin, Search, AlertCircle, Shield, Users, Bell, Phone, Flame, Stethoscope, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useEventData } from '../../context/EventDataContext';
import { SafeExitWidget } from '../../components/public/SafeExitWidget';
import { LiveMap } from '../../components/map/LiveMap';

export const HomePage = ({ setActivePage, onOpenReportModal, onOpenEmergencyModal }) => {
  const { event, alerts, incidents } = useEventData();

  return (
    <div className="space-y-10 pb-16">

      {/* Impressive Hero Section */}
      <section className="relative pt-6 pb-12 overflow-hidden">
        {/* Glow ambient background accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-rose-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span>REAL-TIME EMERGENCY COORDINATION SYSTEM</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
                  CROWD <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-red-600">SAFE</span>
                </h1>
                <p className="text-xl sm:text-2xl font-bold text-slate-200">
                  "Stay informed. Find help. Stay safe."
                </p>
              </div>

              <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
                One platform connecting people, emergency resources, event organizers and responders during large public gatherings.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActivePage('map')}
                  className="flex items-center gap-2 px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-rose-600/40 hover:scale-105 transition-all"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Open Live Map</span>
                </button>

                <button
                  onClick={() => setActivePage('near-me')}
                  className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-100 font-extrabold text-sm rounded-2xl border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <Search className="w-4 h-4 text-rose-400" />
                  <span>Find Help Near Me</span>
                </button>

                <button
                  onClick={onOpenReportModal}
                  className="flex items-center gap-2 px-6 py-3.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-extrabold text-sm rounded-2xl border border-amber-500/30 transition-all"
                >
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>Report an Incident</span>
                </button>
              </div>
            </div>

            {/* Right Hero Visual: Stylized Map Preview */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900/90 p-2">
                <div className="h-80 w-full rounded-2xl overflow-hidden relative">
                  <LiveMap fullScreen={false} />
                </div>
                <div className="p-3 text-center text-xs font-mono text-slate-400 flex items-center justify-between border-t border-slate-800/80 mt-2">
                  <span className="text-emerald-400 font-bold">● Central Festival 2026</span>
                  <span>Interactive Map Engine</span>
                </div>
              </div>
            </div>

          </div>

          {/* Below Hero Live Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl text-center space-y-1 backdrop-blur-md shadow-xl">
              <div className="text-3xl font-black text-white">{event.currentCrowd.toLocaleString()}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">People in Event</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl text-center space-y-1 backdrop-blur-md shadow-xl">
              <div className="text-3xl font-black text-emerald-400">{event.activeRespondersCount}</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Responders</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl text-center space-y-1 backdrop-blur-md shadow-xl">
              <div className="text-3xl font-black text-amber-400">07</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Alerts</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-3xl text-center space-y-1 backdrop-blur-md shadow-xl">
              <div className="text-3xl font-black text-sky-400">24</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Safety Points</div>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligent Safe Exit Recommendation Widget */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SafeExitWidget />
      </section>

      {/* Active Public Safety Alerts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-500" />
            <h2 className="text-xl font-black text-white">LIVE SAFETY ALERTS</h2>
          </div>
          <button
            onClick={() => setActivePage('alerts')}
            className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <span>View All Alerts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alerts.slice(0, 4).map(alt => (
            <div
              key={alt.id}
              className={`p-5 rounded-3xl border space-y-2 backdrop-blur-md ${
                alt.level === 'RED' ? 'bg-rose-950/30 border-rose-500/40 text-rose-100' : 'bg-slate-900/80 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-rose-400 uppercase">{alt.zone}</span>
                <span className="text-[10px] font-mono text-slate-400">{new Date(alt.createdAt).toLocaleTimeString()}</span>
              </div>
              <h3 className="text-base font-bold text-white">{alt.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{alt.message}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
