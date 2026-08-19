'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { SportCards } from '@/components/SportCards';
import { MatchFeed } from '@/components/MatchFeed';
import { MatchmakerModal } from '@/components/MatchmakerModal';
import { useAuth } from '@/context/AuthContext';
import { subscribeToMatches, createMatch, joinMatch, leaveMatch } from '@/lib/matches';
import { MatchItem, SportType } from '@/types';
import { Zap, Trophy, Users, ShieldCheck, MapPin } from 'lucide-react';

export default function HomePage() {
  const { userProfile } = useAuth();
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [currentSport, setCurrentSport] = useState<SportType>('all');
  const [selectedLocation, setSelectedLocation] = useState('Greater Noida');
  const [isMatchmakerOpen, setIsMatchmakerOpen] = useState(false);
  const [liveToast, setLiveToast] = useState<string | null>(null);

  // Firestore Real-Time Listener
  useEffect(() => {
    const unsubscribe = subscribeToMatches((updatedMatches) => {
      setMatches(updatedMatches);
    });
    return () => unsubscribe();
  }, []);

  const handleSelectSport = (sport: SportType) => {
    setCurrentSport(sport);
    const target = document.getElementById('matches-section');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateMatch = async (matchData: any) => {
    try {
      await createMatch(matchData);
      setLiveToast(`?? Lobby created! Matched with active ${matchData.sport} players nearby.`);
      setTimeout(() => setLiveToast(null), 4000);
      const target = document.getElementById('matches-section');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleJoinMatch = async (matchId: string) => {
    if (!userProfile) {
      setLiveToast('Please Sign In or Join to reserve a slot!');
      setTimeout(() => setLiveToast(null), 4000);
      return;
    }
    await joinMatch(matchId, userProfile);
    setLiveToast('?? Spot reserved! Your squad pass & venue directions are ready.');
    setTimeout(() => setLiveToast(null), 4000);
  };

  const handleLeaveMatch = async (matchId: string) => {
    if (!userProfile) return;
    await leaveMatch(matchId, userProfile);
    setLiveToast('You left the match lobby.');
    setTimeout(() => setLiveToast(null), 3000);
  };

  return (
    <main className="relative min-h-screen">
      {/* Real-time notification toast */}
      {liveToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl border border-cyan-500 bg-slate-900/95 backdrop-blur-lg shadow-2xl text-slate-100 text-xs sm:text-sm font-medium flex items-center gap-2 animate-bounce">
          <Zap className="w-4 h-4 text-orange-400 shrink-0" />
          <span>{liveToast}</span>
        </div>
      )}

      {/* Live Ticker */}
      <div className="bg-gradient-to-r from-orange-600/30 via-cyan-600/30 to-emerald-600/30 border-b border-white/10 py-1.5 px-4 text-center text-xs font-medium text-slate-300 flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">Live in Delhi-NCR:</span>
        <span className="text-slate-200">
          Aarav & 2 others joined Box Cricket at Pari Chowk Turf Arena!
        </span>
      </div>

      {/* Floating Header */}
      <Navbar 
        onOpenMatchmaker={() => setIsMatchmakerOpen(true)}
        selectedLocation={selectedLocation}
        onSelectLocation={(loc) => setSelectedLocation(loc)}
      />

      {/* Hero Section */}
      <Hero 
        onSelectSport={handleSelectSport}
        onOpenMatchmaker={() => setIsMatchmakerOpen(true)}
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
        onOpenMatchmaker={() => setIsMatchmakerOpen(true)}
      />

      {/* How it Works */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-400">Frictionless Play</span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white mt-1">From Screen to Pitch in 4 Steps</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">Zero ghosting. Verified venues. Automatic split payments and skill-tier matchmaking.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Pick Sport & Area', desc: 'Select your sport and preferred turf in Delhi, Noida, or Greater Noida.', color: 'text-orange-400 bg-orange-500/20 border-orange-500/40' },
            { step: '02', title: 'Join or Host Lobby', desc: 'Claim open slots in existing lobbies or host your own.', color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/40' },
            { step: '03', title: 'Instant Squad Hub', desc: 'Automated squad coordination, map directions, and team colors.', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' },
            { step: '04', title: 'Play & Build Rating', desc: 'Turn up, play high-intensity sports, and build your Elo score.', color: 'text-amber-400 bg-amber-500/20 border-amber-500/40' },
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
                Over 2,400+ working professionals, students, and weekend athletes across Greater Noida and Delhi play weekly through Spurt Local. Make friends, burn calories, and reignite your passion for local sports.
              </p>

              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-orange-400 font-display">2,400+</div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold mt-0.5">Active Players</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-display">35+</div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold mt-0.5">Partner Turfs</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-display">99.2%</div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold mt-0.5">Show-up Rate</div>
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
          ? 2026 Spurt Local. Built for athletes who want to play, match, and repeat.
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
