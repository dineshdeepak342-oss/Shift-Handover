import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  History, Search, Filter, FileText, Download, CheckCircle2,
  Calendar, Users, ArrowUpRight, ShieldCheck, Database
} from 'lucide-react';
import { Card, Button, Input, Select, Badge } from '../components/ui';
import { MOCK_HANDOVERS } from '../data/mockHandovers';

export default function ShiftHistoryPage() {
  const navigate = useNavigate();

  const [handovers, setHandovers] = useState(MOCK_HANDOVERS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

  useEffect(() => {
    fetch('/api/handovers')
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data && data.length > 0) setHandovers(data); })
      .catch(() => {});
  }, []);

  const filteredHandovers = handovers.filter(hov => {
    const matchesSearch = (hov.createdBy || '').toLowerCase().includes(search.toLowerCase()) ||
                          (hov.summary || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || hov.status === statusFilter;
    const matchesSource = sourceFilter === 'All' || (hov.sources && hov.sources.includes(sourceFilter));
    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <History className="w-6 h-6 text-teal-400" />
          Shift Handover History
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Search and filter historical shift handover notes stored in Supabase PostgreSQL.
        </p>
      </div>

      {/* Filter Controls */}
      <Card className="border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by engineer name or summary keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Draft">Draft</option>
          </Select>

          <Select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
            <option value="All">All Sources</option>
            <option value="Ticketing">Ticketing</option>
            <option value="Incidents">Incidents</option>
            <option value="Team Chat">Team Chat</option>
            <option value="Git Commits">Git Commits</option>
          </Select>
        </div>
      </Card>

      {/* Handover List */}
      <div className="space-y-4">
        {filteredHandovers.length === 0 ? (
          <Card className="text-center py-12 border-slate-800">
            <p className="text-slate-400 text-sm">No handover notes match your current filters.</p>
          </Card>
        ) : (
          filteredHandovers.map((hov) => (
            <Card
              key={hov.id}
              hover
              className="border-slate-800 hover:border-slate-700 cursor-pointer"
              onClick={() => navigate('/app/review', { state: { handoverId: hov.id, shiftStart: hov.shiftStart, shiftEnd: hov.shiftEnd } })}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-teal-400 font-semibold">{hov.id}</span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs font-mono text-slate-300">
                      {new Date(hov.shiftStart).toUTCString().slice(0, 22)} UTC
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">Handover Note by {hov.createdBy}</h3>
                </div>

                <div className="flex items-center gap-3">
                  {hov.pdfExported ? (
                    <Badge variant="completed">PDF Exported</Badge>
                  ) : (
                    <Badge variant="default">Draft PDF</Badge>
                  )}
                  <Button variant="secondary" size="sm" rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}>
                    Open Note
                  </Button>
                </div>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">{hov.summary}</p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60 text-xs">
                <div className="flex items-center gap-4">
                  <span className="text-emerald-400 font-medium">✓ {hov.itemCounts?.completed || 0} Completed</span>
                  <span className="text-blue-400 font-medium">↺ {hov.itemCounts?.inProgress || 0} In Progress</span>
                  <span className="text-red-400 font-medium">⚠ {hov.itemCounts?.blockers || 0} Blockers</span>
                  <span className="text-amber-400 font-medium">👁 {hov.itemCounts?.watchlist || 0} Watch-list</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-500">
                  {hov.sources && hov.sources.map((s, idx) => (
                    <span key={idx} className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-400">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
