'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Zap, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, MapPin, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 4K Ultra-High Resolution Dynamic Sports Action Photography
  const [activeSportIndex, setActiveSportIndex] = useState(0);
  const sportsData = [
    {
      sport: 'Cricket',
      icon: '??',
      tagline: 'Box Cricket & Leather Ball Matches',
      quote: 'Smash boundaries under the floodlights with verified neighborhood squads.',
      venue: 'Pari Chowk Turf Arena, Greater Noida',
      liveCount: '8 Lobbies Active',
      accentColor: 'from-amber-500 to-orange-500',
      glowColor: 'rgba(245, 158, 11, 0.35)',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1920&auto=format&fit=crop&q=90'
    },
    {
      sport: 'Football',
      icon: '?',
      tagline: '5v5 AstroTurf & Weekend 11s',
      quote: 'High-intensity night games, floodlit pitches, and zero last-minute ghosting.',
      venue: 'KickOff Arena, Sector 104, Noida',
      liveCount: '11 Squads Forming',
      accentColor: 'from-emerald-500 to-teal-400',
      glowColor: 'rgba(16, 185, 129, 0.35)',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&auto=format&fit=crop&q=90'
    },
    {
      sport: 'Badminton',
      icon: '??',
      tagline: 'Indoor Wooden Court Rallies',
      quote: 'Jump smashes, doubles partnerships, and air-conditioned court bookings.',
      venue: 'Smash Academy, Knowledge Park 3',
      liveCount: '6 Courts Open',
      accentColor: 'from-rose-500 to-pink-500',
      glowColor: 'rgba(244, 63, 94, 0.35)',
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1920&auto=format&fit=crop&q=90'
    },
    {
      sport: 'Table Tennis',
      icon: '??',
      tagline: 'Ranked 1v1 Elo Duels',
      quote: 'Precision topspin duels, community club leagues, and fast-paced rallies.',
      venue: 'DLF Prime TT Club, South Delhi',
      liveCount: '5 Ranked Duels',
      accentColor: 'from-cyan-500 to-blue-500',
      glowColor: 'rgba(6, 182, 212, 0.35)',
      image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=1920&auto=format&fit=crop&q=90'
    }
  ];

  // Auto-progress timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSportIndex((prev) => (prev + 1) % sportsData.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [sportsData.length]);

  const currentSport = sportsData[activeSportIndex];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      if (err.message?.includes('user-not-found') || err.message?.includes('invalid-credential')) {
        setError('Invalid credentials. If you are new to Spurt, please register first.');
      } else if (err.message?.includes('Account not found')) {
        setError('Account not found in database. Please register first.');
      } else {
        setError(err.message || 'Failed to sign in. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D18] flex items-center justify-center relative overflow-hidden selection:bg-orange-500 selection:text-white">
      
      {/* 4K Cinematic Full-Bleed Background Photography Layer */}
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
            {/* Cinematic Scrims & Dynamic Ambient Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#070D18]/95 via-[#070D18]/80 to-[#070D18]/40 lg:to-[#070D18]/25"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#070D18] via-transparent to-[#070D18]/80"></div>
          </div>
        ))}
      </div>

      {/* Radiant Ambient Glow Blob that matches the active sport */}
      <div 
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-colors duration-1000"
        style={{ backgroundColor: currentSport.glowColor }}
      ></div>

      {/* Main Content Layout */}
      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-screen items-center p-4 sm:p-8 lg:p-12 gap-8 lg:gap-12">
        
        {/* Left Column: Interactive Story & Sports Discipline Switcher (Desktop) */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between min-h-[580px] p-4 text-white">
          
          {/* Header Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-orange-500 flex items-center justify-center text-white font-black text-lg shadow-2xl group-hover:rotate-12 transition-transform">
                <Zap className="w-6 h-6 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl xl:text-3xl tracking-tight text-white leading-none">
                  SPURT<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">LOCAL</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold mt-0.5">
                  Delhi ? Greater Noida ? NCR
                </span>
              </div>
            </Link>

            {/* Dynamic Headline & Hero Info */}
            <div className="mt-12 space-y-4">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/85 border border-white/15 text-xs font-semibold backdrop-blur-xl shadow-2xl animate-float">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-slate-200">{currentSport.liveCount}</span>
                <span className="text-slate-500">?</span>
                <span className="text-orange-400 font-bold">{currentSport.tagline}</span>
              </div>

              <h1 className="font-display font-black text-4xl xl:text-5xl leading-[1.1] uppercase max-w-xl drop-shadow-2xl">
                FIND YOUR TEAM.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
                  MATCH. PLAY. REPEAT.
                </span>
              </h1>

              <p className="text-slate-200 text-sm xl:text-base max-w-lg font-medium leading-relaxed drop-shadow-lg">
                "{currentSport.quote}"
              </p>

              <div className="text-xs text-slate-300 flex items-center gap-2 pt-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="font-semibold text-slate-200">{currentSport.venue}</span>
              </div>
            </div>
          </div>

          {/* Interactive Sport Switcher Bar */}
          <div className="glass-panel p-3 rounded-2xl border border-white/10 max-w-xl backdrop-blur-xl">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
              <span>Explore Active Disciplines</span>
              <span className="text-orange-400">Auto-cycling</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {sportsData.map((s, idx) => (
                <button
                  key={s.sport}
                  onClick={() => setActiveSportIndex(idx)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 relative overflow-hidden ${
                    idx === activeSportIndex
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl glow-orange scale-105'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-white/5 hover:text-white'
                  }`}
                >
                  <span className="text-sm">{s.icon}</span>
                  <span className="truncate">{s.sport}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Ultra-Glassmorphism Sign In Form */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="glass-card rounded-3xl border border-white/20 p-7 sm:p-9 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
            
            {/* Top Radiant Gradient Strip */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${currentSport.accentColor}`}></div>

            {/* Mobile Header */}
            <div className="text-center lg:text-left mb-6">
              <Link href="/" className="lg:hidden inline-flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-orange-500 flex items-center justify-center text-white font-black text-sm">
                  <Zap className="w-5 h-5 fill-white" />
                </div>
                <span className="font-display font-black text-xl text-white">SPURT LOCAL</span>
              </Link>

              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">Sign In to Play</h2>
              <p className="text-xs text-slate-400 mt-1">Access your match lineups, slot reservations, and rating.</p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="athlete@example.com"
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-slate-900/90 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="????????"
                    className="w-full px-4 py-3 pl-10 pr-10 rounded-xl bg-slate-900/90 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs uppercase tracking-wider glow-orange hover:from-orange-600 active:scale-95 transition flex items-center justify-center gap-2 shadow-2xl animate-shimmer"
              >
                {loading ? 'Verifying Credentials...' : 'Sign In to Spurt'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center mt-6 pt-4 border-t border-white/10 text-xs text-slate-400">
              Don't have an athlete profile yet?{' '}
              <Link href="/register" className="text-orange-400 font-bold hover:underline inline-flex items-center gap-1">
                <span>Create Account</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
