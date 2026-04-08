import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-match-tabs',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './match-tabs.component.html'
})
export class MatchTabsComponent {
    @Input() activeTab: 'timeline' | 'stats' | 'info' | 'standings' = 'info';
    @Input() showStandings: boolean = true;
    @Output() tabChange = new EventEmitter<'timeline' | 'stats' | 'info' | 'standings'>();

    onTabClick(tab: 'timeline' | 'stats' | 'info' | 'standings') {
        this.tabChange.emit(tab);
    }
}
