'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Zap, MapPin, ChevronDown, User, LogOut, PlusCircle, Trophy } from 'lucide-react';

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
  const { userProfile, logout } = useAuth();
  const [isLocDropdownOpen, setIsLocDropdownOpen] = useState(false);

  const locations = [
    { name: 'Greater Noida (Pari Chowk & KP3)', label: 'Greater Noida', count: '12 Active' },
    { name: 'Noida Sector 62 / 104', label: 'Noida Sec 62/104', count: '18 Active' },
    { name: 'South Delhi (Saket / Siri Fort)', label: 'South Delhi', count: '15 Active' },
    { name: 'Dwarka Sports Complex', label: 'Dwarka', count: '8 Active' }
  ];

  return (
    <header className="sticky top-4 z-40 max-w-7xl mx-auto px-4 sm:px-6">
      <nav className="glass-nav rounded-full px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xl border border-white/10">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 via-emerald-400 to-orange-500 flex items-center justify-center text-white font-black text-sm shadow-md group-hover:rotate-12 transition-transform">
            <Zap className="w-5 h-5 fill-white text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-white leading-none">
              SPORT<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">MATCH</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-cyan-400 font-bold">LOCAL ? NCR</span>
          </div>
        </Link>

        {/* Navigation links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/dashboard" className="text-white hover:text-orange-400 transition-colors flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live Lobbies
          </Link>
          <a href="#sports-grid-section" className="hover:text-white transition-colors">Sports</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#community" className="hover:text-white transition-colors">Community</a>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Location selector dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsLocDropdownOpen(!isLocDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs font-semibold text-slate-200 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>{selectedLocation}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            
            {isLocDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl p-2 shadow-2xl border border-white/15 z-50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">Select Micro-Location</div>
                {locations.map((loc) => (
                  <button
                    key={loc.name}
                    onClick={() => {
                      onSelectLocation?.(loc.label);
                      setIsLocDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-xl hover:bg-orange-500/20 hover:text-orange-300 text-slate-200 transition flex items-center justify-between"
                  >
                    <span>?? {loc.label}</span>
                    <span className="text-[10px] text-slate-400">{loc.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Host match / Find match CTA */}
          {onOpenMatchmaker && (
            <button 
              onClick={onOpenMatchmaker}
              className="hidden sm:inline-flex items-center gap-1 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-extrabold uppercase tracking-wider hover:from-orange-600 hover:to-amber-600 shadow-md glow-orange transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Host Game</span>
            </button>
          )}

          {/* User Profile / Auth State */}
          {userProfile ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="relative group flex items-center gap-2 p-1 pl-2.5 rounded-full bg-slate-800/60 border border-white/10 hover:border-cyan-400/50 transition">
                <span className="text-xs font-bold text-slate-200">{userProfile.displayName.split(' ')[0]}</span>
                <img 
                  src={userProfile.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'} 
                  alt={userProfile.displayName} 
                  className="w-7 h-7 rounded-full border border-emerald-400 object-cover" 
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#070D18] rounded-full"></span>
              </Link>
              <button 
                onClick={logout}
                title="Log Out"
                className="p-2 rounded-full bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                href="/login" 
                className="px-4 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition border border-white/10"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-extrabold uppercase hover:from-orange-600 transition glow-orange"
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
