import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tournament-presentation',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tournament-presentation.component.html'
})
export class TournamentPresentationComponent {
    @Input() data!: any;
    @Input() tournamentId!: string;

    getPublicLink(): string {
        return `${window.location.origin}/public/tournament/${this.tournamentId}`;
    }

    copyLink() {
        navigator.clipboard.writeText(this.getPublicLink());
        // Parent already has toast, but maybe we can just emit or trust the user sees the copy
    }
}
