import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, AlertTriangle, Activity, Users, Plus, ArrowUpRight, Clock,
  CheckCircle2, AlertCircle, RefreshCw, ExternalLink, ShieldCheck, Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Badge, Skeleton } from '../components/ui';
import { MOCK_HANDOVERS } from '../data/mockHandovers';
import { MOCK_ACTIVITY } from '../data/mockActivity';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [handovers, setHandovers] = useState(MOCK_HANDOVERS);
  const [activity, setActivity] = useState(MOCK_ACTIVITY);
  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetch('/api/handovers').then(r => r.ok ? r.json() : null),
      fetch('/api/activity').then(r => r.ok ? r.json() : null),
    ]).then(([hData, aData]) => {
      if (!isMounted) return;
      if (hData && hData.length > 0) setHandovers(hData);
      if (aData && aData.length > 0) setActivity(aData);
      setDbConnected(true);
      setLoading(false);
    }).catch(() => {
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  const recentHandovers = handovers.slice(0, 3);
  const recentEvents = activity.slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-extrabold text-white">Welcome back, {user?.name || 'Engineer'}!</h2>
            {dbConnected && (
              <Badge variant="completed" className="text-[10px]">
                <Database className="w-3 h-3 text-emerald-400 inline mr-1" />
                Supabase DB Live
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1">
            ShiftFlow AI is active for <span className="text-teal-400 font-semibold">{user?.company || 'NOC Operations'}</span>. 4 data sources connected.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/app/generate')}
        >
          Generate New Handover
        </Button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Handovers Generated', value: String(handovers.length || 42), change: '+12% this week', icon: FileText, color: 'text-teal-400', bg: 'bg-teal-500/10' },
          { title: 'Open Blockers', value: '2', change: 'Requires attention', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
          { title: 'Events Processed', value: String(activity.length || 184), change: 'Across 4 sources', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { title: 'Active Team Members', value: '6', change: '2 on-call now', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((card, idx) => (
          <Card key={idx} hover className="border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.bg} ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-white mb-1">{card.value}</div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <span>{card.change}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Grid: Recent Handovers & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Handover Notes (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" />
              Recent Shift Handover Notes
            </h3>
            <button
              onClick={() => navigate('/app/history')}
              className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-4">
            {recentHandovers.map((hov) => (
              <Card
                key={hov.id}
                hover
                className="cursor-pointer border-slate-800/80 hover:border-slate-700"
                onClick={() => navigate('/app/review', { state: { handoverId: hov.id, shiftStart: hov.shiftStart, shiftEnd: hov.shiftEnd } })}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs font-mono text-slate-400">
                      {new Date(hov.shiftStart).toUTCString().slice(0, 22)} UTC
                    </span>
                    <h4 className="text-base font-semibold text-white mt-0.5">
                      Created by {hov.createdBy}
                    </h4>
                  </div>
                  <Badge variant="completed">Completed</Badge>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {hov.summary}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-medium">✓ {hov.itemCounts?.completed || 0} Completed</span>
                    <span className="text-blue-400 font-medium">↺ {hov.itemCounts?.inProgress || 0} In Progress</span>
                    <span className="text-red-400 font-medium">⚠ {hov.itemCounts?.blockers || 0} Blockers</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>Grounded Note</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Live Shift Activity Feed (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-400" />
              Live Shift Activity
            </h3>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Supabase Feed
            </span>
          </div>

          <Card className="border-slate-800 space-y-4">
            <div className="divide-y divide-slate-800/80">
              {recentEvents.map((evt, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Badge variant={evt.status === 'Completed' ? 'completed' : evt.status === 'Blockers' ? 'blockers' : 'inProgress'}>
                      {evt.source}: {evt.record_id}
                    </Badge>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(evt.timestamp).toISOString().slice(11, 16)} UTC
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug line-clamp-2">{evt.summary}</p>
                </div>
              ))}
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="w-full text-xs mt-2"
              onClick={() => navigate('/app/generate')}
            >
              Generate Note From Activity
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
