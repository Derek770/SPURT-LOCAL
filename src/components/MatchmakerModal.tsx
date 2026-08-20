'use client';

import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Zap, Trophy, ShieldCheck, Check } from 'lucide-react';
import { SportType, UserProfile } from '@/types';

interface MatchmakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (matchData: any) => void;
  currentUser: UserProfile | null;
  defaultSport?: SportType;
}

export const MatchmakerModal: React.FC<MatchmakerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentUser,
  defaultSport = 'cricket'
}) => {
  const [step, setStep] = useState(1);
  const [sport, setSport] = useState<SportType>(defaultSport === 'all' ? 'cricket' : defaultSport);
  const [format, setFormat] = useState('Casual Turf Friendly');
  const [skill, setSkill] = useState('Casual / Recreational');
  const [location, setLocation] = useState('Greater Noida (Pari Chowk & KP3)');
  const [time, setTime] = useState('Tonight (8:00 PM - 10:00 PM)');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit
      const totalSlots = sport === 'table_tennis' ? 2 : sport === 'badminton' ? 4 : 10;
      const filledSlots = 1;
      const availableSlots = totalSlots - filledSlots;

      onSubmit({
        sport,
        title: `${sport.toUpperCase()} Squad Match (${format})`,
        venue: `${location} Arena`,
        area: location.split(' ')[0],
        time: `Today, ${time}`,
        totalSlots,
        filledSlots,
        availableSlots,
        skill,
        price: 'Rs. 200 / player',
        surface: 'Verified Partner Court',
        badge: `${availableSlots} Slots Left`,
        host: {
          uid: currentUser?.uid || 'guest_host',
          displayName: currentUser?.displayName || 'Host Player',
          photoURL: currentUser?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
        },
        playerUids: [currentUser?.uid || 'guest_host']
      });
      onClose();
      setStep(1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4">
      <div className="glass-card rounded-3xl border border-white/20 p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-slate-400 hover:text-white text-xl p-1 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span className="text-orange-400 uppercase tracking-wider">Step {step} of 3</span>
            <span>Instant Matchmaker</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-orange-500 to-amber-400 h-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Select Sport */}
        {step === 1 && (
          <div>
            <h3 className="font-display font-extrabold text-xl text-white mb-1">Select Your Sport</h3>
            <p className="text-xs text-slate-400 mb-4">Choose which game you want to host today.</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { id: 'cricket', name: 'Cricket', sub: 'Box Turf & T20' },
                { id: 'football', name: 'Football', sub: '5v5 Turf & 11s' },
                { id: 'badminton', name: 'Badminton', sub: 'Singles & Doubles' },
                { id: 'table_tennis', name: 'Table Tennis', sub: '1v1 & Elo Duels' },
              ].map((s) => (
                <div 
                  key={s.id}
                  onClick={() => setSport(s.id as SportType)}
                  className={`cursor-pointer p-4 rounded-2xl border text-center transition ${
                    sport === s.id 
                      ? 'border-orange-500 bg-orange-500/20 shadow-lg' 
                      : 'border-white/10 bg-slate-800/40 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-base text-white">{s.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>

            <button 
              onClick={handleNext} 
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider glow-orange transition flex items-center justify-center gap-2"
            >
              <span>Continue to Skill & Format</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Format & Skill */}
        {step === 2 && (
          <div>
            <h3 className="font-display font-extrabold text-xl text-white mb-1">Format & Skill Rating</h3>
            <p className="text-xs text-slate-400 mb-4">We match you with players of similar intensity.</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Match Format</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Casual Turf Friendly', 'Ranked Competitive'].map((f) => (
                    <label 
                      key={f} 
                      className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-xs transition ${
                        format === f ? 'border-orange-500 bg-orange-500/10 text-white' : 'border-white/10 bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="modal-format" 
                        checked={format === f} 
                        onChange={() => setFormat(f)}
                        className="text-orange-500" 
                      />
                      <span>{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Skill Tier</label>
                <div className="space-y-2">
                  {[
                    { label: 'Casual / Recreational', sub: 'Play for fun, fitness, and friendly rallies', badge: 'Recreational' },
                    { label: 'Intermediate', sub: 'Regular player with solid fundamentals & pace', badge: 'Intermediate' },
                    { label: 'Competitive / Advanced', sub: 'High-intensity, tactical, and fast-paced fixtures', badge: 'Advanced' },
                  ].map((sk) => (
                    <label 
                      key={sk.label}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition ${
                        skill === sk.label ? 'border-orange-500 bg-orange-500/10 text-white' : 'border-white/10 bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input 
                          type="radio" 
                          name="modal-skill" 
                          checked={skill === sk.label} 
                          onChange={() => setSkill(sk.label)}
                          className="text-orange-500" 
                        />
                        <div>
                          <div className="font-bold text-white">{sk.label}</div>
                          <div className="text-[10px] text-slate-400">{sk.sub}</div>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-white/10 text-orange-300 font-semibold">{sk.badge}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setStep(1)} 
                className="w-1/3 py-3 rounded-xl border border-white/15 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button 
                onClick={handleNext} 
                className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider glow-orange transition flex items-center justify-center gap-2"
              >
                <span>Continue to Venue & Time</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Location & Time */}
        {step === 3 && (
          <div>
            <h3 className="font-display font-extrabold text-xl text-white mb-1">Select Venue & Time Slot</h3>
            <p className="text-xs text-slate-400 mb-4">Choose preferred hub for this match fixture.</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Location Hub</label>
                <select 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Greater Noida (Pari Chowk & KP3)">Greater Noida (Pari Chowk & KP3)</option>
                  <option value="Noida Sector 62 / 104">Noida Sector 62 / 104</option>
                  <option value="South Delhi (Saket / Siri Fort)">South Delhi (Saket / Siri Fort)</option>
                  <option value="Dwarka Sports Complex">Dwarka Sports Complex</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Match Timing</label>
                <select 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="Tonight (8:00 PM - 10:00 PM)">Tonight (8:00 PM - 10:00 PM)</option>
                  <option value="Tomorrow Morning (7:00 AM - 9:00 AM)">Tomorrow Morning (7:00 AM - 9:00 AM)</option>
                  <option value="Tomorrow Evening (6:30 PM - 8:30 PM)">Tomorrow Evening (6:30 PM - 8:30 PM)</option>
                  <option value="Weekend Special (5:00 PM - 7:00 PM)">Weekend Special (5:00 PM - 7:00 PM)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setStep(2)} 
                className="w-1/3 py-3 rounded-xl border border-white/15 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button 
                onClick={handleNext} 
                className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs uppercase tracking-wider glow-emerald transition flex items-center justify-center gap-2 shadow-lg"
              >
                <span>PUBLISH REAL LOBBY</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
