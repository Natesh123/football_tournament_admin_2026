import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tournament-venues',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tournament-venues.component.html'
})
export class TournamentVenuesComponent implements OnInit {
    @Input() data!: any;

    ngOnInit() {
        if (!this.data.pitches) {
            this.data.pitches = [];
        }
    }

    addPitch() {
        if (!this.data.pitches) {
            this.data.pitches = [];
        }
        
        this.data.pitches.push({
            id: Date.now().toString(),
            name: `Pitch ${this.data.pitches.length + 1}`,
            type: this.data.fieldType || 'grass'
        });
        
        // Auto-sync total pitches count
        if (this.data.multipleVenues) {
            this.data.pitchCount = this.data.pitches.length;
        }
    }

    removePitch(index: number) {
        this.data.pitches.splice(index, 1);
        if (this.data.multipleVenues) {
            this.data.pitchCount = this.data.pitches.length || 1;
        }
    }

}
