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

  // Interactive Background Sports Switcher
  const [activeSportIndex, setActiveSportIndex] = useState(1);
  const sportsData = [
    {
      sport: 'Cricket',
      icon: '??',
      quote: 'Join box turf battles and 20-over fixtures in your neighborhood.',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1600&auto=format&fit=crop&q=85'
    },
    {
      sport: 'Football',
      icon: '?',
      quote: '5v5 AstroTurf and weekend leagues under evening floodlights.',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&auto=format&fit=crop&q=85'
    },
    {
      sport: 'Badminton',
      icon: '??',
      quote: 'Indoor wooden court ladders, mixed doubles, and singles matches.',
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1600&auto=format&fit=crop&q=85'
    },
    {
      sport: 'Table Tennis',
      icon: '??',
      quote: '1v1 ranked rallies, community clubs, and precision play.',
      image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=1600&auto=format&fit=crop&q=85'
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
    <div className="min-h-screen bg-[#070D18] flex items-stretch justify-center relative overflow-hidden">
      
      {/* Background Image Slides */}
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#070D18]/95 via-[#070D18]/85 to-[#070D18]/70 lg:to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#070D18] via-transparent to-[#070D18]/60"></div>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-screen items-center p-4 sm:p-8 gap-8">
        
        {/* Left Side: Desktop Branding */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between h-[600px] p-6 text-white">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-orange-500 flex items-center justify-center text-white font-black text-base shadow-xl group-hover:rotate-12 transition-transform">
                <Zap className="w-6 h-6 fill-white text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-tight text-white leading-none">
                  SPURT<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">LOCAL</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">Delhi-NCR Sports Network</span>
              </div>
            </Link>

            <div className="mt-12 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold backdrop-blur-xl animate-float">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Instant Player Matchmaking</span>
              </div>

              <h1 className="font-display font-black text-4xl xl:text-5xl leading-tight uppercase max-w-lg drop-shadow-2xl">
                JOIN YOUR<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-amber-400">
                  NEIGHBORHOOD SQUAD.
                </span>
              </h1>

              <p className="text-slate-300 text-sm max-w-md font-medium leading-relaxed drop-shadow">
                "{currentSport.quote}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {sportsData.map((s, idx) => (
              <button
                key={s.sport}
                onClick={() => setActiveSportIndex(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  idx === activeSportIndex
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-lg glow-emerald scale-105'
                    : 'glass-card text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.sport}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="lg:col-span-6 w-full max-w-lg mx-auto">
          <div className="glass-card rounded-3xl border border-white/20 p-7 sm:p-9 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"></div>

            <div className="text-center lg:text-left mb-6">
              <h2 className="font-display font-extrabold text-2xl text-white">Create Athlete Profile</h2>
              <p className="text-xs text-slate-400 mt-1">Join active lobbies across Delhi, Noida, & Greater Noida.</p>
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
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs uppercase tracking-wider glow-emerald hover:brightness-110 transition flex items-center justify-center gap-2 shadow-lg mt-2"
              >
                {loading ? 'Creating Profile...' : 'Complete Profile & Play'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center mt-5 pt-3.5 border-t border-white/10 text-xs text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-400 font-bold hover:underline">
                Sign In ?
              </Link>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
