'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Zap, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, MapPin, Trophy, ShieldCheck, Activity, Target, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 4K Dynamic Sports Action Photography
  const [activeSportIndex, setActiveSportIndex] = useState(0);
  const sportsData = [
    {
      sport: 'Cricket',
      tagline: 'Box Cricket & Turf Matches',
      quote: 'Smash boundaries under the floodlights with verified neighborhood squads across NCR.',
      venue: 'Pari Chowk Arena, Greater Noida',
      liveCount: '8 Lobbies Active',
      accentColor: 'text-amber-400 bg-amber-500/20 border-amber-500/40',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1920&auto=format&fit=crop&q=90'
    },
    {
      sport: 'Football',
      tagline: '5v5 AstroTurf & Weekend 11s',
      quote: 'High-intensity night games, floodlit pitches, and guaranteed zero last-minute ghosting.',
      venue: 'KickOff Arena, Sector 104, Noida',
      liveCount: '11 Squads Forming',
      accentColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&auto=format&fit=crop&q=90'
    },
    {
      sport: 'Badminton',
      tagline: 'Indoor Wooden Court Ladders',
      quote: 'Jump smashes, doubles partnerships, and air-conditioned court bookings.',
      venue: 'Smash Academy, Knowledge Park 3',
      liveCount: '6 Courts Open',
      accentColor: 'text-rose-400 bg-rose-500/20 border-rose-500/40',
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1920&auto=format&fit=crop&q=90'
    },
    {
      sport: 'Table Tennis',
      tagline: 'Ranked 1v1 Elo Duels',
      quote: 'Precision topspin duels, community club leagues, and fast-paced rallies.',
      venue: 'DLF Prime TT Club, South Delhi',
      liveCount: '5 Ranked Duels',
      accentColor: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40',
      image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=1920&auto=format&fit=crop&q=90'
    }
  ];

  // Auto-cycle background every 6 seconds
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
    <div className="min-h-screen bg-[#070D18] relative overflow-hidden flex items-center justify-center selection:bg-orange-500 selection:text-white">
      
      {/* 4K Cinematic Action Photography Background Layer */}
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
            {/* Scrim Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#070D18]/95 via-[#070D18]/85 to-[#070D18]/45 md:to-[#070D18]/30"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#070D18] via-transparent to-[#070D18]/70"></div>
          </div>
        ))}
      </div>

      {/* Main Container: Split 2-Columns (Left: Website Info, Right: Login Form Card) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-10 min-h-screen">
        
        {/* LEFT SIDE: Website Info & Brand Story */}
        <div className="w-full md:w-1/2 flex flex-col justify-center text-white py-6">
          
          {/* Brand Header */}
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group w-fit">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-orange-500 flex items-center justify-center text-white font-black text-lg shadow-2xl group-hover:rotate-12 transition-transform">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white leading-none">
                SPURT<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">LOCAL</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold mt-0.5">
                Delhi ? Greater Noida ? NCR
              </span>
            </div>
          </Link>

          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-orange-500/40 text-orange-300 text-xs font-semibold backdrop-blur-xl shadow-xl w-fit mb-4">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>{currentSport.venue}</span>
          </div>

          {/* Big Hero Headline */}
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-[1.08] drop-shadow-2xl">
            FIND YOUR TEAM.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
              MATCH. PLAY. REPEAT.
            </span>
          </h1>

          <p className="text-slate-200 text-sm sm:text-base max-w-lg mt-4 font-medium leading-relaxed drop-shadow">
            "{currentSport.quote}"
          </p>

          {/* Value Props Pills */}
          <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-bold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Ghosting</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-bold text-slate-200">
              <Activity className="w-4 h-4 text-orange-400" />
              <span>Real-Time Sync</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-bold text-slate-200">
              <Trophy className="w-4 h-4 text-cyan-400" />
              <span>Skill Matchmaking</span>
            </div>
          </div>

          {/* Clean Sports Switcher Bar */}
          <div className="mt-8">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Switch Sport Backdrop:
            </div>
            <div className="flex flex-wrap gap-2">
              {sportsData.map((s, idx) => (
                <button
                  key={s.sport}
                  onClick={() => setActiveSportIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    idx === activeSportIndex
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xl glow-orange scale-105'
                      : 'bg-slate-900/75 hover:bg-slate-800 text-slate-300 border border-white/10 hover:text-white'
                  }`}
                >
                  {s.sport}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT SIDE: Frosted Glass Login Card */}
        <div className="w-full md:w-auto md:min-w-[420px] max-w-md">
          <div className="glass-card rounded-3xl border border-white/20 p-8 sm:p-10 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
            
            {/* Top Radiant Strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400"></div>

            <div className="text-left mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Athlete Portal</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">Sign In to Play</h2>
              <p className="text-xs text-slate-400 mt-1">Access your match passes, squad rosters, and ratings.</p>
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
                    className="w-full px-4 py-3.5 pl-10 rounded-xl bg-slate-900/90 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
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
                    placeholder="Enter your password"
                    className="w-full px-4 py-3.5 pl-10 pr-10 rounded-xl bg-slate-900/90 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white font-black text-xs uppercase tracking-wider glow-orange hover:from-orange-600 active:scale-95 transition flex items-center justify-center gap-2 shadow-2xl animate-shimmer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{loading ? 'Verifying Credentials...' : 'SIGN IN TO SPURT'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center mt-6 pt-4 border-t border-white/10 text-xs text-slate-400">
              Don't have an athlete account?{' '}
              <Link href="/register" className="text-orange-400 font-bold hover:underline inline-flex items-center gap-1">
                <span>Register Athlete Profile</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
