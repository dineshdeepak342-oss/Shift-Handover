import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('shiftflow_session');
    if (session) {
      try {
        setUser(JSON.parse(session));
      } catch {
        localStorage.removeItem('shiftflow_session');
      }
    }
    setLoading(false);
  }, []);

  const signup = (userData) => {
    const users = JSON.parse(localStorage.getItem('shiftflow_users') || '[]');
    const exists = users.find(u => u.email === userData.email);
    if (exists) throw new Error('An account with this email already exists.');
    const newUser = {
      id: `usr_${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString(),
      onboarded: false,
    };
    users.push(newUser);
    localStorage.setItem('shiftflow_users', JSON.stringify(users));
    localStorage.setItem('shiftflow_session', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const signin = (email, password) => {
    const users = JSON.parse(localStorage.getItem('shiftflow_users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password.');
    localStorage.setItem('shiftflow_session', JSON.stringify(found));
    setUser(found);
    return found;
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    const users = JSON.parse(localStorage.getItem('shiftflow_users') || '[]');
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) users[idx] = updated;
    localStorage.setItem('shiftflow_users', JSON.stringify(users));
    localStorage.setItem('shiftflow_session', JSON.stringify(updated));
    setUser(updated);
  };

  const logout = () => {
    localStorage.removeItem('shiftflow_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, signin, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
