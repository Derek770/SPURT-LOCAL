'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Zap, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, ShieldCheck, Trophy, MapPin } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Interactive Background Sports Switcher
  const [activeSportIndex, setActiveSportIndex] = useState(0);
  const sportsData = [
    {
      sport: 'Cricket',
      icon: '??',
      quote: 'Smash boundaries under the lights at local NCR parks and box turfs.',
      venue: 'Pari Chowk Turf Arena, Greater Noida',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1600&auto=format&fit=crop&q=85',
      badge: 'Cricket Matchmaking Live'
    },
    {
      sport: 'Football',
      icon: '?',
      quote: 'Join fast 5v5 turf games and weekend 11s under floodlights.',
      venue: 'KickOff Arena, Sector 104, Noida',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&auto=format&fit=crop&q=85',
      badge: '5v5 & 7v7 Squads Forming'
    },
    {
      sport: 'Badminton',
      icon: '??',
      quote: 'Jump smashes, doubles rallies, and air-conditioned court bookings.',
      venue: 'Smash Indoor Academy, Knowledge Park 3',
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1600&auto=format&fit=crop&q=85',
      badge: 'Singles & Doubles Partners'
    },
    {
      sport: 'Table Tennis',
      icon: '??',
      quote: 'High-focus ranked Elo duels and weekend club tournaments.',
      venue: 'DLF Prime TT Club, South Delhi',
      image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=1600&auto=format&fit=crop&q=85',
      badge: 'Ranked 1v1 Matches'
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
        setError('Invalid email or password. If you are new, please register first.');
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
    <div className="min-h-screen bg-[#070D18] flex items-stretch justify-center relative overflow-hidden">
      
      {/* Dynamic Interactive Background Canvas */}
      <div className="absolute inset-0 z-0">
        {sportsData.map((s, idx) => (
          <div
            key={s.sport}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeSportIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img 
              src={s.image} 
              alt={s.sport} 
              className="w-full h-full object-cover transform duration-1000"
            />
            {/* Scrim overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#070D18]/95 via-[#070D18]/85 to-[#070D18]/70 lg:to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#070D18] via-transparent to-[#070D18]/60"></div>
          </div>
        ))}
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-screen items-center p-4 sm:p-8 gap-8">
        
        {/* Left Side: Interactive Brand Showcase & Sport Switcher (Desktop) */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between h-[580px] p-6 text-white">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-orange-500 flex items-center justify-center text-white font-black text-base shadow-xl group-hover:rotate-12 transition-transform">
                <Zap className="w-6 h-6 fill-white text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-tight text-white leading-none">
                  SPURT<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">LOCAL</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">Delhi-NCR Sports Hub</span>
              </div>
            </Link>

            {/* Dynamic Slogan & Live Badge */}
            <div className="mt-12 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-orange-500/40 text-orange-300 text-xs font-semibold backdrop-blur-xl animate-float">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{currentSport.badge}</span>
              </div>

              <h1 className="font-display font-black text-4xl xl:text-5xl leading-tight uppercase max-w-lg drop-shadow-2xl">
                MATCH. PLAY.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
                  NEVER GHOST.
                </span>
              </h1>

              <p className="text-slate-300 text-sm max-w-md font-medium leading-relaxed drop-shadow">
                "{currentSport.quote}"
              </p>

              <div className="text-xs text-cyan-300 flex items-center gap-1.5 font-semibold pt-2">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>Featured Turf: {currentSport.venue}</span>
              </div>
            </div>
          </div>

          {/* Interactive Sport Pills Bar */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Click to Explore Active Disciplines:
            </div>
            <div className="flex items-center gap-2">
              {sportsData.map((s, idx) => (
                <button
                  key={s.sport}
                  onClick={() => setActiveSportIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    idx === activeSportIndex
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg glow-orange scale-105'
                      : 'glass-card text-slate-300 hover:text-white hover:bg-slate-800/80 border border-white/10'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.sport}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Frosted Glass Login Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="glass-card rounded-3xl border border-white/20 p-7 sm:p-9 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
            
            {/* Top Glow Strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400"></div>

            {/* Mobile Header */}
            <div className="text-center lg:text-left mb-6">
              <Link href="/" className="lg:hidden inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-orange-500 flex items-center justify-center text-white font-black text-xs">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <span className="font-display font-black text-lg text-white">SPURT LOCAL</span>
              </Link>

              <h2 className="font-display font-extrabold text-2xl text-white">Sign In to Play</h2>
              <p className="text-xs text-slate-400 mt-1">Access your match lobbies, squad rosters, and ratings.</p>
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
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider glow-orange hover:from-orange-600 transition flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? 'Verifying Account...' : 'Sign In to Spurt'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center mt-6 pt-4 border-t border-white/10 text-xs text-slate-400">
              New athlete to the platform?{' '}
              <Link href="/register" className="text-orange-400 font-bold hover:underline">
                Create Account ?
              </Link>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
