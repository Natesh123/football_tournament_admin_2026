import { Component, OnInit, inject, signal, computed, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_URL } from '../../../core/config/app.config';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UiService } from '../../../services/ui.service';
import { AuthService } from '../../../auth/auth.service';
import { CreateTeamModalComponent } from '../../../teams/components/create-team-modal/create-team-modal.component';

interface Team {
    id: string;
    name: string;
    shortName?: string;
    teamType?: string;
    city?: string;
    logoUrl?: string;
}

interface TournamentTeam {
    id: string;
    status: 'pending' | 'approved' | 'rejected';
    paymentStatus: 'pending' | 'paid';
    team: Team;
}

@Component({
    selector: 'app-tournament-teams',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, CreateTeamModalComponent],
    templateUrl: './tournament-teams.component.html',
    styleUrls: []
})
export class TournamentTeamsComponent implements OnInit, OnChanges {
    @Input() tournamentId!: string;
    @Input() tournamentName: string = '';
    @Input() maxTeams: number = 16;
    /** Required squad size (members) for a team to join — from the tournament's settings. */
    @Input() squadSize: number = 16;

    /** A team must field at least this many members before it can join a tournament. */
    get minMembers(): number {
        return this.squadSize || 16;
    }

    private http = inject(HttpClient);
    public ui = inject(UiService);
    private translate = inject(TranslateService);
    private auth = inject(AuthService);
    private router = inject(Router);

    // Only admins manage the shared global team registry. Organizers register
    // teams from the existing pool (no "create new team" mode).
    get isAdmin(): boolean {
        return this.auth.isAdmin;
    }

    teams = signal<TournamentTeam[]>([]);
    availableTeams = signal<Team[]>([]); // Teams not in this tournament
    isLoading = signal(true);
    isModalOpen = signal(false);
    selectedExistingTeamIds = signal<string[]>([]);

    // The full "Register New Team" popup (shared CreateTeamModalComponent), opened by
    // admins to create a brand-new team into the global pool from this tournament.
    isCreateTeamModalOpen = signal(false);

    // Data Table State
    searchQuery = signal('');
    columns = signal([
        { key: 'team', label: 'TOURNAMENT_DASHBOARD.TEAMS.TABLE.TEAM', visible: true },
        { key: 'type', label: 'TOURNAMENT_DASHBOARD.TEAMS.TABLE.TYPE', visible: true },
        { key: 'location', label: 'TOURNAMENT_DASHBOARD.TEAMS.TABLE.LOCATION', visible: true },
        { key: 'status', label: 'TOURNAMENT_DASHBOARD.TEAMS.TABLE.STATUS', visible: true },
        { key: 'payment', label: 'TOURNAMENT_DASHBOARD.TEAMS.TABLE.PAYMENT', visible: true },
        { key: 'actions', label: 'TOURNAMENT_DASHBOARD.TEAMS.TABLE.ACTIONS', visible: true }
    ]);

    // Computed filtered list
    filteredTeams = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        const currentTeams = this.teams();
        if (!query) return currentTeams;

