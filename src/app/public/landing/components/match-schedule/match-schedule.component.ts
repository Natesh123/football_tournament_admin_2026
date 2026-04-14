import { Component, Input, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match } from '../../../../models/portal.model';

@Component({
  selector: 'app-match-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="schedule" class="relative py-32 overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 bg-gradient-to-b from-navy via-navy-lighter to-navy"></div>
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
      
      <!-- Decorative Elements -->
      <div class="absolute top-20 -left-20 w-64 h-64 bg-gold/10 rounded-full blur-[100px]"></div>
      <div class="absolute bottom-20 -right-20 w-80 h-80 bg-gold/5 rounded-full blur-[120px]"></div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <!-- Header -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-6">
          <div>
            <span class="inline-flex items-center px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-semibold tracking-wide mb-4">
              <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Tourney Timeline
            </span>
            <h2 class="text-5xl md:text-6xl font-black text-white mb-2">Match Schedule</h2>
            <div class="w-20 h-1 bg-gradient-to-r from-gold to-gold/50 rounded-full"></div>
          </div>
          
          <div class="flex gap-3 bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
            <button class="px-6 py-3 rounded-xl bg-gold text-navy font-bold text-sm shadow-lg hover:shadow-gold/30 transition-all">Live & Recent</button>
            <button class="px-6 py-3 rounded-xl text-gray-400 font-bold text-sm hover:text-gold hover:bg-white/5 transition-all">Upcoming</button>
          </div>
        </div>

        <!-- Live Matches -->
        <div *ngIf="liveMatches.length > 0; else noLiveMatches" class="mb-12">
          <div class="flex items-center space-x-3 mb-6">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <h3 class="text-white font-bold text-lg uppercase tracking-wider">Live Matches</h3>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div *ngFor="let m of liveMatches; let i = index" 
                  class="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 hover:border-red-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(220,38,38,0.2)]">
               
               <!-- Live Indicator -->
               <div class="absolute top-4 right-4 flex items-center space-x-2 bg-red-600/90 backdrop-blur-sm px-3 py-1 rounded-full">
                 <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                 <span class="text-white text-xs font-bold uppercase tracking-wider">{{ m.minute }}'</span>
               </div>
               
               <div class="p-8">
                 <div class="flex items-center justify-between">
                   <div class="flex items-center space-x-4">
                     <div class="relative">
                       <div class="w-16 h-16 bg-gradient-to-br from-gold/20 to-transparent rounded-2xl flex items-center justify-center p-3 border border-gold/20 group-hover:border-gold/50 transition-all group-hover:scale-110">
                         <img [src]="m.homeTeamLogo || '/assets/images/default-team.png'" 
                              [alt]="m.homeTeamName" 
                              class="w-full h-full object-contain"
                              onerror="this.src='https://cdn-icons-png.flaticon.com/512/53/53283.png'">
                       </div>
                     </div>
                     <div>
                       <span class="text-white font-bold text-xl block">{{ m.homeTeamName }}</span>
                       <span class="text-gray-500 text-sm">Home</span>
                     </div>
                   </div>

                   <div class="text-center px-6">
                     <div class="text-5xl font-black text-white flex items-center space-x-3">
                       <span class="text-gold">{{ m.homeScore }}</span>
                       <span class="text-gray-600">:</span>
                       <span class="text-gold">{{ m.awayScore }}</span>
                     </div>
                   </div>

                   <div class="flex items-center space-x-4 flex-row-reverse">
                     <div class="relative">
                       <div class="w-16 h-16 bg-gradient-to-br from-gold/20 to-transparent rounded-2xl flex items-center justify-center p-3 border border-gold/20 group-hover:border-gold/50 transition-all group-hover:scale-110">
                         <img [src]="m.awayTeamLogo || '/assets/images/default-team.png'" 
                              [alt]="m.awayTeamName" 
                              class="w-full h-full object-contain"
                              onerror="this.src='https://cdn-icons-png.flaticon.com/512/53/53283.png'">
                       </div>
                     </div>
                     <div class="text-right">
                       <span class="text-white font-bold text-xl block">{{ m.awayTeamName }}</span>
                       <span class="text-gray-500 text-sm">Away</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
        <ng-template #noLiveMatches></ng-template>

        <!-- Recent Results -->
        <div *ngIf="completedMatches.length > 0; else noRecent">
          <h3 class="text-white font-bold text-lg uppercase tracking-wider mb-6 flex items-center">
            <svg class="w-5 h-5 mr-3 text-gold" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Recent Results
          </h3>
          
          <div class="space-y-4">
             <div *ngFor="let m of completedMatches; let i = index" 
                  class="group relative rounded-2xl p-6 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gold/30 hover:bg-white/10 transition-all duration-300">
               
               <div class="flex items-center justify-between">
                 <div class="flex items-center space-x-6 flex-1">
                   <div class="flex items-center space-x-4 flex-1">
                     <div class="w-12 h-12 bg-gradient-to-br from-gold/10 to-transparent rounded-xl flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                        <img [src]="m.homeTeamLogo || '/assets/images/default-team.png'" 
                             class="w-full h-full object-contain"
                             onerror="this.src='https://cdn-icons-png.flaticon.com/512/53/53283.png'">
                     </div>
                     <span class="text-gray-300 font-semibold text-lg">{{ m.homeTeamName }}</span>
                   </div>
                   
                   <div class="flex items-center space-x-4">
                     <div class="text-2xl font-black text-white px-6 py-3 bg-navy rounded-xl border border-gold/20 hover:border-gold/50 transition-all">
                        {{ m.homeScore }}
                     </div>
                     <span class="text-gray-600 text-xl font-bold">-</span>
                     <div class="text-2xl font-black text-white px-6 py-3 bg-navy rounded-xl border border-gold/20 hover:border-gold/50 transition-all">
                        {{ m.awayScore }}
                     </div>
                   </div>
                   
                   <div class="flex items-center space-x-4 flex-1 justify-end">
                     <span class="text-gray-300 font-semibold text-lg text-right">{{ m.awayTeamName }}</span>
                     <div class="w-12 h-12 bg-gradient-to-br from-gold/10 to-transparent rounded-xl flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                        <img [src]="m.awayTeamLogo || '/assets/images/default-team.png'" 
                             class="w-full h-full object-contain"
                             onerror="this.src='https://cdn-icons-png.flaticon.com/512/53/53283.png'">
                     </div>
                   </div>
                 </div>
                 
                 <div class="ml-6 text-right">
                   <span class="text-gray-500 text-sm font-medium">{{ m.startTime | date:'MMM d' }}</span>
                   <span class="text-gray-600 text-xs block">{{ m.startTime | date:'shortTime' }}</span>
                 </div>
               </div>
             </div>
          </div>
        </div>

        <ng-template #noRecent>
          <div class="text-center py-20 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
             <div class="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-gold/20 to-transparent flex items-center justify-center">
               <svg class="w-12 h-12 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
             </div>
             <p class="text-white font-bold text-xl mb-2">No matches completed yet</p>
             <p class="text-gray-500">Check back soon for exciting fixtures!</p>
          </div>
        </ng-template>
      </div>
    </section>
  `,
  styles: []
})
export class MatchScheduleComponent implements OnInit, OnDestroy {
  @Input() liveMatches: Match[] = [];
  @Input() completedMatches: Match[] = [];
  
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
