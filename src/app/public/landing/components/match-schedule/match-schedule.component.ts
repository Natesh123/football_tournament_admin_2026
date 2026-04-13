import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Match } from '../../../../models/portal.model';

@Component({
  selector: 'app-match-schedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="schedule" class="section-padding bg-navy-lighter">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div class="space-y-4">
            <h2 class="text-gold uppercase tracking-[0.15em] font-semibold text-sm">Tourney Timeline</h2>
            <h3 class="text-4xl font-bold text-white">Match Schedule</h3>
            <div class="w-16 h-1 bg-gold rounded-full bg-gradient-to-r from-gold to-gold-dark"></div>
          </div>
          <div class="flex space-x-2 bg-navy p-1 rounded-xl border border-gold/10">
            <button class="px-6 py-2 rounded-lg bg-gold text-navy font-bold text-sm shadow-lg">Live & Recent</button>
            <button class="px-6 py-2 rounded-lg text-gray-400 font-bold text-sm hover:text-gold transition-colors">Upcoming</button>
          </div>
        </div>

        <!-- Live Matches -->
        <div *ngIf="liveMatches.length > 0; else noLiveMatches" class="mb-16 space-y-6">
          <div class="flex items-center space-x-2 mb-4">
             <span class="relative flex h-3 w-3">
               <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
               <span class="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
             </span>
             <h4 class="text-white font-bold uppercase tracking-widest text-xs">Live Matches</h4>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div *ngFor="let m of liveMatches" 
                  class="bg-navy border-l-4 border-l-red-600 rounded-2xl p-6 flex items-center justify-between shadow-[0_0_50px_rgba(220,38,38,0.05)] group">
                <div class="flex items-center space-x-4 w-5/12">
                   <div class="w-12 h-12 bg-navy-lighter rounded-full flex items-center justify-center p-2 border border-gold/10">
                      <img [src]="m.homeTeamLogo || '/assets/images/default-team.png'" 
                           [alt]="m.homeTeamName" 
                           class="w-full h-full object-contain"
                           onerror="this.src='https://cdn-icons-png.flaticon.com/512/53/53283.png'">
                   </div>
                   <span class="text-white font-bold block truncate">{{ m.homeTeamName }}</span>
                </div>

                <div class="flex flex-col items-center justify-center w-2/12">
                   <div class="text-3xl font-black text-white flex items-center space-x-2">
                      <span>{{ m.homeScore }}</span>
                      <span class="text-gray-600 font-normal">:</span>
                      <span>{{ m.awayScore }}</span>
                   </div>
                   <span class="text-red-600 text-[10px] font-bold uppercase tracking-widest animate-pulse mt-2">{{ m.minute }}' LIVE</span>
                </div>

                <div class="flex flex-row-reverse items-center space-x-reverse space-x-4 w-5/12">
                   <div class="w-12 h-12 bg-navy-lighter rounded-full flex items-center justify-center p-2 border border-gold/10">
                      <img [src]="m.awayTeamLogo || '/assets/images/default-team.png'" 
                           [alt]="m.awayTeamName" 
                           class="w-full h-full object-contain"
                           onerror="this.src='https://cdn-icons-png.flaticon.com/512/53/53283.png'">
                   </div>
                   <span class="text-white font-bold block truncate text-right">{{ m.awayTeamName }}</span>
                </div>
             </div>
          </div>
        </div>
        <ng-template #noLiveMatches></ng-template>

        <!-- Recent Results -->
        <div *ngIf="completedMatches.length > 0; else noRecent" class="space-y-6">
          <h4 class="text-white font-bold uppercase tracking-widest text-xs mb-4">Recent Results</h4>
          <div class="space-y-4">
             <div *ngFor="let m of completedMatches" 
                  class="bg-navy border border-gold/5 rounded-2xl p-6 flex items-center justify-between hover:border-gold/20 transition-all">
                <div class="flex items-center space-x-8 w-1/2">
                   <div class="flex items-center space-x-4 flex-1">
                      <div class="w-10 h-10 bg-navy-lighter rounded-full flex items-center justify-center p-2">
                         <img [src]="m.homeTeamLogo || '/assets/images/default-team.png'" 
                              class="w-full h-full object-contain"
                              onerror="this.src='https://cdn-icons-png.flaticon.com/512/53/53283.png'">
                      </div>
                      <span class="text-gray-300 font-medium">{{ m.homeTeamName }}</span>
                   </div>
                   <div class="text-xl font-bold text-white px-4 py-1 bg-navy-lighter rounded-lg min-w-[80px] text-center border border-gold/5">
                      {{ m.homeScore }} - {{ m.awayScore }}
                   </div>
                </div>

                <div class="flex items-center justify-end space-x-8 w-1/2">
                    <div class="flex items-center space-x-4 flex-1 justify-end">
                      <span class="text-gray-300 font-medium text-right">{{ m.awayTeamName }}</span>
                      <div class="w-10 h-10 bg-navy-lighter rounded-full flex items-center justify-center p-2">
                         <img [src]="m.awayTeamLogo || '/assets/images/default-team.png'" 
                              class="w-full h-full object-contain"
                              onerror="this.src='https://cdn-icons-png.flaticon.com/512/53/53283.png'">
                      </div>
                   </div>
                   <div class="text-[10px] text-gray-500 font-bold uppercase tracking-widest w-20 text-right">
                      {{ m.startTime | date:'shortTime' }}
                   </div>
                </div>
             </div>
          </div>
        </div>

        <ng-template #noRecent>
          <div class="text-center py-10 bg-navy p-10 rounded-2xl border border-gold/5">
             <p class="text-gray-500 font-bold text-sm tracking-widest uppercase">No matches completed yet</p>
          </div>
        </ng-template>
      </div>
    </section>
  `,
  styles: []
})
export class MatchScheduleComponent {
  @Input() liveMatches: Match[] = [];
  @Input() completedMatches: Match[] = [];
}
