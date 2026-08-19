'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SportType } from '@/types';

interface SportCardsProps {
  onSelectSport: (sport: SportType) => void;
}

export const SportCards: React.FC<SportCardsProps> = ({ onSelectSport }) => {
  const sports = [
    {
      id: 'cricket' as SportType,
      title: 'Cricket',
      badge: '?? 8 Lobbies Today',
      color: 'amber',
      borderClass: 'border-amber-500/20',
      btnClass: 'bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border-amber-500/30',
      tagClass: 'text-amber-400 border-amber-400/30',
      btnText: 'Find Cricket Matches ?',
      desc: 'Box Cricket turf battles, T20 leather ball fixtures, and neighborhood tennis-ball tournaments.',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'football' as SportType,
      title: 'Football',
      badge: '? 11 Lobbies Today',
      color: 'emerald',
      borderClass: 'border-emerald-500/20',
      btnClass: 'bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-black border-emerald-500/30',
      tagClass: 'text-emerald-400 border-emerald-400/30',
      btnText: 'Join Football Squads ?',
      desc: 'Floodlit 5v5 turf games, 7v7 friendlies, and weekend amateur recreational leagues.',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'badminton' as SportType,
      title: 'Badminton',
      badge: '?? 6 Lobbies Today',
      color: 'rose',
      borderClass: 'border-rose-500/20',
      btnClass: 'bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-black border-rose-500/30',
      tagClass: 'text-rose-400 border-rose-400/30',
      btnText: 'Connect with Partners ?',
      desc: 'Singles ladders, mixed doubles pairings, and indoor court slot bookings in AC venues.',
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'table_tennis' as SportType,
      title: 'Table Tennis',
      badge: '?? 5 Lobbies Today',
      color: 'cyan',
      borderClass: 'border-cyan-500/20',
      btnClass: 'bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-black border-cyan-500/30',
      tagClass: 'text-cyan-400 border-cyan-400/30',
      btnText: 'Challenge TT Players ?',
      desc: '1v1 ranked Elo duels, community club rallies, and casual ping-pong knockouts.',
      image: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?w=600&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <section id="sports-grid-section" className="py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="text-xs uppercase font-extrabold tracking-widest text-orange-400">Explore Sports</div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-1">Pick Your Discipline & Jump In</h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md">
          Whether you need a 10th player for Box Cricket or a singles rival in Badminton, find instant local games tailored to your skill rating.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {sports.map((sport) => (
          <div 
            key={sport.id} 
            className={`glass-card glass-card-hover rounded-2xl p-4 border ${sport.borderClass} group relative overflow-hidden flex flex-col justify-between`}
          >
            <div className="h-44 rounded-xl overflow-hidden relative mb-4">
              <img src={sport.image} alt={sport.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              <div className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-[11px] font-bold border ${sport.tagClass}`}>
                {sport.badge}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-white mb-1">{sport.title}</h3>
              <p className="text-xs text-slate-400 mb-4">{sport.desc}</p>
            </div>
            <button 
              onClick={() => onSelectSport(sport.id)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition border ${sport.btnClass}`}
            >
              {sport.btnText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
