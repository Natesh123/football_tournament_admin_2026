import { Component, Input, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TournamentService } from '../../../tournament/tournament.service';

@Component({
    selector: 'app-tournament-results',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tournament-results.component.html'
})
export class TournamentResultsComponent implements OnInit {
    @Input() data!: any;
    @Input() tournamentId!: string;

    private tournamentService = inject(TournamentService);
    structure = signal<any>(null);
    isLoadingStructure = signal(false);

    ngOnInit() {
        if (this.tournamentId) {
            this.loadStructure();
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
                console.error("Failed to load tournament structure", err);
                this.isLoadingStructure.set(false);
            }
        });
    }

    get groups() {
        if (!this.structure()?.groups) return [];
        return this.structure().groups;
    }
}
