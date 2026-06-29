import { Component, OnInit, inject, signal, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SponsorService, Sponsor, TournamentSponsor } from '../../../settings/services/sponsor.service';
import { UiService } from '../../../services/ui.service';
import { environment } from '../../../../environments/environment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SponsorModalComponent } from '../../../settings/components/sponsors/sponsor-modal.component';

@Component({
  selector: 'app-tournament-sponsors',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, SponsorModalComponent],
  templateUrl: './tournament-sponsors.component.html'
})
export class TournamentSponsorsComponent implements OnInit, OnChanges {
  @Input() tournamentId!: string;

  private sponsorService = inject(SponsorService);
  public ui = inject(UiService);
  private translate = inject(TranslateService);

  mappings = signal<TournamentSponsor[]>([]);
  availableSponsors = signal<Sponsor[]>([]);
  isLoading = signal(true);
  isAssignModalOpen = signal(false);
  isCreateModalOpen = signal(false);
  isEditModalOpen = signal(false);
  editingSponsor = signal<Sponsor | null>(null);
  selectedSponsorId = signal<number | null>(null);
  
  // Modals

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
            this.isLoading.set(false);
          }
        });
      },
      error: (err) => {
        this.isLoading.set(false);
      }
    });
  }

  openAssignModal() {
    this.selectedSponsorId.set(null);
    this.isAssignModalOpen.set(true);
  }

  openCreateModal() {
    this.isCreateModalOpen.set(true);
  }

  openEditModal(mapping: TournamentSponsor) {
    if (!mapping?.sponsor) return;
    this.editingSponsor.set(mapping.sponsor);
    this.isEditModalOpen.set(true);
  }

  closeEditModal() {
    this.isEditModalOpen.set(false);
    this.editingSponsor.set(null);
  }

  onSponsorUpdated(_sponsor: Sponsor) {
    this.closeEditModal();
    this.loadData();
    this.ui.showToast('Sponsor updated successfully', 'success');
  }

  onSponsorCreated(sponsor: Sponsor) {
    if (sponsor.id && this.tournamentId) {
      this.ui.startAction();
      this.sponsorService.assignSponsor(parseInt(this.tournamentId), sponsor.id).subscribe({
        next: () => {
          this.loadData();
          this.ui.endAction();
          this.ui.showToast('Sponsor created and assigned successfully', 'success');
        },
        error: (err) => {
          console.error('Error assigning created sponsor:', err);
          this.loadData(); // Still refresh even if assignment fails
          this.ui.endAction();
          this.ui.showToast('Sponsor created but failed to assign', 'error');
        }
      });
    } else {
      this.loadData();
    }
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
        this.ui.endAction();
        this.ui.showToast('Failed to assign sponsor', 'error');
      }
    });
  }

  async removeMapping(mapping: TournamentSponsor) {
    if (!mapping) return;

    const title = this.translate.instant('TOURNAMENT_DASHBOARD.SPONSORS.CONFIRM_REMOVE_TITLE');
    const message = this.translate.instant('TOURNAMENT_DASHBOARD.SPONSORS.CONFIRM_REMOVE_MSG');

    const confirmed = await this.ui.confirmAction(title, message);

    if (confirmed) {
      this.ui.startAction();
      this.sponsorService.removeSponsorMapping(mapping.id).subscribe({
        next: () => {
          this.loadData();
          this.ui.endAction();
          this.ui.showToast('Sponsor removed from tournament', 'success');
        },
        error: (err) => {
          this.ui.endAction();
          this.ui.showToast('Failed to remove sponsor', 'error');
        }
      });
    }
  }
}
