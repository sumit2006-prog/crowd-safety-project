import React, { useState, useEffect } from 'react';
import { Share2, Clock, ShieldCheck, Copy, Check, X, Compass } from 'lucide-react';
import { useEventData } from '../../context/EventDataContext';

export const LocationShareModal = ({ isOpen, onClose }) => {
  const { startLocationShare, activeLocationShares, event } = useEventData();
  const [activeShare, setActiveShare] = useState(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  if (!isOpen) return null;

  const handleStartShare = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const share = startLocationShare(pos.coords.latitude, pos.coords.longitude, 15);
          setActiveShare(share);
        },
        () => {
          const share = startLocationShare(event.centerLat, event.centerLng, 15);
          setActiveShare(share);
        }
      );
    } else {
      const share = startLocationShare(event.centerLat, event.centerLng, 15);
      setActiveShare(share);
    }
  };

  const handleCopyToken = () => {
    if (!activeShare) return;
    const shareUrl = `${window.location.origin}/#track=${activeShare.token}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStopSharing = () => {
    setActiveShare(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center mx-auto">
          <Share2 className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-xl font-black text-white">TEMPORARY LOCATION SHARING</h3>
          <p className="text-xs text-slate-400 mt-1">Generates a private 15-minute tracking link for family or responders.</p>
        </div>

        {!activeShare ? (
          <div className="space-y-4 pt-2">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-bold">
                <ShieldCheck className="w-4 h-4" /> Privacy Protected
              </div>
              <p className="text-slate-300">
                • Requires explicit consent.<br />
                • Automatically expires in 15 minutes.<br />
                • Can be terminated at any time.<br />
                • Never exposed publicly.
              </p>
            </div>

            <button
              onClick={handleStartShare}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-sky-600/30 transition-all"
            >
              <Compass className="w-5 h-5" />
              <span>START SHARING MY LOCATION</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="bg-sky-950/40 border border-sky-500/40 p-4 rounded-2xl text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-sky-400">STATUS: ACTIVE</span>
                <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 14:59 Remaining
                </span>
              </div>
              <div className="text-xs text-slate-200">
                Token: <strong className="font-mono text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{activeShare.token}</strong>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopyToken}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
              </button>

              <button
                onClick={handleStopSharing}
                className="py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl"
              >
                STOP SHARING
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
