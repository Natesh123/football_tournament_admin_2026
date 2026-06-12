import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import { TeamService, Team } from './team.service';
import { TranslateModule } from '@ngx-translate/core';
import { CreateTeamModalComponent } from './components/create-team-modal/create-team-modal.component';
import { Subject, switchMap, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-team-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, TranslateModule, CreateTeamModalComponent],
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
             @if (t.teamType) {
               <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-white/5 text-zinc-400 border-black-border">
                  {{ t.teamType }}
               </span>
             }

             <!-- Only admins manage the shared global team registry. -->
             @if (isAdmin) {
             <button (click)="openEditModal()"
                class="flex items-center gap-2 px-4 py-2 bg-black-main border border-black-border hover:border-gold-400/50 text-zinc-300 hover:text-white rounded-xl transition-all font-medium text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {{ 'COMMON.EDIT' | translate }}
             </button>

             <button (click)="deleteTeam()" [disabled]="isDeleting"
                class="flex items-center gap-2 px-4 py-2 bg-black-main border border-black-border hover:border-red-500/50 text-zinc-300 hover:text-red-400 rounded-xl transition-all font-medium text-sm disabled:opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {{ 'COMMON.DELETE' | translate }}
             </button>
             }

             <button (click)="close()"
                class="flex items-center gap-2 px-4 py-2 bg-black-main border border-black-border hover:border-gold-400/50 text-zinc-300 hover:text-white rounded-xl transition-all font-medium text-sm">
                {{ 'COMMON.CLOSE' | translate }}
             </button>
          </div>
        </div>
      }

      <app-create-team-modal 
        [isOpen]="isEditModalOpen" 
        [mode]="'edit'" 
        [teamToEdit]="team()"
        (closeModal)="closeEditModal()"
        (teamUpdated)="onTeamUpdated()">
      </app-create-team-modal>

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
  private router = inject(Router);
  protected teamService = inject(TeamService);
  private auth = inject(AuthService);

  // Only admins manage the shared global team registry; organizers view read-only.
  get isAdmin(): boolean {
    return this.auth.isAdmin;
  }

  private teamId = this.route.snapshot.paramMap.get('id')!;
  private refreshSubject = new Subject<void>();
  isDeleting = false;
  
  team = toSignal<Team | undefined>(
    this.refreshSubject.pipe(
      startWith(null),
      switchMap(() => this.teamService.getById(this.teamId))
    )
  );

  isEditModalOpen = false;

  openEditModal() {
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
  }

  onTeamUpdated() {
    this.refreshSubject.next();
  }

  close() {
    this.router.navigate(['/admin/teams']);
  }

  deleteTeam() {
    const t = this.team();
    const name = t?.name ?? 'this team';
    if (!confirm(`Delete "${name}"? This will permanently remove the team, its members and gallery. This cannot be undone.`)) {
      return;
    }
    this.isDeleting = true;
    this.teamService.delete(this.teamId).subscribe({
      next: () => this.router.navigate(['/admin/teams']),
      error: () => { this.isDeleting = false; }
    });
  }

  logoError(event: Event) {
    // Hide broken image — the @else block with initials will show instead
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
