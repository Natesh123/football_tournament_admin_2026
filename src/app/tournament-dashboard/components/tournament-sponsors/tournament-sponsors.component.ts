import { Component, OnInit, inject, signal, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SponsorService, Sponsor, TournamentSponsor } from '../../../settings/services/sponsor.service';
import { UiService } from '../../../services/ui.service';
import { environment } from '../../../../environments/environment';
import { ConfirmModalComponent } from '../../../components/shared/confirm-modal.component';

@Component({
  selector: 'app-tournament-sponsors',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmModalComponent],
  templateUrl: './tournament-sponsors.component.html'
})
export class TournamentSponsorsComponent implements OnInit, OnChanges {
  @Input() tournamentId!: string;

  private sponsorService = inject(SponsorService);
  public ui = inject(UiService);

  mappings = signal<TournamentSponsor[]>([]);
  availableSponsors = signal<Sponsor[]>([]);
  isLoading = signal(true);
  isAssignModalOpen = signal(false);
  selectedSponsorId = signal<number | null>(null);
  
  // Delete confirmation
  showRemoveConfirm = false;
  mappingToRemove: TournamentSponsor | null = null;

  apiUrl = environment.apiUrl.replace('/api', '');

  ngOnInit() {
    if (this.tournamentId) {
      this.loadData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tournamentId'] && !changes['tournamentId'].isFirstChange()) {
      this.loadData();
    }
  }

  loadData() {
    if (!this.tournamentId) return;
    this.isLoading.set(true);

    // Load mappings for this tournament
    this.sponsorService.getTournamentSponsors(parseInt(this.tournamentId)).subscribe({
      next: (mappings) => {
        this.mappings.set(mappings);
        
        // Load all sponsors to filter available ones
        this.sponsorService.getAll({ status: 'active' }).subscribe({
          next: (allSponsors) => {
            const mappedSponsorIds = new Set(mappings.map(m => m.sponsor_id));
            this.availableSponsors.set(allSponsors.filter(s => !mappedSponsorIds.has(s.id!)));
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error('Error loading sponsors:', err);
            this.isLoading.set(false);
          }
        });
      },
      error: (err) => {
        console.error('Error loading mappings:', err);
        this.isLoading.set(false);
      }
    });
  }

  openAssignModal() {
    this.selectedSponsorId.set(null);
    this.isAssignModalOpen.set(true);
  }

  assignSponsor() {
    const sponsorId = this.selectedSponsorId();
    if (!sponsorId || !this.tournamentId) return;

    this.ui.startAction();
    this.sponsorService.assignSponsor(parseInt(this.tournamentId), sponsorId).subscribe({
      next: () => {
        this.loadData();
        this.isAssignModalOpen.set(false);
        this.ui.endAction();
        this.ui.showToast('Sponsor assigned successfully', 'success');
      },
      error: (err) => {
        console.error('Error assigning sponsor:', err);
        this.ui.endAction();
        this.ui.showToast('Failed to assign sponsor', 'error');
      }
    });
  }

  openRemoveConfirm(mapping: TournamentSponsor) {
    this.mappingToRemove = mapping;
    this.showRemoveConfirm = true;
  }

  removeMapping() {
    if (!this.mappingToRemove) return;

    this.ui.startAction();
    this.sponsorService.removeSponsorMapping(this.mappingToRemove.id).subscribe({
      next: () => {
        this.loadData();
        this.showRemoveConfirm = false;
        this.mappingToRemove = null;
        this.ui.endAction();
        this.ui.showToast('Sponsor removed from tournament', 'success');
      },
      error: (err) => {
        console.error('Error removing sponsor:', err);
        this.ui.endAction();
        this.ui.showToast('Failed to remove sponsor', 'error');
      }
    });
  }
}
