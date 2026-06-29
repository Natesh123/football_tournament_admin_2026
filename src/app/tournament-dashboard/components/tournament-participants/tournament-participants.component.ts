import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ValidationComponent } from '../../../shared/components/validation/validation.component';

@Component({
    selector: 'app-tournament-participants',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, ValidationComponent],
    templateUrl: './tournament-participants.component.html'
})
export class TournamentParticipantsComponent implements OnInit, OnChanges {
    @Input() data: any;
    @Output() formReady = new EventEmitter<FormGroup>();

    private fb = inject(FormBuilder);
    form!: FormGroup;
    todayDate = new Date().toISOString().split('T')[0];

    ngOnInit() { this.buildForm(); }
    ngOnChanges(changes: SimpleChanges) { if (changes['data'] && this.data) this.buildForm(); }

    private buildForm() {
        if (!this.data) return;
        this.form = this.fb.group({
            minTeams: [this.data.minTeams ?? 2, [Validators.required, Validators.min(2)]],
            maxTeams: [this.data.maxTeams ?? 2, [Validators.required, Validators.min(2)]],
            squadSize: [this.data.squadSize ?? 1, [Validators.required, Validators.min(1)]],
            playerLimit: [this.data.playerLimit ?? 1, [Validators.required, Validators.min(1)]],
            regOpenDate: [this.data.regOpenDate || '', [Validators.required]],
            regCloseDate: [this.data.regCloseDate || '', [Validators.required]],
            regFee: [this.data.regFee ?? 0, [Validators.min(0)]]
        }, { validators: [this.crossFieldValidator] });

        this.form.valueChanges.subscribe(val => Object.assign(this.data, val));
        this.formReady.emit(this.form);
    }

    /** maxTeams >= minTeams, and regCloseDate >= regOpenDate. */
    private crossFieldValidator = (group: AbstractControl): ValidationErrors | null => {
        const min = group.get('minTeams');
        const max = group.get('maxTeams');
        if (min && max && max.value != null && min.value != null && +max.value < +min.value) {
            max.setErrors({ ...(max.errors ?? {}), teamRange: true });
        } else if (max?.hasError('teamRange')) {
            const e = { ...(max.errors ?? {}) }; delete e['teamRange'];
            max.setErrors(Object.keys(e).length ? e : null);
        }

        const open = group.get('regOpenDate');
        const close = group.get('regCloseDate');
        if (open?.value && close?.value && close.value < open.value) {
            close.setErrors({ ...(close.errors ?? {}), dateRange: true });
        } else if (close?.hasError('dateRange')) {
            const e = { ...(close.errors ?? {}) }; delete e['dateRange'];
            close.setErrors(Object.keys(e).length ? e : null);
        }
        return null;
    };
}
