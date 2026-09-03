import React, { useState } from 'react';
import { Settings, User, Building, ShieldAlert, Key, Bell, Lock, Check } from 'lucide-react';
import { Card, Button, Input, Select, Badge } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [company, setCompany] = useState(user?.company || '');
  const [role, setRole] = useState(user?.role || 'NOC Operator');
  const [timezone, setTimezone] = useState(user?.timezone || 'UTC');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser({ name, company, role, timezone });
    addToast({ type: 'success', title: 'Settings Saved', message: 'Profile & workspace settings updated.' });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-teal-400" />
          Settings & Workspace Configuration
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Manage your account, team defaults, security keys, and environment policies.
        </p>
      </div>

      {/* Profile & Workspace */}
      <Card className="border-slate-800 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <User className="w-4 h-4 text-teal-400" /> Profile & Workspace Details
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Company / Workspace Name" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Primary Role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Support Engineer">Support Engineer</option>
              <option value="NOC Operator">NOC Operator</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="On-call Developer">On-call Developer</option>
              <option value="Engineering Manager">Engineering Manager</option>
            </Select>

            <Select label="Default Timezone" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="EST">EST (Eastern Standard Time)</option>
              <option value="PST">PST (Pacific Standard Time)</option>
              <option value="IST">IST (Indian Standard Time)</option>
            </Select>
          </div>

          <Button type="submit" variant="primary">
            Save Preferences
          </Button>
        </form>
      </Card>

      {/* API Key Placeholder & Security Notice */}
      <Card className="border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Key className="w-4 h-4 text-teal-400" /> API Keys & Integration Tokens
        </h3>

        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-start gap-3 text-xs text-red-300">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
          <div>
            <strong className="font-semibold block text-red-200 uppercase tracking-wider mb-0.5">Critical Security Rule</strong>
            Never hard-code secrets. Use environment variables (e.g. <code>SHIFTFLOW_API_KEY</code>, <code>JIRA_API_TOKEN</code>) in production server environments.
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <Input
            label="Workspace API Key (Read-Only Demo Token)"
            readOnly
            value="sf_live_99f82a17c09e4a3b8d1f2e34567890ab"
          />
          <p className="text-[11px] text-slate-500">
            Use this token to query ShiftFlow AI handover summaries programmatically via REST API.
          </p>
        </div>
      </Card>
    </div>
  );
}
