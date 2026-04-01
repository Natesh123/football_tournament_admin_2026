import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardService, TopScorer } from '../../../dashboard/dashboard.service';

@Component({
    selector: 'app-widgets',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './widgets.component.html'
})
export class WidgetsComponent implements OnInit {
    private dashboardService = inject(DashboardService);

    topScorers = signal<TopScorer[]>([]);
    isLoadingScorers = signal(true);

    ngOnInit() {
        this.dashboardService.getTopScorers().subscribe({
            next: (data) => {
                this.topScorers.set(data);
                this.isLoadingScorers.set(false);
            },
            error: () => {
                this.isLoadingScorers.set(false);
            }
        });
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
