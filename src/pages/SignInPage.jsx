import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button, Input, Card } from '../components/ui';

export default function SignInPage() {
  const navigate = useNavigate();
  const { signin, signup } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      signin(email, password);
      addToast({ type: 'success', title: 'Welcome Back', message: 'Successfully signed in.' });
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setLoading(true);
    try {
      // Ensure a demo account exists
      let demoUser;
      try {
        demoUser = signin('ravi.kumar@example.com', 'demo123');
      } catch {
        demoUser = signup({
          name: 'Ravi Kumar',
          email: 'ravi.kumar@example.com',
          company: 'Acme NOC Operations',
          password: 'demo123',
        });
      }
      addToast({ type: 'success', title: 'Demo Access Granted', message: 'Logged in as Ravi Kumar (Lead NOC Engineer).' });
      navigate('/app/dashboard');
    } catch (err) {
      addToast({ type: 'error', title: 'Demo Access Error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col justify-center py-12 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center mb-8">
        <div className="inline-flex items-center gap-2 cursor-pointer mb-4" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center shadow-glow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-white">ShiftFlow <span className="text-teal-400">AI</span></span>
        </div>
        <h2 className="text-2xl font-extrabold text-white">Sign in to your workspace</h2>
        <p className="text-xs text-slate-400 mt-1">Access your shift handovers and incident history</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <Card className="border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="ravi.kumar@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-teal-500"
                />
                Remember me
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); addToast({ type: 'info', title: 'Password Reset', message: 'Password reset link sent to email placeholder.' }); }} className="text-teal-400 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button variant="primary" className="w-full" loading={loading} type="submit">
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500">Quick Test Drive</span></div>
          </div>

          <Button
            variant="outline"
            className="w-full text-xs"
            leftIcon={<KeyRound className="w-4 h-4 text-teal-400" />}
            onClick={handleDemoLogin}
          >
            Sign in with Prefilled Demo Account
          </Button>

          <p className="text-center text-xs text-slate-400 mt-6">
            Don't have an account yet?{' '}
            <Link to="/signup" className="text-teal-400 hover:underline font-semibold">
              Create Account
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
