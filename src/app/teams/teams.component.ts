import { Component, inject, signal, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamService, Team } from './team.service';
import { CreateTeamModalComponent } from './components/create-team-modal/create-team-modal.component';
import { ConfirmModalComponent } from '../components/shared/confirm-modal.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { API_URL } from '../core/config/app.config';
import { LoaderComponent } from '../components/loader/loader.component';
import { UiService } from '../services/ui.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateTeamModalComponent, ConfirmModalComponent, TranslateModule, LoaderComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">{{ 'TEAMS.TITLE' | translate }}</h1>
          <p class="text-zinc-400 mt-1">{{ 'TEAMS.SUBTITLE' | translate }}</p>
        </div>
        <!-- Only admins manage the shared global team registry. -->
        @if (isAdmin) {
        <button (click)="openCreateModal()"
          class="px-5 py-2.5 bg-gold-400 hover:bg-gold-500 text-black font-bold rounded-xl transition-all shadow-lg shadow-gold-400/20 flex items-center gap-2 self-start sm:self-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          {{ 'TEAMS.CREATE' | translate }}
        </button>
        }
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
      @if (isLoading()) {
        <div class="h-64 flex items-center justify-center">
          <app-loader></app-loader>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (team of teams(); track team.id) {
          <div (click)="openTeamDashboard(team.id)" class="group relative bg-black-card border border-black-border hover:border-gold-400/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-gold-400/5 hover:-translate-y-1 cursor-pointer">
            <div class="flex items-start justify-between mb-4">
              <div class="w-16 h-16 rounded-xl bg-black-main border border-black-border flex items-center justify-center overflow-hidden shrink-0 group-hover:border-gold-400/30 transition-colors">
                @if (team.logoUrl) {
                  <img [src]="getImageUrl(team.logoUrl)" [alt]="team.name" class="w-full h-full object-cover">
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              </div>

              <div class="flex items-center gap-2 shrink-0">
                @if (team.teamType) {
                  <div class="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-zinc-400">
                    {{ team.teamType }}
                  </div>
                }

                <!-- Action menu — only admins manage the shared team registry. -->
                @if (isAdmin) {
                <div class="relative">
                  <button type="button" (click)="toggleMenu($event, team.id)"
                    [class.bg-white/10]="openMenuId() === team.id"
                    [class.text-white]="openMenuId() === team.id"
                    class="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                    [attr.aria-label]="'COMMON.EDIT' | translate">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>

                  @if (openMenuId() === team.id) {
                    <div (click)="$event.stopPropagation()"
                      class="absolute right-0 top-full mt-1.5 w-44 z-50 bg-black-card border border-black-border rounded-xl shadow-xl shadow-black/50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                      <button type="button" (click)="openEditModal($event, team)"
                        class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {{ 'COMMON.EDIT' | translate }}
                      </button>
                      <button type="button" (click)="confirmDelete($event, team)"
                        class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {{ 'COMMON.DELETE' | translate }}
                      </button>
                    </div>
                  }
                </div>
                }
              </div>
            </div>

            <h3 class="text-lg font-bold text-white mb-1 truncate">{{ team.name }}</h3>
            <p class="text-sm text-zinc-400 mb-4 truncate">{{ team.contactEmail || ('TEAMS.CARD.NO_EMAIL' | translate) }}</p>

            <div class="pt-4 border-t border-black-border flex items-center justify-between text-sm">
              <span class="text-zinc-500">{{ 'TEAMS.CARD.CAPTAIN' | translate }}: <span class="text-zinc-300 font-medium">{{ team.captainName || ('COMMON.NA' | translate) }}</span></span>
            </div>
          </div>
        } @empty {
          <div class="col-span-full py-20 flex flex-col items-center justify-center text-center bg-black-card/50 border border-dashed border-black-border/50 rounded-2xl">
            <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-5">
              <svg class="w-10 h-10 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.25" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-zinc-300 mb-2">{{ 'TEAMS.EMPTY' | translate }}</h3>
            @if (isAdmin) {
            <p class="text-sm text-zinc-500 mb-6 max-w-xs">Create your first team to start managing rosters, schedules, and match results.</p>
            <button (click)="openCreateModal()"
                    class="px-6 py-2.5 bg-gold-400 hover:bg-gold-500 text-black font-bold rounded-xl transition-all shadow-lg shadow-gold-400/20 flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              {{ 'TEAMS.CREATE' | translate }}
            </button>
            }
          </div>
        }
      </div>
      }
    </div>

    <!-- Create / Edit Modal -->
    <app-create-team-modal
      [isOpen]="isModalOpen()"
      [mode]="modalMode()"
      [teamToEdit]="teamToEdit()"
      (closeModal)="closeModal()"
      (teamCreated)="onTeamCreated($event)"
      (teamUpdated)="onTeamUpdated()">
    </app-create-team-modal>

    <!-- Delete Confirmation -->
    <app-confirm-modal
      [show]="isConfirmOpen()"
      [title]="'TEAMS.DELETE_TITLE' | translate"
      [message]="deleteMessage()"
      (onConfirm)="executeDelete()"
      (onCancel)="cancelDelete()">
    </app-confirm-modal>
  `
})
export class TeamsComponent {
  private teamService = inject(TeamService);
  private router = inject(Router);
  private ui = inject(UiService);
  private translate = inject(TranslateService);
  private auth = inject(AuthService);

  // Only admins manage the shared global team registry; organizers view read-only.
  get isAdmin(): boolean {
    return this.auth.isAdmin;
  }

  teams = signal<Team[]>([]);
  isLoading = signal(true);
  searchQuery = '';

  // Create / edit modal state
  isModalOpen = signal(false);
  modalMode = signal<'create' | 'edit'>('create');
  teamToEdit = signal<Team | null>(null);

  // Per-card action menu
  openMenuId = signal<string | null>(null);

  // Delete confirmation state
  isConfirmOpen = signal(false);
  teamToDelete = signal<Team | null>(null);
  deleteMessage = signal('');

  constructor() {
    this.loadTeams();
  }

  loadTeams() {
    this.isLoading.set(true);
    this.teamService.getAll(this.searchQuery).subscribe({
      next: (data) => {
        this.teams.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onSearch() {
    // Simple debounce could be added here
    this.loadTeams();
  }

  openCreateModal() {
    this.modalMode.set('create');
    this.teamToEdit.set(null);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.teamToEdit.set(null);
  }

  onTeamCreated(newTeamId: string) {
    this.closeModal();
    this.router.navigate(['/admin/teams', newTeamId]);
  }

  onTeamUpdated() {
    this.closeModal();
    this.ui.showToast(this.translate.instant('TEAMS.UPDATED'), 'success');
    this.loadTeams();
  }

  openTeamDashboard(id: string) {
    this.router.navigate(['/admin/teams', id]);
  }

  // --- Per-card action menu ---

  toggleMenu(event: MouseEvent, id: string) {
    event.stopPropagation();
    this.openMenuId.set(this.openMenuId() === id ? null : id);
  }

  @HostListener('document:click')
  closeMenu() {
    if (this.openMenuId() !== null) {
      this.openMenuId.set(null);
    }
  }

  openEditModal(event: MouseEvent, team: Team) {
    event.stopPropagation();
    this.openMenuId.set(null);
    this.modalMode.set('edit');
    this.teamToEdit.set(team);
    this.isModalOpen.set(true);
  }

  // --- Delete ---

  confirmDelete(event: MouseEvent, team: Team) {
    event.stopPropagation();
    this.openMenuId.set(null);
    this.teamToDelete.set(team);
    this.deleteMessage.set(
      this.translate.instant('TEAMS.DELETE_MESSAGE', { name: team.name })
    );
    this.isConfirmOpen.set(true);
  }

  cancelDelete() {
    this.isConfirmOpen.set(false);
    this.teamToDelete.set(null);
  }

  executeDelete() {
    const team = this.teamToDelete();
    if (!team) return;
    this.teamService.delete(team.id).subscribe({
      next: () => {
        this.teams.update(list => list.filter(t => t.id !== team.id));
        this.ui.showToast(this.translate.instant('TEAMS.DELETED'), 'success');
        this.cancelDelete();
      },
      error: () => {
        this.ui.showToast(this.translate.instant('TEAMS.DELETE_FAILED'), 'error');
        this.cancelDelete();
      }
    });
  }

  getImageUrl(path?: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  }
}
