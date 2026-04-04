import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-match-info',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './match-info.component.html'
})
export class MatchInfoComponent {
    @Input() match: any;
}
