import { Component, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-sponsor-banners',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="py-24 relative overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 bg-gradient-to-b from-navy to-navy-lighter"></div>
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
      
      <!-- Fade Edges -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 left-0 w-40 h-full bg-gradient-to-r from-navy-lighter to-transparent z-10"></div>
        <div class="absolute top-0 right-0 w-40 h-full bg-gradient-to-l from-navy-lighter to-transparent z-10"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative mb-16">
        <div class="text-center">
          <span class="inline-flex items-center px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-semibold tracking-wide mb-4">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            Official Partners
          </span>
          <div class="w-16 h-1 bg-gradient-to-r from-gold to-gold/50 mx-auto rounded-full mt-4"></div>
        </div>
      </div>
      
      <!-- Marquee -->
      <div class="relative">
        <div class="flex animate-marquee hover:pause">
          <div *ngFor="let sponsor of sponsors; let i = index" 
               class="flex-shrink-0 mx-6 group cursor-pointer">
            <div class="w-52 h-28 bg-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center p-6 border border-white/10 hover:border-gold/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:scale-110 hover:bg-white/10">
              <img [src]="sponsor.logo" [alt]="sponsor.name" 
                   class="h-10 object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
            </div>
          </div>
          <!-- Duplicate for seamless loop -->
          <div *ngFor="let sponsor of sponsors; let i = index" 
               class="flex-shrink-0 mx-6 group cursor-pointer">
            <div class="w-52 h-28 bg-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center p-6 border border-white/10 hover:border-gold/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:scale-110 hover:bg-white/10">
              <img [src]="sponsor.logo" [alt]="sponsor.name" 
                   class="h-10 object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
            </div>
          </div>
        </div>
      </div>
      
      <!-- Stats -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/30 transition-all group">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gold/20 to-transparent flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span class="text-4xl font-black text-gold gradient-text block mb-2">50+</span>
            <span class="text-gray-500 text-xs uppercase tracking-widest font-semibold">Partner Brands</span>
          </div>
          <div class="text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/30 transition-all group">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gold/20 to-transparent flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-4xl font-black text-gold gradient-text block mb-2">$2M</span>
            <span class="text-gray-500 text-xs uppercase tracking-widest font-semibold">Total Sponsorship</span>
          </div>
          <div class="text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/30 transition-all group">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gold/20 to-transparent flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span class="text-4xl font-black text-gold gradient-text block mb-2">100K+</span>
            <span class="text-gray-500 text-xs uppercase tracking-widest font-semibold">Brand Reach</span>
          </div>
          <div class="text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/30 transition-all group">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gold/20 to-transparent flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg class="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-4xl font-black text-gold gradient-text block mb-2">25+</span>
            <span class="text-gray-500 text-xs uppercase tracking-widest font-semibold">Countries</span>
          </div>
        </div>
      </div>
    </section>
  `,
    styles: [`
    :host {
      display: block;
    }
    .gradient-text {
      background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 50%, #D4AF37 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    @keyframes marquee {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-50%);
      }
    }
    .animate-marquee {
      animation: marquee 40s linear infinite;
      width: max-content;
    }
    .animate-marquee:hover {
      animation-play-state: paused;
    }
    @media (prefers-reduced-motion: reduce) {
      .animate-marquee {
        animation: none;
      }
    }
  `]
})
export class SponsorBannersComponent implements OnInit, OnDestroy {
  private el: ElementRef;
  private renderer: Renderer2;
  private observer: IntersectionObserver | null = null;
  
  sponsors = [
    { name: 'Nike', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
    { name: 'Adidas', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
    { name: 'Emirates', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg' },
    { name: 'Coca-Cola', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg' },
    { name: 'Red Bull', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Red_Bull_logo.svg' },
    { name: 'Qatar Airways', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Qatar_Airways_Logo.svg' },
    { name: 'Huawei', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Huawei_Logo.svg' },
    { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' },
  ];

  constructor(el: ElementRef, renderer: Renderer2) {
    this.el = el;
    this.renderer = renderer;
  }

  ngOnInit() {
    this.initScrollReveal();
  }

  private initScrollReveal() {
    const options: IntersectionObserverInit = {
      threshold: 0.2
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
    elements.forEach((el: Element) => {
      this.observer?.observe(el);
    });
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
