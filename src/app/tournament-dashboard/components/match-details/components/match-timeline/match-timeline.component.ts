import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-match-timeline',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './match-timeline.component.html'
})
export class MatchTimelineComponent {
    @Input() match: any;
    @Input() events: any[] = [];
    @Input() homeLineup: any;
    @Input() awayLineup: any;
    @Input() isLoading = false;
    @Output() addEvent = new EventEmitter<void>();
    @Output() editEvent = new EventEmitter<any>();
    @Output() deleteEvent = new EventEmitter<string>();

    get sortedEvents() {
        const list = [...this.events];
        
        // Add virtual lineup event if lineups are configured
        if (this.homeLineup || this.awayLineup) {
            list.push({
                id: 'virtual_lineup',
                type: 'lineup_announced',
                minute: -1, // Appears at the very top
                playerName: 'MATCH_DETAILS.TIMELINE.LINEUPS_ANNOUNCED',
                details: 'MATCH_DETAILS.TIMELINE.LINEUPS_ANNOUNCED_DESC',
                teamSide: 'center'
            });
        }

        return list.sort((a, b) => {
            const minA = a.minute || 0;
            const minB = b.minute || 0;
            return minA - minB;
        });
    }

    onAddEvent() {
        this.addEvent.emit();
    }

    getEventSide(event: any): 'home' | 'away' | 'center' {
        if (event.teamSide === 'center') return 'center'; // e.g. for virtual_lineup inside sortedEvents
        if (event.teamSide === 'away' || event.team === 'away') return 'away';
        if (event.teamSide === 'home' || event.team === 'home') return 'home';
        
        // Fallback checks using deep Team objects
        if (event.team?.id && this.match?.awayTeam?.id && String(event.team.id) === String(this.match.awayTeam.id)) return 'away';
        if (event.team?.id && this.match?.homeTeam?.id && String(event.team.id) === String(this.match.homeTeam.id)) return 'home';
        
        return 'home'; // default
    }

    onEditEvent(event: any) {
        this.editEvent.emit(event);
    }

    onDeleteEvent(eventId: string) {
        this.deleteEvent.emit(eventId);
    }
}
