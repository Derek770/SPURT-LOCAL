'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { X, Zap, Flame, Trophy, Sparkles } from 'lucide-react';
import { UserProfile } from '@/types';

// Dynamic lazy imports for optimal performance
const ReflexTester = dynamic(
  () => import('./games/ReflexTester').then((mod) => mod.ReflexTester),
  {
    loading: () => (
      <div className="h-72 flex items-center justify-center text-slate-400 text-xs">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-2"></div>
        <span>Loading Reflex Chamber...</span>
      </div>
    ),
    ssr: false
  }
);

const KeepieUppie = dynamic(
  () => import('./games/KeepieUppie').then((mod) => mod.KeepieUppie),
  {
    loading: () => (
      <div className="h-72 flex items-center justify-center text-slate-400 text-xs">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-2"></div>
        <span>Loading Turf Pitch...</span>
      </div>
    ),
    ssr: false
  }
);

interface WarmUpArenaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
}

export const WarmUpArenaModal: React.FC<WarmUpArenaModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'reflex' | 'keepie'>('reflex');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-3 sm:p-4">
      <div className="glass-card rounded-3xl border border-white/20 max-w-xl w-full h-[88vh] max-h-[720px] shadow-2xl relative flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Radiant Top Glow Strip */}
        <div className="h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 shrink-0"></div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/60 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shrink-0">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  SPURT TIMEPASS ZONE
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  ● Warm-Up Arena
                </span>
              </div>
              <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
                Pre-Match Training Ground
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game Switcher Tabs */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-white/5 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('reflex')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'reflex'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md glow-orange'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Reflex Tester</span>
          </button>

          <button
            onClick={() => setActiveTab('keepie')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'keepie'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-md glow-emerald font-extrabold'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            <span>⚽</span>
            <span>Turf Keepie-Uppie</span>
          </button>
        </div>

        {/* Active Game Chamber */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col">
          {activeTab === 'reflex' ? (
            <ReflexTester currentUser={currentUser} />
          ) : (
            <KeepieUppie currentUser={currentUser} />
          )}
        </div>

      </div>
    </div>
  );
};
