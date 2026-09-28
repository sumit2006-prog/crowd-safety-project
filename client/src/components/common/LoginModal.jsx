import React, { useState } from 'react';
import { X, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEventData } from '../../context/EventDataContext';

export const LoginModal = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const { showToast } = useEventData();
  const [email, setEmail] = useState('admin@crowdsafe.org');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState('Admin');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate auth token API
    const user = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0].toUpperCase(),
      email,
      role
    };
    const token = 'jwt_mock_token_' + Date.now();
    login(user, token);
    showToast(`Logged in successfully as ${role}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white">SYSTEM LOGIN</h2>
          <p className="text-xs text-slate-400">Role-based authentication & Command Center access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={e=>setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-100 outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={e=>setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-100 outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Select Active Role</label>
            <select
              value={role}
              onChange={e=>setRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 outline-none focus:border-rose-500"
            >
              <option value="Visitor">Visitor (Public)</option>
              <option value="Security">Security Personnel</option>
              <option value="Medical Responder">Medical Responder</option>
              <option value="Fire Responder">Fire Responder</option>
              <option value="Organizer">Event Organizer</option>
              <option value="Admin">Admin / Command Director</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-rose-600/30 transition-all"
          >
            AUTHORIZE & LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};
