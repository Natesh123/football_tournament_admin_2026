import { Component, EventEmitter, Input, Output, signal, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TournamentService } from '../../../tournament/tournament.service';
import { LoaderComponent } from '../../loader/loader.component';
import { ValidationComponent } from '../../../shared/components/validation/validation.component';
import { DatePickerComponent } from '../../../shared/components/date-picker/date-picker.component';
import { revealAndFocusInvalid } from '../../../shared/utils/form.util';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { SettingsService } from '../../../settings/settings.service';
import { UiService } from '../../../services/ui.service';

@Component({
    selector: 'app-tournament-create-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, LoaderComponent, ValidationComponent, DatePickerComponent],
    templateUrl: './tournament-create-modal.component.html'
})
export class TournamentCreateModalComponent implements OnChanges {
    private tournamentService = inject(TournamentService);
    private router = inject(Router);
    private fb = inject(FormBuilder);
    public auth = inject(AuthService);
    private settingsService = inject(SettingsService);
    private ui = inject(UiService);

    @Input() show = false;
    @Output() onClose = new EventEmitter<void>();
    @Output() onSuccess = new EventEmitter<any>();

    isCreating = signal(false);
    todayDate = new Date().toISOString().split('T')[0];

    // Admin Only: Organizer list and plan limit state
    organizerList = signal<any[]>([]);
    selectedOrganizerPlanInfo = signal<{ maxTournaments: number; createdCount: number; remaining: number } | null>(null);

    /** Derived from the chosen format; shown read-only, not user-editable. */
    minTeams = 3;

    form: FormGroup = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(80)]],
        description: ['', [Validators.maxLength(500)]],
        startDate: ['', [Validators.required]],
        endDate: [''],
        type: ['group'],
        maxTeams: ['16'],
        status: ['draft'],
        organizerId: ['']
    }, { validators: [this.dateRangeValidator] });

    ngOnChanges(changes: SimpleChanges) {
        if (changes['show'] && this.show && this.auth.isAdmin) {
            this.loadOrganizers();
        }
    }

    loadOrganizers() {
        this.settingsService.getUsers().subscribe({
            next: (users: any[]) => {
                let organizers = (users || []).filter(u => 
                    u.role?.toLowerCase() === 'organizer' || 
                    u.userRole?.name?.toLowerCase() === 'organizer' || 
                    u.roleId === 2
                );

                if (organizers.length === 0) {
                    organizers = [
                        { id: 101, user_name: 'Vignesh Sports Club', email: 'vignesh@organizer.com', role: 'organizer', plan: 'Basic', maxTournaments: 5, remainingTournaments: 4 },
                        { id: 102, user_name: 'Metro Football Association', email: 'metro@football.com', role: 'organizer', plan: 'Premium', maxTournaments: -1, remainingTournaments: 999 }
                    ];
                } else {
                    organizers = organizers.map(o => {
                        const savedRem = localStorage.getItem(`organizer_remaining_tournaments_${o.id}`);
                        const maxT = o.plan === 'Premium' ? -1 : (o.maxTournaments || 5);
                        const rem = savedRem !== null ? parseInt(savedRem, 10) : (maxT === -1 ? 999 : Math.max(0, maxT - 1));
                        return { ...o, maxTournaments: maxT, remainingTournaments: rem };
                    });
                }
                this.organizerList.set(organizers);
            },
            error: () => {
                this.organizerList.set([
                    { id: 101, user_name: 'Vignesh Sports Club', email: 'vignesh@organizer.com', role: 'organizer', plan: 'Basic', maxTournaments: 5, remainingTournaments: 4 },
                    { id: 102, user_name: 'Metro Football Association', email: 'metro@football.com', role: 'organizer', plan: 'Premium', maxTournaments: -1, remainingTournaments: 999 }
                ]);
            }
        });
    }

    onOrganizerChange() {
        const orgId = Number(this.form.controls['organizerId'].value);
        const org = this.organizerList().find(o => o.id === orgId);
        if (org) {
            const max = org.maxTournaments !== undefined ? org.maxTournaments : 5;
            const remaining = org.remainingTournaments !== undefined ? org.remainingTournaments : 4;
            const created = max === -1 ? 1 : Math.max(0, max - remaining);
            this.selectedOrganizerPlanInfo.set({
                maxTournaments: max,
                createdCount: created,
                remaining: remaining
            });
        } else {
            this.selectedOrganizerPlanInfo.set(null);
        }
    }

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
            type: 'group', maxTeams: '16', status: 'draft', organizerId: ''
        });
        this.minTeams = 3;
        this.selectedOrganizerPlanInfo.set(null);
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
        if (this.auth.isAdmin && !this.form.controls['organizerId'].value && this.organizerList().length > 0) {
            this.form.controls['organizerId'].setErrors({ required: true });
        }

        if (!revealAndFocusInvalid(this.form)) {
            return;
        }

        this.isCreating.set(true);
        const v = this.form.getRawValue();

        const payload: any = {
            name: v.name,
            description: v.description,
            startDate: v.startDate,
            endDate: v.endDate || v.startDate,
            maxTeams: Number(v.maxTeams),
            minTeams: this.minTeams,
            status: v.status,
            type: v.type,
        };

        if (this.auth.isAdmin && v.organizerId) {
            payload.organizerId = Number(v.organizerId);
        }

        this.tournamentService.create(payload).subscribe({
            next: (created) => {
                this.isCreating.set(false);

                // Subtraction of 1 from selected Organizer's plan remaining tournament count
                if (this.auth.isAdmin && v.organizerId) {
                    const targetOrgId = Number(v.organizerId);
                    const targetOrg = this.organizerList().find(o => o.id === targetOrgId);

                    if (targetOrg) {
                        const currentRem = targetOrg.remainingTournaments !== undefined ? targetOrg.remainingTournaments : 5;
                        const newRem = Math.max(0, currentRem - 1);
                        targetOrg.remainingTournaments = newRem;
                        localStorage.setItem(`organizer_remaining_tournaments_${targetOrgId}`, String(newRem));

                        this.ui.showToast(
                            `Tournament created! 1 tournament count deducted from ${targetOrg.user_name || 'Organizer'}'s plan (${newRem} remaining)`,
                            'success'
                        );
                    }
                }

                this.onSuccess.emit(created);
                this.close();
                this.router.navigate(['/admin/tournaments', created.id]);
            },
            error: (err) => {
                this.isCreating.set(false);
                const msg = err.error?.message || 'Failed to create tournament';
                this.ui.showToast(msg, 'error');
            }
        });
    }
}
