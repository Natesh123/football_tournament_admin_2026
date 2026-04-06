import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../../../tournament/tournament.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { UiService } from '../../../services/ui.service';

import { MatchTimelineComponent } from './components/match-timeline/match-timeline.component';
import { MatchEventEditorModalComponent } from './components/match-event-editor-modal/match-event-editor-modal.component';
import { MatchEditModalComponent } from './components/match-edit-modal/match-edit-modal.component';
import { MatchHeaderComponent } from './components/match-header/match-header.component';
import { MatchTabsComponent } from './components/match-tabs/match-tabs.component';
import { MatchInfoComponent } from './components/match-info/match-info.component';
import { H2hComponent } from './components/h2h/h2h.component';
import { LineupEditorComponent } from './components/lineup-editor/lineup-editor.component';
import { MatchStatsComponent } from './components/match-stats/match-stats.component';
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
        MatchStatsComponent
    ],
    templateUrl: './match-details.component.html'
})
export class MatchDetailsComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private tournamentService = inject(TournamentService);
    private http = inject(HttpClient);
    private teamMemberService = inject(TeamMemberService);
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
    activeTab = signal<'timeline' | 'stats' | 'info' | 'h2h' | 'form' | 'standings'>('info');
    events = signal<any[]>([]);

    lineups = signal<any>(null);
    h2hData = signal<any>(null);

    // Modals
    isEditModalOpen = signal<boolean>(false);
    isEventModalOpen = signal<boolean>(false);
    isLineupModalOpen = signal<boolean>(false);
    selectedEventData = signal<any>(null);

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
        this.http.get<{ success: boolean, data: any }>(`${environment.apiBaseUrl}/api/matches/${this.matchId()}`).subscribe({
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

                this.isLoading.set(false);
                this.fetchTeamMembersData(); // Fetch extra details like photos
            },
            error: (err) => {
                console.error("Failed to load match details", err);
                this.isLoading.set(false);
            }
        });
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
        this.http.get<{ success: boolean, data: any }>(`${environment.apiBaseUrl}/api/matches/${this.matchId()}/lineups`).subscribe({
            next: (res) => {
                if (res.success) {
                    this.lineups.set(res.data);
                }
            },
            error: (err) => console.error("Error fetching lineups", err)
        });

        this.http.get<{ success: boolean, data: any }>(`${environment.apiBaseUrl}/api/matches/${this.matchId()}/h2h`).subscribe({
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
        this.http.put<{ success: boolean, data: any }>(`${environment.apiBaseUrl}/api/matches/${this.matchId()}`, data).subscribe({
            next: (res) => {
                this.match.set(res.data);
                this.closeEditModal();
                this.ui.endAction();
                this.showToast('Match details updated successfully!', 'success');
            },
            error: (err) => {
                console.error("Failed to update match", err);
                this.ui.endAction();
                this.showToast('Failed to update match details.', 'error');
            }
        });
    }

    handleSaveLineups(lineupsData: { homeLineup: any, awayLineup: any }) {
        this.ui.startAction();
        this.http.put<{ success: boolean, data: any }>(`${environment.apiBaseUrl}/api/matches/${this.matchId()}`, lineupsData).subscribe({
            next: (res) => {
                this.match.set(res.data);
                this.lineups.set({ homeLineup: lineupsData.homeLineup, awayLineup: lineupsData.awayLineup });
                this.closeLineupModal();
                this.ui.endAction();
                this.showToast('Lineups updated successfully!', 'success');
            },
            error: (err) => {
                console.error("Failed to update lineups", err);
                this.ui.endAction();
                this.showToast('Failed to update lineups.', 'error');
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
                    this.showToast('Event updated successfully!', 'success');
                },
                error: (err: any) => {
                    console.error("Failed to update event", err);
                    this.ui.endAction();
                    this.showToast('Failed to update event.', 'error');
                }
            });
        } else {
            // Add new event
            this.tournamentService.addMatchEvent(this.matchId(), data).subscribe({
                next: () => {
                    this.loadMatchDetails(); // reload to get new scores & events
                    this.closeEventModal();
                    this.ui.endAction();
                    this.showToast('Event added successfully!', 'success');
                },
                error: (err: any) => {
                    console.error("Failed to add event", err);
                    this.ui.endAction();
                    this.showToast('Failed to add event.', 'error');
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

    submitDirectEvent() {
        if (!this.eventFormMinute()) {
            this.showToast('Please enter match minute.');
            return;
        }
        if (!this.eventFormPlayerName()) {
            this.showToast('Please select a player.');
            return;
        }

        const data: any = {
            type: this.eventFormType(),
            minute: this.eventFormMinute(),
            team: this.eventFormTeam(),
            playerName: this.eventFormPlayerName(),
            details: this.eventFormDetails()
        };

        if (this.eventFormType() === 'goal' && this.eventFormAssistPlayerName()) {
            data.assistPlayerName = this.eventFormAssistPlayerName();
        }

        this.ui.startAction();
        this.tournamentService.addMatchEvent(this.matchId(), data).subscribe({
            next: () => {
                this.loadMatchDetails(); // reload to get new scores & events
                this.ui.endAction();
                this.showToast('Event added successfully!', 'success');
                // Reset form fields but keep team
                this.eventFormPlayerName.set('');
                this.eventFormAssistPlayerName.set('');
                this.eventFormDetails.set('');
            },
            error: (err: any) => {
                console.error("Failed to add event", err);
                this.ui.endAction();
                this.showToast('Failed to add event.', 'error');
            }
        });
    }

    handleDeleteEvent(eventId: string) {
        this.ui.startAction();
        this.tournamentService.deleteMatchEvent(this.matchId(), eventId).subscribe({
            next: () => {
                this.loadMatchDetails();
                this.ui.endAction();
                this.showToast('Event deleted successfully!', 'success');
            },
            error: (err: any) => {
                console.error("Failed to delete event", err);
                this.ui.endAction();
                this.showToast('Failed to delete event.', 'error');
            }
        });
    }
 
    handleStartMatch() {
        this.ui.startAction();
        this.http.put<{ success: boolean, data: any }>(`${environment.apiBaseUrl}/api/matches/${this.matchId()}`, {
            status: 'live'
        }).subscribe({
            next: (res) => {
                this.match.set(res.data);
                this.ui.endAction();
                this.showToast('Match started!', 'success');
            },
            error: (err: any) => {
                console.error("Failed to start match", err);
                this.ui.endAction();
                this.showToast('Failed to start match.', 'error');
            }
        });
    }

    handleCompleteMatch() {
        if (!confirm('Are you sure you want to complete this match?')) return;
        
        this.ui.startAction();
        this.http.put<{ success: boolean, data: any }>(`${environment.apiBaseUrl}/api/matches/${this.matchId()}`, {
            status: 'completed'
        }).subscribe({
            next: (res) => {
                this.match.set(res.data);
                this.ui.endAction();
                this.showToast('Match completed!', 'success');
                this.loadMatchDetails(); // Refresh all data to see finalized standings/events
            },
            error: (err: any) => {
                console.error("Failed to complete match", err);
                this.ui.endAction();
                this.showToast('Failed to complete match.', 'error');
            }
        });
    }

    saveMatchResult() {
        if (this.homeScore() === null || this.awayScore() === null) {
            this.showToast('Please enter scores for both teams.');
            return;
        }

        this.ui.startAction();
        this.http.post<{ success: boolean, data: any }>(`${environment.apiBaseUrl}/api/matches/${this.matchId()}/result`, {
            homeScore: this.homeScore(),
            awayScore: this.awayScore()
        }).subscribe({
            next: (res) => {
                this.match.set(res.data);
                this.ui.endAction();
                this.showToast('Match result saved successfully!', 'success');
            },
            error: (err: any) => {
                console.error("Failed to save match result", err);
                this.ui.endAction();
                this.showToast('Failed to save match result.', 'error');
            }
        });
    }

    goBack() {
        // Go back to tournament dashboard, matches tab
        this.router.navigate(['/tournaments', this.tournamentId()], { queryParams: { tab: 'matches' } });
    }

    showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
        this.ui.showToast(message, type);
    }
}
