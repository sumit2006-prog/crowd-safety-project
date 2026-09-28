import React, { useState } from 'react';
import { X, Flame, Stethoscope, AlertOctagon, Users, User, ShieldAlert, Zap, Droplet, Package, Camera, Send, CheckCircle2 } from 'lucide-react';
import { useEventData } from '../../context/EventDataContext';

export const ReportModal = ({ isOpen, onClose, defaultType = 'Medical' }) => {
  const { reportIncident, event } = useEventData();

  const [category, setCategory] = useState(defaultType);
  const [severity, setSeverity] = useState('MEDIUM');
  const [locationName, setLocationName] = useState('Zone B Food Court');
  const [zone, setZone] = useState('Zone B');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [submittedIncident, setSubmittedIncident] = useState(null);

  if (!isOpen) return null;

  const categoriesList = [
    { label: 'Fire', icon: Flame, color: 'text-orange-500 border-orange-500/30' },
    { label: 'Medical', icon: Stethoscope, color: 'text-rose-500 border-rose-500/30' },
    { label: 'Blocked Exit', icon: AlertOctagon, color: 'text-red-500 border-red-500/30' },
    { label: 'Crowd Problem', icon: Users, color: 'text-yellow-500 border-yellow-500/30' },
    { label: 'Missing Person', icon: User, color: 'text-purple-500 border-purple-500/30' },
    { label: 'Security Issue', icon: ShieldAlert, color: 'text-sky-500 border-sky-500/30' },
    { label: 'Lighting Problem', icon: Zap, color: 'text-amber-400 border-amber-400/30' },
    { label: 'Water Problem', icon: Droplet, color: 'text-blue-400 border-blue-400/30' },
    { label: 'Lost Item', icon: Package, color: 'text-emerald-400 border-emerald-400/30' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newInc = reportIncident({
      type: category,
      severity,
      locationName,
      zone,
      description,
      reporterPhone: phone,
      photoUrl: photoUrl || null,
      lat: event.centerLat + (Math.random() - 0.5) * 0.003,
      lng: event.centerLng + (Math.random() - 0.5) * 0.003
    });

    setSubmittedIncident(newInc);
  };

  const resetForm = () => {
    setSubmittedIncident(null);
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        {!submittedIncident ? (
          <>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-rose-500 uppercase">CITIZEN INCIDENT REPORT</span>
              <h2 className="text-2xl font-black text-white">REPORT AN INCIDENT</h2>
              <p className="text-xs text-slate-400">Reports start as UNVERIFIED until reviewed by the Command Center.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category Selector Grid */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">1. Select Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {categoriesList.map(cat => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.label;
                    return (
                      <button
                        key={cat.label}
                        type="button"
                        onClick={() => setCategory(cat.label)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-rose-600/20 text-rose-400 border-rose-500'
                            : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-1 ${cat.color}`} />
                        <span className="text-[11px]">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Zone & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">2. Zone</label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-rose-500"
                  >
                    <option value="Zone A">Zone A - Main Stage</option>
                    <option value="Zone B">Zone B - Food Court</option>
                    <option value="Zone C">Zone C - North Lawn</option>
                    <option value="Zone D">Zone D - South Corridor</option>
                    <option value="Zone G">Zone G - Carnival Rides</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Specific Location Name</label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Near Stall #4 or Gate 3"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              {/* Severity Level */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Severity Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(sev => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverity(sev)}
                      className={`py-2 rounded-xl text-xs font-extrabold transition-all border ${
                        severity === sev
                          ? sev === 'CRITICAL' ? 'bg-red-600 text-white border-red-400' : sev === 'HIGH' ? 'bg-orange-600 text-white border-orange-400' : 'bg-amber-600 text-white border-amber-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide clear details of what you observe..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-rose-500"
                  required
                />
              </div>

              {/* Optional Phone Contact */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 00000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-rose-600/30 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>SUBMIT EMERGENCY REPORT</span>
              </button>
            </form>
          </>
        ) : (
          /* Verification Timeline Submission Confirmation */
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">Your report has been submitted</h3>
              <p className="text-xs text-slate-400 mt-1">Incident ID: <strong className="text-rose-400">{submittedIncident.incidentId}</strong></p>
            </div>

            {/* Verification Timeline UI */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left space-y-3">
              <div className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">Verification Progress Timeline</div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span>✓</span> <span>Reported ({new Date(submittedIncident.createdAt).toLocaleTimeString()})</span>
                </div>
                <div className="flex items-center gap-2 text-amber-400 font-semibold animate-pulse">
                  <span>⏳</span> <span>Under Command Center Verification</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <span>○</span> <span>Responder Assignment</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <span>○</span> <span>Resolution</span>
                </div>
              </div>
            </div>

            <button
              onClick={resetForm}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
