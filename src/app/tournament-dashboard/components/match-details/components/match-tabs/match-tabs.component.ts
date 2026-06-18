import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export type MatchTab = 'timeline' | 'stats' | 'info' | 'extra_time' | 'penalties' | 'standings';

@Component({
    selector: 'app-match-tabs',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './match-tabs.component.html'
})
export class MatchTabsComponent {
    @Input() activeTab: MatchTab = 'info';
    @Input() showStandings: boolean = true;
    @Input() showExtraTime: boolean = false;
    @Input() showPenalties: boolean = false;
    @Output() tabChange = new EventEmitter<MatchTab>();

    onTabClick(tab: MatchTab) {
        this.tabChange.emit(tab);
    }
}
