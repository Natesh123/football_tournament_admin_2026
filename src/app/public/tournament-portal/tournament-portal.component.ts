import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface PortalData {
    tournament: {
        id: number;
        name: string;
        logo?: string;
        status: string;
        visibility: string;
    };
    presentation: {
        brandColor: string;
        welcomeMessage: string;
        showStandings: boolean;
        showTopScorers: boolean;
        showLiveMatches: boolean;
        showRecentResults: boolean;
        liveStreamLink?: string;
    };
    standings: any[];
    liveMatches: any[];
    completedMatches: any[];
    topScorers: any[];
}

@Component({
    selector: 'app-tournament-portal',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './tournament-portal.component.html'
})
export class TournamentPortalComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private http = inject(HttpClient);
    
    data = signal<PortalData | null>(null);
    isLoading = signal(true);
    error = signal('');

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.loadPortalData(id);
            }
        });
    }

    loadPortalData(id: string) {
        this.isLoading.set(true);
        this.http.get<{success: boolean, data: PortalData, message?: string}>(`${environment.apiBaseUrl}/api/public/tournament/${id}/portal`).subscribe({
            next: (res) => {
                if (res.success) {
                    this.data.set(res.data);
                } else {
                    this.error.set(res.message || 'Failed to load tournament data');
                }
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error("Portal load error", err);
                this.error.set('Failed to connect to the server');
                this.isLoading.set(false);
            }
        });
    }
}
