'use client';

import React from 'react';

interface SpurtLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const SpurtLogo: React.FC<SpurtLogoProps> = ({ 
  size = 'md', 
  showSubtitle = true,
  className = '' 
}) => {
  const iconSizeClass = 
    size === 'sm' ? 'w-8 h-8' :
    size === 'md' ? 'w-10 h-10' :
    size === 'lg' ? 'w-13 h-13' : 'w-16 h-16';

  const textSizeClass = 
    size === 'sm' ? 'text-base sm:text-lg' :
    size === 'md' ? 'text-lg sm:text-xl' :
    size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl';

  const subSizeClass = 
    size === 'sm' ? 'text-[8px]' :
    size === 'md' ? 'text-[9px]' : 'text-[11px]';

  return (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {/* 3D Geometric Dynamic Spurt Emblem */}
      <div className={`relative ${iconSizeClass} shrink-0`}>
        {/* Glow halo */}
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 via-amber-500 to-cyan-400 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Emblem Container */}
        <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 via-[#0B132B] to-[#070D18] p-1.5 border border-white/20 shadow-2xl flex items-center justify-center overflow-hidden group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
          
          {/* Subtle Grid inside logo badge */}
          <div className="absolute inset-0 bg-[radial-gradient(#ff6b00_1px,transparent_1px)] [background-size:6px_6px] opacity-20 pointer-events-none"></div>

          {/* Precision SVG Vector Glyph */}
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
              <linearGradient id="spurtGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00F0FF" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#FF5E1E" />
              </linearGradient>
              <linearGradient id="spurtGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFAE00" />
                <stop offset="100%" stopColor="#FF3D00" />
              </linearGradient>
              <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Kinetic Fast Outer Chevrons */}
            <path
              d="M20 30 L55 12 L78 28 L45 46 Z"
              fill="url(#spurtGrad1)"
              opacity="0.9"
            />
            {/* Main Athletic Thunderbolt S-Crest */}
            <path
              d="M75 22 L32 54 L52 54 L24 88 L68 46 L48 46 Z"
              fill="url(#spurtGrad2)"
              filter="url(#logoGlow)"
            />
            {/* Speed dots / accent spark */}
            <circle cx="82" cy="74" r="5" fill="#00F0FF" className="animate-ping" style={{ animationDuration: '3s' }} />
            <circle cx="82" cy="74" r="3.5" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className={`font-display font-black tracking-tight leading-none text-white ${textSizeClass}`}>
          SPURT<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">LOCAL</span>
        </div>
        {showSubtitle && (
          <div className={`uppercase tracking-[0.22em] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-300 mt-1 ${subSizeClass}`}>
            Delhi ? Greater Noida ? NCR
          </div>
        )}
      </div>
    </div>
  );
};
