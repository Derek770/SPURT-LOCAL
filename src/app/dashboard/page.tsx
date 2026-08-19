'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AuthGuard } from '@/components/AuthGuard';
import { Navbar } from '@/components/Navbar';
import { MatchFeed } from '@/components/MatchFeed';
import { MatchmakerModal } from '@/components/MatchmakerModal';
import { useAuth } from '@/context/AuthContext';
import { subscribeToMatches, createMatch, joinMatch, leaveMatch } from '@/lib/matches';
import { MatchItem, SportType } from '@/types';
import { Trophy, Zap, MapPin, PlusCircle, CheckCircle, Clock } from 'lucide-react';

export default function DashboardPage() {
  const { userProfile, logout } = useAuth();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [currentSport, setCurrentSport] = useState<SportType>('all');
  const [isMatchmakerOpen, setIsMatchmakerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  useEffect(() => {
    const unsub = subscribeToMatches((items) => setMatches(items));
    return () => unsub();
  }, []);

  const triggerToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateMatch = async (matchData: any) => {
    try {
      await createMatch(matchData);
      triggerToast('?? New match lobby created in Firestore and published live!', 'success');
    } catch (e: any) {
      triggerToast(e.message || 'Failed to create match.', 'error');
    }
  };

  const handleJoin = async (id: string) => {
    if (!userProfile) return;
    try {
      await joinMatch(id, userProfile);
      triggerToast('?? Spot reserved in match lineup!', 'success');
    } catch (e: any) {
      triggerToast(e.message || 'Failed to join match.', 'error');
    }
  };

  const handleLeave = async (id: string) => {
    if (!userProfile) return;
    try {
      await leaveMatch(id, userProfile);
      triggerToast('You left the match lobby.', 'info');
    } catch (e: any) {
      triggerToast(e.message || 'Failed to leave match.', 'error');
    }
  };

  const myJoinedMatches = matches.filter(
    (m) => userProfile && Array.isArray(m.playerUids) && m.playerUids.includes(userProfile.uid)
  );

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#070D18]">
        {/* Toast */}
        {toastMessage && (
          <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border backdrop-blur-lg shadow-2xl text-slate-100 text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-bounce ${
            toastMessage.type === 'success' ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200' :
            toastMessage.type === 'error' ? 'bg-red-950/90 border-red-500 text-red-200' :
            'bg-slate-900/95 border-cyan-500 text-slate-200'
          }`}>
            <Zap className="w-4 h-4 text-orange-400 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        )}

        <Navbar onOpenMatchmaker={() => setIsMatchmakerOpen(true)} />

        {/* Dashboard Profile & Stat Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="flex items-center gap-4">
              <img 
                src={userProfile?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120'} 
                alt="Profile" 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-emerald-400 object-cover shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-extrabold text-xl sm:text-2xl text-white">
                    {userProfile?.displayName}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    Verified Athlete
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-orange-400" />
                  <span>{userProfile?.preferredArea || 'Greater Noida'}</span>
                </p>
                <div className="text-[11px] text-slate-300 mt-1 font-medium">
                  Player Rating: <span className="text-amber-400 font-bold">? {userProfile?.rating || 5.0}</span> ? Confirmed Lineups: <span className="text-cyan-400 font-bold">{myJoinedMatches.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMatchmakerOpen(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider glow-orange transition shadow-lg flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Host a Match</span>
              </button>
            </div>

          </div>
        </div>

        {/* My Active Schedules */}
        {myJoinedMatches.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 bg-emerald-950/20">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                <CheckCircle className="w-4 h-4" />
                <span>Your Confirmed Match Lineups ({myJoinedMatches.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {myJoinedMatches.map((m) => (
                  <div key={m.id} className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white truncate max-w-[200px]">{m.title}</div>
                      <div className="text-[11px] text-slate-400">{m.time} ? {m.venue.split(',')[0]}</div>
                    </div>
                    <button 
                      onClick={() => handleLeave(m.id)}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white transition"
                    >
                      Leave
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Live Match Feed Component */}
        <MatchFeed 
          matches={matches}
          currentSport={currentSport}
          onSelectSport={setCurrentSport}
          currentUser={userProfile}
          onJoinMatch={handleJoin}
          onLeaveMatch={handleLeave}
          onOpenMatchmaker={() => setIsMatchmakerOpen(true)}
        />

        {/* Matchmaker Modal */}
        <MatchmakerModal 
          isOpen={isMatchmakerOpen}
          onClose={() => setIsMatchmakerOpen(false)}
          onSubmit={handleCreateMatch}
          currentUser={userProfile}
          defaultSport={currentSport}
        />
      </main>
    </AuthGuard>
  );
}
