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
    @Input() venues: any = null;

    private router = inject(Router);
    private tournamentService = inject(TournamentService);
    public ui = inject(UiService);
    private translate = inject(TranslateService);
    structure = signal<any>(null);
    isLoading = signal(true);
    isSavingMatch = signal(false);

    // Connected data for the edit modal (teams + tournament referee pool)
    availableTeams = signal<{ id: number; name: string }[]>([]);
    referees = signal<any[]>([]);

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
            this.loadTeams();
            this.loadReferees();
        }
        this.clockTimer = setInterval(() => this.now.set(Date.now()), 1000);
    }

    loadTeams() {
        this.tournamentService.getTeams(this.tournamentId).subscribe({
            next: (regs: any[]) => {
                const teams = (regs || [])
                    .filter(r => r.status === 'approved' && r.team)
                    .map(r => ({ id: r.team.id, name: r.team.name }));
                this.availableTeams.set(teams);
            },
            error: () => { /* non-blocking */ }
        });
    }

    loadReferees() {
        this.tournamentService.getReferees(this.tournamentId).subscribe({
            next: (list) => this.referees.set(list || []),
            error: () => { /* non-blocking */ }
        });
    }

    // Venue options derived from the tournament's venue setup (same as Schedule tab).
    get venueOptions(): string[] {
        const options: string[] = [];
        const primary = this.venues?.primaryVenue?.trim();
        if (primary) {
            options.push(primary);
            if (this.venues?.multipleVenues && Array.isArray(this.venues?.pitches)) {
                for (const pitch of this.venues.pitches) {
                    const name = pitch?.name?.trim();
                    if (name) options.push(`${primary} - ${name}`);
                }
            }
        }
        const current = this.editingMatch?.venue?.trim();
        if (current && !options.includes(current)) options.push(current);
        return options;
    }

    // Referee names from the tournament-level pool, used by the 4 referee dropdowns.
    get refereeOptions(): string[] {
        const options = this.referees()
            .map(r => r?.name?.trim())
            .filter((n): n is string => !!n);
        const refs = this.editingMatch?.referees;
        for (const cur of [refs?.main, refs?.assistant1, refs?.assistant2, refs?.fourthOfficial]) {
            const v = cur?.trim?.();
            if (v && !options.includes(v)) options.push(v);
        }
        return options;
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
            // Default the match venue to the tournament's primary venue
            venue: match.venue || this.venues?.primaryVenue?.trim() || '',
            matchTime: match.startTime ? new Date(match.startTime).toISOString().slice(0, 16) : '',
            // Structured referee assignment (1 main + 2 assistants + 4th official).
            // Seed from the saved object, falling back to legacy free text for `main`.
            referees: {
                main: match.referees?.main || match.matchReferees || '',
                assistant1: match.referees?.assistant1 || '',
                assistant2: match.referees?.assistant2 || '',
                fourthOfficial: match.referees?.fourthOfficial || ''
            },
            homeTeamId: match.homeTeam?.id ?? null,
            awayTeamId: match.awayTeam?.id ?? null,
            _origHomeTeamId: match.homeTeam?.id ?? null,
            _origAwayTeamId: match.awayTeam?.id ?? null
        };
    }

    closeMatchEditor() {
        this.editingMatch = null;
    }

    // ─── Prev/next navigation within the current tab's match list ────────────
    get hasPrevMatch(): boolean {
        if (!this.editingMatch) return false;
        return this.filteredMatches().findIndex((m: any) => m.id === this.editingMatch.id) > 0;
    }

    get hasNextMatch(): boolean {
        if (!this.editingMatch) return false;
        const list = this.filteredMatches();
        const idx = list.findIndex((m: any) => m.id === this.editingMatch.id);
        return idx > -1 && idx < list.length - 1;
    }

    editPrevMatch() {
        const list = this.filteredMatches();
        const idx = list.findIndex((m: any) => m.id === this.editingMatch.id);
        if (idx > 0) this.openMatchEditor(list[idx - 1]);
    }

    editNextMatch() {
        const list = this.filteredMatches();
        const idx = list.findIndex((m: any) => m.id === this.editingMatch.id);
        if (idx > -1 && idx < list.length - 1) this.openMatchEditor(list[idx + 1]);
    }

    saveMatchSchedule() {
        if (!this.editingMatch) return;

        const matchId = this.editingMatch.id;
        if (!matchId) {
            this.showToast('TOURNAMENT_DASHBOARD.SCHEDULE.ERR_MATCH_ID', 'error');
            return;
        }

        // A scheduled match must have a venue
        if (!this.editingMatch.venue?.trim()) {
            this.showToast('TOURNAMENT_DASHBOARD.SCHEDULE.ERR_MATCH_VENUE', 'error');
            return;
        }

        this.isSavingMatch.set(true);

        const payload: any = {
            venue: this.editingMatch.venue ?? null,
            matchTime: this.editingMatch.matchTime || null,
            breakDuration: this.editingMatch.breakDuration ?? null,
            events: this.editingMatch.events ?? null,
            referees: this.editingMatch.referees ?? null,
            // Keep the legacy free-text field in sync with the main referee.
            matchReferees: this.editingMatch.referees?.main ?? null
        };

        // Only send team assignments when they actually changed, so editing the
        // time/venue of a finished match doesn't trip the backend's team guard.
        const normId = (v: any) => (v === '' || v === undefined ? null : v === null ? null : Number(v));
        const home = normId(this.editingMatch.homeTeamId);
        const away = normId(this.editingMatch.awayTeamId);
        if (home !== (this.editingMatch._origHomeTeamId ?? null)) payload.homeTeamId = home;
        if (away !== (this.editingMatch._origAwayTeamId ?? null)) payload.awayTeamId = away;

        if (payload.homeTeamId !== undefined && payload.awayTeamId !== undefined
            && payload.homeTeamId !== null && payload.homeTeamId === payload.awayTeamId) {
            this.showToast('Home and away teams must be different.', 'error');
            this.isSavingMatch.set(false);
            return;
        }

        this.tournamentService.updateMatchSchedule(matchId, payload).subscribe({
            next: (res: any) => {
                const updated = res?.data || res;
                const struct = this.structure();
                if (struct && struct.matches) {
                    const idx = struct.matches.findIndex((m: any) => m.id === matchId);
                    if (idx !== -1) {
                        struct.matches[idx] = { ...struct.matches[idx], ...updated };
                        this.structure.set({ ...struct });
                    }
                }
                this.isSavingMatch.set(false);
                this.showToast('TOURNAMENT_DASHBOARD.TOAST.MATCH_UPDATE_SUCCESS', 'success');
                this.closeMatchEditor();
            },
            error: (err: any) => {
                this.isSavingMatch.set(false);
                this.showToast('TOURNAMENT_DASHBOARD.TOAST.MATCH_UPDATE_ERROR', 'error');
            }
        });
    }

    showToast(key: string, type: 'success' | 'error' | 'info' = 'success') {
        this.ui.showToast(key, type);
    }
}
