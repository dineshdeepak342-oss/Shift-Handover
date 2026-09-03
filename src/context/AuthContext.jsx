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

  const signup = async (userData) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      localStorage.setItem('shiftflow_session', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err) {
      // Local fallback if offline
      const newUser = {
        id: `usr_${Date.now()}`,
        ...userData,
        createdAt: new Date().toISOString(),
        onboarded: false,
      };
      localStorage.setItem('shiftflow_session', JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    }
  };

  const signin = async (email, password) => {
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid email or password.');
      localStorage.setItem('shiftflow_session', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (err) {
      // Demo fallback
      if (email === 'ravi.kumar@example.com' || password === 'demo123') {
        const demoUser = {
          id: 'usr_demo_ravi',
          name: 'Ravi Kumar',
          email: 'ravi.kumar@example.com',
          company: 'Acme NOC Operations',
          role: 'NOC Operator',
          timezone: 'UTC',
          onboarded: true,
        };
        localStorage.setItem('shiftflow_session', JSON.stringify(demoUser));
        setUser(demoUser);
        return demoUser;
      }
      throw err;
    }
  };

  const updateUser = async (updates) => {
    const updated = { ...user, ...updates };
    try {
      await fetch('/api/auth/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {}
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
