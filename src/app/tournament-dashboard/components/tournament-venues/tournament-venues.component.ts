import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ValidationComponent } from '../../../shared/components/validation/validation.component';

@Component({
    selector: 'app-tournament-venues',
    standalone: true,
    // FormsModule kept for the dynamic pitches array (ngModel); ReactiveForms for the validated config card.
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, ValidationComponent],
    templateUrl: './tournament-venues.component.html'
})
export class TournamentVenuesComponent implements OnInit, OnChanges {
    @Input() data!: any;
    @Input() showValidationErrors = false;
    @Output() formReady = new EventEmitter<FormGroup>();

    private fb = inject(FormBuilder);
    form!: FormGroup;

    ngOnInit() {
        if (!this.data.pitches) this.data.pitches = [];
        this.buildForm();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['data'] && this.data) {
            if (!this.data.pitches) this.data.pitches = [];
            this.buildForm();
        }
    }

    private buildForm() {
        if (!this.data) return;
        this.form = this.fb.group({
            multipleVenues: [this.data.multipleVenues ?? false],
            primaryVenue: [this.data.primaryVenue || '', [Validators.required, Validators.maxLength(120)]],
            venueAddress: [this.data.venueAddress || ''],
            pitchCount: [this.data.pitchCount ?? 1, [Validators.min(1)]],
            fieldType: [this.data.fieldType || 'grass']
        });
        this.form.valueChanges.subscribe(val => Object.assign(this.data, val));
        this.formReady.emit(this.form);
    }

    addPitch() {
        if (!this.data.pitches) this.data.pitches = [];
        this.data.pitches.push({
            id: Date.now().toString(),
            name: `Location ${this.data.pitches.length + 1}`,
            type: this.data.fieldType || 'grass',
            location: ''
        });
        if (this.form.value.multipleVenues) {
            this.form.patchValue({ pitchCount: this.data.pitches.length });
        }
    }

    removePitch(index: number) {
        this.data.pitches.splice(index, 1);
        if (this.form.value.multipleVenues) {
            this.form.patchValue({ pitchCount: this.data.pitches.length || 1 });
        }
    }
}
