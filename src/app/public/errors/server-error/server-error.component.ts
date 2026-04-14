import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-neutral-950 flex items-center justify-center overflow-hidden relative px-4">

      <!-- Animated bg orbs - red theme for server error -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="orb orb-red top-[8%] left-[10%]"></div>
        <div class="orb orb-red-dim top-[55%] right-[8%]"></div>
        <div class="orb orb-red-small top-[30%] right-[35%]"></div>
      </div>

      <!-- Subtle grid overlay -->
      <div class="absolute inset-0 opacity-[0.025]" style="background-image: linear-gradient(rgba(239,68,68,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.5) 1px, transparent 1px); background-size: 50px 50px;"></div>

      <!-- Main content -->
      <div class="relative z-10 text-center max-w-2xl mx-auto">

        <!-- Glowing 500 number -->
        <div class="relative mb-4">
          <div class="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-transparent bg-clip-text select-none animate-flicker-red"
               style="background-image: linear-gradient(135deg, #f87171 0%, #ef4444 40%, #dc2626 70%, #f87171 100%);">
            500
          </div>
          <!-- Glow behind number -->
          <div class="absolute inset-0 text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-red-500 blur-[40px] opacity-25 select-none pointer-events-none z-[-1]">
            500
          </div>
        </div>

        <!-- Animated warning icon -->
        <div class="warning-pulse mx-auto mb-6 w-16 h-16 md:w-20 md:h-20">
          <div class="w-full h-full rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.4)]">
            <svg class="w-9 h-9 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
        </div>

        <!-- Heading -->
        <h1 class="text-2xl md:text-4xl font-black text-white uppercase tracking-widest mb-3">
          Server Error
        </h1>

        <!-- Animated scanning bar -->
        <div class="relative w-48 h-1 bg-zinc-800 rounded-full mx-auto mb-6 overflow-hidden">
          <div class="absolute top-0 left-0 h-full bg-red-500 rounded-full scan-bar"></div>
        </div>

        <p class="text-zinc-400 text-sm md:text-base max-w-md mx-auto mb-4 leading-relaxed">
          The server encountered an unexpected condition. Our team is on the pitch working to resolve this issue.
        </p>

        <!-- Blinking terminal-style status -->
        <div class="inline-flex items-center gap-2 bg-black/60 border border-red-500/20 rounded-lg px-4 py-2 mb-10 font-mono text-sm text-red-400">
          <span class="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block"></span>
          <span class="blink-cursor">Error code: 500 — Internal Server Error</span>
        </div>

        <!-- Action buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button onclick="window.location.reload()"
             class="group px-8 py-3.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.35)] hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] transition-all duration-300 hover:scale-105 flex items-center gap-2">
            <svg class="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
          <a routerLink="/"
             class="px-8 py-3.5 bg-transparent border border-zinc-700 text-zinc-400 font-bold text-sm uppercase tracking-widest rounded-xl hover:border-red-500/50 hover:text-red-400 transition-all duration-300">
            Return Home
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes flicker-red {
      0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
      20%, 22%, 24%, 55% { opacity: 0.65; filter: brightness(0.75); }
    }

    @keyframes orb-pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.15); opacity: 0.85; }
    }

    @keyframes warning-pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(239,68,68,0.3); }
      50% { transform: scale(1.08); box-shadow: 0 0 40px rgba(239,68,68,0.6); }
    }

    @keyframes scan {
      0% { left: -40%; width: 40%; }
      100% { left: 100%; width: 40%; }
    }

    .animate-flicker-red { animation: flicker-red 3s infinite; }

    .warning-pulse { animation: warning-pulse 2s ease-in-out infinite; }

    .scan-bar { animation: scan 1.8s linear infinite; }

    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      animation: orb-pulse 5s ease-in-out infinite;
    }
    .orb-red { width: 400px; height: 400px; background: radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%); }
    .orb-red-dim { width: 300px; height: 300px; background: radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%); animation-delay: 2s; }
    .orb-red-small { width: 200px; height: 200px; background: radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%); animation-delay: 1s; }
  `]
})
export class ServerErrorComponent {}
