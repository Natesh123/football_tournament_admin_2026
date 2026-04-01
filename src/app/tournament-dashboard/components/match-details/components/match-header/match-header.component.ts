import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-match-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './match-header.component.html'
})
export class MatchHeaderComponent implements OnInit, OnDestroy, OnChanges {
    @Input() match: any;
    @Input() isLoading = false;

    @Output() editMatch = new EventEmitter<void>();
    @Output() addLineup = new EventEmitter<void>();
    @Output() startMatch = new EventEmitter<void>();
    @Output() completeMatch = new EventEmitter<void>();

    countdown: string = '';
    liveMinute: number = 0;
    private timer: any;

    ngOnInit() {
        this.initTimer();
    }

    ngOnChanges() {
        this.initTimer();
    }

    ngOnDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    private initTimer() {
        if (this.timer) clearInterval(this.timer);

        if (this.match?.status === 'scheduled') {
            this.updateCountdown();
            this.timer = setInterval(() => this.updateCountdown(), 60000);
        } else if (this.match?.status === 'live') {
            this.updateLiveTimer();
            this.timer = setInterval(() => this.updateLiveTimer(), 10000); // update every 10 seconds for accuracy
        }
    }

    private updateLiveTimer() {
        if (!this.match?.periodStartedAt) {
            this.liveMinute = this.match?.live_minute || 0;
            return;
        }
        const now = new Date().getTime();
        const start = new Date(this.match.periodStartedAt).getTime();
        const diff = Math.floor((now - start) / 60000);
        this.liveMinute = Math.max(0, diff + (this.match.live_minute || 0));
    }

    private updateCountdown() {
        if (!this.match?.startTime) return;

        const now = new Date().getTime();
        const matchTime = new Date(this.match.startTime).getTime();
        const diff = matchTime - now;

        if (diff <= 0) {
            this.countdown = 'Started';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            this.countdown = `${days}d ${hours}h`;
        } else {
            this.countdown = `${hours}h ${minutes}m`;
        }
    }
}
