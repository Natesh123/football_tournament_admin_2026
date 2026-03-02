import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tournament-finance',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tournament-finance.component.html'
})
export class TournamentFinanceComponent {
    @Input() data!: any;
}
