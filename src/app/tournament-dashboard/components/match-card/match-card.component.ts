import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-match-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './match-card.component.html'
})
export class MatchCardComponent {
    @Input() match: any;
    @Input() activeTab: string = 'scheduled';
    @Output() cardClick = new EventEmitter<number>();

    onClick() {
        if (this.match && this.match.id) {
            this.cardClick.emit(this.match.id);
        }
    }
}
