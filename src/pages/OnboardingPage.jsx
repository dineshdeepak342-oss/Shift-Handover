import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, ArrowRight, ShieldAlert, Layers, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button, Input, Select, Card, Badge } from '../components/ui';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [step, setStep] = useState(1);
  const [teamName, setTeamName] = useState(user?.company || 'NOC Operations Team');
  const [role, setRole] = useState('NOC Operator');
  const [timezone, setTimezone] = useState('UTC');
  const [dataSources, setDataSources] = useState(['Ticketing', 'Incidents', 'Team Chat', 'Git Commits']);

  const toggleSource = (source) => {
    if (dataSources.includes(source)) {
      if (dataSources.length === 1) return;
      setDataSources(dataSources.filter(s => s !== source));
    } else {
      setDataSources([...dataSources, source]);
    }
  };

  const handleFinish = () => {
    updateUser({
      teamName,
      role,
      timezone,
      dataSources,
      onboarded: true,
    });
    addToast({ type: 'success', title: 'Onboarding Complete', message: 'Workspace configured successfully!' });
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col justify-center py-12 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10 text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-glow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-white">ShiftFlow <span className="text-teal-400">AI</span></span>
        </div>
        <h2 className="text-3xl font-extrabold text-white">Welcome, {user?.name || 'Engineer'}!</h2>
        <p className="text-sm text-slate-400 mt-2">Let's set up your team workspace in 2 simple steps</p>

        {/* Progress Bar */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-16 bg-teal-500' : 'w-8 bg-slate-700'}`} />
          <div className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-16 bg-teal-500' : 'w-8 bg-slate-700'}`} />
        </div>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10"
      >
        <Card className="border-slate-800 shadow-2xl p-8">
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Team & Role Preferences</h3>
                <p className="text-xs text-slate-400">This configures default attribution for shift handover reports.</p>
              </div>

              <Input
                label="Workspace / Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Platform Reliability Team"
              />

              <Select
                label="Primary Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Support Engineer">Support Engineer</option>
                <option value="NOC Operator">NOC Operator</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="On-call Developer">On-call Developer</option>
                <option value="Engineering Manager">Engineering Manager</option>
              </Select>

              <Select
                label="Preferred Timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="EST">EST (Eastern Standard Time / UTC-5)</option>
                <option value="PST">PST (Pacific Standard Time / UTC-8)</option>
                <option value="IST">IST (Indian Standard Time / UTC+5:30)</option>
                <option value="CET">CET (Central European Time / UTC+1)</option>
              </Select>

              <Button variant="primary" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => setStep(2)}>
                Next: Connect Data Sources
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Select Primary Data Sources</h3>
                <p className="text-xs text-slate-400">Choose where ShiftFlow AI will pull operational activity from during shift windows.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'Ticketing', label: 'Ticketing (Jira / Zendesk)', desc: 'P1-P3 incidents and customer tickets' },
                  { id: 'Incidents', label: 'Incidents (PagerDuty)', desc: 'SEV1-SEV3 outages & alerts' },
                  { id: 'Team Chat', label: 'Team Chat (Slack / Teams)', desc: '#ops-alerts & handover threads' },
                  { id: 'Git Commits', label: 'Git Commits (GitHub)', desc: 'Main branch hotfixes & deployments' }
                ].map((src) => {
                  const selected = dataSources.includes(src.id);
                  return (
                    <div
                      key={src.id}
                      onClick={() => toggleSource(src.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selected
                          ? 'bg-teal-500/10 border-teal-500 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">{src.id}</span>
                        {selected && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{src.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <Button variant="secondary" onClick={() => setStep(1)} className="w-1/3">
                  Back
                </Button>
                <Button variant="primary" onClick={handleFinish} className="w-2/3" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Dashboard
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
