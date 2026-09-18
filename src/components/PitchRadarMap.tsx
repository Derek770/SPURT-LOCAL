'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Zap, Users, ArrowRight, ShieldCheck, Clock, Flame } from 'lucide-react';
import { MatchItem, SportType } from '@/types';

interface PitchRadarMapProps {
  matches: MatchItem[];
  currentSport: SportType;
  onSelectMatch: (match: MatchItem) => void;
  onOpenMatchmaker: () => void;
}

// Curated Venue Hub Coordinates for Delhi-NCR
const NCR_HUBS = [
  { name: 'Knowledge Park 3 & Pari Chowk', x: '78%', y: '68%', area: 'Greater Noida' },
  { name: 'Noida Sector 104 & 62', x: '58%', y: '45%', area: 'Noida' },
  { name: 'Saket & Siri Fort Sports Complex', x: '35%', y: '58%', area: 'South Delhi' },
  { name: 'Dwarka Sports Complex Sec 11', x: '18%', y: '40%', area: 'Dwarka' }
];

export const PitchRadarMap: React.FC<PitchRadarMapProps> = ({
  matches,
  currentSport,
  onSelectMatch,
  onOpenMatchmaker
}) => {
  const [selectedHub, setSelectedHub] = useState<string | null>(null);
  const [activePinMatch, setActivePinMatch] = useState<MatchItem | null>(matches[0] || null);

  const filteredMatches = matches.filter((m) => {
    const matchesSport = currentSport === 'all' || m.sport === currentSport;
    const matchesHub = !selectedHub || m.area.toLowerCase().includes(selectedHub.toLowerCase());
    return matchesSport && matchesHub;
  });

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'cricket': return '🏏';
      case 'football': return '⚽';
      case 'badminton': return '🏸';
      case 'table_tennis': return '🏓';
      default: return '⚡';
    }
  };

  return (
    <div className="w-full glass-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl relative overflow-hidden mb-12">
      
      {/* Radar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
              Interactive NCR Pitch Radar
            </span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
            Live Turfs & Neighborhood Hubs
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Discover active match lobbies pinned across Greater Noida, Noida, South Delhi & Dwarka.
          </p>
        </div>

        {/* Hub Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedHub(null)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              selectedHub === null
                ? 'bg-cyan-500 text-black shadow-lg glow-cyan'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            All NCR Hubs
          </button>
          {['Greater Noida', 'Noida', 'South Delhi', 'Dwarka'].map((hub) => (
            <button
              key={hub}
              onClick={() => setSelectedHub(hub)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                selectedHub === hub
                  ? 'bg-cyan-500 text-black shadow-lg glow-cyan'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              {hub}
            </button>
          ))}
        </div>
      </div>

      {/* Main Radar Screen & Match Preview Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Graphic View */}
        <div className="lg:col-span-8 relative h-[380px] sm:h-[450px] rounded-3xl overflow-hidden bg-slate-950 border border-cyan-500/30 p-6 flex flex-col justify-between shadow-2xl">
          
          {/* Cyber Radar Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#00F0FF_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none"></div>
          
          {/* Concentric Radar Sweeper Circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full border border-cyan-500/20 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full border border-cyan-500/15 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-cyan-500/10 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full border border-dashed border-cyan-500/15 pointer-events-none animate-spin" style={{ animationDuration: '40s' }}></div>

          {/* Region Landmark Labels */}
          {NCR_HUBS.map((hub) => (
            <div
              key={hub.name}
              style={{ left: hub.x, top: hub.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center"
            >
              <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase bg-slate-950/80 px-2 py-0.5 rounded-full border border-white/5">
                {hub.area}
              </span>
            </div>
          ))}

          {/* Dynamic Active Match Pins */}
          {filteredMatches.map((m, idx) => {
            const isSelected = activePinMatch?.id === m.id;
            // Generate deterministic map coordinates based on area
            const offsetMultiplier = (idx % 3) * 6;
            const xPos = m.area.includes('Greater Noida') ? 74 + offsetMultiplier :
                         m.area.includes('Noida') ? 54 + offsetMultiplier :
                         m.area.includes('South Delhi') ? 34 + offsetMultiplier : 20 + offsetMultiplier;
            const yPos = m.area.includes('Greater Noida') ? 60 - offsetMultiplier :
                         m.area.includes('Noida') ? 42 + offsetMultiplier :
                         m.area.includes('South Delhi') ? 56 - offsetMultiplier : 36 + offsetMultiplier;

            return (
              <div
                key={m.id}
                style={{ left: `${xPos}%`, top: `${yPos}%` }}
                onClick={() => setActivePinMatch(m)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition-all duration-300 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                }`}
              >
                {/* Pulsing beacon ring */}
                <div className={`absolute -inset-2 rounded-full blur-sm opacity-75 animate-ping ${
                  m.isSosActive ? 'bg-red-500' : 'bg-orange-500'
                }`}></div>

                {/* Pin Button */}
                <div className={`relative px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs font-black shadow-2xl border ${
                  isSelected 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-white scale-110 shadow-orange-500/50' 
                    : m.isSosActive
                    ? 'bg-red-600 text-white border-red-400 animate-bounce'
                    : 'bg-slate-900/90 text-slate-100 border-orange-500/40 hover:border-orange-400'
                }`}>
                  <span>{getSportIcon(m.sport)}</span>
                  <span className="hidden sm:inline">{m.sport.toUpperCase()}</span>
                  {m.isSosActive && <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />}
                </div>
              </div>
            );
          })}

          {/* Top Status Overlay */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-300 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 w-fit">
            <div className="flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scanning Delhi-NCR: <strong className="text-white">{filteredMatches.length} Lobbies Active</strong></span>
            </div>
          </div>

          {/* Bottom Controls Info */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Click any glowing sport pin to inspect match details</span>
            <span className="text-cyan-400 font-bold">GPS Accuracy: ±15m</span>
          </div>

        </div>

        {/* Match Preview Drawer */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          {activePinMatch ? (
            <div className="glass-card rounded-3xl p-6 border border-cyan-500/30 shadow-2xl h-full flex flex-col justify-between relative overflow-hidden">
              
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-emerald-400 to-orange-500"></div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {activePinMatch.sport.toUpperCase()}
                  </span>
                  {activePinMatch.isSosActive ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-500/30 text-red-300 border border-red-500/50 animate-pulse flex items-center gap-1">
                      <Flame className="w-3 h-3 text-red-400 fill-red-400" /> SOS ACTIVE
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {activePinMatch.availableSlots} Slots Left
                    </span>
                  )}
                </div>

                <h3 className="font-display font-extrabold text-xl text-white line-clamp-2 mb-2">
                  {activePinMatch.title}
                </h3>

                <p className="text-xs text-slate-300 flex items-center gap-1.5 mb-3">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>{activePinMatch.venue}</span>
                </p>

                <div className="space-y-2 my-4 text-xs text-slate-300 border-y border-white/10 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Timing:</span>
                    <span className="font-semibold text-slate-100">{activePinMatch.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> Skill:</span>
                    <span className="font-semibold text-slate-100">{activePinMatch.skill}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Roster:</span>
                    <span className="font-bold text-emerald-400">{activePinMatch.filledSlots} / {activePinMatch.totalSlots} Players</span>
                  </div>
                </div>

                {/* Host Karma Badge */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <img 
                      src={activePinMatch.host.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                      alt={activePinMatch.host.displayName} 
                      className="w-7 h-7 rounded-full object-cover border border-white/20" 
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{activePinMatch.host.displayName}</div>
                      <div className="text-[10px] text-slate-400">Match Host</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ⚡ {activePinMatch.host.karmaScore || 100}% Karma
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onSelectMatch(activePinMatch)}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-black text-xs uppercase tracking-wider glow-cyan hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 shadow-xl"
                >
                  <span>ENTER LOBBY</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            <div className="glass-card rounded-3xl p-8 border border-white/10 text-center h-full flex flex-col items-center justify-center text-slate-400">
              <MapPin className="w-12 h-12 text-slate-500 mb-3" />
              <h4 className="text-white font-bold text-base mb-1">No Pin Selected</h4>
              <p className="text-xs">Click on any glowing radar pin to view match details and claim your slot.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
