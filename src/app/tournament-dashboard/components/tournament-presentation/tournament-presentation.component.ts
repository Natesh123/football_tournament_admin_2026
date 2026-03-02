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
}
