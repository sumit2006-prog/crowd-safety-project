import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('crowd_safe_user');
    return saved ? JSON.parse(saved) : { name: 'Visitor', email: 'visitor@crowdsafe.org', role: 'Visitor' };
  });

  const [token, setToken] = useState(() => localStorage.getItem('crowd_safe_token') || null);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('crowd_safe_user', JSON.stringify(userData));
    if (jwtToken) localStorage.setItem('crowd_safe_token', jwtToken);
  };

  const logout = () => {
    setUser({ name: 'Visitor', email: 'visitor@crowdsafe.org', role: 'Visitor' });
    setToken(null);
    localStorage.removeItem('crowd_safe_user');
    localStorage.removeItem('crowd_safe_token');
  };

  const switchRole = (newRole) => {
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem('crowd_safe_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, switchRole, isAdmin: ['Admin', 'Organizer'].includes(user?.role) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
