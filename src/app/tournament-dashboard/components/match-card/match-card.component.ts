import { Component, Input, Output, EventEmitter, OnChanges, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { formatLiveClock } from '../../../core/utils/live-clock.util';

@Component({
    selector: 'app-match-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './match-card.component.html'
})
export class MatchCardComponent implements OnChanges, OnDestroy {
    @Input() match: any;
    @Input() activeTab: string = 'scheduled';
    @Output() cardClick = new EventEmitter<number>();

    // Signal so the ticking clock re-renders under zoneless change detection.
    liveClock = signal('');
    private timer: any;

    ngOnChanges() {
        this.initTimer();
    }

    ngOnDestroy() {
        if (this.timer) clearInterval(this.timer);
    }

    private initTimer() {
        if (this.timer) clearInterval(this.timer);
        if (this.match?.status === 'live') {
            this.updateClock();
            this.timer = setInterval(() => this.updateClock(), 1000);
        } else {
            this.liveClock.set('');
        }
    }

    private updateClock() {
        this.liveClock.set(formatLiveClock(this.match));
    }

    onClick() {
        if (this.match && this.match.id) {
            this.cardClick.emit(this.match.id);
        }
    }
}
