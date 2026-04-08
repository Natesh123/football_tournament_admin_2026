import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from '../../../tournament/tournament.service';
import { MatchCardComponent } from '../match-card/match-card.component';

@Component({
    selector: 'app-match-center',
    standalone: true,
    imports: [CommonModule, FormsModule, MatchCardComponent],
    templateUrl: './match-center.component.html'
})
export class MatchCenterComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private tournamentService = inject(TournamentService);

    tournamentId!: string;
    activeTab = signal<'scheduled' | 'live' | 'completed'>('scheduled');

    matches = signal<any[]>([]);
    isLoading = signal<boolean>(true);

    private pollInterval: any;

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.tournamentId = id;
                this.loadMatches();
            }
        });
    }

    ngOnDestroy() {
        this.stopPolling();
    }

    setTab(tab: 'scheduled' | 'live' | 'completed') {
        this.activeTab.set(tab);
        this.loadMatches();

        if (tab === 'live') {
            this.startPolling();
        } else {
            this.stopPolling();
        }
    }

    loadMatches() {
        this.isLoading.set(true);
        this.tournamentService.getMatchesByStatus(this.activeTab(), this.tournamentId).subscribe({
            next: (data: any[]) => {
                this.matches.set(data);
                this.isLoading.set(false);
            },
            error: (err: any) => {
                console.error("Failed to load matches", err);
                this.isLoading.set(false);
            }
        });
    }

    private startPolling() {
        // Poll every 10 seconds for live data
        this.stopPolling(); // Ensure no duplicates
        this.pollInterval = setInterval(() => {
            if (this.activeTab() === 'live') {
                this.loadMatchesSilently();
            }
        }, 10000);
    }

    private loadMatchesSilently() {
        this.tournamentService.getMatchesByStatus('live', this.tournamentId).subscribe({
            next: (data: any[]) => {
                this.matches.set(data);
            },
            error: (err: any) => console.error("Poll failed", err)
        });
    }

    private stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }

    goToDetails(matchId: number) {
        this.router.navigate(['/admin/tournaments', this.tournamentId, 'matches', matchId]);
    }
}
