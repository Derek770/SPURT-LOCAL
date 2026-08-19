'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Zap, Lock, Mail, User, ArrowRight, AlertCircle, Eye, EyeOff, MapPin } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [preferredArea, setPreferredArea] = useState('Greater Noida (Pari Chowk & KP3)');
  const [sports, setSports] = useState<string[]>(['cricket', 'football']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [activeSportIndex, setActiveSportIndex] = useState(0);
  const sportsData = [
    {
      sport: 'Cricket',
      icon: '??',
      venue: 'Matches in Greater Noida, Delhi & NCR',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1920&auto=format&fit=crop&q=90'
    },
    {
      sport: 'Football',
      icon: '?',
      venue: 'Matches in Noida Sector 104 & South Delhi',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&auto=format&fit=crop&q=90'
    },
    {
      sport: 'Badminton',
      icon: '??',
      venue: 'Matches in Knowledge Park 3 & Siri Fort',
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1920&auto=format&fit=crop&q=90'
    },
    {
      sport: 'Table Tennis',
      icon: '??',
      venue: 'Matches in South Delhi & Dwarka Complex',
      image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=1920&auto=format&fit=crop&q=90'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSportIndex((prev) => (prev + 1) % sportsData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [sportsData.length]);

  const currentSport = sportsData[activeSportIndex];

  const toggleSport = (s: string) => {
    if (sports.includes(s)) {
      setSports(sports.filter((x) => x !== s));
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
        setError(err.message || 'Failed to create athlete profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D18] flex items-center justify-center p-4 relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* 4K Full-Screen Dynamic Background Photography Canvas */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {sportsData.map((s, idx) => (
          <div
            key={s.sport}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeSportIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img 
              src={s.image} 
              alt={s.sport} 
              className="w-full h-full object-cover animate-kenburns"
            />
            <div className="absolute inset-0 bg-[#070D18]/75 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#070D18] via-transparent to-[#070D18]/80"></div>
          </div>
        ))}
      </div>

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-600/20 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative z-10 max-w-lg w-full my-8">
        
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-emerald-300 text-xs font-semibold backdrop-blur-xl shadow-2xl animate-float">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentSport.venue}</span>
          </div>
        </div>

        <div className="glass-card rounded-3xl border border-white/20 p-8 sm:p-10 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"></div>

          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-orange-500 flex items-center justify-center text-white font-black text-sm shadow-xl group-hover:rotate-12 transition-transform">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <span className="font-display font-black text-2xl text-white">
                SPURT<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">LOCAL</span>
              </span>
            </Link>

            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
              CREATE ATHLETE PROFILE
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              Join active local match lobbies across Delhi, Noida, & Greater Noida.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Full Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Rohan Sharma"
                  className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-900/90 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rohan@example.com"
                  className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-900/90 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-2.5 pl-10 pr-10 rounded-xl bg-slate-900/90 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-200 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Preferred Location</label>
              <select 
                value={preferredArea}
                onChange={(e) => setPreferredArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Greater Noida (Pari Chowk & KP3)">?? Greater Noida (Pari Chowk & KP3)</option>
                <option value="Noida Sector 62 / 104">?? Noida Sector 62 / 104</option>
                <option value="South Delhi (Saket / Siri Fort)">?? South Delhi (Saket / Siri Fort)</option>
                <option value="Dwarka Sports Complex">?? Dwarka Sports Complex</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">Select Sports</label>
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
                        : 'border-white/10 bg-slate-900/60 text-slate-400'
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
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs uppercase tracking-wider glow-emerald hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 shadow-2xl animate-shimmer mt-2"
            >
              {loading ? 'Creating Profile in Database...' : 'REGISTER & ENTER PLATFORM'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center mt-5 pt-3.5 border-t border-white/10 text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-emerald-400 font-bold hover:underline">
              Sign In
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
