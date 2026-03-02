import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tournament-rules',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tournament-rules.component.html'
})
export class TournamentRulesComponent {
    @Input() data!: any;
}
