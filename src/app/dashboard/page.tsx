'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { MatchCard } from '@/components/MatchCard';
import { MatchmakerModal } from '@/components/MatchmakerModal';
import { SquadChatModal } from '@/components/SquadChatModal';
import { WarmUpArenaModal } from '@/components/WarmUpArenaModal';
import { WarmUpFAB } from '@/components/WarmUpFAB';
import { UpiTurfSplitterModal } from '@/components/UpiTurfSplitterModal';
import { TeamBalancerModal } from '@/components/TeamBalancerModal';
import { MvpVotingModal } from '@/components/MvpVotingModal';
import { MatchItem, SportType } from '@/types';
import { 
  subscribeToMatches, 
  createMatch, 
  joinMatch, 
  leaveMatch,
  toggleSosBeacon,
  checkInPlayer
} from '@/lib/matches';
import { User, Trophy, Shield, Calendar, MapPin, Zap, LogOut, PlusCircle, Sparkles, MessageSquare, Award, Flame, Wallet, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { userProfile, loading, logout } = useAuth();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [activeTab, setActiveTab] = useState<'joined' | 'hosted' | 'all'>('joined');
  
  const [isMatchmakerOpen, setIsMatchmakerOpen] = useState(false);
  const [isWarmUpOpen, setIsWarmUpOpen] = useState(false);
  const [selectedChatMatch, setSelectedChatMatch] = useState<MatchItem | null>(null);
  const [selectedSplitterMatch, setSelectedSplitterMatch] = useState<MatchItem | null>(null);
  const [selectedBalancerMatch, setSelectedBalancerMatch] = useState<MatchItem | null>(null);
  const [selectedMvpMatch, setSelectedMvpMatch] = useState<MatchItem | null>(null);

  useEffect(() => {
    if (!loading && !userProfile) {
      router.push('/login');
    }
  }, [userProfile, loading, router]);

  useEffect(() => {
    const unsubscribe = subscribeToMatches((liveMatches) => {
      setMatches(liveMatches);
    });
    return () => unsubscribe();
  }, []);

  if (loading || !userProfile) {
    return (
      <div className="min-h-screen bg-[#070D18] flex items-center justify-center text-white">
        <div className="flex items-center gap-3 text-sm font-semibold">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Athlete Profile...</span>
        </div>
      </div>
    );
  }

  const myJoinedMatches = matches.filter((m) => m.playerUids.includes(userProfile.uid));
  const myHostedMatches = matches.filter((m) => m.host.uid === userProfile.uid);

  const displayedMatches = 
    activeTab === 'joined' ? myJoinedMatches :
    activeTab === 'hosted' ? myHostedMatches :
    matches;

  const handleCreateMatch = async (matchData: any) => {
    try {
      await createMatch(matchData);
    } catch (err) {
      console.error('Failed to create match:', err);
    }
  };

  const handleJoin = async (matchId: string) => {
    try {
      await joinMatch(matchId, userProfile);
    } catch (err: any) {
      alert(err.message || 'Could not join match.');
    }
  };

  const handleLeave = async (matchId: string) => {
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
    try {
      await checkInPlayer(match.id, userProfile);
      alert('✓ Checked in successfully! +5 Athlete Karma awarded.');
    } catch (err) {
      console.error('Failed to check in:', err);
    }
  };

  const karma = userProfile.karmaScore || 100;
  const trophies = userProfile.trophies || ['Verified Athlete', 'Zero Ghosting Shield'];

  return (
    <div className="min-h-screen bg-[#070D18] text-slate-100 selection:bg-orange-500 selection:text-white pb-20">
      
      <Navbar 
        onOpenMatchmaker={() => setIsMatchmakerOpen(true)} 
        onOpenWarmUp={() => setIsWarmUpOpen(true)} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Profile Card Header with Karma & Trophies */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400"></div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4 sm:gap-6">
              <img 
                src={userProfile.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                alt={userProfile.displayName} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-orange-500 object-cover shadow-xl"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-black text-2xl sm:text-3xl text-white">{userProfile.displayName}</h1>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                    VERIFIED ATHLETE
                  </span>
                </div>

                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span>{userProfile.preferredArea || 'Greater Noida'}</span>
                </p>

                {/* Score & Skill Badges */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {userProfile.preferredSports?.map((s) => (
                    <span key={s} className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-white/10">
                      {s.replace('_', ' ')}
                    </span>
                  ))}
                  {userProfile.bestReflexMs && (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1">
                      <span>⚡</span> Reflex: {userProfile.bestReflexMs}ms
                    </span>
                  )}
                  {userProfile.bestKeepieUppie !== undefined && userProfile.bestKeepieUppie > 0 && (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <span>⚽</span> Juggles: {userProfile.bestKeepieUppie}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Ghost-Shield Karma Meter & Trophy Showcase */}
            <div className="flex flex-wrap items-center gap-4">
              
              {/* Karma Rating Meter */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-400 text-lg">
                  {karma}%
                </div>
                <div>
                  <div className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-400">Karma Rating</div>
                  <div className="text-xs font-bold text-white">Ghost-Shield Verified</div>
                </div>
              </div>

              {/* MVP Count */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-black text-amber-400 text-lg">
                  🏆 {userProfile.mvpCount || 0}
                </div>
                <div>
                  <div className="text-[10px] uppercase font-extrabold tracking-wider text-amber-400">MVP Wins</div>
                  <div className="text-xs font-bold text-white">Match Day Awards</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMatchmakerOpen(true)}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider glow-orange hover:from-orange-600 transition flex items-center gap-2 shadow-lg"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Host Match</span>
                </button>

                <button 
                  onClick={logout}
                  className="p-3 rounded-xl bg-slate-800/80 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-white/10 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* Trophy Cabinet Row */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Trophy Cabinet:</span>
            </span>
            {trophies.map((tr) => (
              <span key={tr} className="px-3 py-1 rounded-xl bg-slate-900/80 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                <span>🏅</span>
                <span>{tr}</span>
              </span>
            ))}
          </div>

        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('joined')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'joined'
                ? 'bg-orange-500 text-white shadow-lg glow-orange'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            My Joined Squads ({myJoinedMatches.length})
          </button>
          
          <button
            onClick={() => setActiveTab('hosted')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'hosted'
                ? 'bg-orange-500 text-white shadow-lg glow-orange'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            Hosted Matches ({myHostedMatches.length})
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              activeTab === 'all'
                ? 'bg-orange-500 text-white shadow-lg glow-orange'
                : 'bg-slate-800/60 text-slate-400 hover:text-white'
            }`}
          >
            All City Lobbies ({matches.length})
          </button>
        </div>

        {/* Matches Grid */}
        {displayedMatches.length === 0 ? (
          <div className="text-center py-16 px-6 glass-card rounded-3xl border border-white/10 max-w-xl mx-auto shadow-2xl">
            <Sparkles className="w-10 h-10 text-orange-400 mx-auto mb-3" />
            <h3 className="font-display font-extrabold text-xl text-white mb-1">
              {activeTab === 'joined' ? "You haven't joined any match lobbies yet" :
               activeTab === 'hosted' ? "You haven't hosted any matches yet" :
               "No active lobbies in the city"}
            </h3>
            <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">
              Find your sport and join a squad, or host your own match and invite teammates.
            </p>
            <button 
              onClick={() => setIsMatchmakerOpen(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider glow-orange hover:from-orange-600 transition"
            >
              Host a Match Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedMatches.map((match) => (
              <MatchCard 
                key={match.id} 
                match={match} 
                currentUser={userProfile} 
                onJoin={handleJoin} 
                onLeave={handleLeave}
                onOpenChat={(m) => setSelectedChatMatch(m)}
                onOpenSplitter={(m) => setSelectedSplitterMatch(m)}
                onOpenBalancer={(m) => setSelectedBalancerMatch(m)}
                onOpenMvp={(m) => setSelectedMvpMatch(m)}
                onToggleSos={handleToggleSos}
                onCheckIn={handleCheckIn}
              />
            ))}
          </div>
        )}

      </main>

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

      <WarmUpFAB onOpen={() => setIsWarmUpOpen(true)} />

    </div>
  );
}
