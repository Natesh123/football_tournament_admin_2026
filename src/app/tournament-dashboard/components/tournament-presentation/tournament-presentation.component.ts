import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-tournament-presentation',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: './tournament-presentation.component.html'
})
export class TournamentPresentationComponent {
    private translate = inject(TranslateService);
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
