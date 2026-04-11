import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PublicDataService } from '../../services/public-data.service';
import { PortalData } from '../../models/portal.model';

@Component({
    selector: 'app-tournament-portal',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './tournament-portal.component.html'
})
export class TournamentPortalComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private dataService = inject(PublicDataService);

    data = signal<PortalData | null>(null);
    isLoading = signal(true);
    error = signal('');

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.loadPortalData(parseInt(id, 10));
            }
        });
    }

    loadPortalData(id: number) {
        this.isLoading.set(true);
        this.dataService.getPortalData(id).subscribe({
            next: (portalData) => {
                this.data.set(portalData);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error("Portal load error", err);
                this.error.set('Failed to load tournament data');
                this.isLoading.set(false);
            }
        });
    }
}
