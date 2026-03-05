import { Component, Input, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TournamentService } from '../../../tournament/tournament.service';

@Component({
    selector: 'app-tournament-schedule',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tournament-schedule.component.html'
})
export class TournamentScheduleComponent implements OnInit {
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

    generateSchedule() {
        if (!this.tournamentId) return;
        this.isLoadingStructure.set(true);
        this.tournamentService.generateStructure(this.tournamentId).subscribe({
            next: (data: any) => {
                this.structure.set(data);
                this.isLoadingStructure.set(false);
            },
            error: (err: any) => {
                console.error("Failed to generate tournament structure", err);
                this.isLoadingStructure.set(false);
            }
        });
    }

    toggleDay(day: string) {
        this.data.matchDays[day] = !this.data.matchDays[day];
    }
}
