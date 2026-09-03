import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  leftIcon,
  rightIcon,
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-teal-500 hover:bg-teal-400 text-white shadow-glow-sm hover:shadow-glow-teal',
    secondary: 'border border-slate-700 hover:border-teal-500 text-slate-300 hover:text-white bg-transparent',
    ghost: 'text-slate-400 hover:text-white hover:bg-slate-800/60',
    danger: 'bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400',
    outline: 'border border-teal-500/50 text-teal-400 hover:bg-teal-500/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </motion.button>
  );
}

export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700',
    completed: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    inProgress: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    blockers: 'bg-red-500/15 text-red-400 border border-red-500/30',
    watchlist: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    teal: 'bg-teal-500/15 text-teal-400 border border-teal-500/30',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    error: 'bg-red-500/15 text-red-400 border border-red-500/30',
    info: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  };

  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = '', hover = false, ...props }) {
  const Component = hover ? motion.div : 'div';
  const hoverProps = hover ? {
    whileHover: { y: -2, boxShadow: '0 8px 32px rgba(20,184,166,0.1)' },
    transition: { duration: 0.2 },
  } : {};

  return (
    <Component
      className={`card ${className}`}
      {...hoverProps}
      {...props}
    >
      {children}
    </Component>
  );
}

export function Input({ label, error, hint, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="label">{label}</label>}
      <input className={`input ${error ? 'border-red-500 focus:ring-red-500/50' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-red-400 flex items-center gap-1">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="label">{label}</label>}
      <select
        className={`input appearance-none cursor-pointer ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function Skeleton({ className = '', lines = 1 }) {
  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`bg-slate-800/60 rounded-md animate-pulse ${i === lines - 1 ? 'w-3/4' : 'w-full'} h-4 ${className}`}
          />
        ))}
      </div>
    );
  }
  return <div className={`bg-slate-800/60 rounded-md animate-pulse h-4 ${className}`} />;
}

export function Divider({ className = '' }) {
  return <div className={`border-t border-slate-800 ${className}`} />;
}

export function Avatar({ name = '', color = 'bg-teal-600', size = 'md' }) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-11 h-11 text-base', xl: 'w-14 h-14 text-lg' };
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div className={`${color} ${sizes[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {initials}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mb-4">
        {Icon && <Icon className="w-6 h-6 text-slate-500" />}
      </div>
      <h3 className="text-slate-300 font-semibold mb-1">{title}</h3>
      <p className="text-slate-500 text-sm max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative w-full ${sizes[size]} bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden`}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h3 className="font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </div>
  );
}
