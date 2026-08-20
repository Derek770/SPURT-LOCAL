'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Trophy, RotateCcw, Play, Sparkles, Flame } from 'lucide-react';
import { UserProfile } from '@/types';
import { updateUserGameScores } from '@/lib/user';

interface KeepieUppieProps {
  currentUser: UserProfile | null;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  life: number;
}

export const KeepieUppie: React.FC<KeepieUppieProps> = ({ currentUser }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [highScore, setHighScore] = useState<number>(currentUser?.bestKeepieUppie || 0);

  // Physics state refs to prevent re-renders in animation loop
  const ballRef = useRef({
    x: 180,
    y: 120,
    radius: 26,
    vx: 0,
    vy: 0,
    rotation: 0,
    vRot: 0
  });

  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const scoreRef = useRef(0);

  useEffect(() => {
    if (currentUser?.bestKeepieUppie) {
      setHighScore(currentUser.bestKeepieUppie);
    }
  }, [currentUser?.bestKeepieUppie]);

  const spawnParticles = (x: number, y: number, count = 12) => {
    const colors = ['#FF5E1E', '#00F0FF', '#10B981', '#FFAE00', '#FFFFFF'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: Math.random() * 3 + 2,
        life: 1.0
      });
    }
  };

  const startGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ballRef.current = {
      x: canvas.width / 2,
      y: 90,
      radius: 26,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 1,
      rotation: 0,
      vRot: (Math.random() - 0.5) * 0.05
    };
    particlesRef.current = [];
    scoreRef.current = 0;
    setScore(0);
    setCombo(1);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  const handleTap = (clientX: number, clientY: number) => {
    if (!isPlaying) {
      startGame();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = ((clientX - rect.left) / rect.width) * canvas.width;
    const clickY = ((clientY - rect.top) / rect.height) * canvas.height;

    const b = ballRef.current;
    const dx = clickX - b.x;
    const dy = clickY - b.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Hitbox with generous tolerance (radius + 28px)
    if (dist <= b.radius + 28) {
      // Bounce upward with strength based on hit precision
      b.vy = -8.8 - Math.random() * 1.2;
      b.vx += (b.x - clickX) * 0.22;
      b.vRot = (Math.random() - 0.5) * 0.25;

      // Score increment & combo
      scoreRef.current += 1;
      const currentScore = scoreRef.current;
      setScore(currentScore);
      setCombo(Math.min(5, Math.floor(currentScore / 5) + 1));

      // Particle explosion
      spawnParticles(b.x, b.y + b.radius, 14);

      // Check high score
      if (currentScore > highScore) {
        setHighScore(currentScore);
        if (currentUser) {
          updateUserGameScores(currentUser.uid, { bestKeepieUppie: currentScore });
        }
      }
    }
  };

  // Main Physics Engine loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gravity = 0.34;
    const groundY = canvas.height - 20;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Turf Grass / Ground Line
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.stroke();

      // Grass blades gradient
      const grassGrad = ctx.createLinearGradient(0, groundY, 0, canvas.height);
      grassGrad.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
      grassGrad.addColorStop(1, 'rgba(7, 13, 24, 0.9)');
      ctx.fillStyle = grassGrad;
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

      if (isPlaying && !isGameOver) {
        const b = ballRef.current;

        // Apply physics
        b.vy += gravity;
        b.x += b.vx;
        b.y += b.vy;
        b.rotation += b.vRot;

        // Side wall bounce
        if (b.x - b.radius < 10) {
          b.x = 10 + b.radius;
          b.vx = Math.abs(b.vx) * 0.75;
        } else if (b.x + b.radius > canvas.width - 10) {
          b.x = canvas.width - 10 - b.radius;
          b.vx = -Math.abs(b.vx) * 0.75;
        }

        // Top ceiling bounce
        if (b.y - b.radius < 5) {
          b.y = 5 + b.radius;
          b.vy = Math.abs(b.vy) * 0.5;
        }

        // Floor collision -> Game Over
        if (b.y + b.radius >= groundY) {
          b.y = groundY - b.radius;
          b.vy = 0;
          b.vx = 0;
          setIsGameOver(true);
          setIsPlaying(false);
          spawnParticles(b.x, groundY, 20);
        }

        // Draw shadow under ball
        const shadowScale = Math.max(0.2, 1 - (groundY - (b.y + b.radius)) / 300);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(b.x, groundY - 2, b.radius * shadowScale, 6 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw Football
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rotation);

        // Ball Body
        const ballGrad = ctx.createRadialGradient(-6, -6, 4, 0, 0, b.radius);
        ballGrad.addColorStop(0, '#FFFFFF');
        ballGrad.addColorStop(0.7, '#E2E8F0');
        ballGrad.addColorStop(1, '#64748B');
        ctx.fillStyle = ballGrad;
        ctx.beginPath();
        ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Classic Pentagon Pattern
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5;
          const px = Math.cos(angle) * (b.radius * 0.42);
          const py = Math.sin(angle) * (b.radius * 0.42);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // particle gravity
        p.life -= 0.03;

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, isGameOver]);

  return (
    <div className="flex flex-col items-center justify-between h-full w-full select-none">
      {/* Game Header Stats */}
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Juggles:</span>
          <span className="font-display font-black text-2xl sm:text-3xl text-white">{score}</span>
          {combo > 1 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-extrabold border border-orange-500/40 animate-pulse">
              {combo}x Combo
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
          <Trophy className="w-3.5 h-3.5" />
          <span>Record: {highScore}</span>
        </div>
      </div>

      {/* Canvas Interactive Pitch */}
      <div className="relative w-full flex-1 rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#070D18] via-[#0B132B] to-[#061A18] shadow-2xl flex items-center justify-center">
        
        <canvas
          ref={canvasRef}
          width={360}
          height={400}
          onClick={(e) => handleTap(e.clientX, e.clientY)}
          onTouchStart={(e) => {
            if (e.touches.length > 0) {
              handleTap(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          className="w-full h-full cursor-pointer touch-none"
        />

        {/* Start / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
            {isGameOver ? (
              <div className="space-y-3 animate-in fade-in zoom-in-95">
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto shadow-xl">
                  <RotateCcw className="w-7 h-7" />
                </div>
                <h3 className="font-display font-black text-2xl text-white">Ball Hit The Turf!</h3>
                <p className="text-xs text-slate-300">
                  You kept it up for <strong className="text-orange-400 font-extrabold">{score}</strong> juggles!
                </p>
                <button
                  onClick={startGame}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs uppercase tracking-wider glow-orange hover:from-orange-600 active:scale-95 transition shadow-xl"
                >
                  JUGGLE AGAIN ⚽
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-xl">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="font-display font-black text-2xl text-white">Turf Keepie-Uppie</h3>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Tap the ball before it touches the turf. How many juggles can you string together?
                </p>
                <button
                  onClick={startGame}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs uppercase tracking-wider glow-emerald hover:brightness-110 active:scale-95 transition shadow-2xl flex items-center gap-2 mx-auto"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>START JUGGLING</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Hint */}
      <div className="w-full text-center pt-3 text-[11px] text-slate-400 font-medium">
        💡 Tip: Tap near the bottom of the ball for maximum upward bounce!
      </div>
    </div>
  );
};
