'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Users, MapPin, Clock, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';
import { MatchItem, UserProfile, ChatMessage } from '@/types';
import { subscribeToMatchChat, sendChatMessage } from '@/lib/matches';

interface SquadChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchItem | null;
  currentUser: UserProfile | null;
}

export const SquadChatModal: React.FC<SquadChatModalProps> = ({
  isOpen,
  onClose,
  match,
  currentUser
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !match) {
      setMessages([]);
      return;
    }

    const unsubscribe = subscribeToMatchChat(match.id, (msgs) => {
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [isOpen, match?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen || !match) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !currentUser || sending) return;

    setSending(true);
    const textToSend = inputText.trim();
    setInputText('');

    try {
      await sendChatMessage(match.id, currentUser, textToSend);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const quickChips = [
    "📍 I'm at the pitch entrance",
    "🎽 Bringing extra jerseys",
    "⏳ Running 5 mins late",
    "⚡ Ready to warm up!"
  ];

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-3 sm:p-4">
      <div className="glass-card rounded-3xl border border-white/20 max-w-2xl w-full h-[85vh] max-h-[700px] shadow-2xl relative flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Radiant Accent */}
        <div className="h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400 shrink-0"></div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/60 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shrink-0">
              <MessageSquare className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  {match.sport.toUpperCase()} SQUAD CHAT
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  ● Live Room
                </span>
              </div>
              <h3 className="font-display font-extrabold text-base sm:text-lg text-white line-clamp-1">
                {match.title}
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

        {/* Sub-Header: Venue & Squad Info */}
        <div className="px-4 py-2.5 bg-slate-950/60 border-b border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span className="truncate max-w-[200px] sm:max-w-xs">{match.venue}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{match.time}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <Users className="w-3 h-3" />
              <span>{match.filledSlots} / {match.totalSlots} Players</span>
            </div>
          </div>
        </div>

        {/* Chat Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-orange-400 mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-white font-bold text-sm mb-1">Squad Chat Room Ready!</h4>
              <p className="text-xs max-w-xs text-slate-400">
                Say hi to your teammates, confirm pitch arrival, or coordinate jersey colors below.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = currentUser && msg.senderUid === currentUser.uid;
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <img
                      src={msg.senderPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                      alt={msg.senderName}
                      className="w-7 h-7 rounded-full object-cover border border-white/20 shrink-0 mb-1"
                    />
                  )}

                  <div className={`max-w-[78%] sm:max-w-md ${isMe ? 'text-right' : 'text-left'}`}>
                    {!isMe && (
                      <div className="text-[10px] font-bold text-slate-400 mb-1 ml-1">
                        {msg.senderName}
                      </div>
                    )}
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                        isMe
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-none font-medium'
                          : 'bg-slate-800/90 text-slate-100 border border-white/10 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-900/40 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          {quickChips.map((chip) => (
            <button
              key={chip}
              onClick={() => {
                if (currentUser) sendChatMessage(match.id, currentUser, chip);
              }}
              className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSend}
          className="p-3 sm:p-4 bg-slate-900/80 border-t border-white/10 flex items-center gap-2.5 shrink-0"
        >
          {currentUser ? (
            <>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Message your match squad in real time..."
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-950/90 border border-white/15 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 active:scale-95 disabled:opacity-50 transition shadow-lg glow-orange flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full text-center text-xs text-slate-400 py-2">
              Please sign in to send messages in the squad chat room.
            </div>
          )}
        </form>

      </div>
    </div>
  );
};
