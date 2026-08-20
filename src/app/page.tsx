'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { MatchFeed } from '@/components/MatchFeed';
import { SportCards } from '@/components/SportCards';
import { MatchmakerModal } from '@/components/MatchmakerModal';
import { SquadChatModal } from '@/components/SquadChatModal';
import { WarmUpArenaModal } from '@/components/WarmUpArenaModal';
import { WarmUpFAB } from '@/components/WarmUpFAB';
import { useAuth } from '@/context/AuthContext';
import { MatchItem, SportType } from '@/types';
import { subscribeToMatches, createMatch, joinMatch, leaveMatch } from '@/lib/matches';
import { ShieldCheck, Trophy, Zap, MapPin, Heart } from 'lucide-react';

export default function Home() {
  const { userProfile } = useAuth();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [selectedSport, setSelectedSport] = useState<SportType>('all');
  const [isMatchmakerOpen, setIsMatchmakerOpen] = useState(false);
  const [selectedChatMatch, setSelectedChatMatch] = useState<MatchItem | null>(null);
  const [isWarmUpOpen, setIsWarmUpOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Greater Noida');

  useEffect(() => {
    const unsubscribe = subscribeToMatches((liveMatches) => {
      setMatches(liveMatches);
    });
    return () => unsubscribe();
  }, []);

  const handleSelectSport = (sport: SportType) => {
    setSelectedSport(sport);
    const feedElement = document.getElementById('matches-section');
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenMatchmaker = () => {
    setIsMatchmakerOpen(true);
  };

  const handleCreateMatch = async (matchData: any) => {
    try {
      await createMatch(matchData);
    } catch (err) {
      console.error('Failed to create match:', err);
    }
  };

  const handleJoinMatch = async (matchId: string) => {
    if (!userProfile) {
      window.location.href = '/login';
      return;
    }
    try {
      await joinMatch(matchId, userProfile);
    } catch (err: any) {
      alert(err.message || 'Could not join match.');
    }
  };

  const handleLeaveMatch = async (matchId: string) => {
    if (!userProfile) return;
    try {
      await leaveMatch(matchId, userProfile);
    } catch (err: any) {
      alert(err.message || 'Could not leave match.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070D18] relative text-slate-100 selection:bg-orange-500 selection:text-white pb-20">
      
      {/* Dynamic Live Ticker Header */}
      {matches.length > 0 && (
        <div className="bg-slate-900/90 border-b border-white/10 py-2 overflow-hidden sticky top-0 z-50 backdrop-blur-md">
          <div className="animate-ticker flex items-center gap-12 whitespace-nowrap text-xs text-slate-300 font-semibold tracking-wide">
            {matches.map((m) => (
              <span key={m.id} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-orange-400 font-bold uppercase">{m.sport}:</span>
                <span>{m.title} at {m.venue}</span>
                <span className="text-emerald-300">({m.filledSlots}/{m.totalSlots} joined)</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Navbar */}
      <Navbar 
        onOpenMatchmaker={handleOpenMatchmaker}
        onOpenWarmUp={() => setIsWarmUpOpen(true)}
        selectedLocation={selectedLocation}
        onSelectLocation={setSelectedLocation}
      />

      {/* Hero Section */}
      <Hero 
        matches={matches}
        onSelectSport={handleSelectSport}
        onOpenMatchmaker={handleOpenMatchmaker}
      />

      {/* Match Feed */}
      <MatchFeed 
        matches={matches}
        currentSport={selectedSport}
        onSelectSport={setSelectedSport}
        currentUser={userProfile}
        onJoinMatch={handleJoinMatch}
        onLeaveMatch={handleLeaveMatch}
        onOpenMatchmaker={handleOpenMatchmaker}
        onOpenChat={(match) => setSelectedChatMatch(match)}
      />

      {/* Sport Category Cards */}
      <SportCards onSelectSport={handleSelectSport} />

      {/* How it Works / Value Props */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">Simple 3-Step Matchmaker</div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-2">How Spurt Local Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-3xl p-8 border border-white/10 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-black text-xl mb-6 shadow-lg">
              1
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Find or Host a Lobby</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select your sport, specify exact team capacity (from 2 to 32 players), skill level, and local NCR turf venue.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-white/10 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-xl mb-6 shadow-lg">
              2
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Squad Chat & Real-Time Roster</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every match has a dedicated live squad chat room. Coordinate arrival times, jersey colors, and pitch navigation.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-white/10 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-xl mb-6 shadow-lg">
              3
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Show Up & Play</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Arrive at the verified turf venue and play. Guaranteed full rosters with zero ghosting.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 pt-12 pb-8 px-4 sm:px-6 max-w-7xl mx-auto text-center text-xs text-slate-400">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-orange-500 flex items-center justify-center text-white font-black text-xs shadow-md">
            <Zap className="w-3.5 h-3.5 fill-white text-white" />
          </div>
          <span className="font-display font-black text-base text-white tracking-tight">
            SPURT<span className="text-orange-400">LOCAL</span>
          </span>
        </div>
        <p className="mb-2">
          © 2026 SPURT LOCAL. Designed & Created with ⚡ by <strong className="text-slate-200">Yashwant Sonkar</strong>.
        </p>
        <p className="text-slate-500 text-[11px]">
          Delhi • Greater Noida • Noida Sector 62 / 104 • Dwarka
        </p>
      </footer>

      {/* Matchmaker Modal */}
      <MatchmakerModal 
        isOpen={isMatchmakerOpen}
        onClose={() => setIsMatchmakerOpen(false)}
        onSubmit={handleCreateMatch}
        currentUser={userProfile}
      />

      {/* Real-Time Squad Chat Modal */}
      <SquadChatModal 
        isOpen={!!selectedChatMatch}
        match={selectedChatMatch}
        currentUser={userProfile}
        onClose={() => setSelectedChatMatch(null)}
      />

      {/* Warm-Up Arena Modal */}
      <WarmUpArenaModal
        isOpen={isWarmUpOpen}
        onClose={() => setIsWarmUpOpen(false)}
        currentUser={userProfile}
      />

      {/* Floating Warm-Up Action Button */}
      <WarmUpFAB onOpen={() => setIsWarmUpOpen(true)} />

    </div>
  );
}
