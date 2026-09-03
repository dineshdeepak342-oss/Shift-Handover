import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Download, Share2, Copy, RefreshCw, Edit3, ExternalLink,
  CheckCircle2, AlertTriangle, Clock, Eye, Sparkles, ArrowLeft, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, Button, Badge, Modal, Input } from '../components/ui';
import { exportHandoverPDF } from '../utils/pdfExport';
import { generateSlackSummary, generateHandover } from '../utils/handoverEngine';
import { MOCK_HANDOVERS } from '../data/mockHandovers';

export default function ReviewHandoverPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const stateData = location.state || {};
  const [shiftStart] = useState(stateData.shiftStart || '2026-09-03T06:00:00Z');
  const [shiftEnd] = useState(stateData.shiftEnd || '2026-09-03T14:00:00Z');

  // Fallback to computed handover if direct data was not passed
  const initialHandover = stateData.loadedData || generateHandover(shiftStart, shiftEnd, ['Ticketing', 'Incidents', 'Team Chat', 'Git Commits']);

  const [handoverData, setHandoverData] = useState({
    ...initialHandover,
    summary: initialHandover.summary || 'Eventful morning shift with SEV-1 auth outage mitigated promptly. Production DB connection pool issue resolved and pool limit increased to 500. Search service Elasticsearch rebalancing in progress — deployment freeze active.',
  });

  const [editingSummary, setEditingSummary] = useState(false);
  const [summaryText, setSummaryText] = useState(handoverData.summary);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleSaveSummary = () => {
    setHandoverData(prev => ({ ...prev, summary: summaryText }));
    setEditingSummary(false);
    addToast({ type: 'success', title: 'Summary Updated', message: 'Shift summary edited successfully.' });
  };

  const handleDownloadPDF = async () => {
    setExporting(true);
    try {
      await exportHandoverPDF(handoverData, shiftStart, shiftEnd, user?.name || 'Ravi Kumar');
      addToast({ type: 'success', title: 'PDF Exported', message: 'Shift Handover PDF saved to downloads.' });
    } catch (err) {
      addToast({ type: 'error', title: 'PDF Export Failed', message: err.message });
    } finally {
      setExporting(false);
    }
  };

  const handleCopySlack = () => {
    const slackText = generateSlackSummary(handoverData, shiftStart, shiftEnd, user?.name || 'Ravi Kumar');
    navigator.clipboard.writeText(slackText);
    addToast({ type: 'success', title: 'Slack Summary Copied', message: 'Paste directly into your #handover channel.' });
  };

  const handleExportDocx = () => {
    addToast({ type: 'info', title: 'Export DOCX', message: 'DOCX file generated and downloaded placeholder.' });
  };

  const SECTIONS = [
    { key: 'completed', title: '1. Completed', icon: CheckCircle2, color: 'text-emerald-400', badge: 'completed' },
    { key: 'inProgress', title: '2. In Progress', icon: Clock, color: 'text-blue-400', badge: 'inProgress' },
    { key: 'blockers', title: '3. Blockers / Escalations', icon: AlertTriangle, color: 'text-red-400', badge: 'blockers' },
    { key: 'watchlist', title: '4. Watch-list', icon: Eye, color: 'text-amber-400', badge: 'watchlist' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/app/generate')}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Generator
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Copy className="w-3.5 h-3.5 text-teal-400" />}
            onClick={handleCopySlack}
          >
            Copy Slack Summary
          </Button>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportDocx}
          >
            Export DOCX
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            loading={exporting}
            onClick={handleDownloadPDF}
          >
            Download PDF
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
            onClick={() => setShareModalOpen(true)}
          >
            Share
          </Button>
        </div>
      </div>

      {/* Main Document Preview Card */}
      <Card className="border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-10 space-y-8 relative overflow-hidden">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="teal">Official Shift Handover</Badge>
              <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> Grounded & Reproducible
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">Shift Handover Note</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Window: {new Date(shiftStart).toUTCString().slice(0, 22)} UTC → {new Date(shiftEnd).toUTCString().slice(0, 22)} UTC
            </p>
          </div>

          <div className="text-right text-xs text-slate-400 space-y-1">
            <p><span className="text-slate-500">Created by:</span> <strong className="text-slate-200">{user?.name || 'Ravi Kumar'}</strong></p>
            <p><span className="text-slate-500">Role:</span> {user?.role || 'Lead NOC Operator'}</p>
            <p><span className="text-slate-500">Generated:</span> {new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC</p>
          </div>
        </div>

        {/* Shift Summary Paragraph (Editable) */}
        <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Shift Summary</span>
            <button
              onClick={() => setEditingSummary(!editingSummary)}
              className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1"
            >
              <Edit3 className="w-3 h-3" /> {editingSummary ? 'Cancel' : 'Edit Summary'}
            </button>
          </div>

          {editingSummary ? (
            <div className="space-y-3">
              <textarea
                value={summaryText}
                onChange={(e) => setSummaryText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                rows={3}
              />
              <Button size="sm" onClick={handleSaveSummary}>Save Summary</Button>
            </div>
          ) : (
            <p className="text-sm text-slate-300 leading-relaxed italic">
              "{handoverData.summary}"
            </p>
          )}
        </div>

        {/* Four Required Sections */}
        <div className="space-y-8">
          {SECTIONS.map((sec) => {
            const items = handoverData.classified?.[sec.key] || [];
            const Icon = sec.icon;

            return (
              <div key={sec.key} className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className={`text-base font-bold flex items-center gap-2 ${sec.color}`}>
                    <Icon className="w-4 h-4" />
                    {sec.title}
                  </h3>
                  <Badge variant={sec.badge}>{items.length} items</Badge>
                </div>

                {items.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-2">Nothing to report</p>
                ) : (
                  <div className="space-y-2.5">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <p className="text-slate-200 font-medium leading-relaxed">{item.summary}</p>
                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                            <span className="font-mono text-teal-400 font-semibold">{item.source}: {item.record_id}</span>
                            <span>•</span>
                            <span>{new Date(item.timestamp).toISOString().slice(11, 16)} UTC</span>
                            <span>•</span>
                            <span>Assignee: {item.assignee || 'Unassigned'}</span>
                          </div>
                        </div>

                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-teal-400 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0"
                        >
                          Source Record <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Share Modal */}
      <Modal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} title="Share Shift Handover">
        <div className="space-y-4 text-xs">
          <p className="text-slate-400">Share this shift handover note link with team members or copy summary.</p>
          <Input label="Shareable Link" readOnly value={`https://app.shiftflow.ai/share/hov_${Date.now()}`} />
          <div className="flex gap-2">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                navigator.clipboard.writeText(`https://app.shiftflow.ai/share/hov_${Date.now()}`);
                addToast({ type: 'success', title: 'Link Copied', message: 'Share link copied to clipboard.' });
                setShareModalOpen(false);
              }}
            >
              Copy Link
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
