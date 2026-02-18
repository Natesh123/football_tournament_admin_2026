import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-hero',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './hero.component.html'
})
export class HeroComponent {
    @Output() createTournament = new EventEmitter<void>();

    onCreate() {
        this.createTournament.emit();
    }
}
