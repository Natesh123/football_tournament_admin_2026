import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute } from '@angular/router';
import { TeamService } from './team.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-team-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, TranslateModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      @if (team(); as t) {
        <div class="bg-black-card border border-black-border rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div class="w-24 h-24 rounded-2xl bg-black-main border border-black-border flex items-center justify-center overflow-hidden shrink-0">
             @if (teamService.fullUrl(t.logoUrl); as logoSrc) {
                <img [src]="logoSrc" [alt]="t.name" class="w-full h-full object-cover"
                     (error)="logoError($event)">
             } @else {
                <span class="text-2xl font-black text-zinc-500 select-none">
                  {{ t.shortName || t.name.slice(0,2) | uppercase }}
                </span>
             }
          </div>
          <div class="text-center md:text-left">
            <h1 class="text-3xl font-bold text-white mb-1">{{ t.name }}</h1>
            <p class="text-zinc-400">{{ 'TEAM_LAYOUT.TEAM_MANAGER' | translate }}</p>
          </div>
          <div class="ml-auto flex items-center gap-3">
             <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                [ngClass]="{
                  'bg-green-500/10 text-green-500 border-green-500/20': t.status === 'approved',
                  'bg-yellow-500/10 text-yellow-500 border-yellow-500/20': t.status === 'pending',
                  'bg-red-500/10 text-red-500 border-red-500/20': t.status === 'rejected'
                }">
                {{ t.status }}
             </span>
          </div>
        </div>
      }

      <div class="flex flex-col md:flex-row gap-6 min-h-[500px]">
        <!-- Sidebar -->
        <aside class="w-full md:w-64 shrink-0">
          <div class="sticky top-28 bg-black-card border border-black-border rounded-xl overflow-hidden shadow-lg">
            <nav class="flex flex-col p-2 space-y-1">
              <a routerLink="overview" 
                 routerLinkActive="bg-gold-400/10 text-gold-400 border-gold-400/50" 
                 class="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent transition-all font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {{ 'TEAM_LAYOUT.NAV.OVERVIEW' | translate }}
              </a>
              <a routerLink="members" 
                 routerLinkActive="bg-gold-400/10 text-gold-400 border-gold-400/50" 
                 class="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent transition-all font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {{ 'TEAM_LAYOUT.NAV.MEMBERS' | translate }}
              </a>
              <a routerLink="matches" 
                 routerLinkActive="bg-gold-400/10 text-gold-400 border-gold-400/50" 
                 class="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent transition-all font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ 'TEAM_LAYOUT.NAV.MATCHES' | translate }}
              </a>
              <a routerLink="statistics" 
                 routerLinkActive="bg-gold-400/10 text-gold-400 border-gold-400/50" 
                 class="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent transition-all font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {{ 'TEAM_LAYOUT.NAV.STATISTICS' | translate }}
              </a>
              <a routerLink="gallery" 
                 routerLinkActive="bg-gold-400/10 text-gold-400 border-gold-400/50" 
                 class="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent transition-all font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ 'TEAM_LAYOUT.NAV.GALLERY' | translate }}
              </a>
            </nav>
          </div>
        </aside>

        <!-- Content Area -->
        <main class="flex-1 min-w-0">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class TeamLayoutComponent {
  private route = inject(ActivatedRoute);
  protected teamService = inject(TeamService);

  private teamId = this.route.snapshot.paramMap.get('id');

  team = toSignal(this.teamService.getById(this.teamId!));

  logoError(event: Event) {
    // Hide broken image — the @else block with initials will show instead
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
