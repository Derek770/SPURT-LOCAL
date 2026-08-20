'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Zap, Plus, LogOut, ChevronDown, MapPin, User, LogIn, UserPlus } from 'lucide-react';
import { SpurtLogo } from './SpurtLogo';

interface NavbarProps {
  onOpenMatchmaker?: () => void;
  onOpenWarmUp?: () => void;
  selectedLocation?: string;
  onSelectLocation?: (loc: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMatchmaker,
  onOpenWarmUp,
  selectedLocation = 'Greater Noida',
  onSelectLocation
}) => {
  const router = useRouter();
  const { userProfile, logout } = useAuth();
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const locations = [
    'Greater Noida (Pari Chowk & KP3)',
    'Noida Sector 62 / 104',
    'South Delhi (Saket / Siri Fort)',
    'Dwarka Sports Complex'
  ];

  return (
    <header className="sticky top-4 z-40 max-w-7xl mx-auto px-4 sm:px-6">
      <nav className="glass-nav rounded-full px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xl border border-white/10">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center">
          <SpurtLogo size="sm" />
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-300">
          <Link href="/dashboard" className="text-white hover:text-orange-400 transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Lobbies</span>
          </Link>
          <a href="/#sports-grid-section" className="hover:text-white transition-colors">Sports</a>
          <a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          {onOpenWarmUp && (
            <button
              onClick={onOpenWarmUp}
              className="text-orange-400 hover:text-orange-300 font-bold transition flex items-center gap-1"
            >
              <span>🔥</span>
              <span>Warm-Up</span>
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          
          {/* Location Selector */}
          <div className="relative">
            <button 
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs font-semibold text-slate-200 transition"
            >
              <MapPin className="w-3 h-3 text-orange-400" />
              <span className="max-w-[120px] truncate">{selectedLocation}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLocationOpen && (
              <div className="absolute right-0 mt-2 w-64 glass-card rounded-2xl p-2 shadow-2xl border border-white/15 z-50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">Select NCR Hub</div>
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      if (onSelectLocation) onSelectLocation(loc);
                      setIsLocationOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-orange-500/20 hover:text-orange-300 text-slate-200 transition"
                  >
                    <span>{loc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Host Game Button */}
          {onOpenMatchmaker && (
            <button 
              onClick={onOpenMatchmaker}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-extrabold uppercase tracking-wider hover:from-orange-600 shadow-md glow-orange transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>HOST GAME</span>
            </button>
          )}

          {/* User Auth Controls */}
          {userProfile ? (
            <div className="flex items-center gap-2">
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-emerald-500/30 text-xs font-semibold text-slate-200 hover:border-emerald-500 transition"
              >
                <img 
                  src={userProfile.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                  alt="Avatar" 
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="max-w-[70px] truncate">{userProfile.displayName || 'Player'}</span>
              </Link>
              
              <button 
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-full bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                href="/login"
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link 
                href="/register"
                className="px-4 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition shadow-sm"
              >
                Join
              </Link>
            </div>
          )}

        </div>
      </nav>
    </header>
  );
};
