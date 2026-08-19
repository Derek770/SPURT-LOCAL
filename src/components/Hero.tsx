'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Zap } from 'lucide-react';
import { SportType } from '@/types';

interface HeroProps {
  onSelectSport: (sport: SportType) => void;
  onOpenMatchmaker: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectSport, onOpenMatchmaker }) => {
  return (
    <section className="relative pt-6 pb-12 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-cyan-600/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-slate-900">
        
        {/* Quad Split Action Panels */}
        <div className="hero-split-container flex-col lg:flex-row h-auto lg:h-[580px]">
          
          {/* Cricket */}
          <div className="hero-sport-panel group cursor-pointer" onClick={() => onSelectSport('cricket')}>
            <img 
              src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=85" 
              alt="Cricket match drive" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 scrim-gradient"></div>
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/80 text-black text-[11px] font-black uppercase tracking-wider backdrop-blur-md">Cricket</span>
              <h3 className="text-xl font-bold text-white mt-1">Box & Turf Matches</h3>
              <p className="text-xs text-slate-300 line-clamp-1">8 active lobbies in Greater Noida & Sec 62</p>
            </div>
          </div>

          {/* Football */}
          <div className="hero-sport-panel group cursor-pointer" onClick={() => onSelectSport('football')}>
            <img 
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&auto=format&fit=crop&q=85" 
              alt="Football turf celebration" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 scrim-gradient"></div>
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/80 text-black text-[11px] font-black uppercase tracking-wider backdrop-blur-md">Football</span>
              <h3 className="text-xl font-bold text-white mt-1">5v5 Turf & 11s</h3>
              <p className="text-xs text-slate-300 line-clamp-1">11 squads forming for tonight</p>
            </div>
          </div>

          {/* Badminton */}
          <div className="hero-sport-panel group cursor-pointer" onClick={() => onSelectSport('badminton')}>
            <img 
              src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200&auto=format&fit=crop&q=85" 
              alt="Badminton smash" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 scrim-gradient"></div>
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <span className="px-2.5 py-1 rounded-full bg-rose-500/80 text-white text-[11px] font-black uppercase tracking-wider backdrop-blur-md">Badminton</span>
              <h3 className="text-xl font-bold text-white mt-1">Singles & Doubles</h3>
              <p className="text-xs text-slate-300 line-clamp-1">Indoor wooden & synthetic courts</p>
            </div>
          </div>

          {/* Table Tennis */}
          <div className="hero-sport-panel group cursor-pointer" onClick={() => onSelectSport('table_tennis')}>
            <img 
              src="https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=1200&auto=format&fit=crop&q=85" 
              alt="Table Tennis duel" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 scrim-gradient"></div>
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/80 text-black text-[11px] font-black uppercase tracking-wider backdrop-blur-md">Table Tennis</span>
              <h3 className="text-xl font-bold text-white mt-1">Ranked 1v1 Duels</h3>
              <p className="text-xs text-slate-300 line-clamp-1">Fast rallies & club duels</p>
            </div>
          </div>

        </div>

        {/* Hero Center Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none scrim-radial-hero">
          
          <div className="pointer-events-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-orange-500/40 text-orange-300 text-xs sm:text-sm font-semibold mb-4 backdrop-blur-xl shadow-lg animate-float">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>Matches in Greater Noida, Delhi & NCR</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase max-w-4xl leading-[1.08] drop-shadow-2xl">
            FIND YOUR TEAM.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
              MATCH. PLAY. REPEAT.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-xl mt-4 font-medium drop-shadow">
            Stop struggling with last-minute cancellations. Join verified local match lobbies for Cricket, Football, Badminton & Table Tennis in under 60 seconds.
          </p>

          <div className="pointer-events-auto mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button 
              onClick={onOpenMatchmaker}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white font-extrabold text-sm sm:text-base uppercase tracking-wider hover:scale-105 active:scale-95 glow-orange transition-all shadow-2xl flex items-center gap-2.5"
            >
              <Zap className="w-5 h-5 fill-white text-white" />
              <span>FIND A MATCH NOW</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <Link 
              href="/dashboard" 
              className="px-6 py-4 rounded-2xl glass-card text-slate-200 hover:text-white hover:bg-slate-800/80 border border-white/10 font-bold text-xs sm:text-sm uppercase tracking-wider transition"
            >
              View Live Lobbies ?
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};
