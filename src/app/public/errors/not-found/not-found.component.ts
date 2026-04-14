import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-neutral-950 flex items-center justify-center overflow-hidden relative px-4">

      <!-- Animated background orbs -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="orb orb-gold top-[10%] left-[15%]"></div>
        <div class="orb orb-gold-dim top-[60%] right-[10%]"></div>
        <div class="orb orb-small top-[35%] right-[30%]"></div>
      </div>

      <!-- Particle grid overlay -->
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(250,204,21,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(250,204,21,0.5) 1px, transparent 1px); background-size: 50px 50px;"></div>

      <!-- Main content -->
      <div class="relative z-10 text-center max-w-2xl mx-auto">

        <!-- Glowing 404 number -->
        <div class="relative mb-4">
          <div class="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-transparent bg-clip-text select-none error-number animate-flicker"
               style="background-image: linear-gradient(135deg, #fbbf24 0%, #f59e0b 40%, #d97706 70%, #fbbf24 100%);">
            404
          </div>
          <!-- Glow layer behind number -->
          <div class="absolute inset-0 text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-yellow-400 blur-[40px] opacity-30 select-none pointer-events-none z-[-1]">
            404
          </div>
        </div>

        <!-- Animated football icon -->
        <div class="football-bounce mx-auto mb-6 w-16 h-16 md:w-20 md:h-20">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-[0_0_16px_rgba(251,191,36,0.6)]">
            <circle cx="32" cy="32" r="30" stroke="#fbbf24" stroke-width="3" fill="#1a1a1a"/>
            <path d="M32 8 L39 22 L53 22 L42 31 L46 45 L32 37 L18 45 L22 31 L11 22 L25 22 Z" fill="#fbbf24" opacity="0.9"/>
          </svg>
        </div>

        <!-- Glitch text -->
        <h1 class="text-2xl md:text-4xl font-black text-white uppercase tracking-widest mb-3 glitch-text" data-text="PAGE NOT FOUND">
          Page Not Found
        </h1>

        <p class="text-zinc-400 text-sm md:text-base max-w-md mx-auto mb-10 leading-relaxed">
          Looks like this page took a red card and left the field. The route you're looking for doesn't exist on our pitch.
        </p>

        <!-- Action buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a routerLink="/admin/dashboard"
             class="group relative px-8 py-3.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-black text-sm uppercase tracking-widest rounded-xl overflow-hidden shadow-[0_0_25px_rgba(251,191,36,0.4)] hover:shadow-[0_0_40px_rgba(251,191,36,0.7)] transition-all duration-300 hover:scale-105">
            <span class="relative z-10 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Dashboard
            </span>
          </a>
          <button onclick="history.back()"
             class="px-8 py-3.5 bg-transparent border border-zinc-700 text-zinc-400 font-bold text-sm uppercase tracking-widest rounded-xl hover:border-yellow-500/50 hover:text-yellow-400 transition-all duration-300">
            Go Back
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes flicker {
      0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
      20%, 22%, 24%, 55% { opacity: 0.7; filter: brightness(0.8); }
    }

    @keyframes football-bounce {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      30% { transform: translateY(-24px) rotate(20deg); }
      60% { transform: translateY(-10px) rotate(-10deg); }
    }

    @keyframes orb-pulse {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.2); opacity: 0.9; }
    }

    @keyframes glitch {
      0% { clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%); transform: translate(-2px); }
      10% { clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%); transform: translate(2px); }
      20% { clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%); transform: translate(-1px); }
      30% { clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%); transform: translate(1px); }
      40% { clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%); transform: translate(-1px); }
      50% { clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%); transform: translate(2px); }
      60% { clip-path: polygon(0 50%, 100% 50%, 100% 20%, 0 20%); transform: translate(-2px); }
      70% { clip-path: polygon(0 70%, 100% 70%, 100% 70%, 0 70%); transform: translate(1px); }
      80% { clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%); transform: translate(-2px); }
      90% { clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%); transform: translate(2px); }
      100% { clip-path: polygon(0 60%, 100% 60%, 100% 70%, 0 70%); transform: translate(-1px); }
    }

    .animate-flicker { animation: flicker 4s infinite; }

    .football-bounce { animation: football-bounce 1.6s ease-in-out infinite; }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      animation: orb-pulse 5s ease-in-out infinite;
    }
    .orb-gold { width: 400px; height: 400px; background: radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%); }
    .orb-gold-dim { width: 300px; height: 300px; background: radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%); animation-delay: 2s; }
    .orb-small { width: 200px; height: 200px; background: radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%); animation-delay: 1s; }

    .glitch-text {
      position: relative;
    }
    .glitch-text::before,
    .glitch-text::after {
      content: attr(data-text);
      position: absolute;
      top: 0; left: 50%;
      transform: translateX(-50%);
      width: 100%;
    }
    .glitch-text::before {
      color: #fbbf24;
      animation: glitch 3s infinite linear alternate-reverse;
      clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
      transform: translateX(calc(-50% - 2px));
      opacity: 0.5;
    }
    .glitch-text::after {
      color: #f87171;
      animation: glitch 2.5s 0.5s infinite linear alternate-reverse;
      clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
      transform: translateX(calc(-50% + 2px));
      opacity: 0.4;
    }
  `]
})
export class NotFoundComponent {}
