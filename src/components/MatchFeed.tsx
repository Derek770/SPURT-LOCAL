'use client';

import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { MatchItem, SportType, UserProfile } from '@/types';
import { MatchCard } from './MatchCard';

interface MatchFeedProps {
  matches: MatchItem[];
  currentSport: SportType;
  onSelectSport: (sport: SportType) => void;
  currentUser: UserProfile | null;
  onJoinMatch: (matchId: string) => void;
  onLeaveMatch: (matchId: string) => void;
  onOpenMatchmaker: () => void;
}

export const MatchFeed: React.FC<MatchFeedProps> = ({
  matches,
  currentSport,
  onSelectSport,
  currentUser,
  onJoinMatch,
  onLeaveMatch,
  onOpenMatchmaker
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMatches = matches.filter((m) => {
    const matchesSport = currentSport === 'all' || m.sport === currentSport;
    const matchesSearch = !searchQuery || 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesSearch;
  });

  const sportsTabs: { id: SportType; label: string; icon: string }[] = [
    { id: 'all', label: 'All Sports', icon: '?' },
    { id: 'cricket', label: 'Cricket', icon: '??' },
    { id: 'football', label: 'Football', icon: '?' },
    { id: 'badminton', label: 'Badminton', icon: '??' },
    { id: 'table_tennis', label: 'Table Tennis', icon: '??' },
  ];

  return (
    <section id="matches-section" className="py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">Live Matchmaker</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-1">Available Local Matches</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Instant drop-in spots with verified players in Delhi, Noida & Greater Noida.</p>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search venue, sport, or area (e.g. Pari Chowk, Sec 62)..." 
                className="w-full px-4 py-3 pl-10 rounded-2xl bg-slate-900/90 border border-white/15 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            {sportsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onSelectSport(tab.id)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm transition-all ${
                  currentSport === tab.id
                    ? 'font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg glow-orange'
                    : 'font-medium bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/5'
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-bold text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-full border border-white/5">
            {filteredMatches.length} Matches Found
          </div>
        </div>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="text-center py-16 px-4 glass-card rounded-2xl border border-white/5">
          <div className="text-5xl mb-4">??</div>
          <h3 className="text-xl font-bold text-white mb-2">No Matches Found in this Filter</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            Try switching sport tabs or clearing your search. Or be the hero and host a match in your neighborhood!
          </p>
          <button 
            onClick={onOpenMatchmaker}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg glow-orange transition"
          >
            Host a New Match
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <MatchCard 
              key={match.id} 
              match={match} 
              currentUser={currentUser} 
              onJoin={onJoinMatch} 
              onLeave={onLeaveMatch} 
            />
          ))}
        </div>
      )}
    </section>
  );
};
