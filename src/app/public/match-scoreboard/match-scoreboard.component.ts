import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SocketService } from '../../core/services/socket.service';

export interface PublicMatchData {
    match: {
        id: number;
        tournamentName: string;
        homeTeamName: string;
        homeTeamLogo?: string;
        awayTeamName: string;
        awayTeamLogo?: string;
        homeScore: number;
        awayScore: number;
        status: string;
        minute?: number;
        period: string;
    };
    presentation: {
        brandColor: string;
        liveStreamLink?: string;
    };
    events: any[];
}

@Component({
    selector: 'app-match-scoreboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './match-scoreboard.component.html'
})
export class MatchScoreboardComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private http = inject(HttpClient);
    private socketService = inject(SocketService);
    
    data = signal<PublicMatchData | null>(null);
    isLoading = signal(true);
    error = signal('');
    tournamentId = signal<string | null>(null);
    recentEvent = signal<any>(null);

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            const tid = params.get('tournamentId');
            
            if (tid) this.tournamentId.set(tid);

            if (id) {
                this.loadMatchData(id);
                // Listen for real-time updates
                this.socketService.on(`match_update_${id}`, (updatedData: any) => {
                    console.log('Real-time update received:', updatedData);
                    
                    // Handle specific event types for alerts
                    if (updatedData.type === 'event_added') {
                        this.showEventAlert(updatedData.event);
                        this.silentReload(id);
                    } else if (updatedData.status) {
                        // Full match object update (score, status, etc.)
                        this.data.update(curr => curr ? { ...curr, match: updatedData } : null);
                        
                        // If score changed, maybe show an alert too (if it wasn't an event_added)
                    }
                });
            }
        });
    }

    showEventAlert(event: any) {
        this.recentEvent.set(event);
        setTimeout(() => this.recentEvent.set(null), 5000); // Hide after 5s
    }

    loadMatchData(id: string) {
        this.isLoading.set(true);
        this.http.get<{success: boolean, data: PublicMatchData, message?: string}>(`${environment.apiBaseUrl}/api/public/match/${id}`).subscribe({
            next: (res) => {
                if (res.success) {
                    this.data.set(res.data);
                } else {
                    this.error.set(res.message || 'Failed to load match data');
                }
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error("Match load error", err);
                this.error.set('Failed to connect to the server');
                this.isLoading.set(false);
            }
        });
    }

    silentReload(id: string) {
        this.http.get<{success: boolean, data: PublicMatchData}>(`${environment.apiBaseUrl}/api/public/match/${id}`).subscribe({
            next: (res) => {
                if (res.success) {
                    this.data.set(res.data);
                }
            }
        });
    }
}
