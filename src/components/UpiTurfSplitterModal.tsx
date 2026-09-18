'use client';

import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, Copy, ArrowRight, Wallet, ShieldCheck } from 'lucide-react';
import { MatchItem, UserProfile } from '@/types';
import { markPlayerPaid } from '@/lib/matches';

interface UpiTurfSplitterModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchItem | null;
  currentUser: UserProfile | null;
}

export const UpiTurfSplitterModal: React.FC<UpiTurfSplitterModalProps> = ({
  isOpen,
  onClose,
  match,
  currentUser
}) => {
  const [copied, setCopied] = useState(false);
  const [paidConfirmed, setPaidConfirmed] = useState(false);

  if (!isOpen || !match) return null;

  const totalCost = match.turfCost || 1200;
  const totalRoster = Math.max(1, match.playerUids.length);
  const perPlayerCost = Math.ceil(totalCost / totalRoster);
  const hostUpi = match.hostUpiId || 'spurt.host@okaxis';

  // UPI Deep Link String for GPay, PhonePe, Paytm
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(hostUpi)}&pn=${encodeURIComponent(match.host.displayName)}&am=${perPlayerCost}&cu=INR&tn=${encodeURIComponent(`Spurt Turf: ${match.sport}`)}`;
  
  // Real QR Code API URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiDeepLink)}`;

  const isHost = currentUser?.uid === match.host.uid;
  const isPaid = currentUser ? (match.paidPlayerUids || []).includes(currentUser.uid) : false;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(hostUpi);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = async () => {
    if (!currentUser) return;
    try {
      await markPlayerPaid(match.id, currentUser.uid);
      setPaidConfirmed(true);
      setTimeout(() => setPaidConfirmed(false), 3000);
    } catch (err) {
      console.error('Error confirming payment:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-3 sm:p-4">
      <div className="glass-card rounded-3xl border border-white/20 max-w-md w-full p-6 sm:p-8 shadow-2xl relative flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-orange-500"></div>

        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-left mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
              Instant UPI Turf Splitter
            </span>
          </div>
          <h3 className="font-display font-black text-2xl text-white">Turf Fee Breakdown</h3>
          <p className="text-xs text-slate-400 mt-1">{match.title} at {match.venue}</p>
        </div>

        {/* Cost Calculation Pill */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Turf Booking Cost:</span>
            <span className="font-bold text-white">₹{totalCost}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-3 border-b border-white/10">
            <span>Active Joined Players:</span>
            <span className="font-bold text-emerald-400">{totalRoster} Players</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-300">Your Share:</span>
            <span className="font-display font-black text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              ₹{perPlayerCost} <span className="text-xs text-slate-400 font-normal">/ player</span>
            </span>
          </div>
        </div>

        {/* QR Code & Pay Box */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center mb-6 shadow-inner">
          <div className="p-3 bg-white rounded-2xl shadow-xl mb-3">
            <img 
              src={qrCodeUrl} 
              alt="Scan to Pay via UPI" 
              className="w-36 h-36 object-contain"
            />
          </div>
          
          <div className="text-xs font-bold text-slate-200">
            Scan with GPay, PhonePe, Paytm, or BHIM
          </div>

          <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300">
            <span className="font-mono text-cyan-300">{hostUpi}</span>
            <button
              onClick={handleCopyUPI}
              className="text-orange-400 hover:text-orange-300 font-bold ml-1 flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {/* 1-Tap UPI Intent Link on Mobile */}
          <a
            href={upiDeepLink}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs uppercase tracking-wider glow-emerald transition flex items-center justify-center gap-2 shadow-xl"
          >
            <Wallet className="w-4 h-4" />
            <span>PAY ₹{perPlayerCost} VIA UPI APP</span>
          </a>

          {/* Confirm Payment button */}
          {currentUser && (
            <button
              onClick={handleConfirmPayment}
              disabled={isPaid}
              className={`w-full py-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                isPaid
                  ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 cursor-default'
                  : 'border-white/15 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isPaid ? 'Payment Confirmed & Verified ✓' : 'I Have Paid Host (Mark as Paid)'}</span>
            </button>
          )}
        </div>

        {/* Paid Roster Status */}
        <div className="mt-4 pt-3 border-t border-white/10 text-center text-[11px] text-slate-400">
          Paid Athletes: <strong className="text-emerald-400">{(match.paidPlayerUids || []).length} of {totalRoster} Settled</strong>
        </div>

      </div>
    </div>
  );
};
