import { Component, Input, Output, EventEmitter, ChangeDetectorRef, inject, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { API_URL } from '../../../core/config/app.config';
import { TranslateModule } from '@ngx-translate/core';
import { ValidationComponent } from '../../../shared/components/validation/validation.component';

@Component({
    selector: 'app-tournament-general',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        ValidationComponent
    ],
    templateUrl: './tournament-general.component.html'
})
export class TournamentGeneralComponent implements OnInit, OnChanges {
    @Input() data: any;
    @Input() showValidationErrors = false;
    /** Emits the reactive form so the wizard can validate this tab on Save / Save & Next. */
    @Output() formReady = new EventEmitter<FormGroup>();

    private cdr = inject(ChangeDetectorRef);
    private fb = inject(FormBuilder);

    form!: FormGroup;
    private validTypes = ['futsal', '7aside', '11aside', 'custom'];

    ngOnInit() {
        this.buildForm();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['data'] && this.data) {
            this.buildForm();
        }
    }

    private buildForm() {
        if (!this.data) return;
        const type = this.validTypes.includes(this.data.type) ? this.data.type : '11aside';

        this.form = this.fb.group({
            name: [this.data.name || '', [Validators.required, Validators.maxLength(80)]],
            shortName: [this.data.shortName || '', [Validators.maxLength(20)]],
            type: [type, [Validators.required]],
            description: [this.data.description || '', [Validators.maxLength(500)]]
        });

        // Keep the shared settings object in sync so the parent's single save payload stays correct.
        // (Organizer fields now live in the dedicated Organizer tab.)
        this.form.valueChanges.subscribe(val => Object.assign(this.data, val));

        // Persist the normalized type back immediately if it was defaulted.
        if (this.data.type !== type) this.data.type = type;

        this.formReady.emit(this.form);
    }

    // ── Image upload (kept outside the form; stored directly on `data`) ──────
    onFileSelected(event: any, field: 'logo' | 'coverImage') {
        const input = event.target;
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.data[field] = e.target.result;
                this.cdr.detectChanges(); // Required for Zoneless
            };
            reader.readAsDataURL(file);
        }
        input.value = '';
    }

    removeImage(field: 'logo' | 'coverImage', event: Event) {
        event.stopPropagation();
        this.data[field] = '';
        this.cdr.detectChanges();
    }

    getImageUrl(path?: string): string {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    }
}
