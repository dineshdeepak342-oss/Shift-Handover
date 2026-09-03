import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, Filter, Layers, ArrowRight, RefreshCw, AlertTriangle,
  CheckCircle2, Sparkles, Database, FilePlus2, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, Button, Input, Select, Badge, Skeleton } from '../components/ui';
import { PRESET_SHIFTS } from '../data/mockActivity';
import { generateHandover } from '../utils/handoverEngine';

export default function GenerateHandoverPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [shiftStart, setShiftStart] = useState('2026-09-03T06:00');
  const [shiftEnd, setShiftEnd] = useState('2026-09-03T14:00');
  const [timezone, setTimezone] = useState(user?.timezone || 'UTC');
  const [selectedSources, setSelectedSources] = useState(['Ticketing', 'Incidents', 'Team Chat', 'Git Commits']);

  const [loadedData, setLoadedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const toggleSource = (src) => {
    if (selectedSources.includes(src)) {
      if (selectedSources.length === 1) return;
      setSelectedSources(selectedSources.filter(s => s !== src));
    } else {
      setSelectedSources([...selectedSources, src]);
    }
  };

  const handleApplyPreset = (preset) => {
    setShiftStart(preset.start.slice(0, 16));
    setShiftEnd(preset.end.slice(0, 16));
    addToast({ type: 'info', title: 'Shift Window Selected', message: preset.label });
  };

  const handleLoadActivity = () => {
    setLoading(true);
    setTimeout(() => {
      const result = generateHandover(
        `${shiftStart}:00Z`,
        `${shiftEnd}:00Z`,
        selectedSources
      );
      setLoadedData(result);
      setLoading(false);
      if (result.warnings.length > 0) {
        addToast({ type: 'warning', title: 'Source Warning', message: result.warnings[0] });
      } else {
        addToast({
          type: 'success',
          title: 'Activity Loaded',
          message: `Loaded ${result.totalEvents} events (${result.duplicatesRemoved} duplicates deduplicated).`
        });
      }
    }, 600);
  };

  const handleProceedToReview = () => {
    if (!loadedData || loadedData.items.length === 0) {
      addToast({ type: 'error', title: 'Cannot Proceed', message: 'Please load activity records first.' });
      return;
    }

    navigate('/app/review', {
      state: {
        shiftStart: `${shiftStart}:00Z`,
        shiftEnd: `${shiftEnd}:00Z`,
        sources: selectedSources,
        loadedData,
      }
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <FilePlus2 className="w-6 h-6 text-teal-400" />
          Create Shift Handover Note
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Select shift timestamps and active sources. ShiftFlow AI will isolate events, deduplicate records, and build a grounded handover summary.
        </p>
      </div>

      {/* Preset Shift Window Shortcuts */}
      <Card className="border-slate-800 bg-slate-900/60">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">Quick Presets</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_SHIFTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(preset)}
              className="text-left p-3 rounded-lg border border-slate-800 hover:border-teal-500/50 bg-slate-800/40 hover:bg-teal-500/10 transition-all text-xs"
            >
              <div className="font-semibold text-slate-200 mb-1">{preset.label}</div>
              <div className="text-[11px] text-slate-500 font-mono">
                {preset.start.slice(11, 16)} → {preset.end.slice(11, 16)} UTC
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Shift Window & Source Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Window Settings (2 cols) */}
        <Card className="md:col-span-2 space-y-5 border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Clock className="w-4 h-4 text-teal-400" />
            1. Define Shift Window
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Shift Start Date/Time"
              type="datetime-local"
              value={shiftStart}
              onChange={(e) => setShiftStart(e.target.value)}
            />
            <Input
              label="Shift End Date/Time"
              type="datetime-local"
              value={shiftEnd}
              onChange={(e) => setShiftEnd(e.target.value)}
            />
          </div>

          <Select
            label="Shift Timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option value="UTC">UTC (Coordinated Universal Time)</option>
            <option value="EST">EST (Eastern Standard Time)</option>
            <option value="PST">PST (Pacific Standard Time)</option>
            <option value="IST">IST (Indian Standard Time)</option>
          </Select>
        </Card>

        {/* Right: Data Sources (1 col) */}
        <Card className="space-y-4 border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Database className="w-4 h-4 text-teal-400" />
            2. Select Sources
          </h3>

          <div className="space-y-2.5">
            {['Ticketing', 'Incidents', 'Team Chat', 'Git Commits'].map((src) => {
              const selected = selectedSources.includes(src);
              return (
                <div
                  key={src}
                  onClick={() => toggleSource(src)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer text-xs transition-all ${
                    selected
                      ? 'bg-teal-500/10 border-teal-500/50 text-white'
                      : 'bg-slate-800/30 border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="font-semibold">{src}</span>
                  {selected && <Check className="w-4 h-4 text-teal-400" />}
                </div>
              );
            })}
          </div>

          <Button
            variant="primary"
            className="w-full mt-4"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={handleLoadActivity}
            loading={loading}
          >
            Load Shift Activity
          </Button>
        </Card>
      </div>

      {/* Loaded Activity Section */}
      {loadedData && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <Badge variant="teal">{loadedData.totalEvents} Loaded Events</Badge>
              <Badge variant="completed">{loadedData.dedupedCount} Deduplicated Records</Badge>
              {loadedData.duplicatesRemoved > 0 && (
                <Badge variant="warning">{loadedData.duplicatesRemoved} Duplicates Merged</Badge>
              )}
            </div>

            <Button
              variant="primary"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={handleProceedToReview}
            >
              Generate Handover Note
            </Button>
          </div>

          {/* Activity Preview Table */}
          <Card className="border-slate-800 overflow-hidden p-0">
            <div className="p-4 bg-slate-800/50 border-b border-slate-800 font-semibold text-sm text-white">
              Loaded Operational Records [{shiftStart.replace('T', ' ')} → {shiftEnd.replace('T', ' ')}]
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Source</th>
                    <th className="p-3">Record ID</th>
                    <th className="p-3">Timestamp (UTC)</th>
                    <th className="p-3">Summary</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {loadedData.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-semibold text-white">{item.source}</td>
                      <td className="p-3 font-mono text-teal-400">{item.record_id}</td>
                      <td className="p-3 font-mono text-slate-400">{item.timestamp.slice(11, 16)}</td>
                      <td className="p-3">{item.summary}</td>
                      <td className="p-3">
                        <Badge
                          variant={
                            item.status === 'Completed' ? 'completed' :
                            item.status === 'Blockers' ? 'blockers' :
                            item.status === 'In Progress' ? 'inProgress' : 'watchlist'
                          }
                        >
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
