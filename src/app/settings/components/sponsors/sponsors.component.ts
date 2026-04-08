import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Sponsor, SponsorService } from '../../services/sponsor.service';
import { SponsorModalComponent } from './sponsor-modal.component';
import { environment } from '../../../../environments/environment';
import { UiService } from '../../../services/ui.service';
import { ConfirmModalComponent } from '../../../components/shared/confirm-modal.component';

@Component({
  selector: 'app-sponsors',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, SponsorModalComponent, ConfirmModalComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white">{{ 'SETTINGS.SPONSORS.TITLE' | translate }}</h2>
          <p class="text-zinc-400 mt-1">{{ 'SETTINGS.SPONSORS.SUBTITLE' | translate }}</p>
        </div>
        <button (click)="openModal()" 
                class="flex items-center gap-2 px-5 py-2.5 bg-gold-400 hover:bg-gold-500 text-black font-bold rounded-xl transition-all shadow-lg shadow-gold-400/10 active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          {{ 'SETTINGS.SPONSORS.CREATE' | translate }}
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-black-card border border-black-border rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center">
        <div class="relative flex-1 w-full">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input type="text" [(ngModel)]="filters.search" (ngModelChange)="loadSponsors()"
                 class="w-full bg-black-input border border-black-border rounded-lg pl-10 pr-4 py-2 text-white focus:border-gold-400 outline-none transition-all"
                 [placeholder]="'SETTINGS.SPONSORS.SEARCH' | translate">
        </div>
        <div class="flex gap-2 w-full md:w-auto">
          <select [(ngModel)]="filters.status" (ngModelChange)="loadSponsors()"
                  class="bg-black-input border border-black-border rounded-lg px-4 py-2 text-white focus:border-gold-400 outline-none transition-all flex-1 md:flex-none">
            <option value="">{{ 'TOURNAMENTS.FILTER_STATUSES.ALL' | translate }}</option>
            <option value="active">{{ 'COMMON.STATUS.ACTIVE' | translate }}</option>
            <option value="inactive">{{ 'COMMON.STATUS.INACTIVE' | translate }}</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-black-card border border-black-border rounded-xl overflow-hidden shadow-lg border-separate">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-white/5 text-zinc-400 text-xs uppercase tracking-wider">
                <th class="px-6 py-4 font-semibold">{{ 'SETTINGS.SPONSORS.FIELDS.LOGO' | translate }}</th>
                <th class="px-6 py-4 font-semibold">{{ 'SETTINGS.SPONSORS.FIELDS.NAME' | translate }}</th>
                <th class="px-6 py-4 font-semibold">{{ 'SETTINGS.SPONSORS.FIELDS.TYPE' | translate }}</th>
                <th class="px-6 py-4 font-semibold">{{ 'SETTINGS.SPONSORS.FIELDS.EMAIL' | translate }}</th>
                <th class="px-6 py-4 font-semibold">{{ 'SETTINGS.SPONSORS.FIELDS.PHONE' | translate }}</th>
                <th class="px-6 py-4 font-semibold">{{ 'SETTINGS.SPONSORS.FIELDS.TOURNAMENTS' | translate }}</th>
                <th class="px-6 py-4 font-semibold text-center">{{ 'SETTINGS.SPONSORS.FIELDS.STATUS' | translate }}</th>
                <th class="px-6 py-4 font-semibold text-right"></th> 
              </tr>
            </thead>
            <tbody class="divide-y divide-black-border">
              <tr *ngFor="let sponsor of sponsors" class="hover:bg-white/[0.02] transition-colors group">
                <td class="px-6 py-4">
                  <div class="w-12 h-12 rounded-lg bg-white/5 border border-black-border overflow-hidden p-1 shadow-sm">
                    <img *ngIf="sponsor.logo" [src]="apiUrl + sponsor.logo" class="w-full h-full object-contain">
                    <div *ngIf="!sponsor.logo" class="w-full h-full flex items-center justify-center text-zinc-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-white font-medium">{{ sponsor.name }}</td>
                <td class="px-6 py-4">
                  <span *ngIf="sponsor.type" class="px-2 py-1 rounded-md bg-gold-400/10 text-gold-400 text-xs font-semibold uppercase tracking-wide">
                    {{ sponsor.type }}
                  </span>
                </td>
                <td class="px-6 py-4 text-zinc-400 text-sm">{{ sponsor.email || 'N/A' }}</td>
                <td class="px-6 py-4 text-zinc-400 text-sm">{{ sponsor.phone || 'N/A' }}</td>
                <td class="px-6 py-4 text-zinc-400 text-sm">
                  <div class="line-clamp-2" [title]="sponsor.tournamentNames?.join(', ')">
                    {{ sponsor.tournamentNames?.join(', ') || '0 ' + ('TOURNAMENTS.TITLE' | translate) }}
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                        [ngClass]="sponsor.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'">
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="sponsor.status === 'active' ? 'bg-green-500' : 'bg-red-500'"></span>
                    {{ sponsor.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-2 transition-opacity">
                    <button (click)="openModal(sponsor)" class="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button (click)="openDeleteConfirm(sponsor)" class="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="sponsors.length === 0">
                <td colspan="8" class="px-6 py-12 text-center">
                  <div class="flex flex-col items-center gap-2 text-zinc-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p>{{ 'SETTINGS.SPONSORS.EMPTY' | translate }}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <app-sponsor-modal *ngIf="showModal" 
                       [sponsor]="selectedSponsor" 
                       (close)="closeModal()" 
                       (saved)="onSaved()">
    </app-sponsor-modal>

    <app-confirm-modal *ngIf="showDeleteConfirm"
                       [show]="showDeleteConfirm"
                       [title]="'SETTINGS.SPONSORS.DELETE_TITLE' | translate"
                       [message]="'SETTINGS.SPONSORS.DELETE_CONFIRM' | translate"
                       (onConfirm)="deleteSponsor()"
                       (onCancel)="showDeleteConfirm = false">
    </app-confirm-modal>
  `
})
export class SponsorsComponent implements OnInit {
  private sponsorService = inject(SponsorService);
  public ui = inject(UiService);
  
  sponsors: Sponsor[] = [];
  apiUrl = environment.apiBaseUrl.replace('/api', '');
  showModal = false;
  selectedSponsor: Sponsor | null = null;
  
  // Delete confirmation
  showDeleteConfirm = false;
  sponsorToDelete: Sponsor | null = null;
  filters = {
    search: '',
    status: ''
  };

  ngOnInit() {
    this.loadSponsors();
  }

  loadSponsors() {
    this.sponsorService.getAll(this.filters).subscribe({
      next: (data: any) => {
        console.log('Sponsors data received:', data);
        this.sponsors = data.data || data;
      },
      error: (err) => console.error('Error loading sponsors:', err)
    });
  }

  openModal(sponsor: Sponsor | null = null) {
    this.selectedSponsor = sponsor;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedSponsor = null;
  }

  openDeleteConfirm(sponsor: Sponsor) {
    this.sponsorToDelete = sponsor;
    this.showDeleteConfirm = true;
  }

  deleteSponsor() {
    if (!this.sponsorToDelete?.id) return;
    
    this.ui.startAction();
    this.sponsorService.delete(this.sponsorToDelete.id).subscribe({
      next: () => {
        this.loadSponsors();
        this.showDeleteConfirm = false;
        this.sponsorToDelete = null;
        this.ui.endAction();
        this.ui.showToast('Sponsor deleted successfully', 'success');
      },
      error: (err) => {
        console.error('Error deleting sponsor:', err);
        this.ui.endAction();
        this.ui.showToast('Failed to delete sponsor', 'error');
      }
    });
  }

  onSaved() {
    this.loadSponsors();
    this.ui.showToast('Sponsor saved successfully', 'success');
  }
}
