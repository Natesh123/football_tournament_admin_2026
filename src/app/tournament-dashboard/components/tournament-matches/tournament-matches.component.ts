import { Component, Input, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TournamentService } from '../../../tournament/tournament.service';
@Component({
    selector: 'app-tournament-matches',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tournament-matches.component.html'
})
export class TournamentMatchesComponent implements OnInit {
    @Input() tournamentId!: string;

    private router = inject(Router);
    private tournamentService = inject(TournamentService);
    structure = signal<any>(null);
    isLoading = signal(true);

    activeTab = signal<'upcoming' | 'live' | 'past'>('upcoming');

    filteredMatches = computed(() => {
        const matches = this.structure()?.matches || [];
        const now = new Date();
        const tab = this.activeTab();

        return matches.filter((match: any) => {
            const status = (match.status || 'scheduled').toLowerCase();
            const startTime = match.startTime ? new Date(match.startTime) : null;
            let category = 'upcoming';

            if (status === 'completed' || status === 'finished' || status === 'past') {
                category = 'past';
            } else if (status === 'live' || status === 'in_progress') {
                // Primary is status, secondary is time validation for stuck matches
                if (startTime) {
                    const maxEndTime = new Date(startTime.getTime() + 300 * 60000); // 5 hours max for live
                    if (now > maxEndTime) {
                        category = 'past';
                    } else {
                        category = 'live';
                    }
                } else {
                    category = 'live';
                }
            } else {
                // Not started (scheduled)
                if (!startTime) {
                    category = 'upcoming';
                } else {
                    const endTime = new Date(startTime.getTime() + 150 * 60000); // 2.5 hours assumed duration
                    if (now > endTime) {
                        category = 'past';
                    } else if (now >= startTime && now <= endTime) {
                        category = 'live';
                    } else {
                        category = 'upcoming';
                    }
                }
            }

            return category === tab;
        });
    });

    ngOnInit() {
        if (this.tournamentId) {
            this.loadMatches();
        }
    }

    loadMatches() {
        this.isLoading.set(true);
        this.tournamentService.getStructure(this.tournamentId).subscribe({
            next: (data: any) => {
                this.structure.set(data);
                this.isLoading.set(false);
            },
            error: (err: any) => {
                console.error("Failed to load tournament matches", err);
                this.isLoading.set(false);
            }
        });
    }

    // Modal state for viewing/editing match
    editingMatch: any = null;
    isSavingMatch = signal(false);

    openMatchDetails(matchId: string) {
        if (!this.tournamentId) return;
        this.router.navigate(['/tournaments', this.tournamentId, 'matches', matchId]);
    }

    openMatchEditor(match: any) {
        this.editingMatch = {
            ...match,
            matchTime: match.startTime ? new Date(match.startTime).toISOString().slice(0, 16) : ''
        };
    }

    closeMatchEditor() {
        this.editingMatch = null;
    }

    saveMatchSchedule() {
        if (!this.editingMatch) return;
        this.isSavingMatch.set(true);

        const payload = {
            venue: this.editingMatch.venue,
            matchTime: this.editingMatch.matchTime || null,
            breakDuration: this.editingMatch.breakDuration,
            events: this.editingMatch.events,
            matchReferees: this.editingMatch.matchReferees
        };

        this.tournamentService.updateMatchSchedule(this.editingMatch.id, payload).subscribe({
            next: (updatedMatch: any) => {
                const struct = this.structure();
                if (struct && struct.matches) {
                    const idx = struct.matches.findIndex((m: any) => m.id === this.editingMatch.id);
                    if (idx !== -1) {
                        struct.matches[idx] = { ...struct.matches[idx], ...updatedMatch.data };
                        this.structure.set({ ...struct });
                    }
                }
                this.isSavingMatch.set(false);
                this.closeMatchEditor();
            },
            error: () => this.isSavingMatch.set(false)
        });
    }
}
