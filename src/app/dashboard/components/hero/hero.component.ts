import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-hero',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './hero.component.html'
})
export class HeroComponent {
    @Output() createTournament = new EventEmitter<void>();

    onCreate() {
        this.createTournament.emit();
    }
}
