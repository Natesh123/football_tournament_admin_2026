import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tournament-schedule',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tournament-schedule.component.html'
})
export class TournamentScheduleComponent {
    @Input() data!: any;

    toggleDay(day: string) {
        this.data.matchDays[day] = !this.data.matchDays[day];
    }
}
