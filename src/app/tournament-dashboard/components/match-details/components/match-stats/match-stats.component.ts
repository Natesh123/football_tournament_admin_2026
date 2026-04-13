import { Component, Input, OnInit, OnChanges, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

interface StatRow {
    label: string;
    home: number;
    away: number;
}

@Component({
    selector: 'app-match-stats',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './match-stats.component.html'
})
export class MatchStatsComponent implements OnChanges {
    private http = inject(HttpClient);

    @Input() matchId!: string;
    @Input() homeTeamName = 'Home';
    @Input() awayTeamName = 'Away';

    isLoading = signal(true);
    statsRows = signal<StatRow[]>([]);

    private labelMap: Record<string, string> = {
        goals:        'MATCH_DETAILS.STATS.GOALS',
        yellowCards:  'MATCH_DETAILS.STATS.YELLOW_CARDS',
        redCards:     'MATCH_DETAILS.STATS.RED_CARDS',
        corners:      'MATCH_DETAILS.STATS.CORNERS',
        offsides:     'MATCH_DETAILS.STATS.OFFSIDE',
        fouls:        'MATCH_DETAILS.STATS.FOUL',
        freeKicks:    'MATCH_DETAILS.STATS.FREE_KICK',
        substitutions:'MATCH_DETAILS.STATS.SUBSTITUTIONS',
        penalties:    'MATCH_DETAILS.STATS.PENALTIES',
    };

    ngOnChanges() {
        if (this.matchId) {
            this.loadStats();
        }
    }

    loadStats() {
        this.isLoading.set(true);
        this.http.get<{ success: boolean; data: any }>(`${environment.apiUrl}/api/matches/${this.matchId}/stats`)
            .subscribe({
                next: (res) => {
                    if (res.success && res.data?.stats) {
                        const rows: StatRow[] = Object.entries(res.data.stats)
                            .map(([key, val]: [string, any]) => ({
                                label: this.labelMap[key] ?? key,
                                home: val.home ?? 0,
                                away: val.away ?? 0,
                            }))
                            .filter(r => r.home > 0 || r.away > 0 || r.label === 'MATCH_DETAILS.STATS.GOALS');
                        this.statsRows.set(rows.length ? rows : this.emptyStats());
                    } else {
                        this.statsRows.set(this.emptyStats());
                    }
                    this.isLoading.set(false);
                },
                error: () => {
                    this.statsRows.set(this.emptyStats());
                    this.isLoading.set(false);
                }
            });
    }

    private emptyStats(): StatRow[] {
        return Object.entries(this.labelMap).map(([, label]) => ({
            label, home: 0, away: 0
        }));
    }

    getBarPercent(val: number, val2: number, side: 'home' | 'away'): number {
        const total = val + val2;
        if (total === 0) return 50;
        return side === 'home' ? Math.round((val / total) * 100) : Math.round((val2 / total) * 100);
    }
}
