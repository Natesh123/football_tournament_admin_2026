import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { TournamentService, TournamentDTO } from '../../tournament/tournament.service';
import { TeamService } from '../../teams/team.service';
import { UiService } from '../../services/ui.service';

export interface LandingData {
    tournament: TournamentDTO;
    teams: any[];
    matches: any[];
}

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private http = inject(HttpClient);
    private tournamentService = inject(TournamentService);
    private teamService = inject(TeamService);
    public ui = inject(UiService);

    tournament = signal<TournamentDTO | null>(null);
    teams = signal<any[]>([]);
    matches = signal<any[]>([]);
    isLoading = signal(true);
    error = signal('');

    // Registration Form
    regData = {
        name: '',
        teamName: '',
        phone: '',
        email: '',
        city: ''
    };
    isSubmitting = signal(false);

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.loadLandingData(id);
            } else {
                this.loadDefaultTournament();
            }
        });
    }

    loadDefaultTournament() {
        this.tournamentService.getAll().subscribe({
            next: (tournaments) => {
                if (tournaments && tournaments.length > 0) {
                    // Sort by date to get the latest or current
                    const sorted = tournaments.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
                    this.loadLandingData(sorted[0].id!);
                } else {
                    this.error.set('No tournaments found.');
                    this.isLoading.set(false);
                }
            },
            error: (err) => {
                this.error.set('Failed to load tournaments.');
                this.isLoading.set(false);
            }
        });
    }

    loadLandingData(id: string) {
        this.isLoading.set(true);
        
        // Fetch Tournament Details
        this.tournamentService.getById(id).subscribe({
            next: (data) => {
                this.tournament.set(data);
                this.fetchTeamsAndMatches(id);
            },
            error: (err) => {
                this.error.set('Failed to load tournament details.');
                this.isLoading.set(false);
            }
        });
    }

    fetchTeamsAndMatches(id: string) {
        // Fetch Teams
        this.http.get<{ success: boolean, data: any[] }>(`${environment.apiBaseUrl}/api/tournaments/${id}/teams`).subscribe({
            next: (res) => {
                this.teams.set(res.data || []);
            }
        });

        // Fetch Matches (using getMatchesByStatus 'all')
        this.tournamentService.getMatchesByStatus('all', id).subscribe({
            next: (data) => {
                this.matches.set(data || []);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error("Match fetch error", err);
                this.isLoading.set(false);
            }
        });
    }

    handleRegistration() {
        if (!this.regData.name || !this.regData.teamName || !this.regData.phone) {
            this.ui.showToast('Please fill in all required fields.', 'error');
            return;
        }

        const tId = this.tournament()?.id;
        if (!tId) return;

        this.isSubmitting.set(true);
        
        // 1. Create Team
        const teamPayload = {
            name: this.regData.teamName,
            city: this.regData.city,
            contactEmail: this.regData.email,
            captainName: this.regData.name,
            status: 'pending'
        };

        this.http.post<any>(`${environment.apiBaseUrl}/api/teams`, teamPayload).subscribe({
            next: (newTeam) => {
                // 2. Map team to tournament
                this.http.post(`${environment.apiBaseUrl}/api/tournaments/${tId}/teams/${newTeam.id}`, {}).subscribe({
                    next: () => {
                        this.ui.showToast('Registration submitted successfully! We will contact you soon.', 'success');
                        this.resetForm();
                        this.isSubmitting.set(false);
                    },
                    error: (err) => {
                        console.error("Mapping error", err);
                        this.ui.showToast('Team created but failed to register for tournament.', 'info');
                        this.isSubmitting.set(false);
                    }
                });
            },
            error: (err) => {
                console.error("Team creation error", err);
                this.ui.showToast('Failed to register. Please try again.', 'error');
                this.isSubmitting.set(false);
            }
        });
    }

    resetForm() {
        this.regData = {
            name: '',
            teamName: '',
            phone: '',
            email: '',
            city: ''
        };
    }

    getImageUrl(path?: string): string {
        if (!path) return 'assets/placeholder-logo.png';
        if (path.startsWith('http')) return path;
        return `${environment.apiBaseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    }

    scrollToSection(sectionId: string) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
