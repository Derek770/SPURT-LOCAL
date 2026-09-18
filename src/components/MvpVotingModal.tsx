'use client';

import React, { useState } from 'react';
import { X, Trophy, Award, Check, Sparkles, Heart } from 'lucide-react';
import { MatchItem, UserProfile } from '@/types';
import { submitMvpVote } from '@/lib/matches';

interface MvpVotingModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchItem | null;
  currentUser: UserProfile | null;
}

export const MvpVotingModal: React.FC<MvpVotingModalProps> = ({
  isOpen,
  onClose,
  match,
  currentUser
}) => {
  const [selectedCandidateUid, setSelectedCandidateUid] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);

  if (!isOpen || !match) return null;

  const currentVotes = match.mvpVotes || {};
  const hasAlreadyVoted = currentUser ? Boolean(currentVotes[currentUser.uid]) : false;

  const handleVote = async () => {
    if (!currentUser || !selectedCandidateUid) return;
    const candidateName = selectedCandidateUid === match.host.uid ? match.host.displayName : 'Teammate';

    try {
      await submitMvpVote(match.id, currentUser.uid, selectedCandidateUid, candidateName);
      setVoted(true);
      setTimeout(() => {
        setVoted(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error('Error submitting MVP vote:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-3 sm:p-4">
      <div className="glass-card rounded-3xl border border-white/20 max-w-md w-full p-6 sm:p-8 shadow-2xl relative flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-500"></div>

        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-left mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
              Post-Match Awards
            </span>
          </div>
          <h3 className="font-display font-black text-2xl text-white">Vote For Match MVP</h3>
          <p className="text-xs text-slate-400 mt-1">
            Recognize the player with the best performance, leadership, or sportsmanship.
          </p>
        </div>

        {/* Current Leader Badge if exists */}
        {match.mvpWinner && (
          <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-center mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-400 text-black flex items-center justify-center font-black">
                👑
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-amber-300">Current MVP Leader</div>
                <div className="text-sm font-black text-white">{match.mvpWinner.displayName}</div>
              </div>
            </div>
            <span className="text-xs font-black text-amber-400 bg-amber-950 px-2.5 py-1 rounded-full border border-amber-500/30">
              {match.mvpWinner.votes} Votes
            </span>
          </div>
        )}

        {/* Candidates List */}
        <div className="space-y-2 mb-6 max-h-56 overflow-y-auto pr-1">
          {match.playerUids.map((uid, idx) => {
            const isHost = uid === match.host.uid;
            const name = isHost ? match.host.displayName : `Player #${idx + 1}`;
            const isSelected = selectedCandidateUid === uid;

            return (
              <div
                key={uid}
                onClick={() => !hasAlreadyVoted && setSelectedCandidateUid(uid)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg'
                    : 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-white/20 flex items-center justify-center text-xs font-bold text-slate-300">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{name}</span>
                      {isHost && <span className="text-[9px] bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded">Host</span>}
                    </div>
                  </div>
                </div>

                <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                  {isSelected && <div className="w-3 h-3 rounded-full bg-amber-400"></div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Vote */}
        <button
          onClick={handleVote}
          disabled={hasAlreadyVoted || !selectedCandidateUid}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs uppercase tracking-wider glow-amber hover:brightness-110 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-xl"
        >
          <Award className="w-4 h-4" />
          <span>{hasAlreadyVoted ? 'Vote Cast Successfully ✓' : voted ? 'Submitting Ballot...' : 'CAST MVP VOTE (+10 KARMA)'}</span>
        </button>

      </div>
    </div>
  );
};