        return currentTeams.filter(reg => {
            const team = reg.team;
            return team.name.toLowerCase().includes(query) ||
                (team.shortName && team.shortName.toLowerCase().includes(query)) ||
                (team.city && team.city.toLowerCase().includes(query));
        });
    });

    remainingSlots = computed(() => this.maxTeams - this.teams().length);
    isTeamLimitReached = computed(() => this.teams().length >= this.maxTeams);

    ngOnInit() {
        if (this.tournamentId) {
            this.fetchTeams();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['tournamentId'] && !changes['tournamentId'].isFirstChange()) {
            this.fetchTeams();
        }
    }

    fetchTeams() {
        this.isLoading.set(true);

        // Fetch the full shared team pool (all=true) so organizers can register
        // any team into their own tournament, even those not yet in their tournaments.
        this.http.get<Team[]>(`${API_URL}/api/teams?all=true`).subscribe({
            next: (allTeams) => {
                // Fetch tournament registrations
                this.http.get<{ success: boolean, data: TournamentTeam[] }>(`${API_URL}/api/tournaments/${this.tournamentId}/teams`).subscribe({
                    next: (res) => {
                        const mappedTeams = res.data || [];
                        this.teams.set(mappedTeams);

                        // Calculate available teams (teams not in mappedTeams)
                        const mappedTeamIds = new Set(mappedTeams.map(m => m.team.id));
                        const unmappedTeams = allTeams.filter(t => !mappedTeamIds.has(t.id));
                        this.availableTeams.set(unmappedTeams);

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

    openModal() {
        if (this.isTeamLimitReached()) {
            this.notify('TOURNAMENT_DASHBOARD.TOAST.MAX_TEAMS_REACHED', 'error');
            return;
        }
        this.selectedExistingTeamIds.set([]);
        this.isModalOpen.set(true);
    }

    closeModal() {
        this.isModalOpen.set(false);
    }

    /**
     * Admin-only: launch the full "Register New Team" popup to create a brand-new team.
     * Closes the existing-team picker so only one modal is shown at a time.
     */
    openCreateTeamModal() {
        this.isModalOpen.set(false);
        this.isCreateTeamModalOpen.set(true);
    }

    closeCreateTeamModal() {
        this.isCreateTeamModalOpen.set(false);
    }

    /**
     * After a brand-new team is created via the popup, close it and guide the admin to
     * build the team's squad — a team with no members can't be mapped to a tournament yet.
     */
    onNewTeamCreated(teamId: string) {
        this.closeCreateTeamModal();
        this.promptCreateMembers(teamId);
    }

    toggleExistingTeamSelection(teamId: string) {
        this.selectedExistingTeamIds.update(ids => {
            if (ids.includes(teamId)) {
                return ids.filter(id => id !== teamId);
            } else {
                return [...ids, teamId];
            }
        });
    }

    saveTeam() {
        const teamIds = this.selectedExistingTeamIds();
        if (!teamIds || teamIds.length === 0) return;

        // Check max teams limit
        if (this.teams().length + teamIds.length > this.maxTeams) {
            this.notify('TOURNAMENT_DASHBOARD.TOAST.MAX_TEAMS_EXCEEDED', 'error');
            return;
        }

        this.ui.startAction();
        this.http.post<{ success: boolean, data: TournamentTeam[], skipped?: { teamId: any, reason: string }[] }>(`${API_URL}/api/tournaments/${this.tournamentId}/teams/bulk`, { teamIds })
            .subscribe({
                next: (res) => {
                    const newRegistrations = res.data || [];
                    this.teams.update(t => [...newRegistrations, ...t]);

                    // Remove only the teams that were actually added from the available list
                    const addedSet = new Set(newRegistrations.map(r => r.team.id));
                    this.availableTeams.update(av => av.filter(a => !addedSet.has(a.id)));

                    this.ui.endAction();

                    const skipped = res.skipped || [];
                    if (skipped.length > 0) {
                        // Surface each conflict (overlap / shared player) to the organizer.
                        for (const s of skipped) {
                            this.ui.showToast(s.reason, 'error');
                        }
                        if (newRegistrations.length > 0) {
                            this.notify('TOURNAMENT_DASHBOARD.TOAST.ADD_TEAMS_SUCCESS', 'success');
                        }
                    } else {
                        this.notify('TOURNAMENT_DASHBOARD.TOAST.ADD_TEAMS_SUCCESS', 'success');
                    }
                    this.closeModal();
                },
                error: (err) => {
                    this.ui.endAction();
                    this.notify(err?.error?.message || 'TOURNAMENT_DASHBOARD.TOAST.ADD_TEAMS_ERROR', 'error');
                }
            });
    }

    /**
     * After a new team is created, confirm whether to build its squad now. On confirm,
     * redirect to the team-members page carrying the tournament context so that page can
     * offer a "next step" back into this tournament once 16 members exist.
     */
    private async promptCreateMembers(teamId: string) {
        const confirmed = await this.ui.confirmAction(
            this.translate.instant('TOURNAMENT_DASHBOARD.TEAMS.SQUAD_REQUIRED_TITLE'),
            this.translate.instant('TOURNAMENT_DASHBOARD.TEAMS.SQUAD_REQUIRED_MSG', { min: this.minMembers }),
            this.translate.instant('TOURNAMENT_DASHBOARD.TEAMS.CREATE_MEMBERS_BTN'),
            this.translate.instant('COMMON.CLOSE')
        );
        if (confirmed) {
            this.router.navigate(['/admin/teams', teamId, 'members'], {
                queryParams: {
                    tournamentId: this.tournamentId,
                    tournamentName: this.tournamentName,
                    required: this.minMembers
                }
            });
        }
    }

    /** Show a toast from an i18n key (or already-resolved text). */
    private notify(keyOrText: string, type: 'success' | 'error' | 'info' = 'success') {
        this.ui.showToast(this.translate.instant(keyOrText), type);
    }

    deleteTeam(regId: string, teamId: string) {
        this.translate.get('TOURNAMENT_DASHBOARD.TEAMS.CONFIRM_REMOVE').subscribe(confirmMsg => {
            if (confirm(confirmMsg)) {
                this.ui.startAction();
                // Delete the registration link
                this.http.delete(`${API_URL}/api/tournaments/${this.tournamentId}/teams/${teamId}`).subscribe({
                    next: () => {
                        this.notify('TOURNAMENT_DASHBOARD.TOAST.REMOVE_TEAM_SUCCESS', 'success');
                        this.fetchTeams(); // Refetch to update both lists
                        this.ui.endAction();
                    },
                    error: (err) => {
                        this.notify('TOURNAMENT_DASHBOARD.TOAST.REMOVE_TEAM_ERROR', 'error');
                        this.ui.endAction();
                    }
                });
            }
        });
    }

    toggleApprovalStatus(reg: TournamentTeam) {
        const newStatus = reg.status === 'approved' ? 'pending' : 'approved';
        // Optimistic update
        const oldStatus = reg.status;
        reg.status = newStatus;

        this.ui.startAction();
        this.http.put(`${API_URL}/api/tournaments/${this.tournamentId}/teams/${reg.team.id}/status`, { status: newStatus }).subscribe({
            next: () => {
                this.ui.endAction();
                this.translate.get('TOURNAMENT_DASHBOARD.TEAMS.STATUS_UPDATED', { status: newStatus }).subscribe(msg => {
                    this.ui.showToast(msg, 'success');
                });
            },
            error: (err) => {
                reg.status = oldStatus; // Revert on error
                this.ui.endAction();
                this.notify('TOURNAMENT_DASHBOARD.TOAST.SAVE_ERROR', 'error');
            }
        });
    }

    togglePaymentStatus(reg: TournamentTeam) {
        const newPaymentStatus = reg.paymentStatus === 'paid' ? 'pending' : 'paid';
        // Optimistic update
        const oldPaymentStatus = reg.paymentStatus;
        reg.paymentStatus = newPaymentStatus;

        this.ui.startAction();
        this.http.put(`${API_URL}/api/tournaments/${this.tournamentId}/teams/${reg.team.id}/status`, { paymentStatus: newPaymentStatus }).subscribe({
            next: () => {
                this.ui.endAction();
                this.translate.get('TOURNAMENT_DASHBOARD.TEAMS.PAYMENT_UPDATED', { status: newPaymentStatus }).subscribe(msg => {
                    this.ui.showToast(msg, 'success');
                });
            },
            error: (err) => {
                reg.paymentStatus = oldPaymentStatus; // Revert on error
                this.ui.endAction();
                this.notify('TOURNAMENT_DASHBOARD.TOAST.SAVE_ERROR', 'error');
            }
        });
    }

    toggleColumn(key: string) {
        this.columns.update(cols =>
            cols.map(col => col.key === key ? { ...col, visible: !col.visible } : col)
        );
    }

    getImageUrl(path?: string): string {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        // Prefix with backend URL since Angular runs on 4200
        return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    }
}
