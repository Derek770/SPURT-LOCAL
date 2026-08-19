'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Zap } from 'lucide-react';
import { SportType } from '@/types';

interface HeroProps {
  onSelectSport: (sport: SportType) => void;
  onOpenMatchmaker: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectSport, onOpenMatchmaker }) => {
  const [activeHoverSport, setActiveHoverSport] = useState<SportType | null>(null);

  const sportsList = [
    {
      id: 'cricket' as SportType,
      name: 'Cricket',
      tag: 'Box & Turf Matches',
      activeCount: '8 active lobbies in Greater Noida & Sec 62',
      badgeColor: 'bg-amber-500 text-black',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=85'
    },
    {
      id: 'football' as SportType,
      name: 'Football',
      tag: '5v5 Turf & 11s',
      activeCount: '11 squads forming for tonight',
      badgeColor: 'bg-emerald-500 text-black',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&auto=format&fit=crop&q=85'
    },
    {
      id: 'badminton' as SportType,
      name: 'Badminton',
      tag: 'Singles & Doubles',
      activeCount: 'Indoor wooden & synthetic courts',
      badgeColor: 'bg-rose-500 text-white',
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1200&auto=format&fit=crop&q=85'
    },
    {
      id: 'table_tennis' as SportType,
      name: 'Table Tennis',
      tag: 'Ranked 1v1 Duels',
      activeCount: 'Fast rallies & club duels',
      badgeColor: 'bg-cyan-500 text-black',
      image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=1200&auto=format&fit=crop&q=85'
    }
  ];

  return (
    <section className="relative pt-6 pb-12 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-600/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-cyan-600/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-slate-950">
        
        {/* Quad Split Action Panels (4-Way Interactive Sports Accordion) */}
        <div className="w-full flex flex-col lg:flex-row min-h-[580px]">
          {sportsList.map((sport) => {
            const isHovered = activeHoverSport === sport.id;
            return (
              <div 
                key={sport.id}
                onClick={() => onSelectSport(sport.id)}
                onMouseEnter={() => setActiveHoverSport(sport.id)}
                onMouseLeave={() => setActiveHoverSport(null)}
                className={`relative overflow-hidden group cursor-pointer transition-all duration-500 ease-out flex flex-col justify-end p-6 border-b lg:border-b-0 lg:border-r border-white/10 ${
                  isHovered ? 'lg:flex-[2.2] brightness-110' : (activeHoverSport ? 'lg:flex-[0.6] brightness-50' : 'lg:flex-1')
                } min-h-[140px] lg:min-h-[580px]`}
              >
                {/* Background Sport Image */}
                <img 
                  src={sport.image} 
                  alt={sport.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#070D18] via-[#070D18]/60 to-transparent"></div>

                {/* Isolated Bottom Label for this specific panel */}
                <div className="relative z-10 pointer-events-none">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider backdrop-blur-md shadow-md inline-block ${sport.badgeColor}`}>
                    {sport.name}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-white mt-1.5 drop-shadow-md">
                    {sport.tag}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1 drop-shadow-sm">
                    {sport.activeCount}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hero Center Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pointer-events-none scrim-radial-hero">
          
          <div className="pointer-events-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-orange-500/40 text-orange-300 text-xs sm:text-sm font-semibold mb-4 backdrop-blur-xl shadow-2xl animate-float">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>Matches in Greater Noida, Delhi & NCR</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase max-w-4xl leading-[1.08] drop-shadow-2xl">
            FIND YOUR TEAM.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
              MATCH. PLAY. REPEAT.
            </span>
          </h1>

          <p className="text-slate-200 text-sm sm:text-base max-w-xl mt-4 font-medium drop-shadow-lg">
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
