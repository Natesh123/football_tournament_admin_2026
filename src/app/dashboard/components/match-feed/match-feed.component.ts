import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardService, LiveMatch, MatchGroup, UpcomingMatch, PastMatch } from '../../../dashboard/dashboard.service';

@Component({
    selector: 'app-match-feed',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule],
    templateUrl: './match-feed.component.html'
})
export class MatchFeedComponent implements OnInit {
    private dashboardService = inject(DashboardService);

    isLoading = signal(true);
    currentTab = signal<'live' | 'upcoming' | 'past'>('live');

    liveMatches = signal<LiveMatch[]>([]);
    upcomingGrouped = signal<MatchGroup<UpcomingMatch>[]>([]);
    pastGrouped = signal<MatchGroup<PastMatch>[]>([]);

    ngOnInit() {
        this.loadAll();
    }

    loadAll() {
        this.isLoading.set(true);
        // Load all three in parallel
        Promise.all([
            new Promise<void>(resolve => {
                this.dashboardService.getLiveMatches().subscribe({
                    next: (data) => { this.liveMatches.set(data); resolve(); },
                    error: () => resolve()
                });
            }),
            new Promise<void>(resolve => {
                this.dashboardService.getUpcomingMatches().subscribe({
                    next: (data) => { this.upcomingGrouped.set(data); resolve(); },
                    error: () => resolve()
                });
            }),
            new Promise<void>(resolve => {
                this.dashboardService.getPastMatches().subscribe({
                    next: (data) => { this.pastGrouped.set(data); resolve(); },
                    error: () => resolve()
                });
            })
        ]).then(() => this.isLoading.set(false));
    }

    switchTab(tab: 'live' | 'upcoming' | 'past') {
        this.currentTab.set(tab);
    }
}
