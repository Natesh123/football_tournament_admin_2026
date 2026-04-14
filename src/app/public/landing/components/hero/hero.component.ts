import { Component, Input, ElementRef, Renderer2, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Tournament } from '../../../../models/portal.model';
import { AuthService } from '../../../../auth/auth.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="hero" class="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <!-- Dynamic Background -->
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-br from-navy via-navy-lighter to-navy"></div>
        
        <!-- Animated Mesh Gradient -->
        <div class="absolute inset-0 opacity-30">
          <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold/20 rounded-full blur-[150px] animate-pulse-slow"></div>
          <div class="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-gold/10 rounded-full blur-[200px] animate-pulse-slow" style="animation-delay: 2s;"></div>
          <div class="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gold-dark/20 rounded-full blur-[120px] animate-pulse-slow" style="animation-delay: 4s;"></div>
        </div>
        
        <!-- Grid Pattern Overlay -->
        <div class="absolute inset-0 opacity-5" style="background-image: linear-gradient(rgba(212,175,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.3) 1px, transparent 1px); background-size: 50px 50px;"></div>
        
        <!-- Floating Particles -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div *ngFor="let particle of particles; let i = index"
               class="absolute w-1 h-1 bg-gold/40 rounded-full"
               [style.left.%]="particle.x"
               [style.top.%]="particle.y"
               [style.animation-delay.ms]="particle.delay"
               [style.animation-duration.ms]="particle.duration">
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <!-- Content Side -->
          <div class="lg:col-span-7 space-y-10">
            <div class="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-gold/10 border border-gold/30 backdrop-blur-sm">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
              </span>
              <span class="text-gold text-sm font-semibold tracking-wide">Registrations Open</span>
            </div>
            
            <h1 class="text-6xl md:text-8xl font-black text-white leading-none tracking-tight">
              <span class="block text-shadow-gold">ULTIMATE</span>
              <span class="block gradient-text mt-2">CHAMPIONS</span>
              <span class="block text-5xl md:text-6xl text-gray-400 mt-4">LEAGUE 2026</span>
            </h1>
            
            <p class="text-gray-400 text-xl max-w-xl leading-relaxed border-l-2 border-gold/50 pl-6">
              {{ $any(tournamentData)?.description || 'Join the most prestigious regional football tournament. Experience the thrill, the passion, and the glory. Your journey to the top starts here.' }}
            </p>
            
            <div class="flex flex-wrap gap-4">
              <button (click)="handleRegisterClick()" 
                      class="group relative px-8 py-4 bg-gradient-to-r from-gold via-gold-light to-gold text-navy font-black text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] hover:scale-105">
                <span class="relative z-10 flex items-center">
                  Register Now
                  <svg class="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <a href="#schedule" 
                 class="group px-8 py-4 border-2 border-gold/50 text-gold font-bold rounded-2xl backdrop-blur-sm hover:bg-gold/10 hover:border-gold transition-all duration-300 flex items-center">
                View Schedule
                <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>

            <!-- Stats Row -->
            <div class="grid grid-cols-3 gap-6 pt-8">
              <div class="text-center p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/30 transition-all group">
                <span class="text-4xl font-black text-gold block group-hover:scale-110 transition-transform">32+</span>
                <span class="text-gray-500 text-xs uppercase tracking-widest font-semibold">Teams</span>
              </div>
              <div class="text-center p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/30 transition-all group">
                <span class="text-4xl font-black text-gold block group-hover:scale-110 transition-transform">120+</span>
                <span class="text-gray-500 text-xs uppercase tracking-widest font-semibold">Matches</span>
              </div>
              <div class="text-center p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/30 transition-all group">
                <span class="text-4xl font-black text-gold block group-hover:scale-110 transition-transform">$5K+</span>
                <span class="text-gray-500 text-xs uppercase tracking-widest font-semibold">Prize Pool</span>
              </div>
            </div>
          </div>

          <!-- Visual Side -->
          <div class="lg:col-span-5 relative hidden lg:block">
            <!-- Main Card -->
            <div class="relative">
              <div class="absolute -inset-4 bg-gradient-to-r from-gold/20 via-gold/5 to-gold/20 rounded-[3rem] blur-2xl"></div>
              <div class="relative rounded-[2rem] overflow-hidden border border-gold/20 shadow-2xl">
                <img src="/assets/images/hero-player.jpg" alt="Player" 
                     class="w-full h-[600px] object-cover"
                     onerror="this.src='https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1000'">
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent"></div>
                
                <!-- Floating Badge -->
                <div class="absolute top-6 right-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gold rounded-xl flex items-center justify-center">
                      <svg class="w-5 h-5 text-navy" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                    </div>
                    <div>
                      <p class="text-white font-bold text-sm">Season 2026</p>
                      <p class="text-gold text-xs">Live Now</p>
                    </div>
                  </div>
                </div>
                
                <!-- Bottom Info -->
                <div class="absolute bottom-6 left-6 right-6">
                  <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-gray-400 text-xs uppercase tracking-wider">Tournament</p>
                        <p class="text-white font-bold text-lg">{{ $any(tournamentData)?.name || 'Champions League' }}</p>
                      </div>
                      <div class="text-right">
                        <p class="text-gray-400 text-xs uppercase tracking-wider">Starts</p>
                        <p class="text-gold font-bold">March 21, 2026</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Decorative Elements -->
            <div class="absolute -top-6 -right-6 w-32 h-32 border-2 border-gold/30 rounded-full"></div>
            <div class="absolute -bottom-6 -left-6 w-48 h-48 border border-gold/20 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <!-- Scroll Indicator -->
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2">
        <span class="text-gray-500 text-xs uppercase tracking-widest">Scroll</span>
        <div class="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center pt-2">
          <div class="w-1 h-2 bg-gold rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .gradient-text {
      background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 50%, #D4AF37 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .text-shadow-gold {
      text-shadow: 0 0 40px rgba(212, 175, 55, 0.5);
    }
    .animate-pulse-slow {
      animation: pulse-slow 8s ease-in-out infinite;
    }
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.1); }
    }
  `]
})
export class HeroComponent {
  @Input() tournamentData?: Tournament;

  private auth = inject(AuthService);
  private router = inject(Router);
  
  particles: Array<{x: number, y: number, delay: number, duration: number}> = [];

  constructor() {
    this.generateParticles();
  }
  
  private generateParticles() {
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5000,
        duration: 3000 + Math.random() * 4000
      });
    }
  }

  handleRegisterClick() {
    if (this.auth.isAuthenticated()) {
      document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/landing#register' }
      });
    }
  }
}
