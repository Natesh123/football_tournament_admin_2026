import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tournament-results',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tournament-results.component.html'
})
export class TournamentResultsComponent {
    @Input() data!: any;
}
