import { Component, Input, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Presentation, Tournament } from '../../../../models/portal.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="about" class="relative py-32 overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 bg-gradient-to-b from-navy via-navy-lighter to-navy"></div>
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
      
      <!-- Decorative Orbs -->
      <div class="absolute top-1/4 -left-40 w-80 h-80 bg-gold/10 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-1/4 -right-40 w-96 h-96 bg-gold/5 rounded-full blur-[120px]"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <!-- Section Header -->
        <div class="text-center mb-20">
          <span class="inline-flex items-center px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-semibold tracking-wide mb-6">
            <span class="w-2 h-2 bg-gold rounded-full mr-2"></span>
            Discover More
          </span>
          <h2 class="text-5xl md:text-7xl font-black text-white mb-4">About the Tournament</h2>
          <p class="text-gray-400 text-lg max-w-2xl mx-auto">Everything you need to know about the most prestigious football event of 2026</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <!-- Left Column - Description -->
          <div class="space-y-8">
            <div class="relative">
              <div class="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-gold via-gold/50 to-transparent rounded-full"></div>
              <p class="text-gray-300 text-xl leading-relaxed pl-8">
                {{ presentation?.welcomeMessage || 'The Champions League 2026 is designed to showcase the best talent in our region and bring the football community together. Our mission is to provide a world-class platform for competitive sportsmanship, community engagement, and athletic excellence.' }}
              </p>
            </div>
            
            <!-- Feature Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="relative">
                  <div class="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg class="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 class="text-white font-bold text-xl mb-3">High Intensity</h4>
                  <p class="text-gray-500 text-sm leading-relaxed">Competitive matches designed to push players to their absolute limits.</p>
                </div>
              </div>

              <div class="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="relative">
                  <div class="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg class="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 class="text-white font-bold text-xl mb-3">Grand Rewards</h4>
                  <p class="text-gray-500 text-sm leading-relaxed">Substantial prize pool and accolades for winners and participants.</p>
                </div>
              </div>

              <div class="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="relative">
                  <div class="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg class="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 class="text-white font-bold text-xl mb-3">Community</h4>
                  <p class="text-gray-500 text-sm leading-relaxed">Join a vibrant football community and make lasting connections.</p>
                </div>
              </div>

              <div class="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="relative">
                  <div class="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg class="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 class="text-white font-bold text-xl mb-3">Fair Play</h4>
                  <p class="text-gray-500 text-sm leading-relaxed">Strict regulations ensuring a level playing field for all teams.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Stats Cards -->
          <div class="relative">
            <!-- Main Visual Card -->
            <div class="relative">
              <div class="absolute -inset-6 bg-gradient-to-r from-gold/20 via-gold/5 to-gold/20 rounded-[3rem] blur-3xl"></div>
              
              <div class="relative rounded-[2rem] bg-gradient-to-br from-navy to-navy-lighter p-10 border border-gold/20 shadow-2xl overflow-hidden">
                <!-- Background Pattern -->
                <div class="absolute inset-0 opacity-5" style="background-image: radial-gradient(circle at 2px 2px, rgba(212,175,55,0.5) 1px, transparent 0); background-size: 24px 24px;"></div>
                
                <div class="relative grid grid-cols-2 gap-8">
                  <div class="text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/30 transition-all group">
                    <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gold/20 to-transparent flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg class="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span class="text-5xl font-black gradient-text block mb-2">21</span>
                    <span class="text-gray-400 text-sm uppercase tracking-widest font-semibold">March 2026</span>
                    <p class="text-gold text-xs mt-2 font-medium">Kick Off Date</p>
                  </div>
                  
                  <div class="text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/30 transition-all group mt-12">
                    <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gold/20 to-transparent flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg class="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <span class="text-5xl font-black gradient-text block mb-2">88</span>
                    <span class="text-gray-400 text-sm uppercase tracking-widest font-semibold">Trophies</span>
                    <p class="text-gold text-xs mt-2 font-medium">To Be Won</p>
                  </div>
                  
                  <div class="text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/30 transition-all group">
                    <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gold/20 to-transparent flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg class="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span class="text-5xl font-black gradient-text block mb-2">12</span>
                    <span class="text-gray-400 text-sm uppercase tracking-widest font-semibold">Venues</span>
                    <p class="text-gold text-xs mt-2 font-medium">Across Regions</p>
                  </div>
                  
                  <div class="text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/30 transition-all group mt-12">
                    <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gold/20 to-transparent flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg class="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span class="text-5xl font-black gradient-text block mb-2">45</span>
                    <span class="text-gray-400 text-sm uppercase tracking-widest font-semibold">Days</span>
                    <p class="text-gold text-xs mt-2 font-medium">Duration</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Floating Badge -->
            <div class="absolute -top-4 -right-4 bg-gold text-navy px-6 py-3 rounded-2xl font-black text-sm shadow-lg">
              EARLY BIRD SPECIAL
            </div>
          </div>
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
  `]
})
export class AboutTournamentComponent implements OnInit, OnDestroy {
  @Input() presentation?: Presentation;
  @Input() tournament?: Tournament;
  
  private el: ElementRef;
  private renderer: Renderer2;
  private observer: IntersectionObserver | null = null;

  constructor(el: ElementRef, renderer: Renderer2) {
    this.el = el;
    this.renderer = renderer;
  }

  ngOnInit() {
    this.initScrollReveal();
  }

  private initScrollReveal() {
    const options: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'revealed');
          this.renderer.addClass(entry.target, 'animate-fadeInUp');
          this.observer?.unobserve(entry.target);
        }
      });
    }, options);

    const elements = this.el.nativeElement.querySelectorAll('.scroll-reveal');
    elements.forEach((el: Element, index: number) => {
      this.renderer.setStyle(el, 'transition-delay', `${index * 0.1}s`);
      this.observer?.observe(el);
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
