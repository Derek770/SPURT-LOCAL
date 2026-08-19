'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Zap, Lock, Mail, User, ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferredArea, setPreferredArea] = useState('Greater Noida (Pari Chowk & KP3)');
  const [sports, setSports] = useState<string[]>(['cricket', 'football']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSport = (s: string) => {
    if (sports.includes(s)) {
      setSports(sports.filter(x => x !== s));
    } else {
      setSports([...sports, s]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill out all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (sports.length === 0) {
      setError('Please select at least one sport.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(email, password, displayName, preferredArea, sports);
      router.push('/dashboard');
    } catch (err: any) {
      if (err.message?.includes('email-already-in-use')) {
        setError('An account with this email already exists. Please sign in.');
      } else {
        setError(err.message || 'Failed to create athlete account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D18] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-600/15 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="glass-card rounded-3xl border border-white/15 p-8 max-w-lg w-full shadow-2xl relative z-10">
        
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 via-emerald-400 to-orange-500 flex items-center justify-center text-white font-black text-sm shadow-md">
              <Zap className="w-5 h-5 fill-white text-white" />
            </div>
            <span className="font-display font-black text-xl text-white">
              SPURT<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">LOCAL</span>
            </span>
          </Link>
          <h2 className="font-display font-extrabold text-2xl text-white">Create Athlete Profile</h2>
          <p className="text-xs text-slate-400 mt-1">Get registered to join live match lobbies across Delhi-NCR.</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Full Name / Nickname</label>
            <div className="relative">
              <input 
                type="text" 
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Rohan Sharma"
                className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-900/90 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohan@example.com"
                className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-900/90 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Password</label>
            <div className="relative">
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-900/90 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Primary Location Hub</label>
            <select 
              value={preferredArea}
              onChange={(e) => setPreferredArea(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-orange-500"
            >
              <option value="Greater Noida (Pari Chowk & KP3)">?? Greater Noida (Pari Chowk & KP3)</option>
              <option value="Noida Sector 62 / 104">?? Noida Sector 62 / 104</option>
              <option value="South Delhi (Saket / Siri Fort)">?? South Delhi (Saket / Siri Fort)</option>
              <option value="Dwarka Sports Complex">?? Dwarka Sports Complex</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Sports You Play</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'cricket', label: '?? Cricket' },
                { id: 'football', label: '? Football' },
                { id: 'badminton', label: '?? Badminton' },
                { id: 'table_tennis', label: '?? Table Tennis' },
              ].map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => toggleSport(s.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition text-left flex items-center justify-between ${
                    sports.includes(s.id) 
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' 
                      : 'border-white/10 bg-slate-900/60 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <span>{s.label}</span>
                  {sports.includes(s.id) && <span className="text-emerald-400 font-bold">?</span>}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs uppercase tracking-wider glow-emerald hover:brightness-110 transition flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Profile in Database...' : 'Register & Enter Platform'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-white/10 text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-orange-400 font-bold hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
