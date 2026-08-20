'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Zap, Plus, LogOut, ChevronDown, MapPin, User, LogIn, UserPlus } from 'lucide-react';

interface NavbarProps {
  onOpenMatchmaker?: () => void;
  selectedLocation?: string;
  onSelectLocation?: (loc: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMatchmaker,
  selectedLocation = 'Greater Noida',
  onSelectLocation
}) => {
  const router = useRouter();
  const { userProfile, logout } = useAuth();
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const locations = [
    { name: 'Greater Noida', count: '12 Active' },
    { name: 'Noida Sector 62 / 104', count: '18 Active' },
    { name: 'South Delhi', count: '15 Active' },
    { name: 'Dwarka', count: '8 Active' },
  ];

  return (
    <header className="sticky top-4 z-40 max-w-7xl mx-auto px-4 sm:px-6">
      <nav className="glass-nav rounded-full px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xl border border-white/10">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 via-emerald-400 to-orange-500 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:rotate-12 transition-transform">
            <Zap className="w-4 h-4 fill-white text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-base sm:text-lg tracking-tight text-white leading-none">
              SPURT<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">LOCAL</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-cyan-400 font-bold">Delhi-NCR</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-300">
          <Link href="/dashboard" className="text-white hover:text-orange-400 transition-colors flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Lobbies</span>
          </Link>
          <a href="/#sports-grid-section" className="hover:text-white transition-colors">Sports</a>
          <a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="/#community" className="hover:text-white transition-colors">Community</a>
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
              <span className="max-w-[100px] truncate">{selectedLocation}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLocationOpen && (
              <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl p-2 shadow-2xl border border-white/15 z-50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">Select NCR Hub</div>
                {locations.map((loc) => (
                  <button
                    key={loc.name}
                    onClick={() => {
                      if (onSelectLocation) onSelectLocation(loc.name);
                      setIsLocationOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-orange-500/20 hover:text-orange-300 text-slate-200 transition flex items-center justify-between"
                  >
                    <span>{loc.name}</span>
                    <span className="text-[10px] text-slate-400">{loc.count}</span>
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
