import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Standing } from '../../../../models/portal.model';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="teams" class="section-padding bg-navy">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div class="space-y-4">
            <h2 class="text-gold uppercase tracking-[0.15em] font-semibold text-sm">Competitors</h2>
            <h3 class="text-4xl font-bold text-white">Registered Teams</h3>
            <div class="w-16 h-1 bg-gold rounded-full bg-gradient-to-r from-gold to-gold-dark"></div>
          </div>
          <div class="text-gray-500 text-sm hidden md:block">
            Showing all {{ teams.length }} confirmed teams
          </div>
        </div>

        <div *ngIf="teams.length > 0; else noTeams" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-10">
          <div *ngFor="let team of teams" 
               class="group relative flex flex-col items-center bg-navy-lighter p-8 rounded-3xl border border-gold/5 hover:border-gold/30 hover:scale-105 transition-all duration-300 hover:shadow-[0_0_50px_rgba(212,175,55,0.05)]">
            
            <div class="relative mb-6">
              <div class="absolute inset-0 bg-gold/5 blur-2xl rounded-full scale-150 rotate-45"></div>
              <div class="relative w-24 h-24 overflow-hidden rounded-2xl bg-navy/50 p-2 border border-gold/20 flex items-center justify-center">
                <img [src]="team.teamLogo || '/assets/images/default-team.png'" 
                     [alt]="team.teamName" 
                     class="w-full h-full object-contain filter drop-shadow-xl group-hover:scale-110 transition-transform duration-300"
                     onerror="this.src='https://cdn-icons-png.flaticon.com/512/53/53283.png'">
              </div>
            </div>
            
            <h4 class="text-white font-bold text-lg text-center leading-tight mb-2 group-hover:text-gold transition-colors">{{ team.teamName }}</h4>
            <div class="flex items-center space-x-2">
              <span class="w-2 h-2 rounded-full bg-green-500"></span>
              <span class="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Confirmed</span>
            </div>

            <!-- Hover Decoration -->
            <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <svg class="w-5 h-5 text-gold/30" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
               </svg>
            </div>
          </div>
        </div>

        <ng-template #noTeams>
          <div class="text-center py-20 bg-navy-lighter rounded-3xl border-2 border-dashed border-gold/10">
            <div class="w-20 h-20 bg-gold/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-gold/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p class="text-gray-500 font-medium">Be the first team to register!</p>
            <a href="#register" class="mt-4 inline-block text-gold hover:underline font-bold">Register Now</a>
          </div>
        </ng-template>
      </div>
    </section>
  `,
  styles: []
})
export class TeamsListComponent {
  @Input() teams: Standing[] = [];
}
