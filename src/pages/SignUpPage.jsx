import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Code2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button, Input, Card } from '../components/ui';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Valid work email is required';
    if (!formData.company.trim()) errs.company = 'Company name is required';
    if (!formData.password || formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!formData.termsAccepted) errs.termsAccepted = 'You must accept terms & conditions';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      signup({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        password: formData.password,
      });
      addToast({ type: 'success', title: 'Account Created', message: 'Welcome to ShiftFlow AI!' });
      navigate('/onboarding');
    } catch (err) {
      setErrors({ email: err.message });
      addToast({ type: 'error', title: 'Signup Failed', message: err.message });
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
        <h2 className="text-2xl font-extrabold text-white">Create your account</h2>
        <p className="text-xs text-slate-400 mt-1">Start generating source-grounded shift handovers</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
      >
        <Card className="border-slate-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              placeholder="e.g. Alex Morgan"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />

            <Input
              label="Work Email"
              name="email"
              type="email"
              placeholder="alex@company.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Input
              label="Company / Team Name"
              name="company"
              placeholder="e.g. Acme Ops Team"
              value={formData.company}
              onChange={handleChange}
              error={errors.company}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="mt-1 rounded border-slate-700 bg-slate-800 text-teal-500 focus:ring-teal-500/50"
              />
              <label htmlFor="terms" className="text-xs text-slate-400">
                I agree to the <a href="#" className="text-teal-400 hover:underline">Terms of Service</a> and <a href="#" className="text-teal-400 hover:underline">Privacy Policy</a>
              </label>
            </div>
            {errors.termsAccepted && <p className="text-xs text-red-400">{errors.termsAccepted}</p>}

            <Button variant="primary" className="w-full mt-2" loading={loading} type="submit">
              Create Account
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="text-xs"
              onClick={() => {
                signup({ name: 'Demo Engineer', email: 'demo@shiftflow.ai', company: 'Acme Cloud Ops', password: 'password123' });
                addToast({ type: 'success', title: 'Social Sign In', message: 'Signed in with Google placeholder' });
                navigate('/onboarding');
              }}
            >
              Google
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="text-xs"
              leftIcon={<Code2 className="w-3.5 h-3.5" />}
              onClick={() => {
                signup({ name: 'Demo Dev', email: 'github.demo@shiftflow.ai', company: 'DevOps Org', password: 'password123' });
                addToast({ type: 'success', title: 'Social Sign In', message: 'Signed in with GitHub placeholder' });
                navigate('/onboarding');
              }}
            >
              GitHub
            </Button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/signin" className="text-teal-400 hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
