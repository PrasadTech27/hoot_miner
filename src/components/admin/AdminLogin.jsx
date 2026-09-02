import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles, KeyRound } from 'lucide-react';

export function AdminLogin({ onLoginSuccess, addToast }) {
  const [email, setEmail] = useState('admin@hootminer.io');
  const [password, setPassword] = useState('hootminer2026');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (email.trim() && password.trim()) {
        onLoginSuccess({
          email,
          role: 'Administrator',
          loginTime: new Date().toISOString()
        });
        if (addToast) addToast('Authenticated successfully as Admin', 'success');
      } else {
        if (addToast) addToast('Please enter valid email and password credentials', 'error');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="py-16 max-w-md mx-auto px-4 animate-fade-in">
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 bg-white shadow-xl relative overflow-hidden">
        
        {/* Header Badge */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-sky-500 p-[1.5px] mx-auto mb-4 shadow-md">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-900">Admin Authentication</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Sign in to manage repositories, Q&A entries, and database sync.</p>
        </div>

        {/* Demo Quick Auto-Fill Info */}
        <div className="mb-6 p-3 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center justify-between font-medium">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Demo Mode Pre-filled</span>
          </div>
          <span className="font-mono text-[10px] font-bold bg-purple-200/80 px-2 py-0.5 rounded-lg text-purple-900">Ready</span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:border-purple-500 font-semibold"
                placeholder="admin@hootminer.io"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 focus:outline-none focus:border-purple-500 font-semibold"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
