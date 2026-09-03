import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, ArrowRight, ShieldCheck, Filter, FileText, Share2, Layers,
  CheckCircle2, Clock, Terminal, ChevronDown, HelpCircle, Star, Lock
} from 'lucide-react';
import { Button, Badge } from '../components/ui';

export default function LandingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-slate-100 selection:bg-teal-500/30 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1e]/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-glow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-white tracking-tight">ShiftFlow <span className="text-teal-400">AI</span></span>
              <span className="block text-[10px] text-slate-400 font-mono tracking-wider uppercase">Handover Intelligence</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-teal-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-teal-400 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-teal-400 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-teal-400 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/signin" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2">
              Sign In
            </Link>
            <Button variant="primary" size="md" onClick={() => navigate('/signup')}>
              Start Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="teal" className="mb-6 py-1 px-4 text-xs font-semibold uppercase tracking-wider">
              ✨ Grounded Shift Handover Automation
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Never lose critical <span className="text-gradient">shift context</span> again.
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
              ShiftFlow AI automatically consolidates tickets, incidents, chat threads, and git commits into structured, source-grounded shift handover notes for on-call & ops teams.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="primary" size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-5 h-5" />} onClick={() => navigate('/signup')}>
                Start Free Trial
              </Button>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={() => navigate('/signin')}>
                View Demo Workspace
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-4 flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              No credit card required • 100% Source-Grounded & Reproducible
            </p>
          </motion.div>

          {/* Product Preview Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-16 rounded-2xl border border-slate-700/60 bg-slate-900/90 shadow-2xl p-4 sm:p-6 backdrop-blur-xl relative overflow-hidden text-left"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-500 ml-2">handover-note_2026-09-03_morning.pdf</span>
              </div>
              <Badge variant="completed">Completed Shift</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <span className="text-xs text-slate-400 block mb-1">Shift Duration</span>
                <span className="text-sm font-semibold text-white">06:00 UTC - 14:00 UTC</span>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <span className="text-xs text-slate-400 block mb-1">Deduplicated Records</span>
                <span className="text-sm font-semibold text-teal-400">12 items (3 duplicates merged)</span>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <span className="text-xs text-slate-400 block mb-1">Primary Sources</span>
                <span className="text-sm font-semibold text-white">Jira, PagerDuty, Slack, GitHub</span>
              </div>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-emerald-400 font-bold">✓ COMPLETED</span>
                  <span className="text-slate-500">Ticketing: OPS-4821</span>
                </div>
                <p className="text-slate-300">Production DB connection pool exhausted — pool limit increased to 500 & resolved.</p>
              </div>
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-400 font-bold">↺ IN PROGRESS</span>
                  <span className="text-slate-500">Incidents: INC-2207</span>
                </div>
                <p className="text-slate-300">SEV-2: Search service degraded — Elasticsearch shard rebalancing in progress.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-slate-900/40 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Purpose-built for operational rigor
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Generic AI hallucinates. ShiftFlow AI uses deterministic deduplication and strict grounding so every note item is verifiable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Filter,
                title: 'Shift-Window Filtering',
                desc: 'Strictly isolate activity within exact shift boundaries [start, end) without missing context.'
              },
              {
                icon: ShieldCheck,
                title: 'Source-Grounded Notes',
                desc: 'Every item links directly to ticket IDs, commit hashes, or incident URLs. Zero generic placeholder tasks.'
              },
              {
                icon: Layers,
                title: 'Automatic Deduplication',
                desc: 'Collapses multiple status updates on the same incident or ticket into a clean, final item state.'
              },
              {
                icon: FileText,
                title: 'PDF & DOCX Export',
                desc: 'Generate executive-ready PDF handovers or formatted text snippets for Slack in one click.'
              },
              {
                icon: Share2,
                title: 'Team-Ready Handovers',
                desc: 'Share shift summaries instantly with incoming engineers, team leads, or cross-functional stakeholders.'
              },
              {
                icon: Clock,
                title: 'Reproducible Logic',
                desc: 'Deterministic pipeline ensures regenerating the exact same window yields identical, reliable notes.'
              }
            ].map((f, i) => (
              <div key={i} className="card hover:border-teal-500/50 transition-all duration-300 group">
                <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center mb-6 text-teal-400 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="teal" className="mb-4">Four Simple Steps</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              How ShiftFlow AI Works
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              From raw shift logs to clean, traceable handovers in under 30 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Select Shift Window', desc: 'Define your shift start/end times and preferred timezone.' },
              { step: '02', title: 'Connect Activity', desc: 'Select active sources (Jira, PagerDuty, Slack, GitHub).' },
              { step: '03', title: 'Generate Handover', desc: 'ShiftFlow filters, deduplicates, and classifies items into 4 sections.' },
              { step: '04', title: 'Export & Share', desc: 'Download branded PDF or copy Slack summary for seamless transition.' }
            ].map((s, i) => (
              <div key={i} className="card relative overflow-hidden border-slate-800">
                <span className="text-5xl font-extrabold text-slate-800/80 absolute top-4 right-4 font-mono select-none">{s.step}</span>
                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Transparent pricing for every operational scale
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Start free, upgrade as your engineering or NOC team grows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Free',
                price: '$0',
                desc: 'For individual engineers on-call',
                features: ['Up to 10 handovers/month', '2 connected data sources', 'PDF Export', 'Local storage history']
              },
              {
                name: 'Team',
                price: '$29',
                popular: true,
                desc: 'For NOC, DevOps, & Support teams',
                features: ['Unlimited handovers', 'All data sources connected', 'PDF + DOCX Export', 'Slack/Teams integration', 'Shared team history', 'Role-based access']
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                desc: 'For large mission-critical orgs',
                features: ['Custom API integrations', 'SOC2 Compliance & SSO', 'Dedicated Support Manager', 'Custom SLA & Retention', 'On-prem deployment option']
              }
            ].map((p, i) => (
              <div key={i} className={`card relative flex flex-col justify-between ${p.popular ? 'border-teal-500 shadow-glow-sm' : 'border-slate-800'}`}>
                {p.popular && (
                  <Badge variant="teal" className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{p.name}</h3>
                  <p className="text-xs text-slate-400 mb-6">{p.desc}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-white">{p.price}</span>
                    {p.price !== 'Custom' && <span className="text-slate-400 text-sm"> / user / mo</span>}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 flex-shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant={p.popular ? 'primary' : 'secondary'} className="w-full" onClick={() => navigate('/signup')}>
                  {p.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-400">Everything you need to know about ShiftFlow AI handover automation.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How does ShiftFlow AI ensure notes are accurate and not hallucinated?',
                a: 'ShiftFlow AI relies on a deterministic data processing pipeline that strictly maps incoming activity records within your specified timestamp window. Every single note item is directly anchored to a record ID (e.g. Jira Ticket ID or Git commit hash).'
              },
              {
                q: 'Can multiple updates to the same ticket be merged?',
                a: 'Yes! Our deduplication logic identifies items sharing the same source and record ID, collapsing status changes into a single final state using the latest timestamp.'
              },
              {
                q: 'What formats can I export handover notes in?',
                a: 'You can export fully formatted PDF documents, copy markdown snippets directly for Slack/Teams, or download raw structured data.'
              },
              {
                q: 'Is my data secure?',
                a: 'Yes. API keys and data source credentials are never hardcoded. All communication uses encrypted TLS pipelines.'
              }
            ].map((item, idx) => (
              <div key={idx} className="card border-slate-800 cursor-pointer" onClick={() => toggleFaq(idx)}>
                <div className="flex items-center justify-between font-semibold text-white text-base">
                  <span>{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-teal-400' : ''}`} />
                </div>
                {openFaq === idx && (
                  <p className="mt-4 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-4">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-800 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-teal-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-base">ShiftFlow AI</span>
            <span className="text-slate-600">|</span>
            <span>© 2026 ShiftFlow Inc. All rights reserved.</span>
          </div>

          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-200">Privacy Policy</a>
            <a href="#" className="hover:text-slate-200">Terms of Service</a>
            <a href="#" className="hover:text-slate-200">Security</a>
            <a href="#" className="hover:text-slate-200">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
