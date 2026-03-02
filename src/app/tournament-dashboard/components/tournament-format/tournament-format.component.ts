import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tournament-format',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tournament-format.component.html'
})
export class TournamentFormatComponent {
    @Input() data!: any;
}
