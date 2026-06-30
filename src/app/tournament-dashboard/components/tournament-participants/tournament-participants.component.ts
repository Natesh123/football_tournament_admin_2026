import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ValidationComponent } from '../../../shared/components/validation/validation.component';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';

@Component({
    selector: 'app-tournament-participants',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, ValidationComponent, DatePickerComponent],
    templateUrl: './tournament-participants.component.html'
})
export class TournamentParticipantsComponent implements OnInit, OnChanges {
    @Input() data: any;
    /** Tournament start date (yyyy-MM-dd). Registration must close before this. */
    @Input() startDate?: string;
    @Output() formReady = new EventEmitter<FormGroup>();

    private fb = inject(FormBuilder);
    form!: FormGroup;
    todayDate = new Date().toISOString().split('T')[0];

    ngOnInit() { this.buildForm(); }
    ngOnChanges(changes: SimpleChanges) {
        if (changes['data'] && this.data) this.buildForm();
        // Re-run cross-field validation when the start date changes from another tab.
        else if (changes['startDate'] && this.form) this.form.updateValueAndValidity();
    }

    /** Latest allowed registration-close date: the day before the tournament start. */
    get regCloseMax(): string {
        const m = this.startDate?.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (!m) return '';
        const d = new Date(+m[1], +m[2] - 1, +m[3]);
        d.setDate(d.getDate() - 1);
        const y = d.getFullYear(), mo = String(d.getMonth() + 1).padStart(2, '0'), da = String(d.getDate()).padStart(2, '0');
        return `${y}-${mo}-${da}`;
    }

    private buildForm() {
        if (!this.data) return;
        this.form = this.fb.group({
            minTeams: [this.data.minTeams ?? 2, [Validators.required, Validators.min(2)]],
            maxTeams: [this.data.maxTeams ?? 2, [Validators.required, Validators.min(2)]],
            squadSize: [this.data.squadSize ?? 1, [Validators.required, Validators.min(1)]],
            playerLimit: [this.data.playerLimit ?? 1, [Validators.min(1)]],
            regOpenDate: [this.data.regOpenDate || '', [Validators.required]],
            regCloseDate: [this.data.regCloseDate || '', [Validators.required]],
            regFee: [this.data.regFee ?? 0, [Validators.min(0)]]
        }, { validators: [this.crossFieldValidator] });

        this.form.valueChanges.subscribe(val => Object.assign(this.data, val));
        this.formReady.emit(this.form);
    }

    /** maxTeams >= minTeams, playerLimit (max squad) >= squadSize (min squad),
     *  regCloseDate >= regOpenDate, and regCloseDate < tournament startDate. */
    private crossFieldValidator = (group: AbstractControl): ValidationErrors | null => {
        const min = group.get('minTeams');
        const max = group.get('maxTeams');
        if (min && max && max.value != null && min.value != null && +max.value < +min.value) {
            max.setErrors({ ...(max.errors ?? {}), teamRange: true });
        } else if (max?.hasError('teamRange')) {
            const e = { ...(max.errors ?? {}) }; delete e['teamRange'];
            max.setErrors(Object.keys(e).length ? e : null);
        }

        const squadMin = group.get('squadSize');
        const squadMax = group.get('playerLimit');
        if (squadMin && squadMax && squadMax.value != null && squadMin.value != null && +squadMax.value < +squadMin.value) {
            squadMax.setErrors({ ...(squadMax.errors ?? {}), squadRange: true });
        } else if (squadMax?.hasError('squadRange')) {
            const e = { ...(squadMax.errors ?? {}) }; delete e['squadRange'];
            squadMax.setErrors(Object.keys(e).length ? e : null);
        }

        const open = group.get('regOpenDate');
        const close = group.get('regCloseDate');
        if (open?.value && close?.value && close.value < open.value) {
            close.setErrors({ ...(close.errors ?? {}), dateRange: true });
        } else if (close?.hasError('dateRange')) {
            const e = { ...(close.errors ?? {}) }; delete e['dateRange'];
            close.setErrors(Object.keys(e).length ? e : null);
        }

        // Registration must close before the tournament start date.
        if (this.startDate && close?.value && close.value >= this.startDate) {
            close.setErrors({ ...(close.errors ?? {}), closeBeforeStart: true });
        } else if (close?.hasError('closeBeforeStart')) {
            const e = { ...(close.errors ?? {}) }; delete e['closeBeforeStart'];
            close.setErrors(Object.keys(e).length ? e : null);
        }
        return null;
    };
}
