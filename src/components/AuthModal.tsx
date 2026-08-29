import React, { useState } from 'react';
import { X, User, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserAuthProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAuthProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'signin' | 'signup' | 'config'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [customUrl, setCustomUrl] = useState(localStorage.getItem('supabase_url') || '');
  const [customKey, setCustomKey] = useState(localStorage.getItem('supabase_anon_key') || '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!isSupabaseConfigured && !supabase) {
      setTimeout(() => {
        setLoading(false);
        const demoUser: UserAuthProfile = {
          id: 'demo-user-' + Math.random().toString(36).substring(2, 8),
          email: email || 'demo_user@finguide.ai',
          fullName: 'Demo Participant',
        };
        onLoginSuccess(demoUser);
        onClose();
      }, 500);
      return;
    }

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase!.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          setSuccessMsg('Account created successfully!');
          onLoginSuccess({ id: data.user.id, email: data.user.email || email });
          setTimeout(() => onClose(), 700);
        }
      } else {
        const { data, error } = await supabase!.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          onLoginSuccess({ id: data.user.id, email: data.user.email || email });
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = () => {
    if (customUrl && customKey) {
      localStorage.setItem('supabase_url', customUrl.trim());
      localStorage.setItem('supabase_anon_key', customKey.trim());
      setSuccessMsg('Supabase credentials saved! Refreshing page...');
      setTimeout(() => window.location.reload(), 600);
    } else {
      setErrorMsg('Please enter both Supabase URL and Anon Key');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-11 h-11 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
            <User className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {mode === 'config' ? 'Supabase Configuration' : mode === 'signup' ? 'Create Account' : 'Sign In to FinGuide'}
            </h2>
            <p className="text-xs text-slate-500">Secure JWT Authentication & Cloud History Sync</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 mb-4 text-xs font-semibold">
          <button
            onClick={() => { setMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-1.5 rounded-lg transition ${
              mode === 'signin' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-1.5 rounded-lg transition ${
              mode === 'signup' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => { setMode('config'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-1.5 rounded-lg transition ${
              mode === 'config' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Supabase Keys
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Forms */}
        {mode === 'config' ? (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Supabase Project URL</label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Supabase Anon Public API Key</label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition font-mono"
              />
            </div>
            <button
              onClick={handleSaveConfig}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-sm transition"
            >
              Save Credentials & Connect
            </button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 transition font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold shadow-sm transition"
            >
              {loading ? 'Authenticating...' : mode === 'signup' ? 'Create Free Account' : 'Sign In with JWT'}
            </button>

            {/* Quick Demo Guest button */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  onLoginSuccess({
                    id: 'guest-session-1',
                    email: 'guest@demo.local',
                    fullName: 'Guest User',
                  });
                  onClose();
                }}
                className="text-[11px] text-slate-500 hover:text-amber-700 font-semibold flex items-center justify-center gap-1 mx-auto transition"
              >
                <span>Or Continue in Instant Guest Demo Mode</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5 justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>Protected by Supabase Auth (JWT & Row-Level Security)</span>
        </div>
      </div>
    </div>
  );
};
