import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tournament-rules',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tournament-rules.component.html',
    styleUrls: ['./tournament-rules.css']
})
export class TournamentRulesComponent {
    @Input() data!: any;

    get isNoExtraTime(): boolean {
        return this.data?.extraTimeRule === 'None';
    }

    onExtraTimeChange(): void {
        if (this.isNoExtraTime) {
            this.data.penaltiesRule = false;
        }
    }

    stepperDecrement(field: string, min: number): void {
        if (this.data[field] > min) {
            this.data[field]--;
        }
    }

    stepperIncrement(field: string, max: number): void {
        if (this.data[field] < max) {
            this.data[field]++;
        }
    }
}
