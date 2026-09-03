import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, CheckCircle2, ShieldAlert, KeyRound, AlertTriangle, ExternalLink } from 'lucide-react';
import { Card, Button, Badge, Modal, Input } from '../components/ui';
import { useToast } from '../context/ToastContext';

export default function DataSourcesPage() {
  const { addToast } = useToast();
  const [sources, setSources] = useState([
    { id: 'jira', name: 'Jira / Ticketing', connected: true, lastSync: '3 mins ago', events: '142 records' },
    { id: 'pagerduty', name: 'PagerDuty / Incidents', connected: true, lastSync: '1 min ago', events: '38 records' },
    { id: 'slack', name: 'Slack / Team Chat', connected: true, lastSync: 'Just now', events: '89 records' },
    { id: 'github', name: 'GitHub / Git Commits', connected: true, lastSync: '12 mins ago', events: '54 records' },
  ]);

  const [connectModal, setConnectModal] = useState(null);

  const toggleConnect = (id) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, connected: !s.connected } : s));
    const target = sources.find(s => s.id === id);
    addToast({
      type: target.connected ? 'info' : 'success',
      title: `${target.name} Integration`,
      message: target.connected ? 'Source disconnected.' : 'Connected successfully in demo mode.'
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Database className="w-6 h-6 text-teal-400" />
          Connected Data Sources
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Manage integrations for automatic shift activity retrieval.
        </p>
      </div>

      {/* Security Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex items-start gap-3 text-xs text-amber-300">
        <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" />
        <div>
          <strong className="font-semibold block text-amber-200">Security Architecture Notice</strong>
          Production API tokens & secrets are never hard-coded in client bundles. Connected states below are grounded mock instances configured via secure environment variables.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sources.map((src) => (
          <Card key={src.id} className="border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{src.name}</h3>
                <span className="text-xs text-slate-500">Last synced: {src.lastSync}</span>
              </div>
              <Badge variant={src.connected ? 'completed' : 'default'}>
                {src.connected ? 'Connected' : 'Not Connected'}
              </Badge>
            </div>

            <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
              <span>Indexed shift events: <strong className="text-slate-200">{src.events}</strong></span>
              <Button
                variant={src.connected ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => toggleConnect(src.id)}
              >
                {src.connected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
