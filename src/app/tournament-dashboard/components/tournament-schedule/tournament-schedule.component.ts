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
        this.tournamentService.generateStructure(this.tournamentId, this.data).subscribe({
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

    // ─── Match Scheduling Modal ──────────────────────────────────────────────
    editingMatch: any = null;
    isSavingMatch = signal(false);

    startManualEditor() {
        if (this.structure()?.matches && this.structure().matches.length > 0) {
            this.openMatchEditor(this.structure().matches[0]);
        }
    }

    openMatchEditor(match: any) {
        // Create a copy to edit without affecting the list until saved
        this.editingMatch = {
            ...match,
            // ensure date is formatted for datetime-local input
            matchTime: match.startTime ? new Date(match.startTime).toISOString().slice(0, 16) : ''
        };
    }

    closeMatchEditor() {
        this.editingMatch = null;
    }

    get hasPrevMatch(): boolean {
        if (!this.editingMatch || !this.structure()?.matches) return false;
        const idx = this.structure().matches.findIndex((m: any) => m.id === this.editingMatch.id);
        return idx > 0;
    }

    get hasNextMatch(): boolean {
        if (!this.editingMatch || !this.structure()?.matches) return false;
        const idx = this.structure().matches.findIndex((m: any) => m.id === this.editingMatch.id);
        return idx < this.structure().matches.length - 1;
    }

    editPrevMatch() {
        if (this.hasPrevMatch) {
            const idx = this.structure().matches.findIndex((m: any) => m.id === this.editingMatch.id);
            this.openMatchEditor(this.structure().matches[idx - 1]);
        }
    }

    editNextMatch() {
        if (this.hasNextMatch) {
            const idx = this.structure().matches.findIndex((m: any) => m.id === this.editingMatch.id);
            this.openMatchEditor(this.structure().matches[idx + 1]);
        }
    }

    saveMatchSchedule() {
        if (!this.editingMatch) return;
        this.isSavingMatch.set(true);

        const payload = {
            venue: this.editingMatch.venue,
            matchTime: this.editingMatch.matchTime || null,
            breakDuration: this.editingMatch.breakDuration,
            events: this.editingMatch.events,
            matchReferees: this.editingMatch.matchReferees
        };

        this.tournamentService.updateMatchSchedule(this.editingMatch.id, payload).subscribe({
            next: (updatedMatch: any) => {
                // Update local structure with the updated match
                const struct = this.structure();
                if (struct && struct.matches) {
                    const idx = struct.matches.findIndex((m: any) => m.id === this.editingMatch.id);
                    if (idx !== -1) {
                        struct.matches[idx] = { ...struct.matches[idx], ...updatedMatch.data };
                        // Trigger reactivity
                        this.structure.set({ ...struct });
                    }
                }
                this.isSavingMatch.set(false);
            },
            error: () => this.isSavingMatch.set(false)
        });
    }
}
