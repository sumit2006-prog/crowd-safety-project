import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, Users, AlertTriangle, Clock, ShieldCheck } from 'lucide-react';

export const AnalyticsDashboard = () => {
  const crowdByHourData = [
    { hour: '14:00', crowd: 4200 },
    { hour: '16:00', crowd: 8500 },
    { hour: '18:00', crowd: 14200 },
    { hour: '20:00', crowd: 18420 },
    { hour: '22:00', crowd: 12540 },
    { hour: '00:00', crowd: 6100 }
  ];

  const incidentsByCategoryData = [
    { name: 'Medical', count: 14, color: '#ef4444' },
    { name: 'Missing Persons', count: 12, color: '#a855f7' },
    { name: 'Security', count: 8, color: '#3b82f6' },
    { name: 'Fire', count: 2, color: '#f97316' },
    { name: 'Facilities/Exits', count: 5, color: '#10b981' }
  ];

  const responseTimeByZoneData = [
    { zone: 'Zone A', avgMinutes: 2.5 },
    { zone: 'Zone B', avgMinutes: 3.8 },
    { zone: 'Zone C', avgMinutes: 4.1 },
    { zone: 'Zone D', avgMinutes: 2.9 },
    { zone: 'Zone G', avgMinutes: 3.2 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> RECHARTS ANALYTICS ENGINE
          </div>
          <h2 className="text-2xl font-black text-white">SAFETY & INCIDENT METRICS</h2>
          <p className="text-xs text-slate-400">Post-event and real-time performance analytics for emergency operations.</p>
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1">
          <div className="text-xs font-mono text-slate-400">PEAK CROWD</div>
          <div className="text-2xl font-black text-white">18,420</div>
          <div className="text-[11px] text-emerald-400">↑ At 20:00 PM Stage Performance</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1">
          <div className="text-xs font-mono text-slate-400">TOTAL INCIDENTS</div>
          <div className="text-2xl font-black text-rose-400">37</div>
          <div className="text-[11px] text-slate-400">32 Resolved • 5 Active</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1">
          <div className="text-xs font-mono text-slate-400">AVG RESPONSE TIME</div>
          <div className="text-2xl font-black text-sky-400">3m 18s</div>
          <div className="text-[11px] text-emerald-400">⚡ Target &lt; 5 minutes met</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-1">
          <div className="text-xs font-mono text-slate-400">REUNIFICATIONS</div>
          <div className="text-2xl font-black text-purple-400">11 / 12</div>
          <div className="text-[11px] text-slate-400">91.6% Success Rate</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crowd Flow Line Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Crowd Density Trajectory (By Hour)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={crowdByHourData}>
                <XAxis dataKey="hour" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="crowd" stroke="#ef4444" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incidents by Category Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Incidents Distribution by Category</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentsByCategoryData}>
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {incidentsByCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
