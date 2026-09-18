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
import { UpiTurfSplitterModal } from '@/components/UpiTurfSplitterModal';
import { TeamBalancerModal } from '@/components/TeamBalancerModal';
import { MvpVotingModal } from '@/components/MvpVotingModal';
import { useAuth } from '@/context/AuthContext';
import { MatchItem, SportType } from '@/types';
import { 
  subscribeToMatches, 
  createMatch, 
  joinMatch, 
  leaveMatch,
  toggleSosBeacon,
  checkInPlayer
} from '@/lib/matches';
import { ShieldCheck, Trophy, Zap, MapPin, Heart, Flame } from 'lucide-react';

export default function Home() {
  const { userProfile } = useAuth();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [selectedSport, setSelectedSport] = useState<SportType>('all');
  const [isMatchmakerOpen, setIsMatchmakerOpen] = useState(false);
  const [isWarmUpOpen, setIsWarmUpOpen] = useState(false);
  
  // Modals state
  const [selectedChatMatch, setSelectedChatMatch] = useState<MatchItem | null>(null);
  const [selectedSplitterMatch, setSelectedSplitterMatch] = useState<MatchItem | null>(null);
  const [selectedBalancerMatch, setSelectedBalancerMatch] = useState<MatchItem | null>(null);
  const [selectedMvpMatch, setSelectedMvpMatch] = useState<MatchItem | null>(null);
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

  const handleToggleSos = async (match: MatchItem) => {
    try {
      await toggleSosBeacon(match.id, !match.isSosActive);
    } catch (err) {
      console.error('Failed to toggle SOS:', err);
    }
  };

  const handleCheckIn = async (match: MatchItem) => {
    if (!userProfile) {
      window.location.href = '/login';
      return;
    }
    try {
      await checkInPlayer(match.id, userProfile);
      alert('✓ Checked in successfully! +5 Athlete Karma awarded.');
    } catch (err) {
      console.error('Failed to check in:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D18] relative text-slate-100 selection:bg-orange-500 selection:text-white pb-20">
      
      {/* Dynamic Live Ticker Header with SOS Alerts */}
      {matches.length > 0 && (
        <div className="bg-slate-900/90 border-b border-white/10 py-2 overflow-hidden sticky top-0 z-50 backdrop-blur-md">
          <div className="animate-ticker flex items-center gap-12 whitespace-nowrap text-xs text-slate-300 font-semibold tracking-wide">
            {matches.map((m) => (
              <span key={m.id} className="flex items-center gap-2">
                {m.isSosActive ? (
                  <span className="flex items-center gap-1 text-red-400 font-black animate-pulse">
                    <Flame className="w-3.5 h-3.5 fill-red-400" />
                    <span>[🚨 SOS DROPOUT]</span>
                  </span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
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

      {/* Match Feed & Interactive Pitch Radar */}
      <MatchFeed 
        matches={matches}
        currentSport={selectedSport}
        onSelectSport={setSelectedSport}
        currentUser={userProfile}
        onJoinMatch={handleJoinMatch}
        onLeaveMatch={handleLeaveMatch}
        onOpenMatchmaker={handleOpenMatchmaker}
        onOpenChat={(match) => setSelectedChatMatch(match)}
        onOpenSplitter={(match) => setSelectedSplitterMatch(match)}
        onOpenBalancer={(match) => setSelectedBalancerMatch(match)}
        onOpenMvp={(match) => setSelectedMvpMatch(match)}
        onToggleSos={handleToggleSos}
        onCheckIn={handleCheckIn}
      />

      {/* Sport Category Cards */}
      <SportCards onSelectSport={handleSelectSport} />

      {/* How it Works / 6 Features */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">Next-Gen Local Matchmaking</div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-2">Built for Pure Competition</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-3xl p-8 border border-white/10 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-black text-xl mb-6 shadow-lg">
              🛡️
            </div>
            <h3 className="font-bold text-lg text-white mb-2">Ghost-Shield Karma</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              100-point reliability score. Verified on-pitch check-ins award +5 Karma; no-shows get penalized.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-white/10 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-xl mb-6 shadow-lg">
              💸
            </div>
            <h3 className="font-bold text-lg text-white mb-2">In-Chat UPI Splitter</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatic cost-per-head breakdown and instant GPay/PhonePe/Paytm QR code payments.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-white/10 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black text-xl mb-6 shadow-lg">
              🗺️
            </div>
            <h3 className="font-bold text-lg text-white mb-2">NCR Pitch Radar</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive cyber radar map showing live match venues across Greater Noida, Noida, and Delhi.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 pt-12 pb-8 px-4 sm:px-6 max-w-7xl mx-auto text-center text-xs text-slate-400">
        <p className="mb-2">
          © 2026 SPURT LOCAL. Designed & Created with ⚡ by <strong className="text-slate-200">Yashwant Sonkar</strong>.
        </p>
        <p className="text-slate-500 text-[11px]">
          Delhi • Greater Noida • Noida Sector 62 / 104 • Dwarka
        </p>
      </footer>

      {/* Modals Suite */}
      <MatchmakerModal 
        isOpen={isMatchmakerOpen}
        onClose={() => setIsMatchmakerOpen(false)}
        onSubmit={handleCreateMatch}
        currentUser={userProfile}
      />

      <SquadChatModal 
        isOpen={!!selectedChatMatch}
        match={selectedChatMatch}
        currentUser={userProfile}
        onClose={() => setSelectedChatMatch(null)}
      />

      <WarmUpArenaModal
        isOpen={isWarmUpOpen}
        onClose={() => setIsWarmUpOpen(false)}
        currentUser={userProfile}
      />

      <UpiTurfSplitterModal
        isOpen={!!selectedSplitterMatch}
        match={selectedSplitterMatch}
        currentUser={userProfile}
        onClose={() => setSelectedSplitterMatch(null)}
      />

      <TeamBalancerModal
        isOpen={!!selectedBalancerMatch}
        match={selectedBalancerMatch}
        currentUser={userProfile}
        onClose={() => setSelectedBalancerMatch(null)}
      />

      <MvpVotingModal
        isOpen={!!selectedMvpMatch}
        match={selectedMvpMatch}
        currentUser={userProfile}
        onClose={() => setSelectedMvpMatch(null)}
      />

      {/* Floating Action Button */}
      <WarmUpFAB onOpen={() => setIsWarmUpOpen(true)} />

    </div>
  );
}
