import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Presentation, Tournament } from '../../../../models/portal.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="about" class="section-padding bg-navy-lighter relative">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16 space-y-4">
          <h2 class="text-gold uppercase tracking-[0.2em] font-semibold text-sm">Everything you need to know</h2>
          <h3 class="text-4xl md:text-5xl font-bold text-white">About the Tournament</h3>
          <div class="w-24 h-1.5 bg-gold mx-auto rounded-full mt-4 bg-gradient-to-r from-gold via-gold-light to-gold-dark"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div class="space-y-8">
            <p class="text-gray-400 text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:text-gold first-letter:mr-3 first-letter:float-left">
              {{ presentation?.welcomeMessage || 'The Champions League 2026 is designed to showcase the best talent in our region and bring the football community together. Our mission is to provide a world-class platform for competitive sportsmanship, community engagement, and athletic excellence.' }}
            </p>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="p-6 rounded-2xl bg-navy border border-gold/10 hover:border-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all group">
                <div class="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <svg class="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 class="text-white font-bold mb-2">High Intensity</h4>
                <p class="text-gray-500 text-sm">Competitive matches designed to push players to their absolute limits.</p>
              </div>

              <div class="p-6 rounded-2xl bg-navy border border-gold/10 hover:border-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all group">
                <div class="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <svg class="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 class="text-white font-bold mb-2">Grand Rewards</h4>
                <p class="text-gray-500 text-sm">Substantial prize pool and accolades for winners and participants.</p>
              </div>
            </div>
          </div>

          <div class="relative">
             <div class="grid grid-cols-2 gap-4 pb-4">
                <div class="aspect-square bg-navy border border-gold/10 rounded-3xl p-8 flex flex-col justify-center items-center text-center space-y-2">
                   <span class="text-4xl font-bold text-gold">21</span>
                   <span class="text-gray-500 text-xs uppercase font-bold tracking-widest">March 2026</span>
                   <span class="text-white text-sm font-semibold">KICK OFF</span>
                </div>
                <div class="aspect-square bg-navy border border-gold/10 rounded-3xl p-8 flex flex-col justify-center items-center text-center space-y-2 translate-y-8">
                   <span class="text-4xl font-bold text-gold">88</span>
                   <span class="text-gray-500 text-xs uppercase font-bold tracking-widest">Trophies</span>
                   <span class="text-white text-sm font-semibold">FOR THE BEST</span>
                </div>
             </div>
             <div class="absolute -z-10 w-full h-full border-2 border-gold/5 top-4 left-4 rounded-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class AboutTournamentComponent {
  @Input() presentation?: Presentation;
  @Input() tournament?: Tournament;
}
