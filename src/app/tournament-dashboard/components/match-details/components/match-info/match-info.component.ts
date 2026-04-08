import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-match-info',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './match-info.component.html'
})
export class MatchInfoComponent {
    @Input() match: any;
    @Input() homeLineup: any;
    @Input() awayLineup: any;
}
