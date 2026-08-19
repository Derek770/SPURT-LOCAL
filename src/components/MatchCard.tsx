'use client';

import React from 'react';
import { MapPin, Clock, Zap, Shield, Check } from 'lucide-react';
import { MatchItem, UserProfile } from '@/types';

interface MatchCardProps {
  match: MatchItem;
  currentUser: UserProfile | null;
  onJoin: (matchId: string) => void;
  onLeave: (matchId: string) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, currentUser, onJoin, onLeave }) => {
  const isJoined = currentUser ? match.playerUids.includes(currentUser.uid) : false;
  const slotsLeft = match.totalSlots - match.filledSlots;
  const isFull = slotsLeft <= 0;

  const sportMeta = {
    cricket: { name: 'Cricket', icon: '??', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
    football: { name: 'Football', icon: '?', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    badminton: { name: 'Badminton', icon: '??', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
    table_tennis: { name: 'Table Tennis', icon: '??', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' }
  }[match.sport] || { name: 'Sports', icon: '?', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' };

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 border border-white/10 flex flex-col justify-between relative overflow-hidden group">
      {/* Glow Strip */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
        match.sport === 'cricket' ? 'from-amber-500 to-orange-500' :
        match.sport === 'football' ? 'from-emerald-500 to-teal-400' :
        match.sport === 'badminton' ? 'from-rose-500 to-pink-500' :
        'from-cyan-500 to-blue-500'
      }`}></div>

      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${sportMeta.bg} ${sportMeta.color}`}>
            <span>{sportMeta.icon}</span> {sportMeta.name}
          </span>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
            isJoined ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
            isFull ? 'bg-red-500/20 text-red-300' : 'bg-orange-500/20 text-orange-300'
          }`}>
            {isJoined ? '? You are in!' : match.badge}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 mb-1.5">
          {match.title}
        </h3>
        
        <p className="text-xs text-slate-300 flex items-center gap-1.5 mb-2">
          <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span className="truncate">{match.venue}</span>
        </p>

        <div className="space-y-1.5 my-3.5 text-xs text-slate-300 border-y border-white/5 py-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Time:</span>
            <span className="font-medium text-slate-200">{match.time}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1"><Zap className="w-3 h-3" /> Skill:</span>
            <span className="font-medium text-slate-200">{match.skill}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1"><Shield className="w-3 h-3" /> Surface:</span>
            <span className="font-medium text-slate-300 truncate max-w-[170px]">{match.surface}</span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        {/* Slot progress */}
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 mb-3 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${slotsLeft <= 2 ? 'bg-orange-500' : 'bg-emerald-400'}`} 
            style={{ width: `${(match.filledSlots / match.totalSlots) * 100}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img 
              src={match.host.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
              alt={match.host.displayName} 
              className="w-8 h-8 rounded-full border border-white/20 object-cover" 
            />
            <div>
              <div className="text-[11px] text-slate-400">Host: <span className="text-slate-200 font-medium">{match.host.displayName.split(' ')[0]}</span></div>
              <div className="text-xs font-bold text-emerald-400">{match.price}</div>
            </div>
          </div>

          <button
            onClick={() => isJoined ? onLeave(match.id) : onJoin(match.id)}
            disabled={!isJoined && isFull}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
              isJoined
                ? 'bg-emerald-600 text-white hover:bg-red-600 hover:shadow-red-600/30'
                : isFull
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 glow-orange'
            }`}
          >
            {isJoined ? 'Joined ?' : isFull ? 'Lobby Full' : 'Join Match'}
          </button>
        </div>
      </div>
    </div>
  );
};
