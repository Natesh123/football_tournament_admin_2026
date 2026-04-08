import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-h2h',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './h2h.component.html'
})
export class H2hComponent implements OnInit {
    @Input() homeTeam: any;
    @Input() awayTeam: any;
    @Input() h2hData: any;
    @Input() mode: 'all' | 'form' | 'h2h' | 'standings' = 'all';

    homeForm: string[] = [];
    awayForm: string[] = [];
    previousMatches: any[] = [];
    groupStandings: any = null;

    ngOnInit() {
        if (this.h2hData) {
            this.homeForm = this.h2hData.homeTeamForm || [];
            this.awayForm = this.h2hData.awayTeamForm || [];
            this.previousMatches = this.h2hData.previousEncounters || [];
            this.groupStandings = this.h2hData.groupStandings || null;
        }
    }

    getFormColor(result: string): string {
        if (result === 'W') return 'bg-green-500 text-black border-green-600';
        if (result === 'L') return 'bg-red-500 text-white border-red-600';
        if (result === 'D') return 'bg-zinc-500 text-white border-zinc-600';
        return 'bg-zinc-800 text-zinc-500 border-zinc-700'; // Unknown or empty
    }
}
