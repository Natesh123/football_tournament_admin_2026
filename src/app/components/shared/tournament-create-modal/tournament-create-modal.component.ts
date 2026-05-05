import { Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TournamentService } from '../../../tournament/tournament.service';
import { LoaderComponent } from '../../loader/loader.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tournament-create-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, LoaderComponent],
    templateUrl: './tournament-create-modal.component.html'
})
export class TournamentCreateModalComponent {
    private tournamentService = inject(TournamentService);
    private router = inject(Router);

    @Input() show = false;
    @Output() onClose = new EventEmitter<void>();
    @Output() onSuccess = new EventEmitter<any>();

    isCreating = signal(false);
    
    newTournament = {
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'draft',
        maxTeams: 16,
        minTeams: 3,
        type: 'group'
    };

    close() {
        this.resetForm();
        this.onClose.emit();
    }

    resetForm() {
        this.newTournament = {
            name: '',
            description: '',
            startDate: '',
            endDate: '',
            status: 'draft',
            maxTeams: 16,
            minTeams: 3,
            type: 'group'
        };
    }

    onFormatChange() {
        switch (this.newTournament.type) {
            case 'group':
                this.newTournament.minTeams = 3;
                break;
            case 'knockout':
            case 'group_knockout':
                this.newTournament.minTeams = 4;
                break;
            default:
                this.newTournament.minTeams = 2;
                break;
        }
    }

    createTournament() {
        if (!this.newTournament.name || !this.newTournament.startDate) return;
        this.isCreating.set(true);

        this.tournamentService.create({
            name: this.newTournament.name,
            description: this.newTournament.description,
            startDate: this.newTournament.startDate,
            endDate: this.newTournament.endDate || this.newTournament.startDate,
            maxTeams: Number(this.newTournament.maxTeams),
            minTeams: this.newTournament.minTeams,
            status: this.newTournament.status,
            type: this.newTournament.type,
        }).subscribe({
            next: (created) => {
                this.isCreating.set(false);
                this.onSuccess.emit(created);
                this.close();
                this.router.navigate(['/admin/tournaments', created.id]);
            },
            error: (err) => {
                console.error('Failed to create tournament:', err);
                this.isCreating.set(false);
                // We could emit error here too if needed
            }
        });
    }
}
