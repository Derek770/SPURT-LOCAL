'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Zap, Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, MapPin, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 4K Full-Screen Dynamic Sports Backgrounds (Cricket, Football, Badminton, Table Tennis)
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

  // Auto-cycle background
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
    <div className="min-h-screen bg-[#070D18] flex items-center justify-center p-4 relative overflow-hidden selection:bg-orange-500 selection:text-white">
      
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
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-[#070D18]/75 backdrop-blur-[2px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#070D18] via-transparent to-[#070D18]/80"></div>
          </div>
        ))}
      </div>

      {/* Ambient Lighting Pulse */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-600/20 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Centered Glass Card */}
      <div className="relative z-10 max-w-md w-full my-8">
        
        {/* Floating Top Badge */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-orange-500/40 text-orange-300 text-xs font-semibold backdrop-blur-xl shadow-2xl animate-float">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>{currentSport.venue}</span>
          </div>
        </div>

        {/* The Card */}
        <div className="glass-card rounded-3xl border border-white/20 p-8 sm:p-10 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
          
          {/* Top Radiant Strip */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400"></div>

          {/* Logo & Header */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-orange-500 flex items-center justify-center text-white font-black text-sm shadow-xl group-hover:rotate-12 transition-transform">
                <Zap className="w-5 h-5 fill-white" />
              </div>
              <span className="font-display font-black text-2xl text-white">
                SPURT<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">LOCAL</span>
              </span>
            </Link>

            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase">
              FIND YOUR TEAM.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
                MATCH. PLAY. REPEAT.
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              Sign in to claim verified match slots across Delhi-NCR.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
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
                  placeholder="????????"
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

          {/* Quick Switch Sport Pills */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-center gap-2">
            {sportsData.map((s, idx) => (
              <button
                key={s.sport}
                onClick={() => setActiveSportIndex(idx)}
                title={s.sport}
                className={`w-8 h-8 rounded-lg text-sm flex items-center justify-center transition-all ${
                  idx === activeSportIndex 
                    ? 'bg-orange-500 text-white shadow-md scale-110' 
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                {s.icon}
              </button>
            ))}
          </div>

          <div className="text-center mt-4 text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link href="/register" className="text-orange-400 font-bold hover:underline">
              Register Athlete Account
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
