import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tournament-participants',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tournament-participants.component.html'
})
export class TournamentParticipantsComponent {
    @Input() data!: any;
}
