import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-premium-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="relative bg-[#0B0B0B] text-white overflow-x-hidden font-sans">
      
      <!-- ========================================
          FLOATING ELEMENTS (Background)
          ======================================== -->
      <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div class="parallax-layer absolute w-64 h-64 border border-[#D4AF37]/10 rounded-full" 
             style="top: 20%; left: 5%; transform: translateZ(-100px);"
             data-speed="0.3"></div>
        <div class="parallax-layer absolute w-96 h-96 border border-[#D4AF37]/5 rounded-full" 
             style="top: 60%; right: -10%; transform: translateZ(-200px);"
             data-speed="0.5"></div>
        <div class="parallax-layer absolute w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-3xl" 
             style="top: 40%; left: 70%;"
             data-speed="0.2"></div>
        <div class="parallax-layer absolute w-48 h-48 bg-[#D4AF37]/3 rounded-full blur-3xl" 
             style="top: 80%; left: 20%;"
             data-speed="0.4"></div>
        
        <!-- Grid Pattern -->
        <div class="absolute inset-0 opacity-[0.02]" 
             style="background-image: linear-gradient(rgba(212,175,55,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.8) 1px, transparent 1px); background-size: 100px 100px;"></div>
      </div>

      <!-- ========================================
          NAVIGATION
          ======================================== -->
      <nav class="fixed top-4 left-0 right-0 mx-auto w-[92%] max-w-7xl z-50 transition-all duration-500 rounded-3xl" [class]="navClasses">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-20">
            <!-- Logo -->
            <a href="#" class="flex items-center space-x-3 group">
              <div class="w-12 h-12 flex items-center justify-center -ml-2">
                <img src="/images/logo-gold.png" alt="ATB Sports" class="h-16 w-auto object-contain mix-blend-screen drop-shadow-[#D4AF37]">
              </div>
              <span class="text-2xl font-black tracking-widest text-[#D4AF37]">ATB SPORTS</span>
            </a>
            
            <!-- Desktop Nav -->
            <div class="hidden lg:flex items-center space-x-10">
              <a *ngFor="let link of navLinks" [href]="link.href" 
                 class="relative text-sm font-medium text-gray-300 hover:text-[#D4AF37] transition-colors group">
                {{ link.label }}
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D4AF37] group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
            
            <!-- CTA Buttons -->
            <div class="hidden lg:flex items-center space-x-4">
              <a href="/login" class="text-sm font-semibold text-gray-300 hover:text-[#D4AF37] transition-colors">Login</a>
              <a href="#pricing" class="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 hover:scale-105 transition-all">
                Get Started
              </a>
            </div>
            
            <!-- Mobile Menu Button -->
            <button class="lg:hidden p-2 text-white" (click)="toggleMobileMenu()">
              <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path *ngIf="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path *ngIf="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Mobile Menu -->
        <div *ngIf="mobileMenuOpen" class="lg:hidden bg-black/40 backdrop-blur-xl border-t border-[#D4AF37]/20 rounded-b-3xl">
          <div class="px-6 py-6 space-y-4">
            <a *ngFor="let link of navLinks" [href]="link.href" (click)="closeMobileMenu()"
               class="block py-3 text-lg font-medium text-gray-300 hover:text-[#D4AF37] border-b border-white/5">
              {{ link.label }}
            </a>
            <div class="pt-4 space-y-3">
              <a href="/login" class="block text-center py-3 text-gray-300">Login</a>
              <a href="#pricing" (click)="closeMobileMenu()" class="block text-center py-3 bg-[#D4AF37] text-black font-bold rounded-xl">Get Started</a>
            </div>
          </div>
        </div>
      </nav>

      <!-- ========================================
          HERO SECTION
          ======================================== -->
      <section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden pt-36 pb-20">
        <!-- Hero Background -->
        <div class="absolute inset-0">
          <!-- Radial Gradient -->
          <div class="absolute inset-0 bg-gradient-radial from-[#1a1a1a] via-[#0B0B0B] to-[#0B0B0B]"></div>
          
          <!-- Glowing Orbs -->
          <div class="hero-orb absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-[#D4AF37]/10 rounded-full blur-[150px]" data-parallax="0.2"></div>
          <div class="hero-orb absolute bottom-1/4 right-1/4 w-[900px] h-[900px] bg-[#D4AF37]/5 rounded-full blur-[200px]" data-parallax="0.3"></div>
          <div class="hero-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/8 rounded-full blur-[120px]" data-parallax="0.1"></div>
          
          <!-- Floating Particles -->
          <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div *ngFor="let p of particles; let i = index"
                 class="absolute w-1.5 h-1.5 bg-[#D4AF37]/40 rounded-full floating-dot"
                 [style.left.%]="p.x"
                 [style.top.%]="p.y"
                 [style.animation-delay.s]="p.delay"
                 [style.animation-duration.s]="p.duration">
            </div>
          </div>
        </div>
        
        <!-- Hero Content -->
        <div class="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <!-- Badge -->
          <div class="hero-badge inline-flex items-center space-x-3 px-5 py-2.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-8">
            <span class="relative flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D4AF37]"></span>
            </span>
            <span class="text-[#D4AF37] font-semibold tracking-wide">Season 2026 Now Live</span>
          </div>
          
          <!-- Main Headline -->
          <h1 class="hero-title text-7xl md:text-8xl lg:text-[120px] font-black leading-none tracking-tighter mb-8">
            <span class="block text-white mb-2">ORGANIZE.</span>
            <span class="block bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">COMPETE.</span>
            <span class="block text-white/80 mt-2">CONQUER.</span>
          </h1>
          
          <!-- Subtitle -->
          <p class="hero-subtitle text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            The world's most advanced football tournament platform. 
            Create epic competitions, manage teams, and deliver unforgettable experiences.
          </p>
          
          <!-- CTA Buttons -->
          <div class="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-5 mb-20">
            <a href="/register" class="group relative px-10 py-5 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-bold text-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_50px_rgba(212,175,55,0.5)] hover:scale-105">
              <span class="relative z-10 flex items-center">
                Start Free Trial
                <svg class="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
            <a href="#tournaments" class="group px-10 py-5 border-2 border-[#D4AF37]/50 text-[#D4AF37] font-bold text-lg rounded-2xl hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] transition-all duration-300 flex items-center">
              View Tournaments
              <svg class="w-6 h-6 ml-3 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>
          
          <!-- Stats Grid -->
          <div class="hero-stats grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div *ngFor="let stat of heroStats; let i = index" 
                 class="stat-card group p-6 md:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-sm border border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all duration-500 cursor-pointer">
              <div class="text-4xl md:text-5xl font-black text-[#D4AF37] mb-3 group-hover:scale-110 transition-transform">{{ stat.value }}</div>
              <div class="text-gray-400 text-sm uppercase tracking-wider font-medium">{{ stat.label }}</div>
            </div>
          </div>
        </div>
        
        <!-- Scroll Indicator -->
        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-3">
          <span class="text-gray-600 text-xs uppercase tracking-[0.3em]">Scroll</span>
          <div class="w-7 h-12 border-2 border-[#D4AF37]/40 rounded-full flex justify-center pt-2">
            <div class="w-1.5 h-3 bg-[#D4AF37] rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      <!-- ========================================
          TOURNAMENTS SECTION
          ======================================== -->
      <section id="tournaments" class="relative py-32 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-[#0a0a0a] to-[#0B0B0B]"></div>
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
        
        <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <!-- Section Header -->
          <div class="text-center mb-20">
            <span class="section-label inline-block text-[#D4AF37] text-sm font-bold uppercase tracking-[0.3em] mb-6">Championships</span>
            <h2 class="section-title text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">Featured Tournaments</h2>
            <p class="text-gray-400 text-lg max-w-2xl mx-auto">Join the most prestigious football competitions from around the globe</p>
          </div>
          
          <!-- Tournament Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div *ngFor="let t of tournaments; let i = index" 
                 class="tournament-card group relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-[#D4AF37]/60 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_30px_80px_rgba(212,175,55,0.2)]">
              
              <!-- Image Area -->
              <div class="aspect-[16/10] relative overflow-hidden">
                <img [src]="t.image" [alt]="t.name" 
                     class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                     onerror="this.src='https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600'">
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                
                <!-- Type Badge -->
                <div class="absolute top-4 right-4 px-4 py-1.5 bg-[#D4AF37] text-black text-xs font-bold rounded-full shadow-lg">
                  {{ t.type }}
                </div>
                
                <!-- Prize Badge -->
                <div class="absolute bottom-4 left-4 px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-[#D4AF37]/30">
                  <span class="text-[#D4AF37] font-black text-lg">{{ t.prize }}</span>
                </div>
              </div>
              
              <!-- Content -->
              <div class="p-7">
                <h3 class="text-xl font-bold text-white mb-3 group-hover:text-[#D4AF37] transition-colors">{{ t.name }}</h3>
                <p class="text-gray-400 text-sm mb-5 leading-relaxed">{{ t.description }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-gray-500 text-sm flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ t.date }}
                  </span>
                  <button class="text-[#D4AF37] font-semibold text-sm flex items-center hover:underline">
                    Details
                    <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================
          FEATURES SECTION
          ======================================== -->
      <section id="features" class="relative py-32 overflow-hidden">
        <div class="absolute inset-0 bg-[#0B0B0B]"></div>
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
        
        <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <!-- Section Header -->
          <div class="text-center mb-20">
            <span class="section-label inline-block text-[#D4AF37] text-sm font-bold uppercase tracking-[0.3em] mb-6">Capabilities</span>
            <h2 class="section-title text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">Powerful Features</h2>
            <p class="text-gray-400 text-lg max-w-2xl mx-auto">Everything you need to run world-class tournaments</p>
          </div>
          
          <!-- Features Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div *ngFor="let f of features; let i = index" 
                 class="feature-card group p-8 md:p-10 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 transition-all duration-500 cursor-pointer"
                 [style.transition-delay.ms]="i * 100">
              
              <!-- Icon -->
              <div class="w-16 h-16 mb-8 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center group-hover:scale-110 group-hover:from-[#D4AF37]/30 group-hover:to-[#D4AF37]/10 transition-all duration-300">
                <div [innerHTML]="f.icon" class="w-8 h-8 text-[#D4AF37]"></div>
              </div>
              
              <h3 class="text-xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">{{ f.title }}</h3>
              <p class="text-gray-400 leading-relaxed">{{ f.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================
          ABOUT / SPLIT SECTION
          ======================================== -->
      <section id="about" class="relative py-32 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] to-[#080808]"></div>
        
        <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            <!-- Left: Content -->
            <div class="order-2 lg:order-1">
              <span class="section-label inline-block text-[#D4AF37] text-sm font-bold uppercase tracking-[0.3em] mb-6">About Us</span>
              <h2 class="section-title text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-tight">
                Revolutionizing<br>
                <span class="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] bg-clip-text text-transparent">Football</span> Management
              </h2>
              <p class="text-gray-400 text-lg leading-relaxed mb-10">
                We're building the future of football tournament management. Our platform brings together organizers, teams, and fans in one powerful ecosystem, delivering unmatched experiences.
              </p>
              
              <!-- Benefits List -->
              <div class="space-y-5 mb-10">
                <div *ngFor="let point of aboutPoints" class="flex items-start space-x-4">
                  <div class="w-8 h-8 mt-0.5 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span class="text-gray-300 text-lg">{{ point }}</span>
                </div>
              </div>
              
              <a href="#cta" class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 hover:scale-105 transition-all">
                Learn More
                <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
            
            <!-- Right: Dashboard Visual Stack -->
            <div class="about-visual order-1 lg:order-2 relative">
              <div class="relative min-h-[450px] flex items-center justify-center">
                <!-- Background Graph (Subtle) -->
                <div class="about-bg-graph absolute inset-0 opacity-[0.03] pointer-events-none z-0 overflow-hidden">
                  <div class="flex items-end gap-2 h-full w-[150%] -ml-[25%]">
                    <div *ngFor="let b of [80, 45, 90, 65, 85, 50, 95, 70, 40, 60, 100, 75, 45, 80, 55, 90]" 
                         class="flex-1 bg-white rounded-t-lg" [style.height.%]="b"></div>
                  </div>
                </div>

                <!-- Glow Effect -->
                <div class="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/15 via-transparent to-[#D4AF37]/15 rounded-[3rem] blur-3xl"></div>

                <!-- Card 1 (back) - Small Analytics Graph -->
                <div class="about-card-1 absolute -bottom-6 -left-8 w-60 rounded-2xl bg-[#0b0b0b] border border-white/5 p-5 shadow-2xl z-10">
                  <p class="text-[9px] text-[#D4AF37] font-bold uppercase tracking-widest mb-3">Analytics</p>
                  <div class="relative h-16 mb-2">
                    <div class="relative h-full flex items-end gap-1 z-10">
                      <div *ngFor="let b of [40, 70, 50, 90, 60, 80, 75]" 
                           class="about-graph-bar flex-1 rounded-t-sm bg-gradient-to-t from-[#D4AF37]/10 to-[#D4AF37]/40" 
                           [style.height.%]="b"></div>
                    </div>
                  </div>
                </div>

                <!-- Card 2 (middle) - Match Score Card -->
                <div class="about-card-2 absolute -top-8 -right-8 w-52 rounded-2xl bg-[#0f0f0f] border border-[#D4AF37]/10 p-4 shadow-xl z-20">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                    <span class="text-[8px] font-bold text-red-400 uppercase tracking-widest">Live</span>
                  </div>
                  <div class="flex items-center justify-between text-white">
                    <span class="font-bold text-[10px]">RMA</span>
                    <span class="text-lg font-black text-[#D4AF37]">2 - 1</span>
                    <span class="font-bold text-[10px]">BAY</span>
                  </div>
                </div>

                <!-- Card 3 (front) - Main Standings Card -->
                <div class="about-card-3 relative w-72 rounded-[1.5rem] overflow-hidden border border-[#D4AF37]/30 shadow-2xl z-30">
                  <div class="bg-gradient-to-br from-[#111] to-[#0B0B0B] p-6">
                    <div class="flex items-center justify-between mb-5">
                      <div class="flex items-center gap-2">
                        <img src="/images/logo-gold.png" alt="ATB" class="h-4 w-auto object-contain mix-blend-screen">
                        <span class="text-[10px] font-black text-[#D4AF37] tracking-widest uppercase">Live Standings</span>
                      </div>
                      <div class="px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20">
                        <span class="text-[8px] font-bold text-gold">PRO</span>
                      </div>
                    </div>
                    
                    <div class="space-y-3">
                      <div *ngFor="let s of mockStandings" class="flex items-center gap-3 py-2 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors px-1 rounded-lg">
                        <span class="w-4 text-[10px] text-zinc-500 font-mono">{{s.pos}}</span>
                        <span class="flex-1 text-xs text-white font-medium truncate">{{s.team}}</span>
                        <div class="flex items-center gap-2">
                          <span class="text-[10px] text-zinc-500">Pts</span>
                          <span class="text-xs text-[#D4AF37] font-black">{{s.pts}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Floating Badge -->
                <div class="absolute bottom-12 -right-4 z-30 px-3 py-2 bg-[#D4AF37] rounded-xl shadow-lg shadow-[#D4AF37]/30">
                  <p class="text-black text-[10px] font-black uppercase tracking-widest">🏆 500+ Tournaments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================
          PRICING SECTION
          ======================================== -->
      <section id="pricing" class="relative py-32 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-[#080808] to-[#0B0B0B]"></div>
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
        
        <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <!-- Section Header -->
          <div class="text-center mb-20">
            <span class="section-label inline-block text-[#D4AF37] text-sm font-bold uppercase tracking-[0.3em] mb-6">Pricing</span>
            <h2 class="section-title text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">Choose Your Plan</h2>
            <p class="text-gray-400 text-lg max-w-2xl mx-auto">Select the perfect plan for your tournament needs</p>
          </div>
          
          <!-- Pricing Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div *ngFor="let plan of pricingPlans; let i = index" 
                 class="pricing-card relative rounded-3xl p-8 lg:p-10 transition-all duration-500 hover:-translate-y-2"
                 [class.bg-gradient-to-br]="plan.featured"
                 [class.from-[#D4AF37]/15]="plan.featured"
                 [class.to-black]="plan.featured"
                 [class.border-2]="plan.featured"
                 [class.border-[#D4AF37]/50]="plan.featured"
                 [class.-mt-8]="plan.featured"
                 [class.md:-mt-8]="plan.featured"
                 [class.shadow-2xl]="plan.featured"
                 [class.shadow-[#D4AF37]/10]="plan.featured"
                 [class]="!plan.featured ? 'bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10' : ''">
              
              <!-- Popular Badge -->
              <div *ngIf="plan.featured" class="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black text-xs font-bold rounded-full shadow-lg">
                MOST POPULAR
              </div>
              
              <h3 class="text-2xl font-bold text-white mb-2">{{ plan.name }}</h3>
              <p class="text-gray-400 text-sm mb-6">{{ plan.description }}</p>
              
              <div class="mb-8">
                <span class="text-6xl font-black text-white">{{ plan.price }}</span>
                <span class="text-gray-500 text-lg">/{{ plan.period }}</span>
              </div>
              
              <ul class="space-y-4 mb-10">
                <li *ngFor="let feature of plan.features" class="flex items-center space-x-3">
                  <svg class="w-5 h-5 text-[#D4AF37] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-gray-300 text-sm">{{ feature }}</span>
                </li>
              </ul>
              
              <a [href]="plan.ctaLink" 
                 class="block text-center py-4 rounded-xl font-bold transition-all duration-300"
                 [class.bg-[#D4AF37]]="plan.featured"
                 [class.text-black]="plan.featured"
                 [class.hover:bg-[#F4D03F]]="plan.featured"
                 [class.shadow-lg]="plan.featured"
                 [class.shadow-[#D4AF37]/30]="plan.featured"
                 [class.border]="!plan.featured"
                 [class.border-[#D4AF37]/50]="!plan.featured"
                 [class.text-[#D4AF37]]="!plan.featured"
                 [class.hover.bg-[#D4AF37]/10]="!plan.featured">
                {{ plan.cta }}
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================
          TESTIMONIALS SECTION
          ======================================== -->
      <section id="testimonials" class="relative py-32 overflow-hidden">
        <div class="absolute inset-0 bg-[#0B0B0B]"></div>
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
        
        <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <!-- Section Header -->
          <div class="text-center mb-20">
            <span class="section-label inline-block text-[#D4AF37] text-sm font-bold uppercase tracking-[0.3em] mb-6">Testimonials</span>
            <h2 class="section-title text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">What They Say</h2>
          </div>
          
          <!-- Testimonial Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div *ngFor="let t of testimonials; let i = index" 
                 class="testimonial-card p-8 md:p-10 rounded-3xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-[#D4AF37]/30 transition-all duration-500 hover:-translate-y-2">
              
              <!-- Stars -->
              <div class="flex space-x-1 mb-6">
                <svg *ngFor="let s of [1,2,3,4,5]" class="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              
              <!-- Quote -->
              <p class="text-gray-300 leading-relaxed mb-8 text-lg">"{{ t.text }}"</p>
              
              <!-- Author -->
              <div class="flex items-center space-x-4">
                <img [src]="t.avatar" [alt]="t.name"
                     class="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4AF37]/30 shadow-lg shadow-[#D4AF37]/10"
                     onerror="this.style.display='none'">
                <div>
                  <div class="text-white font-bold text-lg">{{ t.name }}</div>
                  <div class="text-gray-500 text-sm">{{ t.role }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================
          SPONSORS SECTION
          ======================================== -->
      <section id="sponsors" class="relative py-24 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] to-[#0a0a0a]"></div>
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
        
        <div class="relative z-10">
          <!-- Section Header -->
          <div class="text-center mb-16">
            <span class="section-label inline-block text-[#D4AF37] text-sm font-bold uppercase tracking-[0.3em] mb-6">Partners</span>
            <h2 class="section-title text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">Our Sponsors</h2>
            <p class="text-gray-400 text-lg max-w-2xl mx-auto">Trusted by world-class brands and organizations</p>
          </div>
          
          <!-- Marquee Container -->
          <div class="relative overflow-hidden">
            <!-- Gradient Fades -->
            <div class="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0B0B0B] to-transparent z-10 pointer-events-none"></div>
            <div class="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0B0B0B] to-transparent z-10 pointer-events-none"></div>
            
            <!-- Marquee Track -->
            <div class="flex animate-marquee hover:pause">
              <div *ngFor="let sponsor of sponsors; let i = index" 
                   class="flex-shrink-0 mx-8 group cursor-pointer">
                <div class="sponsor-card w-56 h-32 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/50 flex items-center justify-center p-6 transition-all duration-500 hover:bg-[#D4AF37]/5 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] hover:scale-105">
                  <img [src]="sponsor.logo" [alt]="sponsor.name" 
                       class="h-12 object-contain grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:opacity-100 opacity-60"
                       onerror="this.style.display='none'">
                  <span *ngIf="!sponsor.logo" class="text-gray-500 font-bold text-lg group-hover:text-[#D4AF37] transition-colors">{{ sponsor.name }}</span>
                </div>
              </div>
              <!-- Duplicate for seamless loop -->
              <div *ngFor="let sponsor of sponsors; let i = index" 
                   class="flex-shrink-0 mx-8 group cursor-pointer">
                <div class="sponsor-card w-56 h-32 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/50 flex items-center justify-center p-6 transition-all duration-500 hover:bg-[#D4AF37]/5 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] hover:scale-105">
                  <img [src]="sponsor.logo" [alt]="sponsor.name" 
                       class="h-12 object-contain grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:opacity-100 opacity-60"
                       onerror="this.style.display='none'">
                  <span *ngIf="!sponsor.logo" class="text-gray-500 font-bold text-lg group-hover:text-[#D4AF37] transition-colors">{{ sponsor.name }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Stats Row -->
          <div class="max-w-5xl mx-auto px-6 lg:px-8 mt-20">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div *ngFor="let stat of sponsorStats" class="text-center group">
                <div class="text-4xl md:text-5xl font-black text-[#D4AF37] mb-2 group-hover:scale-110 transition-transform">{{ stat.value }}</div>
                <div class="text-gray-500 text-sm uppercase tracking-wider">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================
          CONTACT SECTION
          ======================================== -->
      <section id="contact" class="relative py-32 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] to-[#080808]"></div>
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
        
        <div class="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
          <!-- Section Header -->
          <div class="text-center mb-16">
            <span class="section-label inline-block text-[#D4AF37] text-sm font-bold uppercase tracking-[0.3em] mb-6">Contact</span>
            <h2 class="section-title text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6">Get In Touch</h2>
            <p class="text-gray-400 text-lg">Have questions? We'd love to hear from you.</p>
          </div>
          
          <!-- Contact Form -->
          <form (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input type="text" [(ngModel)]="contactForm.name" name="name" placeholder="Your Name"
                       class="w-full px-6 py-5 bg-white/[0.05] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-[#D4AF37]/5 transition-all">
              </div>
              <div>
                <input type="email" [(ngModel)]="contactForm.email" name="email" placeholder="Your Email"
                       class="w-full px-6 py-5 bg-white/[0.05] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-[#D4AF37]/5 transition-all">
              </div>
            </div>
            <div>
              <input type="text" [(ngModel)]="contactForm.subject" name="subject" placeholder="Subject"
                     class="w-full px-6 py-5 bg-white/[0.05] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-[#D4AF37]/5 transition-all">
            </div>
            <div>
              <textarea [(ngModel)]="contactForm.message" name="message" rows="5" placeholder="Your Message"
                        class="w-full px-6 py-5 bg-white/[0.05] border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-[#D4AF37]/5 transition-all resize-none"></textarea>
            </div>
            <button type="submit" 
                    class="w-full py-5 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-bold text-lg rounded-2xl hover:shadow-lg hover:shadow-[#D4AF37]/40 hover:scale-[1.02] transition-all">
              Send Message
            </button>
          </form>
        </div>
      </section>

      <!-- ========================================
          CTA SECTION
          ======================================== -->
      <section id="cta" class="relative py-40 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=2000&q=80" 
             onerror="this.style.display='none'"
             class="absolute inset-0 w-full h-full object-cover object-center z-0" 
             alt="Professional Football Stadium" />
        <div class="absolute inset-0 bg-black/60"></div>
        <div class="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 via-transparent to-[#D4AF37]/10"></div>
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, rgba(212,175,55,0.08) 1px, transparent 0); background-size: 50px 50px;"></div>
        
        <div class="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <h2 class="cta-title text-5xl md:text-6xl lg:text-8xl font-black text-white mb-8 leading-tight">
            Ready to<br>
            <span class="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] bg-clip-text text-transparent">Dominate?</span>
          </h2>
          <p class="text-gray-400 text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
            Join thousands of tournament organizers who trust ATB SPORTS to deliver world-class experiences.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-5">
            <a href="/register" class="cta-btn-primary magnetic px-12 py-5 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-bold text-xl rounded-2xl hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] hover:scale-105 transition-all">
              Start Free Trial
            </a>
            <a href="/login" class="cta-btn-secondary px-12 py-5 border-2 border-white/20 text-white font-bold text-xl rounded-2xl hover:bg-white/10 hover:border-[#D4AF37]/50 transition-all">
              Login to Dashboard
            </a>
          </div>
        </div>
      </section>

      <!-- ========================================
          FOOTER
          ======================================== -->
      <footer class="relative pt-24 pb-10 bg-[#080808]">
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"></div>
        
        <div class="max-w-7xl mx-auto px-6 lg:px-8">
          <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
            
            <!-- Brand -->
            <div class="col-span-2 lg:col-span-1">
              <a href="#" class="flex items-center space-x-3 mb-6">
                <div class="w-12 h-12 flex items-center justify-center -ml-2">
                   <img src="/images/logo-gold.png" alt="ATB Sports" class="h-16 w-auto object-contain mix-blend-screen drop-shadow-[#D4AF37]">
                </div>
                <span class="text-2xl font-black tracking-widest text-[#D4AF37]">ATB SPORTS</span>
              </a>
              <p class="text-gray-500 text-sm leading-relaxed mb-6">
                The world's most advanced football tournament platform.
              </p>
              <!-- Social Links -->
              <div class="flex space-x-4">
                <a *ngFor="let social of socials" [href]="social.url" 
                   class="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#D4AF37] hover:text-black transition-all hover:-translate-y-1">
                  <div [innerHTML]="social.icon" class="w-5 h-5"></div>
                </a>
              </div>
            </div>
            
            <!-- Links -->
            <div *ngFor="let col of footerLinks">
              <h5 class="text-white font-bold uppercase tracking-widest text-sm mb-6">{{ col.title }}</h5>
              <ul class="space-y-4">
                <li *ngFor="let link of col.links">
                  <a [href]="link.href" class="text-gray-500 hover:text-[#D4AF37] transition-colors text-sm">{{ link.label }}</a>
                </li>
              </ul>
            </div>
            
            <!-- Newsletter -->
            <div class="col-span-2 lg:col-span-1">
              <h5 class="text-white font-bold uppercase tracking-widest text-sm mb-6">Newsletter</h5>
              <p class="text-gray-500 text-sm mb-4">Get updates on new features.</p>
              <div class="flex">
                <input type="email" placeholder="Email" 
                       class="flex-1 px-5 py-3.5 bg-white/5 border border-white/10 rounded-l-xl text-white text-sm focus:outline-none focus:border-[#D4AF37]/50">
                <button class="px-5 py-3.5 bg-[#D4AF37] text-black rounded-r-xl font-bold hover:bg-[#F4D03F] transition-colors">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Bottom Bar -->
          <div class="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p class="text-gray-600 text-xs tracking-widest font-medium">© 2026 ATB SPORTS. ALL RIGHTS RESERVED.</p>
            <p class="text-gray-600 text-xs">Premium Tournament Platform</p>
          </div>
        </div>
      </footer>
      
    </main>
  `,
  styles: [`
    :host { display: block; }
    
    /* Background Gradient Radial */
    .bg-gradient-radial {
      background: radial-gradient(ellipse at center, var(--tw-gradient-from) 0%, var(--tw-gradient-via) 50%, var(--tw-gradient-to) 100%);
    }
    
    /* Animated Gradient Text */
    .animate-gradient {
      animation: gradientShift 3s ease infinite;
      -webkit-text-fill-color: transparent;
    }
    
    @keyframes gradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    /* Floating Particles */
    .floating-dot {
      animation: floatUp linear infinite;
    }
    
    @keyframes floatUp {
      0% { transform: translateY(0) translateX(0); opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { transform: translateY(-150vh) translateX(50px); opacity: 0; }
    }
    
    /* Hero Orb Animation */
    .hero-orb {
      animation: orbPulse 8s ease-in-out infinite;
    }
    
    @keyframes orbPulse {
      0%, 100% { opacity: 0.5; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }
    
    /* Section Animations */
    .section-label, .section-title {
      opacity: 0;
      transform: translateY(40px);
    }
    
    .section-label.animate-in, .section-title.animate-in {
      opacity: 1;
      transform: translateY(0);
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Card Glow on Hover */
    .tournament-card:hover, .feature-card:hover, .pricing-card:hover, .testimonial-card:hover {
      box-shadow: 0 0 60px rgba(212, 175, 55, 0.15);
    }
    
    /* Stat Card Animation */
    .stat-card {
      opacity: 0;
      transform: translateY(30px);
    }
    
    .stat-card.animate-in {
      opacity: 1;
      transform: translateY(0);
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Marquee Animation */
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    
    .animate-marquee {
      animation: marquee 40s linear infinite;
    }
    
    .animate-marquee:hover {
      animation-play-state: paused;
    }
    
    /* Sponsor Card */
    .sponsor-card {
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `]
})
export class PremiumLandingComponent implements OnInit, AfterViewInit, OnDestroy {
  
  isScrolled = false;
  mobileMenuOpen = false;
  scrollHandler: (() => void) | null = null;
  
  particles: Array<{x: number, y: number, delay: number, duration: number}> = [];
  
  navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Tournaments', href: '#tournaments' },
    { label: 'Features', href: '#features' },
    { label: 'Sponsors', href: '#sponsors' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Contact', href: '#contact' },
  ];
  
  heroStats = [
    { value: '500+', label: 'Tournaments' },
    { value: '50K+', label: 'Teams' },
    { value: '1M+', label: 'Players' },
    { value: '$10M+', label: 'Prizes' },
  ];
  
  tournaments = [
    { 
      name: 'Champions League 2026', 
      description: 'The biggest club competition in world football. Top clubs battle for ultimate glory.', 
      date: 'March - June 2026', 
      prize: '$5M Prize Pool', 
      type: 'Professional',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600' 
    },
    { 
      name: 'World Cup Qualifiers', 
      description: 'National teams competing for a spot in the global showpiece.', 
      date: 'September - November 2026', 
      prize: '$2M Prize Pool', 
      type: 'International',
      image: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600' 
    },
    { 
      name: 'Youth Championship', 
      description: 'Future stars showcase their talent in this prestigious youth tournament.', 
      date: 'July - August 2026', 
      prize: '$500K Prize Pool', 
      type: 'Youth',
      image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600' 
    },
  ];
  
  features = [
    { 
      title: 'Real-time Match Tracking', 
      description: 'Live scores, stats, and updates streamed instantly to fans worldwide with sub-second latency.',
      icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>'
    },
    { 
      title: 'Team Management', 
      description: 'Comprehensive tools for roster management, player stats, transfers, and performance analytics.',
      icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>'
    },
    { 
      title: 'Venue Scheduling', 
      description: 'Smart scheduling algorithms with conflict resolution, capacity management, and logistics optimization.',
      icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>'
    },
    { 
      title: 'Prize Distribution', 
      description: 'Automated prize money distribution with transparent tracking and multi-currency support.',
      icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
    },
    { 
      title: 'Live Streaming', 
      description: 'Integrated streaming solutions with multi-camera support and global CDN delivery.',
      icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>'
    },
    { 
      title: 'Analytics Dashboard', 
      description: 'Deep insights into tournament performance, engagement metrics, and predictive analytics.',
      icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>'
    },
  ];
  
  aboutPoints = [
    'Industry-leading technology since 2020',
    'Trusted by 500+ tournament organizers',
    '24/7 dedicated expert support',
    'Secure enterprise-grade infrastructure',
  ];

  mockStandings = [
    { pos: 1, team: 'Real Madrid', pts: 72 },
    { pos: 2, team: 'Barcelona', pts: 68 },
    { pos: 3, team: 'Atletico', pts: 61 },
    { pos: 4, team: 'Villarreal', pts: 55 },
  ];

  mockStats = [
    { val: '18', label: 'Matches' },
    { val: '47', label: 'Goals' },
    { val: '94%', label: 'Uptime' },
  ];

  mockBars = [35, 50, 45, 78, 55, 82, 70, 95, 60, 88, 75, 100];
  mockMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  
  pricingPlans = [
    { 
      name: 'Starter', 
      description: 'Perfect for small tournaments', 
      price: '$49', 
      period: 'month', 
      featured: false, 
      cta: 'Get Started',
      ctaLink: '#',
      features: [
        'Up to 16 teams',
        'Basic analytics dashboard',
        'Email support',
        'Standard branding',
        '5GB storage',
      ] 
    },
    { 
      name: 'Professional', 
      description: 'For growing organizations', 
      price: '$149', 
      period: 'month', 
      featured: true, 
      cta: 'Start Free Trial',
      ctaLink: '#',
      features: [
        'Unlimited teams',
        'Advanced analytics & reports',
        'Priority 24/7 support',
        'Custom branding',
        'Live streaming integration',
        'API access',
        '50GB storage',
      ] 
    },
    { 
      name: 'Enterprise', 
      description: 'For large-scale events', 
      price: '$499', 
      period: 'month', 
      featured: false, 
      cta: 'Contact Us',
      ctaLink: '#',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'White-label options',
        'Custom integrations',
        'SLA guarantee',
        'On-premise deployment',
        'Unlimited storage',
      ] 
    },
  ];
  
  testimonials = [
    { 
      name: 'James Rodriguez', 
      role: 'Tournament Director, La Liga', 
      text: 'ATB SPORTS transformed how we manage our league. The platform handles everything from registration to live scoring seamlessly. Our fans love it!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face'
    },
    { 
      name: 'Sarah Chen', 
      role: 'Club Manager, FC United', 
      text: 'The best investment we made for our club. The team management tools are incredible, and our fans love the real-time updates.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face'
    },
    { 
      name: 'Michael Park', 
      role: 'League Commissioner, K-League', 
      text: 'We scaled from 20 to 200 teams in one year. ATB SPORTS handled it all without missing a beat. The support team is phenomenal!',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face'
    },
  ];
  
  sponsors = [
    { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
    { name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
    { name: 'Emirates', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg' },
    { name: 'Coca-Cola', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg' },
    { name: 'Red Bull', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Red_Bull_logo.svg' },
    { name: 'Qatar Airways', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Qatar_Airways_Logo.svg' },
    { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
    { name: 'Huawei', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Huawei_Logo.svg' },
  ];
  
  sponsorStats = [
    { value: '50+', label: 'Official Sponsors' },
    { value: '$5M+', label: 'Sponsorship Value' },
    { value: '100+', label: 'Countries Reached' },
    { value: '1B+', label: 'Brand Impressions' },
  ];
  
  socials = [
    { url: '#', icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>' },
    { url: '#', icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>' },
    { url: '#', icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.132 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.584-.072-4.85c-.052-1.17-.247-1.803-.413-2.227-.217-.562-.477-.96-.896-1.382-.419-.419-.824-.679-1.38-.896-.42-.164-1.057-.36-2.227-.413-1.266-.057-1.646-.07-4.85-.07s-3.584.015-4.85.072c-1.17.052-1.803.247-2.227.413-.562.217-.96.477-1.382.896-.419.419-.679.824-.896 1.38-.164.42-.36 1.057-.413 2.227-.057 1.266-.07 1.646-.07 4.85s.015 3.584.072 4.85c.052 1.17.247 1.803.413 2.227.217.562.477.96.896 1.382.419.419.824.679 1.38.896.42.164 1.057.36 2.227.413 1.266.057 1.646.07 4.85.07zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z"/></svg>' },
    { url: '#', icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>' },
  ];
  
  footerLinks = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'API', href: '#' },
        { label: 'Integrations', href: '#' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#contact' },
        { label: 'Contact', href: '#contact' },
        { label: 'Privacy', href: '#' },
        { label: 'Terms', href: '#' },
      ]
    },
  ];
  
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  
  constructor(private el: ElementRef) {
    this.generateParticles();
  }
  
  ngOnInit() {
    this.scrollHandler = this.onScroll.bind(this);
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
    }
  }
  
  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      // Ensure Angular has finished rendering and DOM is stable
      requestAnimationFrame(() => {
        this.initGSAP();
      });
    }
  }
  
  ngOnDestroy() {
    if (this.scrollHandler && typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
  
  private generateParticles() {
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 10 + Math.random() * 15
      });
    }
  }
  
  private initGSAP() {
    // ─── HERO ENTRANCE ───────────────────────────────────────────────────────
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl
      .from('.hero-badge',    { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' })
      .from('.hero-title',    { opacity: 0, y: 80, duration: 1, ease: 'power4.out' }, '-=0.4')
      .from('.hero-subtitle', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .from('.hero-buttons',  { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .to('.stat-card', { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' }, '-=0.3');

    // ─── HERO PARALLAX ───────────────────────────────────────────────────────
    gsap.utils.toArray('.hero-orb').forEach((orb: any) => {
      gsap.to(orb, { y: -160, scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });
    });
    gsap.utils.toArray('.parallax-layer').forEach((layer: any) => {
      const speed = parseFloat(layer.dataset.speed) || 0.5;
      gsap.to(layer, { y: -200 * speed, scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom top', scrub: true } });
    });

    // ─── SECTION LABELS / TITLES ─────────────────────────────────────────────
    gsap.utils.toArray('section').forEach((section: any) => {
      const label = section.querySelector('.section-label');
      const title = section.querySelector('.section-title');
      if (label) gsap.to(label, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 82%', toggleActions: 'play none none reverse' } });
      if (title) gsap.to(title, { opacity: 1, y: 0, duration: 0.9, delay: 0.1, ease: 'power4.out', scrollTrigger: { trigger: section, start: 'top 82%', toggleActions: 'play none none reverse' } });
    });

    // ─── TOURNAMENT CARDS ─────────────────────────────────────────────────────
    gsap.utils.toArray('.tournament-card').forEach((card: any, i: number) => {
      gsap.from(card, { opacity: 0, y: 70, rotateX: 8, duration: 0.9, delay: i * 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' } });
    });

    // ─── FEATURE CARDS ────────────────────────────────────────────────────────
    gsap.utils.toArray('.feature-card').forEach((card: any, i: number) => {
      gsap.from(card, { opacity: 0, y: 60, scale: 0.96, duration: 0.8, delay: (i % 3) * 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' } });
    });

    // ─── ABOUT SECTION ─────────────────────────────────────────────────────────
    const aboutTl = gsap.timeline({ scrollTrigger: { trigger: '#about', start: 'top 70%', toggleActions: 'play none none reverse' } });
    aboutTl
      .from('#about .order-2', { opacity: 0, x: -60, duration: 1, ease: 'power3.out' })
      .from('.about-bg-graph div', { scaleY: 0, opacity: 0, transformOrigin: 'bottom', duration: 1.5, stagger: 0.03, ease: 'power2.out' }, '-=0.8')
      .from('.about-card-3', { opacity: 0, scale: 0.8, duration: 0.8, ease: 'back.out(1.7)' }, '-=1.2')
      .from('.about-card-1', { opacity: 0, x: -30, y: 15, duration: 0.6, ease: 'power3.out' }, '-=0.6')
      .from('.about-graph-bar', { scaleY: 0, opacity: 0, transformOrigin: 'bottom', duration: 0.8, stagger: 0.04, ease: 'power3.out' }, '-=0.4')
      .from('.about-card-2', { opacity: 0, x: 30, y: -15, duration: 0.6, ease: 'power3.out' }, '-=0.4');

    // Continuous dynamic effects for graphs
    setTimeout(() => {
      gsap.to('.about-graph-bar', {
        scaleY: () => gsap.utils.random(0.3, 1.5),
        duration: () => gsap.utils.random(0.4, 0.8),
        yoyo: true,
        repeat: -1,
        repeatRefresh: true,
        transformOrigin: 'bottom',
        ease: 'power1.inOut',
        stagger: { amount: 0.5, from: "random" }
      });

      gsap.to('.about-bg-graph div', {
        scaleY: () => gsap.utils.random(0.7, 1.3),
        duration: () => gsap.utils.random(2, 3),
        yoyo: true,
        repeat: -1,
        repeatRefresh: true,
        transformOrigin: 'bottom',
        ease: 'sine.inOut',
        stagger: { amount: 1.5, from: "random" }
      });
    }, 2000);

    // Add parallax to background graph
    gsap.to('.about-bg-graph', {
      y: -80,
      scrollTrigger: {
        trigger: '#about',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    // ─── PRICING CARDS ────────────────────────────────────────────────────────
    gsap.utils.toArray('.pricing-card').forEach((card: any, i: number) => {
      gsap.from(card, { opacity: 0, y: 80, duration: 0.9, delay: i * 0.15, ease: 'power4.out',
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' } });
    });

    // ─── TESTIMONIAL CARDS ────────────────────────────────────────────────────
    gsap.utils.toArray('.testimonial-card').forEach((card: any, i: number) => {
      gsap.from(card, { opacity: 0, y: 60, scale: 0.95, duration: 0.8, delay: i * 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' } });
    });

    // ─── SPONSORS STATS COUNTER ─────────────────────────────────────────────
    gsap.from('.sponsor-stat-val', { opacity: 0, y: 30, duration: 0.7, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '#sponsors', start: 'top 80%', toggleActions: 'play none none reverse' } });

    // ─── CTA SECTION ──────────────────────────────────────────────────────────
    const ctaTl = gsap.timeline({ scrollTrigger: { trigger: '#cta', start: 'top 75%', toggleActions: 'play none none reverse' } });
    ctaTl
      .from('.cta-title',      { opacity: 0, y: 80, duration: 1, ease: 'power4.out' })
      .from('.cta-subtitle',   { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .from('.cta-btn-primary, .cta-btn-secondary', { opacity: 0, y: 30, stagger: 0.15, duration: 0.7, ease: 'back.out(1.4)' }, '-=0.4');

    // ─── FOOTER FADE ──────────────────────────────────────────────────────────
    gsap.from('footer > div > div', { opacity: 0, y: 40, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: 'footer', start: 'top 90%', toggleActions: 'play none none reverse' } });

    // ─── MAGNETIC BUTTONS ─────────────────────────────────────────────────────
    gsap.utils.toArray('.magnetic').forEach((btn: any) => {
      btn.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      });
    });

    // Refresh ScrollTrigger to ensure accurate positions after rendering
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }
  
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }
  
  get navClasses(): string {
    return 'bg-black/60 backdrop-blur-xl border border-[#D4AF37]/30 shadow-2xl shadow-black/50';
  }
  
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  
  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
  
  onSubmit() {
    console.log('Form submitted:', this.contactForm);
    alert('Thank you for your message! We will get back to you soon.');
    this.contactForm = { name: '', email: '', subject: '', message: '' };
  }
}
