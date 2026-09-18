'use client';

import React from 'react';
import { MapPin, Clock, Zap, Shield, Check, MessageSquare, Flame, Wallet, Users, Award } from 'lucide-react';
import { MatchItem, UserProfile } from '@/types';

interface MatchCardProps {
  match: MatchItem;
  currentUser: UserProfile | null;
  onJoin: (matchId: string) => void;
  onLeave: (matchId: string) => void;
  onOpenChat?: (match: MatchItem) => void;
  onOpenSplitter?: (match: MatchItem) => void;
  onOpenBalancer?: (match: MatchItem) => void;
  onOpenMvp?: (match: MatchItem) => void;
  onToggleSos?: (match: MatchItem) => void;
  onCheckIn?: (match: MatchItem) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ 
  match, 
  currentUser, 
  onJoin, 
  onLeave, 
  onOpenChat,
  onOpenSplitter,
  onOpenBalancer,
  onOpenMvp,
  onToggleSos,
  onCheckIn
}) => {
  const isJoined = currentUser ? match.playerUids.includes(currentUser.uid) : false;
  const isHost = currentUser ? match.host.uid === currentUser.uid : false;
  const isCheckedIn = currentUser ? (match.checkedInPlayerUids || []).includes(currentUser.uid) : false;
  const isPaid = currentUser ? (match.paidPlayerUids || []).includes(currentUser.uid) : false;

  const slotsLeft = Math.max(0, match.totalSlots - match.filledSlots);
  const isFull = slotsLeft <= 0;

  const sportColors: Record<string, { bg: string; text: string }> = {
    cricket: { bg: 'bg-amber-500/15 border-amber-500/30', text: 'text-amber-400' },
    football: { bg: 'bg-emerald-500/15 border-emerald-500/30', text: 'text-emerald-400' },
    badminton: { bg: 'bg-rose-500/15 border-rose-500/30', text: 'text-rose-400' },
    table_tennis: { bg: 'bg-cyan-500/15 border-cyan-500/30', text: 'text-cyan-400' }
  };

  const currentSportTheme = sportColors[match.sport] || { bg: 'bg-orange-500/15 border-orange-500/30', text: 'text-orange-400' };

  return (
    <div className={`glass-card glass-card-hover rounded-3xl p-5 sm:p-6 border flex flex-col justify-between relative overflow-hidden group shadow-xl transition-all ${
      match.isSosActive ? 'border-red-500/80 shadow-red-500/20' : 'border-white/10'
    }`}>
      
      {/* Glow Top Strip */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${
        match.isSosActive ? 'from-red-500 via-orange-500 to-red-500 animate-pulse' :
        match.sport === 'cricket' ? 'from-amber-500 to-orange-500' :
        match.sport === 'football' ? 'from-emerald-500 to-teal-400' :
        match.sport === 'badminton' ? 'from-rose-500 to-pink-500' :
        'from-cyan-500 to-blue-500'
      }`}></div>

      {/* SOS Alert Banner */}
      {match.isSosActive && (
        <div className="mb-3 -mt-1 p-2.5 rounded-2xl bg-gradient-to-r from-red-600/90 to-orange-600/90 border border-red-400 text-white flex items-center justify-between text-xs font-black shadow-lg animate-pulse">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 fill-white" />
            <span>🚨 SOS EMERGENCY BEACON</span>
          </div>
          <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full">PRIORITY</span>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${currentSportTheme.bg} ${currentSportTheme.text}`}>
            {match.sport.replace('_', ' ')}
          </span>
          
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              isJoined ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
              isFull ? 'bg-red-500/20 text-red-300' : 'bg-orange-500/20 text-orange-300'
            }`}>
              {isJoined ? '✓ You are in!' : (isFull ? 'Lobby Full' : `${slotsLeft} ${slotsLeft === 1 ? 'Slot Left' : 'Slots Left'}`)}
            </span>
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1.5">
          {match.title}
        </h3>
        
        <p className="text-xs text-slate-300 flex items-center gap-1.5 mb-3">
          <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span className="truncate">{match.venue}</span>
        </p>

        <div className="space-y-2 my-3 text-xs text-slate-300 border-y border-white/5 py-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Time:</span>
            <span className="font-medium text-slate-200">{match.time}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> Skill:</span>
            <span className="font-medium text-slate-200">{match.skill}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Squad Roster:</span>
            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {match.filledSlots} / {match.totalSlots} Players
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        {/* Real Slot Progress Meter */}
        <div className="w-full bg-slate-800/80 rounded-full h-2 mb-3.5 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              match.isSosActive ? 'bg-red-500' : slotsLeft <= 2 ? 'bg-orange-500' : 'bg-emerald-400'
            }`} 
            style={{ width: `${Math.min(100, (match.filledSlots / match.totalSlots) * 100)}%` }}
          ></div>
        </div>

        {/* Host Info & Karma Meter */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <img 
              src={match.host.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
              alt={match.host.displayName} 
              className="w-7 h-7 rounded-full border border-white/20 object-cover" 
            />
            <div>
              <div className="text-[11px] text-slate-300 font-bold">{match.host.displayName.split(' ')[0]}</div>
              <div className="text-[9px] text-emerald-400 font-bold">⚡ {match.host.karmaScore || 100}% Karma</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-black text-emerald-400">{match.price}</div>
            <div className="text-[9px] text-slate-400">₹{Math.ceil((match.turfCost || 1200) / Math.max(1, match.playerUids.length))}/head</div>
          </div>
        </div>

        {/* Secondary Sports Tool Row (UPI Splitter, Team Balancer, MVP, SOS) */}
        <div className="grid grid-cols-4 gap-1.5 mb-3 pt-2 border-t border-white/10">
          <button
            onClick={() => onOpenSplitter && onOpenSplitter(match)}
            title="In-Chat UPI Splitter"
            className="py-1.5 px-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-[10px] font-bold text-slate-200 hover:text-emerald-300 transition flex flex-col items-center gap-1"
          >
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Split ₹</span>
          </button>

          <button
            onClick={() => onOpenBalancer && onOpenBalancer(match)}
            title="AI Fair-Play Team Balancer"
            className="py-1.5 px-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-[10px] font-bold text-slate-200 hover:text-cyan-300 transition flex flex-col items-center gap-1"
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Teams</span>
          </button>

          <button
            onClick={() => onOpenMvp && onOpenMvp(match)}
            title="Post-Match MVP Voting"
            className="py-1.5 px-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-[10px] font-bold text-slate-200 hover:text-amber-300 transition flex flex-col items-center gap-1"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>MVP</span>
          </button>

          {isHost ? (
            <button
              onClick={() => onToggleSos && onToggleSos(match)}
              title="Toggle SOS Emergency Beacon"
              className={`py-1.5 px-2 rounded-xl border text-[10px] font-bold transition flex flex-col items-center gap-1 ${
                match.isSosActive 
                  ? 'bg-red-500/20 border-red-500 text-red-300 animate-pulse' 
                  : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-300 hover:text-red-400'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-red-400" />
              <span>{match.isSosActive ? 'SOS ON' : 'SOS'}</span>
            </button>
          ) : (
            <button
              onClick={() => onCheckIn && onCheckIn(match)}
              disabled={isCheckedIn || !isJoined}
              title="Pitch Check-in (+5 Karma)"
              className={`py-1.5 px-2 rounded-xl border text-[10px] font-bold transition flex flex-col items-center gap-1 ${
                isCheckedIn 
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                  : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-300'
              }`}
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isCheckedIn ? 'Checked' : 'Check-In'}</span>
            </button>
          )}
        </div>

        {/* Primary Action Buttons: Squad Chat & Join */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenChat && onOpenChat(match)}
            className="py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/15 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
          >
            <MessageSquare className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Squad Chat</span>
          </button>

          <button
            onClick={() => isJoined ? onLeave(match.id) : onJoin(match.id)}
            disabled={!isJoined && isFull}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-1.5 active:scale-95 ${
              isJoined
                ? 'bg-emerald-600 text-white hover:bg-red-600'
                : isFull
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 glow-orange'
            }`}
          >
            {isJoined && <Check className="w-3.5 h-3.5 shrink-0" />}
            <span>{isJoined ? 'Joined' : isFull ? 'Lobby Full' : 'Join Match'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
