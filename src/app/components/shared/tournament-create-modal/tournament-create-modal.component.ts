import { Component, EventEmitter, Input, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TournamentService } from '../../../tournament/tournament.service';
import { LoaderComponent } from '../../loader/loader.component';
import { ValidationComponent } from '../../../shared/components/validation/validation.component';
import { revealAndFocusInvalid } from '../../../shared/utils/form.util';
import { Router } from '@angular/router';

@Component({
    selector: 'app-tournament-create-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, LoaderComponent, ValidationComponent],
    templateUrl: './tournament-create-modal.component.html'
})
export class TournamentCreateModalComponent {
    private tournamentService = inject(TournamentService);
    private router = inject(Router);
    private fb = inject(FormBuilder);

    @Input() show = false;
    @Output() onClose = new EventEmitter<void>();
    @Output() onSuccess = new EventEmitter<any>();

    isCreating = signal(false);
    todayDate = new Date().toISOString().split('T')[0];

    /** Derived from the chosen format; shown read-only, not user-editable. */
    minTeams = 3;

    form: FormGroup = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(80)]],
        description: ['', [Validators.maxLength(500)]],
        startDate: ['', [Validators.required]],
        endDate: [''],
        type: ['group'],
        maxTeams: ['16'],
        status: ['draft']
    }, { validators: [this.dateRangeValidator] });

    /** endDate (when provided) must not be before startDate. */
    private dateRangeValidator(group: AbstractControl): ValidationErrors | null {
        const start = group.get('startDate')?.value;
        const end = group.get('endDate');
        if (start && end?.value && end.value < start) {
            end.setErrors({ ...(end.errors ?? {}), dateRange: true });
        } else if (end?.hasError('dateRange')) {
            const e = { ...(end.errors ?? {}) }; delete e['dateRange'];
            end.setErrors(Object.keys(e).length ? e : null);
        }
        return null;
    }

    close() {
        this.resetForm();
        this.onClose.emit();
    }

    resetForm() {
        this.form.reset({
            name: '', description: '', startDate: '', endDate: '',
            type: 'group', maxTeams: '16', status: 'draft'
        });
        this.minTeams = 3;
    }

    onFormatChange() {
        switch (this.form.controls['type'].value) {
            case 'group': this.minTeams = 3; break;
            case 'knockout':
            case 'group_knockout': this.minTeams = 4; break;
            default: this.minTeams = 2; break;
        }
    }

    createTournament() {
        // No disabled button — validate required fields on click instead.
        if (!revealAndFocusInvalid(this.form)) {
            return;
        }
        this.isCreating.set(true);

        const v = this.form.getRawValue();
        this.tournamentService.create({
            name: v.name,
            description: v.description,
            startDate: v.startDate,
            endDate: v.endDate || v.startDate,
            maxTeams: Number(v.maxTeams),
            minTeams: this.minTeams,
            status: v.status,
            type: v.type,
        }).subscribe({
            next: (created) => {
                this.isCreating.set(false);
                this.onSuccess.emit(created);
                this.close();
                this.router.navigate(['/admin/tournaments', created.id]);
            },
            error: () => {
                this.isCreating.set(false);
            }
        });
    }
}
