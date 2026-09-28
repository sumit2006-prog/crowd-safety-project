import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventDataProvider, useEventData } from './context/EventDataContext';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { EmergencyButton } from './components/common/EmergencyButton';
import { LoginModal } from './components/common/LoginModal';
import { ReportModal } from './components/public/ReportModal';
import { LocationShareModal } from './components/public/LocationShareModal';
import { HomePage } from './pages/public/HomePage';
import { LiveMap } from './components/map/LiveMap';
import { NearMeSection } from './components/public/NearMeSection';
import { MissingPersonSection } from './components/public/MissingPersonSection';
import { SafeExitWidget } from './components/public/SafeExitWidget';
import { OrganizerDashboardPage } from './pages/organizer/DashboardPage';
import { Bell, ShieldCheck, MapPin, Phone, Users, AlertTriangle } from 'lucide-react';

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isLocationShareOpen, setIsLocationShareOpen] = useState(false);
  const [reportDefaultType, setReportDefaultType] = useState('Medical');
  const { alerts, event } = useEventData();
  const { user } = useAuth();

  const handleOpenReport = (type = 'Medical') => {
    setReportDefaultType(type);
    setIsReportOpen(true);
  };

  if (activePage === 'command-center') {
    return <OrganizerDashboardPage setActivePage={setActivePage} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Toast Notifications */}
      <Toast />

      {/* Public Navbar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenLoginModal={() => setIsLoginOpen(true)}
        onOpenReportModal={() => handleOpenReport('Medical')}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            setActivePage={setActivePage}
            onOpenReportModal={() => handleOpenReport('Medical')}
            onOpenEmergencyModal={() => setIsReportOpen(true)}
          />
        )}

        {activePage === 'map' && (
          <div className="p-4 max-w-7xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" /> FULL-SCREEN EVENT SAFETY MAP
            </h2>
            <LiveMap fullScreen={true} />
          </div>
        )}

        {activePage === 'near-me' && (
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <NearMeSection />
          </div>
        )}

        {activePage === 'missing-person' && (
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <MissingPersonSection />
          </div>
        )}

        {activePage === 'alerts' && (
          <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
            <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Bell className="w-6 h-6 text-rose-500" /> OFFICIAL SAFETY ALERTS
              </h2>
              <p className="text-xs text-slate-400">Real-time emergency broadcast announcements for {event.name}.</p>
            </div>

            <div className="space-y-4">
              {alerts.map(alt => (
                <div key={alt.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-rose-400 font-bold">{alt.zone}</span>
                    <span className="text-slate-400">{new Date(alt.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{alt.title}</h3>
                  <p className="text-xs text-slate-300">{alt.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === 'emergency' && (
          <div className="p-4 md:p-8 max-w-3xl mx-auto text-center space-y-6">
            <div className="bg-slate-900 border border-rose-500/40 p-8 rounded-3xl space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/40 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-white">EMERGENCY ASSISTANCE</h2>
              <p className="text-sm text-slate-300">Click below to connect to 112 India National Emergency Line or request on-site medical/security response.</p>
              <a
                href="tel:112"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-black text-xl rounded-2xl shadow-2xl shadow-rose-600/50"
              >
                <Phone className="w-6 h-6" />
                <span>DIAL 112 EMERGENCY NOW</span>
              </a>
            </div>
          </div>
        )}

        {activePage === 'about' && (
          <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4">
              <h2 className="text-3xl font-black text-white">ABOUT CROWD SAFE</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                CROWD SAFE is a next-generation real-time crowd safety & emergency coordination platform built for festivals, concerts, sports events, and public rallies. It unifies public safety awareness, quick incident reporting, exit route optimization, and command center tactical operations into one cohesive ecosystem.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Floating 🚨 EMERGENCY Action Button */}
      <EmergencyButton
        onOpenReportModal={(type) => handleOpenReport(type)}
        onOpenLocationShareModal={() => setIsLocationShareOpen(true)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenReportModal={() => handleOpenReport('Medical')}
        onOpenEmergencyModal={() => handleOpenReport('Medical')}
      />

      {/* Modals */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} defaultType={reportDefaultType} />
      <LocationShareModal isOpen={isLocationShareOpen} onClose={() => setIsLocationShareOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <EventDataProvider>
        <AppContent />
      </EventDataProvider>
    </AuthProvider>
  );
}
