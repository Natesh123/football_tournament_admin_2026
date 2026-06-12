import { Component, Input, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TournamentService } from '../../../tournament/tournament.service';
import { UiService } from '../../../services/ui.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { formatLiveClock } from '../../../core/utils/live-clock.util';
@Component({
    selector: 'app-tournament-matches',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: './tournament-matches.component.html'
})
export class TournamentMatchesComponent implements OnInit, OnDestroy {
    @Input() tournamentId!: string;

    private router = inject(Router);
    private tournamentService = inject(TournamentService);
    public ui = inject(UiService);
    private translate = inject(TranslateService);
    structure = signal<any>(null);
    isLoading = signal(true);

    activeTab = signal<'upcoming' | 'live' | 'past'>('upcoming');

    // Ticks every second so live clocks in the list keep running
    now = signal<number>(Date.now());
    private clockTimer: any;

    liveClock(match: any): string {
        return formatLiveClock(match, this.now());
    }

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
                category = 'live';
            } else {
                // Not started (scheduled) - prioritize status over time bounds 
                // so newly generated matches don't immediately drop into "live" or "past"
                category = 'upcoming';
            }

            return category === tab;
        });
    });

    ngOnInit() {
        if (this.tournamentId) {
            this.loadMatches();
        }
        this.clockTimer = setInterval(() => this.now.set(Date.now()), 1000);
    }

    ngOnDestroy() {
        if (this.clockTimer) clearInterval(this.clockTimer);
    }

    loadMatches() {
        this.isLoading.set(true);
        this.tournamentService.getStructure(this.tournamentId).subscribe({
            next: (data: any) => {
                this.structure.set(data);
                this.isLoading.set(false);
            },
            error: (err: any) => {
                this.isLoading.set(false);
            }
        });
    }

    // Modal state for viewing/editing match
    editingMatch: any = null;

    openMatchDetails(matchId: string) {
        if (!this.tournamentId) return;
        this.router.navigate(['/admin/tournaments', this.tournamentId, 'matches', matchId]);
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
        this.ui.startAction();

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
                this.ui.endAction();
                this.showToast('TOURNAMENT_DASHBOARD.TOAST.MATCH_UPDATE_SUCCESS', 'success');
                this.closeMatchEditor();
            },
            error: (err: any) => {
                this.ui.endAction();
                this.showToast('TOURNAMENT_DASHBOARD.TOAST.MATCH_UPDATE_ERROR', 'error');
            }
        });
    }

    showToast(key: string, type: 'success' | 'error' | 'info' = 'success') {
        this.ui.showToast(key, type);
    }
}
