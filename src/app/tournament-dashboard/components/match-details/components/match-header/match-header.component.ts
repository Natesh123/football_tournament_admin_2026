import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { inject } from '@angular/core';
import { formatLiveClock, getLiveMinute } from '../../../../../core/utils/live-clock.util';

@Component({
    selector: 'app-match-header',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './match-header.component.html'
})
export class MatchHeaderComponent implements OnInit, OnDestroy, OnChanges {
    private translate = inject(TranslateService);
    @Input() match: any;
    @Input() isLoading = false;
    // Whether both teams have a complete, valid lineup. Gates the Start Match button.
    @Input() canStart = false;

    @Output() editMatch = new EventEmitter<void>();
    @Output() addLineup = new EventEmitter<void>();
    @Output() startMatch = new EventEmitter<void>();
    @Output() completeMatch = new EventEmitter<void>();

    // Signals so the ticking clock re-renders under zoneless change detection.
    countdown = signal('');
    liveMinute = signal(0);
    liveClock = signal('0:00');
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
            this.timer = setInterval(() => this.updateLiveTimer(), 1000); // tick every second to keep the clock running
        }
    }

    private updateLiveTimer() {
        const now = Date.now();
        this.liveMinute.set(getLiveMinute(this.match, now));
        this.liveClock.set(formatLiveClock(this.match, now));
    }

    private updateCountdown() {
        if (!this.match?.startTime) return;

        const now = new Date().getTime();
        const matchTime = new Date(this.match.startTime).getTime();
        const diff = matchTime - now;

        if (diff <= 0) {
            this.countdown.set(this.translate.instant('MATCH_DETAILS.HEADER.LIVE'));
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            this.countdown.set(`${days}d ${hours}h`);
        } else {
            this.countdown.set(`${hours}h ${minutes}m`);
        }
    }
}
