import { Component, Input, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TournamentService } from '../../../tournament/tournament.service';

@Component({
    selector: 'app-tournament-results',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: './tournament-results.component.html'
})
export class TournamentResultsComponent implements OnInit {
    private translate = inject(TranslateService);
    @Input() tournamentId!: string;

    private tournamentService = inject(TournamentService);
    structure = signal<any>(null);
    isLoadingStructure = signal(false);
    matches = signal<any[]>([]);
    isLoadingMatches = signal(false);
    topPerformance = signal<any>(null);
    isLoadingPerformance = signal(false);

    ngOnInit() {
        if (this.tournamentId) {
            this.loadStructure();
            this.loadMatches();
            this.loadTopPerformance();
        }
    }

    loadStructure() {
        this.isLoadingStructure.set(true);
        this.tournamentService.getStructure(this.tournamentId).subscribe({
            next: (data: any) => {
                this.structure.set(data);
                this.isLoadingStructure.set(false);
            },
            error: (err: any) => {
                this.isLoadingStructure.set(false);
            }
        });
    }

    loadMatches() {
        this.isLoadingMatches.set(true);
        this.tournamentService.getTournamentResults(this.tournamentId).subscribe({
            next: (data: any[]) => {
                this.matches.set(data);
                this.isLoadingMatches.set(false);
            },
            error: (err: any) => {
                this.isLoadingMatches.set(false);
            }
        });
    }

    loadTopPerformance() {
        this.isLoadingPerformance.set(true);
        this.tournamentService.getTournamentTopPerformance(this.tournamentId).subscribe({
            next: (data: any) => {
                this.topPerformance.set(data);
                this.isLoadingPerformance.set(false);
            },
            error: (err: any) => {
                this.isLoadingPerformance.set(false);
            }
        });
    }

    get groups() {
        if (!this.structure()?.groups) return [];
        return this.structure().groups;
    }
}
