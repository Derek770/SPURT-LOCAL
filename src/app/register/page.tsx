'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Zap, Lock, Mail, User, ArrowRight, AlertCircle, Eye, EyeOff, MapPin, ShieldCheck, Trophy, ChevronRight } from 'lucide-react';

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

  const [activeSportIndex, setActiveSportIndex] = useState(1);
  const sportsData = [
    {
      sport: 'Cricket',
      icon: '??',
      tagline: 'Box Turf & Leather Matches',
      quote: 'Join 8v8 box cricket matches and T20 fixtures in your neighborhood.',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1920&auto=format&fit=crop&q=90'
    },
    {
      sport: 'Football',
      icon: '?',
      tagline: '5v5 AstroTurf & Weekend 11s',
      quote: 'Floodlit night games, fast-paced 5s, and guaranteed zero ghosting.',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&auto=format&fit=crop&q=90'
    },
    {
      sport: 'Badminton',
      icon: '??',
      tagline: 'Singles & Doubles Partners',
      quote: 'Indoor wooden court ladders, mixed doubles, and quick slot locks.',
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1920&auto=format&fit=crop&q=90'
    },
    {
      sport: 'Table Tennis',
      icon: '??',
      tagline: 'Ranked 1v1 Elo Duels',
      quote: 'Topspin rallies, fast reaction duels, and local weekend tournaments.',
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
    <div className="min-h-screen bg-[#070D18] flex items-center justify-center relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* 4K Background */}
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#070D18]/95 via-[#070D18]/85 to-[#070D18]/50 lg:to-[#070D18]/30"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#070D18] via-transparent to-[#070D18]/70"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-screen items-center p-4 sm:p-8 lg:p-12 gap-8 lg:gap-12">
        
        {/* LEFT COLUMN: About Spurt Onboarding */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between min-h-[580px] p-4 text-white">
          <div>
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-orange-500 flex items-center justify-center text-white font-black text-lg shadow-2xl group-hover:rotate-12 transition-transform">
                <Zap className="w-6 h-6 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl xl:text-3xl tracking-tight text-white leading-none">
                  SPURT<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">LOCAL</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mt-0.5">
                  Athlete Onboarding Hub
                </span>
              </div>
            </Link>

            <div className="mt-10 space-y-4">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/85 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-xl shadow-2xl animate-float">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Verified Matchmaking Network</span>
              </div>

              <h1 className="font-display font-black text-4xl xl:text-5xl leading-[1.1] uppercase max-w-lg drop-shadow-2xl">
                JOIN YOUR<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  NEIGHBORHOOD SQUAD.
                </span>
              </h1>

              <p className="text-slate-200 text-sm xl:text-base max-w-lg font-medium leading-relaxed drop-shadow-lg">
                "{currentSport.quote}"
              </p>
            </div>
          </div>

          <div className="glass-panel p-3 rounded-2xl border border-white/10 max-w-xl backdrop-blur-xl">
            <div className="grid grid-cols-4 gap-2">
              {sportsData.map((s, idx) => (
                <button
                  key={s.sport}
                  onClick={() => setActiveSportIndex(idx)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    idx === activeSportIndex
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-xl glow-emerald scale-105'
                      : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border border-white/5'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span className="truncate">{s.sport}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Register Form */}
        <div className="lg:col-span-6 w-full max-w-lg mx-auto">
          <div className="glass-card rounded-3xl border border-white/20 p-7 sm:p-9 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"></div>

            <div className="text-center lg:text-left mb-6">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">Create Athlete Profile</h2>
              <p className="text-xs text-slate-400 mt-1">Get verified to join live match lobbies across NCR.</p>
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

    </div>
  );
}
