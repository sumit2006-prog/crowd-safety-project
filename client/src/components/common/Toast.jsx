import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { useEventData } from '../../context/EventDataContext';

export const Toast = () => {
  const { toastNotification } = useEventData();
  if (!toastNotification) return null;

  const { message, type } = toastNotification;

  const styles = {
    error: 'bg-rose-900/90 border-rose-500 text-rose-100 shadow-glow-red',
    warning: 'bg-amber-900/90 border-amber-500 text-amber-100',
    success: 'bg-emerald-900/90 border-emerald-500 text-emerald-100 shadow-glow-green',
    info: 'bg-sky-900/90 border-sky-500 text-sky-100 shadow-glow-blue'
  };

  const icons = {
    error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />
  };

  return (
    <div className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md transition-all duration-300 ${styles[type] || styles.info}`}>
      {icons[type] || icons.info}
      <span className="text-sm font-medium pr-2">{message}</span>
    </div>
  );
};
