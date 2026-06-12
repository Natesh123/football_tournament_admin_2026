import { Component, OnInit, OnDestroy, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PublicDataService } from '../../services/public-data.service';
import { SocketService } from '../../core/services/socket.service';
import { formatLiveClock } from '../../core/utils/live-clock.util';

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
        periodStartedAt?: string;
        // Present on real-time socket payloads (full match entity)
        live_minute?: number;
        match_period?: string;
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
export class MatchScoreboardComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private dataService = inject(PublicDataService);
    private socketService = inject(SocketService);

    data = signal<PublicMatchData | null>(null);
    isLoading = signal(true);
    error = signal('');
    tournamentId = signal<string | null>(null);
    recentEvent = signal<any>(null);

    /** Running match clock ("MM:SS" / "HT"), ticked locally once a match is live. */
    liveClock = signal('');
    private clockTimer: ReturnType<typeof setInterval> | null = null;

    constructor() {
        // Start/stop the ticking clock as the match goes live / ends. The clock is
        // anchored to periodStartedAt, so it keeps running between socket updates.
        effect(() => {
            if (this.data()?.match?.status === 'live') {
                this.startClock();
            } else {
                this.stopClock();
            }
        });
    }

    private startClock() {
        if (this.clockTimer) return;
        this.tickClock();
        this.clockTimer = setInterval(() => this.tickClock(), 1000);
    }

    private stopClock() {
        if (this.clockTimer) {
            clearInterval(this.clockTimer);
            this.clockTimer = null;
        }
        this.liveClock.set('');
    }

    private tickClock() {
        const m = this.data()?.match;
        if (!m) return;
        // Normalize REST (minute/period) and socket (live_minute/match_period) shapes.
        this.liveClock.set(formatLiveClock({
            live_minute: m.live_minute ?? m.minute,
            match_period: m.match_period ?? m.period,
            periodStartedAt: m.periodStartedAt
        }));
    }

    ngOnDestroy() {
        this.stopClock();
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            const tid = params.get('tournamentId');

            if (tid) this.tournamentId.set(tid);

            if (id) {
                this.loadMatchData(id);
                // Listen for real-time updates
                this.socketService.on(`match_update_${id}`, (updatedData: any) => {

                    // Handle specific event types for alerts
                    if (updatedData.type === 'event_added') {
                        this.showEventAlert(updatedData.event);
                        this.silentReload(id);
                    } else if (updatedData.status) {
                        // Full match object update (score, status, etc.)
                        this.data.update(curr => curr ? { ...curr, match: updatedData } : null);
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
        this.dataService.getMatchData(id).subscribe({
            next: (matchData) => {
                this.data.set(matchData);
                this.isLoading.set(false);
            },
            error: (err) => {
                this.error.set('Failed to load match data');
                this.isLoading.set(false);
            }
        });
    }

    silentReload(id: string) {
        this.dataService.getMatchData(id).subscribe({
            next: (matchData) => {
                this.data.set(matchData);
            }
        });
    }
}
