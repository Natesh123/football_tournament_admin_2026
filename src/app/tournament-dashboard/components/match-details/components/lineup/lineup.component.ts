import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-lineup',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './lineup.component.html'
})
export class LineupComponent {
    @Input() homeTeam: any;
    @Input() awayTeam: any;
    @Input() homeLineup: any;
    @Input() awayLineup: any;

    // Helpers to safely extract lineup arrays
    get homeStarting() {
        return this.homeLineup?.starting || [];
    }

    get homeSubs() {
        return this.homeLineup?.subs || [];
    }

    get awayStarting() {
        return this.awayLineup?.starting || [];
    }

    get awaySubs() {
        return this.awayLineup?.subs || [];
    }
}
