import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamService, Team } from './team.service';
import { CreateTeamModalComponent } from './components/create-team-modal/create-team-modal.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateTeamModalComponent, TranslateModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">{{ 'TEAMS.TITLE' | translate }}</h1>
          <p class="text-zinc-400 mt-1">{{ 'TEAMS.SUBTITLE' | translate }}</p>
        </div>
        <button (click)="openCreateModal()" 
          class="px-5 py-2.5 bg-gold-400 hover:bg-gold-500 text-black font-bold rounded-xl transition-all shadow-lg shadow-gold-400/20 flex items-center gap-2 self-start sm:self-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          {{ 'TEAMS.CREATE' | translate }}
        </button>
      </div>

      <!-- Search & Filter -->
      <div class="bg-black-card border border-black-border rounded-2xl p-4">
        <div class="relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onSearch()" 
            [placeholder]="'TEAMS.SEARCH_PLACEHOLDER' | translate" 
            class="w-full bg-black-main border border-black-border rounded-xl pl-12 pr-4 py-3 text-white placeholder-zinc-500 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all">
        </div>
      </div>

      <!-- Teams Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        @for (team of teams(); track team.id) {
          <div (click)="openTeamDashboard(team.id)" class="group bg-black-card border border-black-border hover:border-gold-400/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-gold-400/5 hover:-translate-y-1 cursor-pointer">
            <div class="flex items-start justify-between mb-4">
              <div class="w-16 h-16 rounded-xl bg-black-main border border-black-border flex items-center justify-center overflow-hidden shrink-0 group-hover:border-gold-400/30 transition-colors">
                @if (team.logoUrl) {
                  <img [src]="team.logoUrl" [alt]="team.name" class="w-full h-full object-cover">
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              </div>
              <div class="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                [ngClass]="{
                  'bg-green-500/10 text-green-500': team.status === 'approved',
                  'bg-yellow-500/10 text-yellow-500': team.status === 'pending',
                  'bg-red-500/10 text-red-500': team.status === 'rejected'
                }">
                {{ team.status }}
              </div>
            </div>
            
            <h3 class="text-lg font-bold text-white mb-1 truncate">{{ team.name }}</h3>
            <p class="text-sm text-zinc-400 mb-4 truncate">{{ team.contactEmail || ('TEAMS.CARD.NO_EMAIL' | translate) }}</p>
            
            <div class="pt-4 border-t border-black-border flex items-center justify-between text-sm">
              <span class="text-zinc-500">{{ 'TEAMS.CARD.CAPTAIN' | translate }}: <span class="text-zinc-300 font-medium">{{ team.captainName || ('COMMON.NA' | translate) }}</span></span>
              <!-- <button class="text-gold-400 hover:text-white font-medium transition-colors">Details</button> -->
            </div>
          </div>
        } @empty {
          <div class="col-span-full py-12 text-center text-zinc-500 bg-black-card/50 border border-black-border/50 rounded-2xl border-dashed">
            <p class="text-lg">{{ 'TEAMS.EMPTY' | translate }}</p>
          </div>
        }
      </div>
    </div>

    <!-- Create Modal -->
    <app-create-team-modal 
      [isOpen]="isCreateModalOpen()" 
      (closeModal)="closeCreateModal()"
      (teamCreated)="onTeamCreated($event)">
    </app-create-team-modal>
  `
})
export class TeamsComponent {
  private teamService = inject(TeamService);
  private router = inject(Router);

  teams = signal<Team[]>([]);
  searchQuery = '';
  isCreateModalOpen = signal(false);

  constructor() {
    this.loadTeams();
  }

  loadTeams() {
    this.teamService.getAll(this.searchQuery).subscribe({
      next: (data) => this.teams.set(data),
      error: (err) => console.error('Failed to load teams', err)
    });
  }

  onSearch() {
    // Simple debounce could be added here
    this.loadTeams();
  }

  openCreateModal() {
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal() {
    this.isCreateModalOpen.set(false);
  }

  onTeamCreated(newTeamId: string) {
    this.closeCreateModal();
    this.router.navigate(['/teams', newTeamId]);
  }

  openTeamDashboard(id: string) {
    this.router.navigate(['/teams', id]);
  }
}
