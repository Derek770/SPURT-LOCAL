'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Zap, RotateCcw, Trophy, AlertTriangle, Flame, ShieldAlert } from 'lucide-react';
import { UserProfile } from '@/types';
import { updateUserGameScores } from '@/lib/user';

interface ReflexTesterProps {
  currentUser: UserProfile | null;
}

export const ReflexTester: React.FC<ReflexTesterProps> = ({ currentUser }) => {
  const [gameState, setGameState] = useState<'idle' | 'waiting' | 'ready' | 'early' | 'result'>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(currentUser?.bestReflexMs || null);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    if (currentUser?.bestReflexMs) {
      setBestScore(currentUser.bestReflexMs);
    }
  }, [currentUser?.bestReflexMs]);

  const startTest = () => {
    setGameState('waiting');
    setReactionTime(null);

    // Random delay between 2000ms (2s) and 5500ms (5.5s)
    const randomDelay = Math.floor(Math.random() * 3500) + 2000;

    timeoutRef.current = setTimeout(() => {
      setGameState('ready');
      startTimeRef.current = Date.now();
    }, randomDelay);
  };

  const handleClick = () => {
    if (gameState === 'idle') {
      startTest();
    } else if (gameState === 'waiting') {
      // False start penalty!
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('early');
    } else if (gameState === 'ready') {
      // Clicked on green
      const timeMs = Date.now() - startTimeRef.current;
      setReactionTime(timeMs);
      setGameState('result');

      // Check if new best score (lower ms is better)
      if (!bestScore || timeMs < bestScore) {
        setBestScore(timeMs);
        if (currentUser) {
          updateUserGameScores(currentUser.uid, { bestReflexMs: timeMs });
        }
      }
    } else if (gameState === 'early' || gameState === 'result') {
      startTest();
    }
  };

  const getTier = (ms: number) => {
    if (ms < 200) {
      return {
        label: '⚡ Pro Goalkeeper / TT Reflexes',
        sub: 'Lightning fast! Exceptional hand-eye coordination.',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/20 border-emerald-500/40',
        icon: Flame
      };
    } else if (ms <= 280) {
      return {
        label: '🏃 Box Cricket Batsman Speed',
        sub: 'Sharp instincts and rapid pitch reaction.',
        color: 'text-amber-400',
        bg: 'bg-amber-500/20 border-amber-500/40',
        icon: Zap
      };
    } else {
      return {
        label: '☕ Warm Up Muscles & Try Again',
        sub: 'Give your fingers a quick stretch and focus.',
        color: 'text-cyan-400',
        bg: 'bg-cyan-500/20 border-cyan-500/40',
        icon: RotateCcw
      };
    }
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full select-none">
      {/* Game Card Area */}
      <div
        onClick={handleClick}
        className={`w-full flex-1 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative overflow-hidden shadow-2xl ${
          gameState === 'idle' ? 'bg-slate-900/90 border-2 border-dashed border-white/20 hover:border-orange-500/60' :
          gameState === 'waiting' ? 'bg-gradient-to-br from-rose-950 via-red-900 to-red-950 border-2 border-red-500/80' :
          gameState === 'ready' ? 'bg-gradient-to-br from-emerald-900 via-emerald-600 to-teal-800 border-2 border-emerald-400 animate-pulse' :
          gameState === 'early' ? 'bg-gradient-to-br from-amber-950 via-orange-900 to-slate-950 border-2 border-amber-500' :
          'bg-slate-900 border-2 border-white/20'
        }`}
      >
        {/* Ambient Glow */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 bg-emerald-400/20 blur-2xl pointer-events-none animate-ping"></div>
        )}

        {/* State 1: IDLE */}
        {gameState === 'idle' && (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 mx-auto shadow-xl">
              <Zap className="w-8 h-8 fill-orange-400" />
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
              Athlete Reflex Tester
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto">
              Tap anywhere when the screen turns <span className="text-emerald-400 font-bold">GREEN</span>. Test your reaction speed before hitting the turf!
            </p>
            <div className="pt-2">
              <span className="inline-block px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg glow-orange">
                TAP ANYWHERE TO START
              </span>
            </div>
          </div>
        )}

        {/* State 2: WAITING (RED) */}
        {gameState === 'waiting' && (
          <div className="space-y-3 animate-pulse">
            <div className="w-16 h-16 rounded-2xl bg-red-500/30 border border-red-400 flex items-center justify-center text-white mx-auto shadow-2xl">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wider">
              WAIT FOR GREEN...
            </h3>
            <p className="text-xs text-red-200 font-medium">
              Don't click yet or you'll get a false start penalty!
            </p>
          </div>
        )}

        {/* State 3: READY (GREEN) */}
        {gameState === 'ready' && (
          <div className="space-y-3 scale-110 transition-transform">
            <div className="w-20 h-20 rounded-full bg-white text-emerald-900 flex items-center justify-center mx-auto shadow-2xl animate-bounce">
              <Zap className="w-10 h-10 fill-emerald-900" />
            </div>
            <h3 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight drop-shadow-2xl">
              CLICK NOW! ⚡
            </h3>
          </div>
        )}

        {/* State 4: FALSE START (EARLY) */}
        {gameState === 'early' && (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-xl">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-amber-400">
              FALSE START! 🛑
            </h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              You clicked too early while the screen was still red.
            </p>
            <div className="pt-2">
              <span className="inline-block px-4 py-2 rounded-full bg-slate-800 text-slate-200 border border-white/15 font-bold text-xs">
                Tap to Try Again
              </span>
            </div>
          </div>
        )}

        {/* State 5: RESULT */}
        {gameState === 'result' && reactionTime !== null && (
          <div className="space-y-4 w-full max-w-md">
            <div>
              <span className="text-[11px] uppercase tracking-widest font-bold text-slate-400">Your Reaction Time</span>
              <div className="font-display font-black text-5xl sm:text-6xl text-white mt-1 drop-shadow-2xl">
                {reactionTime}<span className="text-2xl text-orange-400 font-bold ml-1">ms</span>
              </div>
            </div>

            {/* Rating Tier Badge */}
            {(() => {
              const tier = getTier(reactionTime);
              const TierIcon = tier.icon;
              return (
                <div className={`p-4 rounded-2xl border ${tier.bg} text-left flex items-start gap-3 shadow-lg`}>
                  <TierIcon className={`w-5 h-5 ${tier.color} shrink-0 mt-0.5`} />
                  <div>
                    <div className={`font-bold text-sm ${tier.color}`}>{tier.label}</div>
                    <div className="text-xs text-slate-300 mt-0.5">{tier.sub}</div>
                  </div>
                </div>
              );
            })()}

            <div className="pt-2">
              <span className="inline-block px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg glow-orange">
                TAP TO TRY AGAIN 🔄
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats Bar */}
      <div className="w-full flex items-center justify-between pt-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Personal Best:</span>
          <strong className="text-white">{bestScore ? `${bestScore} ms` : 'None yet'}</strong>
        </div>
        <div className="text-[11px] text-slate-500">
          Pro Benchmark: &lt; 200 ms
        </div>
      </div>
    </div>
  );
};
