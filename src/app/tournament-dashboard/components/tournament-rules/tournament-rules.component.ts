import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-tournament-rules',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: './tournament-rules.component.html',
    styleUrls: ['./tournament-rules.css']
})
export class TournamentRulesComponent {
    private translate = inject(TranslateService);
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
