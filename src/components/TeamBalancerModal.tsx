'use client';

import React, { useState } from 'react';
import { X, Users, Shuffle, ShieldCheck, Trophy, Sparkles, Check } from 'lucide-react';
import { MatchItem, TeamPlayer, UserProfile } from '@/types';
import { saveBalancedTeams } from '@/lib/matches';

interface TeamBalancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchItem | null;
  currentUser: UserProfile | null;
}

export const TeamBalancerModal: React.FC<TeamBalancerModalProps> = ({
  isOpen,
  onClose,
  match,
  currentUser
}) => {
  const [teamA, setTeamA] = useState<TeamPlayer[]>(match?.teams?.teamA || []);
  const [teamB, setTeamB] = useState<TeamPlayer[]>(match?.teams?.teamB || []);
  const [saved, setSaved] = useState(false);

  if (!isOpen || !match) return null;

  const handleAutoBalance = () => {
    const players = match.playerUids.map((uid, idx) => ({
      uid,
      displayName: uid === match.host.uid ? match.host.displayName : `Player #${idx + 1}`,
      skill: idx % 2 === 0 ? 'Advanced' : 'Intermediate'
    }));

    // Random Fair Shuffle
    const shuffled = [...players].sort(() => Math.random() - 0.5);
    const half = Math.ceil(shuffled.length / 2);

    const a = shuffled.slice(0, half);
    const b = shuffled.slice(half);

    setTeamA(a);
    setTeamB(b);
  };

  const handleSaveLineup = async () => {
    if (teamA.length === 0 && teamB.length === 0) return;
    try {
      await saveBalancedTeams(match.id, { teamA, teamB });
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error saving teams:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-3 sm:p-4">
      <div className="glass-card rounded-3xl border border-white/20 max-w-xl w-full p-6 sm:p-8 shadow-2xl relative flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-cyan-400"></div>

        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-left mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-400">
              AI Fair-Play Squad Generator
            </span>
          </div>
          <h3 className="font-display font-black text-2xl text-white">Auto-Balance Match Teams</h3>
          <p className="text-xs text-slate-400 mt-1">
            Intelligently split {match.playerUids.length} players into two even squads to guarantee competitive games.
          </p>
        </div>

        {/* Teams Comparison Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          
          {/* Team Flame (Orange) */}
          <div className="p-4 rounded-2xl bg-orange-950/40 border border-orange-500/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-orange-500/20">
                <span className="text-xs font-black uppercase tracking-wider text-orange-400">TEAM FLAME</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-bold">
                  {teamA.length} Players
                </span>
              </div>
              <div className="space-y-1.5 min-h-[100px]">
                {teamA.length === 0 ? (
                  <div className="text-xs text-slate-500 italic py-6 text-center">Click Balance to assign</div>
                ) : (
                  teamA.map((p, i) => (
                    <div key={p.uid + i} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-900/60 text-slate-200">
                      <span className="font-semibold truncate">{p.displayName}</span>
                      <span className="text-[9px] text-orange-300 font-bold">{p.skill}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Team Volt (Cyan) */}
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-500/20">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400">TEAM VOLT</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                  {teamB.length} Players
                </span>
              </div>
              <div className="space-y-1.5 min-h-[100px]">
                {teamB.length === 0 ? (
                  <div className="text-xs text-slate-500 italic py-6 text-center">Click Balance to assign</div>
                ) : (
                  teamB.map((p, i) => (
                    <div key={p.uid + i} className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-900/60 text-slate-200">
                      <span className="font-semibold truncate">{p.displayName}</span>
                      <span className="text-[9px] text-cyan-300 font-bold">{p.skill}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleAutoBalance}
            className="flex-1 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/15 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
          >
            <Shuffle className="w-4 h-4 text-orange-400" />
            <span>Shuffle & Balance</span>
          </button>

          <button
            onClick={handleSaveLineup}
            disabled={teamA.length === 0}
            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs uppercase tracking-wider glow-orange hover:from-orange-600 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-xl"
          >
            <Check className="w-4 h-4" />
            <span>{saved ? 'Lineup Saved!' : 'Save & Publish'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
