import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FilePlus2, History, Database, Users, Settings,
  Zap, LogOut, ChevronLeft, ChevronRight, Sparkles, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui';

const NAV_ITEMS = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/app/generate', icon: FilePlus2, label: 'Generate Handover' },
  { to: '/app/history', icon: History, label: 'Shift History' },
  { to: '/app/sources', icon: Database, label: 'Data Sources' },
  { to: '/app/team', icon: Users, label: 'Team Members' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen bg-slate-900/80 border-r border-slate-800 flex-shrink-0 z-20"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800 overflow-hidden">
        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <p className="text-sm font-bold text-white leading-none">ShiftFlow AI</p>
              <p className="text-xs text-slate-500 mt-0.5">{user?.company || 'Workspace'}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap text-sm"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* Upgrade */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-teal-500/10 to-blue-500/10 border border-teal-500/20"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <Zap className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-xs font-semibold text-teal-400">Free Plan</span>
          </div>
          <p className="text-xs text-slate-400 mb-2">Upgrade to Team for unlimited handovers</p>
          <button
            onClick={() => navigate('/app/settings')}
            className="w-full text-xs font-semibold text-white bg-teal-500 hover:bg-teal-400 rounded-lg py-1.5 transition-colors"
          >
            Upgrade Plan
          </button>
        </motion.div>
      )}

      {/* User */}
      <div className={`border-t border-slate-800 p-3 flex items-center gap-3 overflow-hidden ${collapsed ? 'justify-center' : ''}`}>
        <Avatar name={user?.name || 'User'} color="bg-teal-600" size="sm" />
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 min-w-0"
            >
              <p className="text-xs font-medium text-slate-200 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {!collapsed && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all shadow-lg"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  );
}
