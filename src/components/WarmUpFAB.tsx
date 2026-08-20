'use client';

import React from 'react';
import { Flame, Zap } from 'lucide-react';

interface WarmUpFABProps {
  onOpen: () => void;
}

export const WarmUpFAB: React.FC<WarmUpFABProps> = ({ onOpen }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 animate-bounce hover:animate-none">
      <button
        onClick={onOpen}
        title="Warm-Up & Timepass Arena"
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400 text-white font-black text-xs uppercase tracking-wider shadow-2xl glow-orange hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <Flame className="w-4 h-4 fill-white shrink-0 group-hover:rotate-12 transition-transform" />
        <span className="drop-shadow-md">Warm-Up Arena</span>
      </button>
    </div>
  );
};
