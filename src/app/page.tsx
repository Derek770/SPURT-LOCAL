'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { SportCards } from '@/components/SportCards';
import { MatchFeed } from '@/components/MatchFeed';
import { MatchmakerModal } from '@/components/MatchmakerModal';
import { useAuth } from '@/context/AuthContext';
import { subscribeToMatches, createMatch, joinMatch, leaveMatch } from '@/lib/matches';
import { MatchItem, SportType } from '@/types';
import { Zap, ShieldCheck, Users, MapPin, Trophy } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [currentSport, setCurrentSport] = useState<SportType>('all');
  const [selectedLocation, setSelectedLocation] = useState('Greater Noida');
  const [isMatchmakerOpen, setIsMatchmakerOpen] = useState(false);
  const [liveToast, setLiveToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Firestore Real-Time Subscription
  useEffect(() => {
    const unsubscribe = subscribeToMatches(
      (updatedMatches) => {
        setMatches(updatedMatches);
      },
      (err) => {
        console.error('Firestore listener error:', err);
      }
    );
    return () => unsubscribe();
  }, []);

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setLiveToast({ message, type });
    setTimeout(() => setLiveToast(null), 4000);
  };

  const handleSelectSport = (sport: SportType) => {
    setCurrentSport(sport);
    const target = document.getElementById('matches-section');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenMatchmaker = () => {
    if (!userProfile) {
      triggerToast('Please sign in or register to host a match.', 'info');
      router.push('/login');
      return;
    }
    setIsMatchmakerOpen(true);
  };

  const handleCreateMatch = async (matchData: any) => {
    try {
      await createMatch(matchData);
      triggerToast(`?? Match lobby created in database and published live!`, 'success');
      const target = document.getElementById('matches-section');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    } catch (e: any) {
      triggerToast(e.message || 'Failed to create match in database.', 'error');
    }
  };

  const handleJoinMatch = async (matchId: string) => {
    if (!userProfile) {
      triggerToast('Please sign in to join match lobbies.', 'info');
      router.push('/login');
      return;
    }
    try {
      await joinMatch(matchId, userProfile);
      triggerToast('?? Slot confirmed! You have joined the match roster.', 'success');
    } catch (e: any) {
      triggerToast(e.message || 'Failed to join match.', 'error');
    }
  };

  const handleLeaveMatch = async (matchId: string) => {
    if (!userProfile) return;
    try {
      await leaveMatch(matchId, userProfile);
      triggerToast('You left the match lobby.', 'info');
    } catch (e: any) {
      triggerToast(e.message || 'Failed to leave match.', 'error');
    }
  };

  // Real ticker message based on actual latest Firestore match
  const latestMatch = matches[0];

  return (
    <main className="relative min-h-screen">
      {/* Toast Notification */}
      {liveToast && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border backdrop-blur-lg shadow-2xl text-slate-100 text-xs sm:text-sm font-medium flex items-center gap-2.5 animate-bounce ${
          liveToast.type === 'success' ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200' :
          liveToast.type === 'error' ? 'bg-red-950/90 border-red-500 text-red-200' :
          'bg-slate-900/95 border-cyan-500 text-slate-200'
        }`}>
          <Zap className="w-4 h-4 text-orange-400 shrink-0" />
          <span>{liveToast.message}</span>
        </div>
      )}

      {/* Live Activity Ticker (Driven strictly by real Firestore data) */}
      <div className="bg-gradient-to-r from-orange-600/20 via-cyan-600/20 to-emerald-600/20 border-b border-white/10 py-1.5 px-4 text-center text-xs font-medium text-slate-300 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">Real-Time Feed:</span>
        <span className="text-slate-200">
          {latestMatch 
            ? `Latest Match: ${latestMatch.title} at ${latestMatch.venue} (${latestMatch.availableSlots} slots left)`
            : 'SPURT Local matchmaking network is live in Delhi-NCR. Be the first to host a game!'
          }
        </span>
      </div>

      {/* Floating Header */}
      <Navbar 
        onOpenMatchmaker={handleOpenMatchmaker}
        selectedLocation={selectedLocation}
        onSelectLocation={(loc) => setSelectedLocation(loc)}
      />

      {/* Hero Section */}
      <Hero 
        matches={matches}
        onSelectSport={handleSelectSport}
        onOpenMatchmaker={handleOpenMatchmaker}
      />

      {/* Sport Cards Grid */}
      <SportCards onSelectSport={handleSelectSport} />

      {/* Real-time Match Feed */}
      <MatchFeed 
        matches={matches}
        currentSport={currentSport}
        onSelectSport={setCurrentSport}
        currentUser={userProfile}
        onJoinMatch={handleJoinMatch}
        onLeaveMatch={handleLeaveMatch}
        onOpenMatchmaker={handleOpenMatchmaker}
      />

      {/* How it Works */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400">Frictionless Play</span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white mt-1">From Screen to Pitch in 4 Steps</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">Zero ghosting. Verified venues. Real-time slot locking and skill-tier matchmaking.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Pick Sport & Area', desc: 'Select your sport and preferred turf in Delhi, Noida, or Greater Noida.', color: 'text-orange-400 bg-orange-500/20 border-orange-500/40' },
            { step: '02', title: 'Join or Host Lobby', desc: 'Claim open slots in real Firestore lobbies or host your own.', color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40' },
            { step: '03', title: 'Instant Lineup Lock', desc: 'Real-time atomic slot lock prevents overbooking and cancellations.', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' },
            { step: '04', title: 'Play & Build Rating', desc: 'Turn up, play competitive recreational sports, and build your rating.', color: 'text-amber-400 bg-amber-500/20 border-amber-500/40' },
          ].map((item) => (
            <div key={item.step} className="glass-card rounded-2xl p-6 border border-white/10 text-center">
              <div className={`w-12 h-12 mx-auto rounded-2xl border flex items-center justify-center font-extrabold text-lg mb-4 ${item.color}`}>
                {item.step}
              </div>
              <h3 className="font-bold text-base text-white mb-1.5">{item.title}</h3>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Community Showcase */}
      <section id="community" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">Neighborhood Camaraderie</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-1 leading-tight">
                JOIN THE RECREATIONAL SPORTS NETWORK.
              </h2>
              <p className="text-slate-300 text-sm mt-4 leading-relaxed">
                Connect with working professionals, students, and weekend athletes across Greater Noida and Delhi. Never cancel another game due to missing players.
              </p>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-orange-400 font-display">Zero Ghosting</div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold mt-0.5">Automated Slots</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-display">Real-Time</div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold mt-0.5">Live Sync</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-cyan-400 font-display">Skill-Tiered</div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold mt-0.5">Fair Games</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg group">
                <img src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=500&auto=format&fit=crop&q=80" alt="Athletes high fiving" className="w-full h-40 object-cover group-hover:scale-105 transition" />
              </div>
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg group">
                <img src="https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=500&auto=format&fit=crop&q=80" alt="Sports match smiles" className="w-full h-40 object-cover group-hover:scale-105 transition" />
              </div>
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg group">
                <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&auto=format&fit=crop&q=80" alt="Team friendship" className="w-full h-40 object-cover group-hover:scale-105 transition" />
              </div>
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg group">
                <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&auto=format&fit=crop&q=80" alt="Post game celebration" className="w-full h-40 object-cover group-hover:scale-105 transition" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10 text-xs text-slate-400">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-cyan-500 flex items-center justify-center text-white font-black text-xs">?</span>
            <span className="font-display font-bold text-white text-sm">SPURT LOCAL</span>
            <span className="text-slate-500">| Delhi-NCR Recreational Sports Network</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#matches-section" className="hover:text-white transition">Find Matches</a>
            <a href="#sports-grid-section" className="hover:text-white transition">Sports Hubs</a>
            <Link href="/dashboard" className="hover:text-white transition">Player Dashboard</Link>
            <Link href="/login" className="hover:text-white transition">Sign In</Link>
          </div>
        </div>
        <div className="text-center sm:text-left mt-6 text-slate-500 text-[11px]">
          ? 2026 SPURT LOCAL. Designed & Created with ? by Yashwant Sonkar.
        </div>
      </footer>

      {/* Matchmaker Modal */}
      <MatchmakerModal 
        isOpen={isMatchmakerOpen}
        onClose={() => setIsMatchmakerOpen(false)}
        onSubmit={handleCreateMatch}
        currentUser={userProfile}
        defaultSport={currentSport}
      />
    </main>
  );
}
