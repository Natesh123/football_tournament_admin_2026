import { Component, signal, OnInit, inject, computed, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { DashboardService, TopScorer } from '../../../dashboard/dashboard.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
    selector: 'app-widgets',
    standalone: true,
    imports: [CommonModule, TranslateModule, RouterLink],
    templateUrl: './widgets.component.html'
})
export class WidgetsComponent implements OnInit {
    private dashboardService = inject(DashboardService);
    private auth = inject(AuthService);

    @Output() openCreateModal = new EventEmitter<void>();

    topScorers = signal<TopScorer[]>([]);
    isLoadingScorers = signal(true);

    isAdmin = computed(() => this.auth.isAdmin);
    isOrganizer = computed(() => this.auth.isOrganizer);

    createTournamentAction() {
        this.openCreateModal.emit();
    }


    topOrganizers = signal<{ rank: number; name: string; email: string; tournamentsCount: number }[]>([]);
    isLoadingOrganizers = signal(true);

    ngOnInit() {
        if (this.isOrganizer()) {
            this.dashboardService.getTopScorers().subscribe({
                next: (data) => {
                    this.topScorers.set(data);
                    this.isLoadingScorers.set(false);
                },
                error: () => {
                    this.isLoadingScorers.set(false);
                }
            });
        } else {
            this.isLoadingScorers.set(false);
        }

        if (this.isAdmin()) {
            this.dashboardService.getTopOrganizers().subscribe({
                next: (data) => {
                    this.topOrganizers.set(data);
                    this.isLoadingOrganizers.set(false);
                },
                error: () => {
                    this.isLoadingOrganizers.set(false);
                }
            });
        } else {
            this.isLoadingOrganizers.set(false);
        }
    }

    getFormClass(result: string): string {
        switch (result) {
            case 'W': return 'bg-green-500 text-white';
            case 'D': return 'bg-zinc-500 text-white';
            case 'L': return 'bg-red-500 text-white';
            default: return 'bg-zinc-700 text-zinc-400';
        }
    }
}
