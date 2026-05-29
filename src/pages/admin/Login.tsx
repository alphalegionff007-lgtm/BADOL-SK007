import React, { useState } from 'react';
import { setAdminUser, isSupabaseConfigured, supabase } from '../../lib/supabase';
import { Dumbbell, ShieldAlert, KeyRound, Loader2, Info } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
  setHash: (hash: string) => void;
}

export default function Login({ onLoginSuccess, setHash }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSupabaseConfigured && supabase) {
        // Real Supabase Auth login
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        // Retrieve profile role
        const { data: profile, error: pError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user?.id)
          .single();

        if (pError || !profile || profile.role !== 'admin') {
          throw new Error('Access denied. Only registered administrators are permitted.');
        }

        setAdminUser({ email: data.user?.email || email, role: 'admin' });
      } else {
        // Fallback simulated credentials for seamless testing
        if (email.toLowerCase() === 'admin@ironelite.com' && password === 'admin123') {
          setAdminUser({ email, role: 'admin' });
        } else {
          throw new Error('Invalid credentials. Use admin@ironelite.com and admin123.');
        }
      }

      onLoginSuccess();
      setHash('#admin/dashboard');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Authorization failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-950 text-white min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-xl rounded-full" />
        
        {/* Logo/Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 bg-amber-500 rounded-2xl text-zinc-950 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Dumbbell className="w-6 h-6 transform -rotate-45" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wider">Admin Portal</h2>
          <p className="text-zinc-500 text-xs">
            Unlock lead pipelines, adjust price plans, and track payments ledger.
          </p>
        </div>

        {/* Info Credentials block for easy preview */}
        <div className="bg-amber-500/10 border border-amber-500/15 p-4 rounded-xl space-y-1 text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[10px] pl-0.5">
            <Info className="w-4 h-4 shrink-0" /> Local Test Credentials
          </div>
          <p className="text-zinc-400 leading-relaxed font-semibold">
            Email: <strong className="text-zinc-200">admin@ironelite.com</strong><br />
            Password: <strong className="text-zinc-200">admin123</strong>
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-550/10 border border-rose-550/20 text-rose-400 p-3.5 rounded-xl text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-zinc-400 text-xs font-semibold mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ironelite.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-amber-500 focus:text-white"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-semibold mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-650 focus:outline-none focus:border-amber-500 focus:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-zinc-950 font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-amber-500/20 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" /> Verifying Credentials...
              </>
            ) : (
              <>
                Authorize Portal <KeyRound className="w-4 h-4 shrink-0" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => setHash('#home')}
            className="text-zinc-500 hover:text-white text-xs transition-colors cursor-pointer"
          >
            ← Return to main website
          </button>
        </div>
      </div>
    </div>
  );
}
