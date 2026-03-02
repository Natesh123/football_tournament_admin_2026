import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tournament-venues',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tournament-venues.component.html'
})
export class TournamentVenuesComponent {
    @Input() data!: any;
}
