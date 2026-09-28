import React, { useState } from 'react';
import { Shield, MapPin, AlertCircle, Search, Users, Bell, Globe, User, LogIn, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEventData } from '../../context/EventDataContext';

export const Navbar = ({ activePage, setActivePage, onOpenLoginModal, onOpenReportModal }) => {
  const { user, switchRole, logout, isAdmin } = useAuth();
  const { alerts } = useEventData();
  const [lang, setLang] = useState('EN');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const activeAlertsCount = alerts.filter(a => a.active).length;

  const publicNavLinks = [
    { id: 'home', label: 'Home', icon: Shield },
    { id: 'map', label: 'Live Map', icon: MapPin },
    { id: 'near-me', label: 'Near Me', icon: Search },
    { id: 'emergency', label: 'Emergency', icon: AlertCircle },
    { id: 'report', label: 'Report', icon: Bell },
    { id: 'missing-person', label: 'Missing Person', icon: Users },
    { id: 'alerts', label: 'Safety Alerts', icon: Bell, badge: activeAlertsCount },
    { id: 'about', label: 'About', icon: Shield }
  ];

  const roles = ['Visitor', 'Security', 'Medical Responder', 'Fire Responder', 'Organizer', 'Admin'];

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePage('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-rose-600/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-wider">CROWD <span className="text-rose-500">SAFE</span></span>
              <span className="hidden md:block text-[10px] text-slate-400 font-mono tracking-widest uppercase">REAL-TIME SAFETY COMMAND</span>
            </div>
          </div>

          {/* Desktop Public Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {publicNavLinks.map(link => {
              const Icon = link.icon;
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    if (link.id === 'report' && onOpenReportModal) {
                      onOpenReportModal();
                    } else {
                      setActivePage(link.id);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-rose-600 text-white font-bold rounded-full">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Top Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-slate-200 outline-none cursor-pointer"
              >
                <option value="EN" className="bg-slate-900">EN - English</option>
                <option value="HI" className="bg-slate-900">HI - हिंदी</option>
                <option value="KN" className="bg-slate-900">KN - ಕನ್ನಡ</option>
                <option value="TA" className="bg-slate-900">TA - தமிழ்</option>
              </select>
            </div>

            {/* Admin Command Center Switcher Button */}
            <button
              onClick={() => setActivePage(isAdmin ? 'command-center' : 'home')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                activePage === 'command-center'
                  ? 'bg-sky-600 text-white border-sky-400'
                  : 'bg-slate-900 text-sky-400 border-sky-500/30 hover:bg-sky-950'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{activePage === 'command-center' ? 'Public View' : 'Command Center'}</span>
            </button>

            {/* Role Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 hover:border-slate-700"
              >
                <User className="w-3.5 h-3.5 text-rose-400" />
                <span>{user.role}</span>
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                  <div className="px-3 py-1 text-[10px] font-mono text-slate-400 uppercase border-b border-slate-800 mb-1">
                    Switch Role (Demo)
                  </div>
                  {roles.map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-slate-800 ${
                        user.role === r ? 'text-rose-400 font-bold bg-slate-800/50' : 'text-slate-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login / Auth Button */}
            {user.email !== 'visitor@crowdsafe.org' ? (
              <button
                onClick={logout}
                className="text-xs font-semibold text-slate-400 hover:text-white px-2 py-1"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl border border-slate-800"
              >
                <LogIn className="w-3.5 h-3.5 text-rose-400" />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setActivePage(activePage === 'command-center' ? 'home' : 'command-center')}
              className="px-2.5 py-1 text-[11px] bg-sky-950 text-sky-400 font-bold rounded-lg border border-sky-500/30"
            >
              {activePage === 'command-center' ? 'Public' : 'Admin'}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {publicNavLinks.map(link => {
              const Icon = link.icon;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (link.id === 'report' && onOpenReportModal) {
                      onOpenReportModal();
                    } else {
                      setActivePage(link.id);
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left ${
                    activePage === link.id ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Role: <strong className="text-rose-400">{user.role}</strong></span>
            <button
              onClick={() => {
                const nextRole = user.role === 'Visitor' ? 'Admin' : 'Visitor';
                switchRole(nextRole);
              }}
              className="px-3 py-1 bg-slate-800 text-slate-200 rounded-lg"
            >
              Toggle Admin/Visitor
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
