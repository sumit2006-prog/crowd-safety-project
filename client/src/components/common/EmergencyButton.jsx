import React, { useState } from 'react';
import { Phone, Flame, Stethoscope, ShieldAlert, Share2, X, AlertTriangle } from 'lucide-react';
import { useEventData } from '../../context/EventDataContext';

export const EmergencyButton = ({ onOpenReportModal, onOpenLocationShareModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null); // { type: 'CALL'|'MEDICAL'|'FIRE'|'SECURITY', title, subtitle }
  const { showToast } = useEventData();

  const handleTrigger112 = () => {
    setConfirmDialog({
      type: 'CALL',
      title: 'Call Emergency Services (112)?',
      subtitle: 'This will connect you directly to the Official National Emergency Line (112 India).'
    });
  };

  const handleTriggerMedical = () => {
    setConfirmDialog({
      type: 'MEDICAL',
      title: 'Report Medical Emergency?',
      subtitle: 'Nearest paramedics will be alerted with your location.'
    });
  };

  const handleTriggerFire = () => {
    setConfirmDialog({
      type: 'FIRE',
      title: 'Report Fire Hazard?',
      subtitle: 'Fire response units will be dispatched to your current coordinates.'
    });
  };

  const handleTriggerSecurity = () => {
    setConfirmDialog({
      type: 'SECURITY',
      title: 'Request Urgent Security assistance?',
      subtitle: 'On-site Security Command Point will dispatch immediate personnel.'
    });
  };

  const executeAction = () => {
    if (!confirmDialog) return;
    const { type } = confirmDialog;
    setConfirmDialog(null);
    setIsOpen(false);

    if (type === 'CALL') {
      showToast('Initiating emergency call to 112...', 'warning');
      window.location.href = 'tel:112';
    } else if (type === 'MEDICAL' || type === 'FIRE' || type === 'SECURITY') {
      if (onOpenReportModal) {
        onOpenReportModal(type === 'MEDICAL' ? 'Medical' : type === 'FIRE' ? 'Fire' : 'Security Issue');
      }
    }
  };

  return (
    <>
      {/* Floating Emergency Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold rounded-full shadow-2xl shadow-rose-600/50 hover:scale-105 transition-all duration-200 border-2 border-rose-400/30 animate-pulse"
      >
        <span className="text-xl">🚨</span>
        <span className="tracking-wide">EMERGENCY</span>
      </button>

      {/* Emergency Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/40 mb-1">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">EMERGENCY OPTIONS</h2>
              <p className="text-xs text-slate-400">Select urgent action. Confirmation required before trigger.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* Direct 112 Call */}
              <button
                onClick={handleTrigger112}
                className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-extrabold rounded-2xl shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-6 h-6 animate-bounce" />
                  <span className="text-lg">CALL 112 (OFFICIAL)</span>
                </div>
                <span className="text-xs bg-black/30 px-2.5 py-1 rounded-full border border-white/20">India Emergency</span>
              </button>

              {/* Medical Emergency */}
              <button
                onClick={handleTriggerMedical}
                className="flex items-center gap-4 px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-500/30 rounded-2xl font-bold transition-all text-left"
              >
                <Stethoscope className="w-6 h-6 text-rose-400 shrink-0" />
                <div>
                  <div className="text-base text-white">MEDICAL EMERGENCY</div>
                  <div className="text-xs text-slate-400 font-normal">Injuries, unconsciousness, severe distress</div>
                </div>
              </button>

              {/* Fire Incident */}
              <button
                onClick={handleTriggerFire}
                className="flex items-center gap-4 px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-orange-400 border border-orange-500/30 rounded-2xl font-bold transition-all text-left"
              >
                <Flame className="w-6 h-6 text-orange-400 shrink-0" />
                <div>
                  <div className="text-base text-white">FIRE HAZARD</div>
                  <div className="text-xs text-slate-400 font-normal">Smoke, flames, electrical hazards</div>
                </div>
              </button>

              {/* Security Alert */}
              <button
                onClick={handleTriggerSecurity}
                className="flex items-center gap-4 px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-purple-400 border border-purple-500/30 rounded-2xl font-bold transition-all text-left"
              >
                <ShieldAlert className="w-6 h-6 text-purple-400 shrink-0" />
                <div>
                  <div className="text-base text-white">SECURITY ASSISTANCE</div>
                  <div className="text-xs text-slate-400 font-normal">Crowd surge, violence, suspicious activity</div>
                </div>
              </button>

              {/* Share Location */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenLocationShareModal) onOpenLocationShareModal();
                }}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-500/30 text-sky-300 font-semibold rounded-2xl transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Share My Location (15 Min Expiry Token)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-slate-900 border border-rose-500/40 rounded-3xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 mx-auto flex items-center justify-center border border-rose-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{confirmDialog.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{confirmDialog.subtitle}</p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={executeAction}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-rose-600/40"
              >
                Confirm Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
