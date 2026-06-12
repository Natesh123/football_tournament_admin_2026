import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

export interface LegalSection {
  heading: string;
  body: string[];
}

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-neutral-950 text-gold-100 font-['Inter',sans-serif] relative overflow-hidden">

      <!-- Subtle grid backdrop -->
      <div class="absolute inset-0 opacity-[0.03] pointer-events-none"
           style="background-image: linear-gradient(rgba(250,204,21,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(250,204,21,0.5) 1px, transparent 1px); background-size: 50px 50px;"></div>

      <div class="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">

        <!-- Brand / back -->
        <a routerLink="/" class="inline-flex items-center gap-3 mb-10 group">
          <img src="images/logo-gold.png" alt="ATB Sport Logo" class="h-9 w-auto object-contain mix-blend-screen">
          <span class="text-base font-black tracking-widest text-[#D4AF37]">ATB SPORTS</span>
        </a>

        <!-- Header -->
        <header class="mb-10 border-b border-white/5 pb-6">
          <h1 class="text-3xl md:text-4xl font-black text-white tracking-tight">{{ title }}</h1>
          <p class="text-sm text-zinc-500 mt-2">Last updated: {{ lastUpdated }}</p>
        </header>

        <!-- Body -->
        <article class="space-y-8">
          @for (section of sections; track section.heading) {
            <section>
              <h2 class="text-lg font-bold text-gold-400 mb-3">{{ section.heading }}</h2>
              @for (para of section.body; track $index) {
                <p class="text-sm md:text-base text-zinc-400 leading-relaxed mb-3">{{ para }}</p>
              }
            </section>
          }
        </article>

        <!-- Footer nav -->
        <div class="mt-14 pt-6 border-t border-white/5">
          <a routerLink="/"
             class="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-gold-400/30 text-sm font-bold uppercase tracking-widest text-zinc-300 hover:text-gold-400 rounded-xl transition-all duration-300">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  `
})
export class LegalPageComponent {
  @Input() title = '';
  @Input() lastUpdated = 'June 2026';
  @Input() sections: LegalSection[] = [];
}
