import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-match-tabs',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './match-tabs.component.html'
})
export class MatchTabsComponent {
    @Input() activeTab: 'timeline' | 'stats' | 'info' | 'h2h' | 'form' | 'standings' = 'info';
    @Output() tabChange = new EventEmitter<'timeline' | 'stats' | 'info' | 'h2h' | 'form' | 'standings'>();

    onTabClick(tab: 'timeline' | 'stats' | 'info' | 'h2h' | 'form' | 'standings') {
        this.tabChange.emit(tab);
    }
}
