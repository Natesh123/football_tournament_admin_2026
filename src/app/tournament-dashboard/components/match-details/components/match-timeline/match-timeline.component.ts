import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-match-timeline',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './match-timeline.component.html'
})
export class MatchTimelineComponent {
    @Input() match: any;
    @Input() events: any[] = [];
    @Output() addEvent = new EventEmitter<void>();
    @Output() editEvent = new EventEmitter<any>();
    @Output() deleteEvent = new EventEmitter<string>();

    get sortedEvents() {
        return [...this.events].sort((a, b) => {
            const minA = a.minute || 0;
            const minB = b.minute || 0;
            return minA - minB;
        });
    }

    onAddEvent() {
        this.addEvent.emit();
    }

    onEditEvent(event: any) {
        this.editEvent.emit(event);
    }

    onDeleteEvent(eventId: string) {
        if (confirm('Are you sure you want to delete this event?')) {
            this.deleteEvent.emit(eventId);
        }
    }
}
