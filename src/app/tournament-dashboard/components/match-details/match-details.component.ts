import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../../../tournament/tournament.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { UiService } from '../../../services/ui.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MatchTimelineComponent } from './components/match-timeline/match-timeline.component';
import { MatchEventEditorModalComponent } from './components/match-event-editor-modal/match-event-editor-modal.component';
import { MatchEditModalComponent } from './components/match-edit-modal/match-edit-modal.component';
import { MatchHeaderComponent } from './components/match-header/match-header.component';
import { MatchTabsComponent } from './components/match-tabs/match-tabs.component';
import { MatchInfoComponent } from './components/match-info/match-info.component';
import { H2hComponent } from './components/h2h/h2h.component';
import { LineupEditorComponent } from './components/lineup-editor/lineup-editor.component';
import { MatchStatsComponent } from './components/match-stats/match-stats.component';
import { ConfirmModalComponent } from '../../../components/shared/confirm-modal.component';
import { TeamMemberService, TeamMember } from '../../../teams/team-member.service';

@Component({
    selector: 'app-match-details',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatchTimelineComponent,
        MatchEventEditorModalComponent,
        MatchEditModalComponent,
        MatchHeaderComponent,
        MatchTabsComponent,
        MatchInfoComponent,
        H2hComponent,
        LineupEditorComponent,
        MatchStatsComponent,
        ConfirmModalComponent,
        TranslateModule
    ],
    templateUrl: './match-details.component.html'
})
export class MatchDetailsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private tournamentService = inject(TournamentService);
    private http = inject(HttpClient);
    private teamMemberService = inject(TeamMemberService);
    private translate = inject(TranslateService);
    public ui = inject(UiService);

    tournamentId = signal<string>('');
    matchId = signal<string>('');
    match = signal<any>(null);
    isLoading = signal<boolean>(true);

    // Team Members (for photos)
    homePlayers = signal<TeamMember[]>([]);
    awayPlayers = signal<TeamMember[]>([]);
    // Edit fields for score (direct edit in UI if needed, but we'll use auto-calc in the background primarily now)
    homeScore = signal<number | null>(null);
    awayScore = signal<number | null>(null);

    // Dynamic state
    activeTab = signal<'timeline' | 'stats' | 'info' | 'standings'>('timeline');
    events = signal<any[]>([]);

    // Event Add/Edit State
    isEventModalOpen = signal(false);
    selectedEventData = signal<any>(null);
    selectedEventId = signal<number | null>(null);

    // Live Match Modals
    isLineupModalOpen = signal(false);
    isEditModalOpen = signal(false);

    // Deletion confirmation state
    isConfirmDeleteOpen = signal(false);
    eventToDeleteId = signal<string | null>(null);

    // Helpers to easily access lineup objects in template
    get homeLineup() {
        return this.lineups()?.homeLineup || null;
    }

    get awayLineup() {
        return this.lineups()?.awayLineup || null;
    }

    lineups = signal<any>(null);
    h2hData = signal<any>(null);

    // Direct Event Form State
    eventFormType = signal<string>('goal');
    eventFormMinute = signal<number | null>(null);
    eventFormTeam = signal<'home' | 'away'>('home');
    eventFormPlayerName = signal<string>('');
    eventFormAssistPlayerName = signal<string>('');
    eventFormDetails = signal<string>('');

    ngOnInit() {
        this.tournamentId.set(this.route.snapshot.paramMap.get('id') || '');
        this.matchId.set(this.route.snapshot.paramMap.get('matchId') || '');

        if (this.matchId()) {
            this.loadMatchDetails();
        }
    }

    loadMatchDetails() {
        this.isLoading.set(true);
        this.http.get<{ success: boolean, data: any }>(`${environment.apiUrl}/api/matches/${this.matchId()}`).subscribe({
            next: (res) => {
                this.match.set(res.data);
                this.homeScore.set(res.data.homeScore !== undefined ? res.data.homeScore : null);
                this.awayScore.set(res.data.awayScore !== undefined ? res.data.awayScore : null);

                // Parse events from the match entity
                const matchEvents = res.data.matchEvents || [];
                this.events.set(matchEvents);

                // Always fetch pre-match data (lineups/H2H) regardless of status
                this.fetchPreMatchData();

                // Set default tab based on match status
                if (res.data.status === 'scheduled') {
                    this.activeTab.set('info');
                } else {
                    this.activeTab.set('timeline');
                }

                // Auto-fill form minute if match is live
                if (res.data.status === 'live' && !this.eventFormMinute()) {
                    this.eventFormMinute.set(this.calculateLiveMinute());
                }

                this.isLoading.set(false);
                this.fetchTeamMembersData(); // Fetch extra details like photos
            },
            error: (err) => {
                console.error("Failed to load match details", err);
                this.isLoading.set(false);
            }
        });
    }

    private calculateLiveMinute(): number {
        const m = this.match();
        if (!m?.periodStartedAt) return 1;
        const start = new Date(m.periodStartedAt).getTime();
        const now = new Date().getTime();
        const diffMs = now - start;
        const diffMins = Math.floor(diffMs / 60000);

        // Base minute (e.g. 45 for second half) plus elapsed time in current period
        const currentMinute = (m.live_minute || 0) + diffMins + 1;

        return currentMinute;
    }

    private fetchTeamMembersData() {
        const homeTeamId = this.match()?.homeTeam?.id;
        const awayTeamId = this.match()?.awayTeam?.id;

        if (homeTeamId) {
            this.teamMemberService.getByTeamId(homeTeamId.toString()).subscribe({
                next: (players) => this.homePlayers.set(players),
                error: (err) => console.error("Error fetching home players", err)
            });
        }
        if (awayTeamId) {
            this.teamMemberService.getByTeamId(awayTeamId.toString()).subscribe({
                next: (players) => this.awayPlayers.set(players),
                error: (err) => console.error("Error fetching away players", err)
            });
        }
    }

    getPlayerPhoto(playerName: string, team: 'home' | 'away'): string | undefined {
        const players = team === 'home' ? this.homePlayers() : this.awayPlayers();
        return players.find(p => p.name === playerName)?.photoUrl;
    }

    get homeLineupData() {
        const data = this.lineups()?.homeLineup || this.match()?.homeLineup;
        if (!data) return null;
        try {
            return typeof data === 'string' ? JSON.parse(data) : data;
        } catch (e) { return null; }
    }

    get awayLineupData() {
        const data = this.lineups()?.awayLineup || this.match()?.awayLineup;
        if (!data) return null;
        try {
            return typeof data === 'string' ? JSON.parse(data) : data;
        } catch (e) { return null; }
    }

    private fetchPreMatchData() {
        this.http.get<{ success: boolean, data: any }>(`${environment.apiUrl}/api/matches/${this.matchId()}/lineups`).subscribe({
            next: (res) => {
                if (res.success) {
                    this.lineups.set(res.data);
                }
            },
            error: (err) => console.error("Error fetching lineups", err)
        });

        this.http.get<{ success: boolean, data: any }>(`${environment.apiUrl}/api/matches/${this.matchId()}/h2h`).subscribe({
            next: (res) => {
                if (res.success) {
                    this.h2hData.set(res.data);
                }
            },
            error: (err) => console.error("Error fetching H2H", err)
        });
    }

    // Modal controls
    openEditModal() {
        this.isEditModalOpen.set(true);
    }

    closeEditModal() {
        this.isEditModalOpen.set(false);
    }

    openEventModal(eventData: any = null) {
        this.selectedEventData.set(eventData);
        this.isEventModalOpen.set(true);
    }

    closeEventModal() {
        this.isEventModalOpen.set(false);
        this.selectedEventData.set(null);
    }

    openLineupModal() {
        this.isLineupModalOpen.set(true);
    }

    closeLineupModal() {
        this.isLineupModalOpen.set(false);
    }

    // Handlers
    handleSaveMatchMetadata(data: any) {
        this.ui.startAction();
        this.http.put<{ success: boolean, data: any }>(`${environment.apiUrl}/api/matches/${this.matchId()}`, data).subscribe({
            next: (res) => {
                this.match.set(res.data);
                this.closeEditModal();
                this.ui.endAction();
                this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.UPDATE_SUCCESS'), 'success');
            },
            error: (err) => {
                console.error("Failed to update match", err);
                this.ui.endAction();
                this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.UPDATE_ERROR'), 'error');
            }
        });
    }

    handleSaveLineups(lineupsData: { homeLineup: any, awayLineup: any }) {
        this.ui.startAction();
        this.http.put<{ success: boolean, data: any }>(`${environment.apiUrl}/api/matches/${this.matchId()}`, lineupsData).subscribe({
            next: (res) => {
                this.match.set(res.data);
                this.lineups.set({ homeLineup: lineupsData.homeLineup, awayLineup: lineupsData.awayLineup });
                this.closeLineupModal();
                this.ui.endAction();
                this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.LINEUP_UPDATE_SUCCESS'), 'success');
            },
            error: (err) => {
                console.error("Failed to update lineups", err);
                this.ui.endAction();
                this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.LINEUP_UPDATE_ERROR'), 'error');
            }
        });
    }

    handleSaveEvent(data: any) {
        this.ui.startAction();
        if (data.id) {
            // Edit existing event
            this.tournamentService.updateMatchEvent(this.matchId(), data.id, data).subscribe({
                next: () => {
                    this.loadMatchDetails(); // reload to get new scores & events
                    this.closeEventModal();
                    this.ui.endAction();
                    this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.EVENT_UPDATE_SUCCESS'), 'success');
                },
                error: (err: any) => {
                    console.error("Failed to update event", err);
                    this.ui.endAction();
                    this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.EVENT_UPDATE_ERROR'), 'error');
                }
            });
        } else {
            // Add new event
            this.tournamentService.addMatchEvent(this.matchId(), data).subscribe({
                next: () => {
                    this.loadMatchDetails(); // reload to get new scores & events
                    this.closeEventModal();
                    this.ui.endAction();
                    this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.EVENT_ADD_SUCCESS'), 'success');
                },
                error: (err: any) => {
                    console.error("Failed to add event", err);
                    this.ui.endAction();
                    this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.EVENT_ADD_ERROR'), 'error');
                }
            });
        }
    }

    onDirectTeamSwitch(team: 'home' | 'away') {
        this.eventFormTeam.set(team);
        this.eventFormPlayerName.set(''); // Reset player when team changes
        this.eventFormAssistPlayerName.set('');
    }

    get directEventTeamPlayers(): TeamMember[] {
        return this.eventFormTeam() === 'home' ? this.homePlayers() : this.awayPlayers();
    }

    get directEventStartingPlayers(): TeamMember[] {
        const lineup = this.eventFormTeam() === 'home' ? this.homeLineupData : this.awayLineupData;
        const players = this.directEventTeamPlayers;
        if (lineup && lineup.starting && Array.isArray(lineup.starting)) {
            const names = lineup.starting.map((obj: any) => {
                if (typeof obj === 'string' || typeof obj === 'number') {
                    const foundP = players.find(p => p.id?.toString() === obj.toString());
                    return foundP ? foundP.name : obj.toString();
                }
                return obj?.name;
            });
            return players.filter(p => names.includes(p.name));
        }
        return players;
    }

    get directEventSubPlayers(): TeamMember[] {
        const lineup = this.eventFormTeam() === 'home' ? this.homeLineupData : this.awayLineupData;
        const players = this.directEventTeamPlayers;
        if (lineup && lineup.subs && Array.isArray(lineup.subs)) {
            const names = lineup.subs.map((obj: any) => {
                if (typeof obj === 'string' || typeof obj === 'number') {
                    const foundP = players.find(p => p.id?.toString() === obj.toString());
                    return foundP ? foundP.name : obj.toString();
                }
                return obj?.name;
            });
            return players.filter(p => names.includes(p.name));
        }
        return players;
    }

    submitDirectEvent() {
        if (!this.eventFormMinute()) {
            this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.ENTER_MINUTE'), 'error');
            return;
        }
        if (!this.eventFormPlayerName()) {
            this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.SELECT_PLAYER'), 'error');
            return;
        }
        if (this.eventFormType() === 'substitution' && !this.eventFormAssistPlayerName()) {
            this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.SELECT_SUB_IN'), 'error');
            return;
        }

        const data: any = {
            type: this.eventFormType(),
            minute: parseInt(this.eventFormMinute() as any, 10),
            team: this.eventFormTeam(),
            teamId: this.eventFormTeam() === 'home' ? this.match()?.homeTeam?.id : this.match()?.awayTeam?.id,
            playerName: this.eventFormPlayerName(),
            details: this.eventFormDetails()
        };

        if ((this.eventFormType() === 'goal' || this.eventFormType() === 'substitution') && this.eventFormAssistPlayerName()) {
            data.assistPlayerName = this.eventFormAssistPlayerName();
            if (this.eventFormType() === 'goal') {
                if (!data.details) {
                    data.details = `Assist: ${data.assistPlayerName}`;
                } else {
                    data.details = `${data.details} (Assist: ${data.assistPlayerName})`;
                }
            }
        }

        this.ui.startAction();
        this.tournamentService.addMatchEvent(this.matchId(), data).subscribe({
            next: () => {
                this.loadMatchDetails(); // reload to get new scores & events
                this.ui.endAction();
                this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.EVENT_ADD_SUCCESS'), 'success');
                // Reset form fields but keep team
                this.eventFormMinute.set(null);
                this.eventFormPlayerName.set('');
                this.eventFormAssistPlayerName.set('');
                this.eventFormDetails.set('');
            },
            error: (err: any) => {
                console.error("Failed to add event", err);
                this.ui.endAction();
                this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.EVENT_ADD_ERROR'), 'error');
            }
        });
    }

    handleDeleteEvent(eventId: string) {
        this.eventToDeleteId.set(eventId);
        this.isConfirmDeleteOpen.set(true);
    }

    confirmDeleteEvent() {
        const eventId = this.eventToDeleteId();
        if (!eventId) return;

        this.isConfirmDeleteOpen.set(false);
        this.ui.startAction();
        this.tournamentService.deleteMatchEvent(this.matchId(), eventId).subscribe({
            next: () => {
                this.loadMatchDetails();
                this.ui.endAction();
                this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.EVENT_DELETE_SUCCESS'), 'success');
                this.eventToDeleteId.set(null);
            },
            error: (err: any) => {
                console.error("Failed to delete event", err);
                this.ui.endAction();
                this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.EVENT_DELETE_ERROR'), 'error');
            }
        });
    }

    getRequiredLineupCounts() {
        const tournament = this.match()?.tournament;

        let playersOnField = 11;
        let squadSize = 25;
        if (tournament) {
            if (tournament.rules?.playersOnField) playersOnField = tournament.rules.playersOnField;
            else if (tournament.settings?.rules?.playersOnField) playersOnField = tournament.settings.rules.playersOnField;
            else {
                const type = tournament.type?.toLowerCase();
                if (type === 'futsal') playersOnField = 5;
                if (type === '7aside') playersOnField = 7;
            }

            if (tournament.squadSize) squadSize = tournament.squadSize;
            else if (tournament.settings?.rules?.squadSize) squadSize = tournament.settings.rules.squadSize;
            else {
                const type = tournament.type?.toLowerCase();
                if (type === 'futsal') squadSize = 12;
                if (type === '7aside') squadSize = 14;
            }
        }
        const subsLimit = Math.max(0, squadSize - playersOnField);
        return { playersOnField, subsLimit };
    }

    get isLineupValid(): boolean {
        const { playersOnField, subsLimit } = this.getRequiredLineupCounts();
        const homeData = this.homeLineupData;
        const awayData = this.awayLineupData;

        if (!homeData || !awayData || !homeData.starting || !awayData.starting) return false;
        if (homeData.starting.length !== playersOnField || awayData.starting.length !== playersOnField) return false;

        const homeSubsCount = homeData.subs ? homeData.subs.length : 0;
        const awaySubsCount = awayData.subs ? awayData.subs.length : 0;
        if (homeSubsCount > subsLimit || awaySubsCount > subsLimit) return false;

        return true;
    }

    handleStartMatch() {
        if (!this.isLineupValid) {
            const { playersOnField, subsLimit } = this.getRequiredLineupCounts();
            this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.LINEUP_INVALID', { playersOnField, subsLimit }), 'error');
            return;
        }

        this.ui.startAction();
        this.http.put<{ success: boolean, data: any }>(`${environment.apiUrl}/api/matches/${this.matchId()}`, {
            status: 'live'
        }).subscribe({
            next: (res) => {
                this.match.set(res.data);
                this.ui.endAction();
                this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.MATCH_START_SUCCESS'), 'success');
            },
            error: (err: any) => {
                console.error("Failed to start match", err);
                this.ui.endAction();
                this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.MATCH_START_ERROR'), 'error');
            }
        });
    }

    handleCompleteMatch() {
        if (!confirm(this.translate.instant('MATCH_DETAILS.TIMELINE.COMPLETE_CONFIRM_MSG'))) return;

        this.ui.startAction();
        this.http.put<{ success: boolean, data: any }>(`${environment.apiUrl}/api/matches/${this.matchId()}`, {
            status: 'completed'
        }).subscribe({
            next: (res) => {
                this.match.set(res.data);
                this.ui.endAction();
                this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.MATCH_COMPLETE_SUCCESS'), 'success');
                this.loadMatchDetails(); // Refresh all data to see finalized standings/events
            },
            error: (err: any) => {
                console.error("Failed to complete match", err);
                this.ui.endAction();
                this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.MATCH_COMPLETE_ERROR'), 'error');
            }
        });
    }

    saveMatchResult() {
        if (this.homeScore() === null || this.awayScore() === null) {
            this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.ENTER_SCORES'), 'error');
            return;
        }

        this.ui.startAction();
        this.http.post<{ success: boolean, data: any }>(`${environment.apiUrl}/api/matches/${this.matchId()}/result`, {
            homeScore: this.homeScore(),
            awayScore: this.awayScore()
        }).subscribe({
            next: (res) => {
                this.match.set(res.data);
                this.ui.endAction();
                this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.RESULT_SAVE_SUCCESS'), 'success');
            },
            error: (err: any) => {
                console.error("Failed to save match result", err);
                this.ui.endAction();
                this.showToast(this.translate.instant('MATCH_DETAILS.TOAST.RESULT_SAVE_ERROR'), 'error');
            }
        });
    }

    goBack() {
        // Go back to tournament dashboard, matches tab
        this.router.navigate(['/admin/tournaments', this.tournamentId()], { queryParams: { tab: 'matches' } });
    }

    showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
        this.ui.showToast(message, type);
    }
}
