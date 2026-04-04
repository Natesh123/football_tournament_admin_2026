import { Component, OnInit, inject, signal, computed, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

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
    imports: [CommonModule, FormsModule],
    templateUrl: './tournament-teams.component.html',
    styleUrls: []
})
export class TournamentTeamsComponent implements OnInit, OnChanges {
    @Input() tournamentId!: string;

    private http = inject(HttpClient);

    teams = signal<TournamentTeam[]>([]);
    availableTeams = signal<Team[]>([]); // Teams not in this tournament
    isLoading = signal(true);
    isModalOpen = signal(false);
    isSaving = signal(false);
    modalMode = signal<'new' | 'existing'>('existing');
    selectedExistingTeamIds = signal<string[]>([]);

    newTeam = signal<Partial<Team>>({
        name: '',
        shortName: '',
        teamType: 'Club',
        city: '',
        logoUrl: ''
    });

    // Data Table State
    searchQuery = signal('');
    columns = signal([
        { key: 'team', label: 'Team', visible: true },
        { key: 'type', label: 'Type', visible: true },
        { key: 'location', label: 'Location', visible: true },
        { key: 'status', label: 'Status', visible: true },
        { key: 'payment', label: 'Payment', visible: true },
        { key: 'actions', label: 'Actions', visible: true }
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

        // Fetch all teams
        this.http.get<Team[]>(`${environment.apiBaseUrl}/api/teams`).subscribe({
            next: (allTeams) => {
                // Fetch tournament registrations
                this.http.get<{ success: boolean, data: TournamentTeam[] }>(`${environment.apiBaseUrl}/api/tournaments/${this.tournamentId}/teams`).subscribe({
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
                        console.error('Error fetching tournament teams:', err);
                        this.isLoading.set(false);
                    }
                });
            },
            error: (err) => {
                console.error('Error fetching all teams:', err);
                this.isLoading.set(false);
            }
        });
    }

    openModal() {
        this.newTeam.set({
            name: '',
            shortName: '',
            teamType: 'Club',
            city: '',
            logoUrl: ''
        });
        this.selectedExistingTeamIds.set([]);
        this.isModalOpen.set(true);
    }

    closeModal() {
        this.isModalOpen.set(false);
    }

    setModalMode(mode: 'new' | 'existing') {
        this.modalMode.set(mode);
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
        if (this.modalMode() === 'existing') {
            const teamIds = this.selectedExistingTeamIds();
            if (!teamIds || teamIds.length === 0) return;

            this.isSaving.set(true);
            this.http.post<{ success: boolean, data: TournamentTeam[] }>(`${environment.apiBaseUrl}/api/tournaments/${this.tournamentId}/teams/bulk`, { teamIds })
                .subscribe({
                    next: (res) => {
                        const newRegistrations = res.data || [];
                        this.teams.update(t => [...newRegistrations, ...t]);

                        // Remove assigned teams from available list
                        const addedSet = new Set(teamIds);
                        this.availableTeams.update(av => av.filter(a => !addedSet.has(a.id)));

                        this.isSaving.set(false);
                        this.closeModal();
                    },
                    error: (err) => {
                        console.error('Error assigning teams:', err);
                        this.isSaving.set(false);
                    }
                });
        } else {
            const teamData = { ...this.newTeam(), tournamentId: this.tournamentId };
            if (!teamData.name || !teamData.teamType) return;

            this.isSaving.set(true);
            this.http.post<Team>(`${environment.apiBaseUrl}/api/teams`, teamData).subscribe({
                next: (newTeam) => {
                    // Step 2: Now map it to the tournament
                    this.http.post<{ success: boolean, data: TournamentTeam }>(`${environment.apiBaseUrl}/api/tournaments/${this.tournamentId}/teams/${newTeam.id}`, {})
                        .subscribe({
                            next: (res) => {
                                this.teams.update(t => [res.data, ...t]);
                                this.isSaving.set(false);
                                this.closeModal();
                            },
                            error: (err) => {
                                console.error('Error mapping new team to tournament:', err);
                                this.isSaving.set(false);
                            }
                        });
                },
                error: (err) => {
                    console.error('Error saving team:', err);
                    this.isSaving.set(false);
                }
            });
        }
    }

    deleteTeam(regId: string, teamId: string) {
        if (confirm('Are you sure you want to remove this team from the tournament?')) {
            // Delete the registration link
            this.http.delete(`${environment.apiBaseUrl}/api/tournaments/${this.tournamentId}/teams/${teamId}`).subscribe({
                next: () => {
                    this.fetchTeams(); // Refetch to update both lists
                },
                error: (err) => console.error('Error unassigning team:', err)
            });
        }
    }

    toggleApprovalStatus(reg: TournamentTeam) {
        const newStatus = reg.status === 'approved' ? 'pending' : 'approved';
        // Optimistic update
        const oldStatus = reg.status;
        reg.status = newStatus;

        this.http.put(`${environment.apiBaseUrl}/api/tournaments/${this.tournamentId}/teams/${reg.team.id}/status`, { status: newStatus }).subscribe({
            error: (err) => {
                console.error('Error updating approval status:', err);
                reg.status = oldStatus; // Revert on error
            }
        });
    }

    togglePaymentStatus(reg: TournamentTeam) {
        const newPaymentStatus = reg.paymentStatus === 'paid' ? 'pending' : 'paid';
        // Optimistic update
        const oldPaymentStatus = reg.paymentStatus;
        reg.paymentStatus = newPaymentStatus;

        this.http.put(`${environment.apiBaseUrl}/api/tournaments/${this.tournamentId}/teams/${reg.team.id}/status`, { paymentStatus: newPaymentStatus }).subscribe({
            error: (err) => {
                console.error('Error updating payment status:', err);
                reg.paymentStatus = oldPaymentStatus; // Revert on error
            }
        });
    }

    getImageUrl(path?: string): string {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        // Prefix with backend URL since Angular runs on 4200
        return `${environment.apiBaseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    }

    // Data Table Logic
    toggleColumn(key: string) {
        this.columns.update(cols =>
            cols.map(c => c.key === key ? { ...c, visible: !c.visible } : c)
        );
    }
}
