import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, ChevronDown, Settings, LogOut, User, FilePlus2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar, Badge } from '../ui';

const BREADCRUMBS = {
  '/app/dashboard': 'Overview',
  '/app/generate': 'Generate Handover',
  '/app/history': 'Shift History',
  '/app/sources': 'Data Sources',
  '/app/team': 'Team Members',
  '/app/settings': 'Settings',
  '/app/review': 'Review Handover',
};

export default function TopHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const page = BREADCRUMBS[location.pathname] || 'ShiftFlow AI';

  const NOTIFICATIONS = [
    { id: 1, text: 'INC-2207 search degradation still ongoing', time: '11 min ago', type: 'warning' },
    { id: 2, text: 'OPS-4821 resolved — handover updated', time: '42 min ago', type: 'success' },
    { id: 3, text: 'Meera Iyer accepted team invitation', time: '2h ago', type: 'info' },
  ];

  return (
    <header className="h-14 bg-slate-900/70 border-b border-slate-800 backdrop-blur-md flex items-center justify-between px-5 flex-shrink-0 sticky top-0 z-10">
      {/* Left */}
      <div>
        <h1 className="text-sm font-semibold text-white">{page}</h1>
        <p className="text-xs text-slate-500">ShiftFlow AI · {user?.company || 'Workspace'}</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Quick Generate */}
        <button
          onClick={() => navigate('/app/generate')}
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-lg hover:bg-teal-500/20 transition-all"
        >
          <FilePlus2 className="w-3.5 h-3.5" />
          New Handover
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifs(v => !v); setShowProfile(false); }}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-teal-500 rounded-full" />
          </button>
          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Notifications</span>
                  <Badge variant="teal">{NOTIFICATIONS.length}</Badge>
                </div>
                <div className="divide-y divide-slate-800">
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} className="px-4 py-3 hover:bg-slate-800/50 transition-colors cursor-pointer">
                      <p className="text-xs text-slate-300">{n.text}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 text-center">
                  <button className="text-xs text-teal-400 hover:text-teal-300">Mark all read</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(v => !v); setShowNotifs(false); }}
            className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-800 transition-all"
          >
            <Avatar name={user?.name || 'U'} color="bg-teal-600" size="sm" />
            <span className="hidden sm:block text-xs font-medium text-slate-300 max-w-[100px] truncate">
              {user?.name || 'User'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>
          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-slate-800">
                  <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  {[
                    { icon: User, label: 'Profile', action: () => navigate('/app/settings') },
                    { icon: Settings, label: 'Settings', action: () => navigate('/app/settings') },
                  ].map(({ icon: Icon, label, action }) => (
                    <button
                      key={label}
                      onClick={() => { action(); setShowProfile(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <button
                      onClick={() => { logout(); navigate('/'); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:bg-slate-800/60 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
