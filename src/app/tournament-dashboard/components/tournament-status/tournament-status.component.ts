import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ValidationComponent } from '../../../shared/components/validation/validation.component';

/**
 * Status tab — consolidates Tournament Status, Visibility (from General) and
 * Approval Required (from Participation) into one place. Status/visibility belong
 * to settings.general; approvalRequired belongs to settings.participants, so the
 * component takes both objects and writes each field back to its owner.
 */
@Component({
    selector: 'app-tournament-status',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, ValidationComponent],
    template: `
    <form [formGroup]="form" class="space-y-8">
        <div>
            <h1 class="text-3xl font-black text-white tracking-tight">{{ 'TOURNAMENT_DASHBOARD.STATUS_TAB.TITLE' | translate }}</h1>
            <p class="text-zinc-500 mt-1.5">{{ 'TOURNAMENT_DASHBOARD.STATUS_TAB.SUBTITLE' | translate }}</p>
        </div>

        <div class="bg-black-card border border-black-border rounded-xl p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Tournament Status -->
                <div>
                    <label class="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block required-mark">{{ 'TOURNAMENT_DASHBOARD.GENERAL.FORM.STATUS' | translate }}</label>
                    <select formControlName="status"
                        class="w-full bg-white/5 border rounded-lg px-4 py-3 text-white focus:outline-none transition-all"
                        [ngClass]="invalid('status') ? 'border-red-500 ring-1 ring-red-500/50' : 'border-black-border focus:border-gold-400'">
                        <option value="draft" class="bg-black-card">{{ 'TOURNAMENT_DASHBOARD.GENERAL.STATUS.DRAFT' | translate }}</option>
                        <option value="registration_open" class="bg-black-card">{{ 'TOURNAMENT_DASHBOARD.GENERAL.STATUS.REGISTRATION' | translate }}</option>
                        <option value="in_progress" class="bg-black-card">{{ 'TOURNAMENT_DASHBOARD.GENERAL.STATUS.LIVE' | translate }}</option>
                        <option value="completed" class="bg-black-card">{{ 'TOURNAMENT_DASHBOARD.GENERAL.STATUS.COMPLETED' | translate }}</option>
                    </select>
                    <app-validation [control]="form.controls['status']" label="Tournament status" />
                </div>

                <!-- Visibility -->
                <div class="relative group">
                    <label class="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <span class="required-mark">{{ 'TOURNAMENT_DASHBOARD.GENERAL.FORM.VISIBILITY' | translate }}</span>
                        <span class="text-gold-400 cursor-help text-xs leading-none">&#9432;</span>
                    </label>
                    <!-- Tooltip -->
                    <div class="absolute z-20 left-0 bottom-full mb-2 hidden group-hover:block w-72
                                bg-zinc-900 border border-gold-400/40 text-zinc-300 text-xs rounded-lg px-4 py-3 shadow-xl pointer-events-none">
                        {{ 'TOURNAMENT_DASHBOARD.GENERAL.FORM.VISIBILITY_TOOLTIP' | translate }}
                    </div>
                    <div class="flex gap-4 mt-2">
                        <label class="cursor-pointer label flex items-center gap-2">
                            <input type="radio" formControlName="visibility" value="public" class="radio border-gold-400 checked:bg-gold-400" />
                            <span class="label-text text-white">{{ 'TOURNAMENT_DASHBOARD.GENERAL.FORM.PUBLIC' | translate }}</span>
                        </label>
                        <label class="cursor-pointer label flex items-center gap-2">
                            <input type="radio" formControlName="visibility" value="private" class="radio border-gold-400 checked:bg-gold-400" />
                            <span class="label-text text-white">{{ 'TOURNAMENT_DASHBOARD.GENERAL.FORM.PRIVATE' | translate }}</span>
                        </label>
                    </div>
                    <app-validation [control]="form.controls['visibility']" label="Visibility" />
                </div>
            </div>

            <!-- Approval Required -->
            <div class="pt-6 mt-2">
                <label class="cursor-pointer label flex items-center justify-between bg-white/5 border border-black-border rounded-lg px-4 py-3 hover:border-gold-400/50 transition-all">
                    <div>
                        <span class="label-text text-white font-bold block">{{ 'TOURNAMENT_DASHBOARD.PARTICIPANTS.APPROVAL_REQUIRED' | translate }}</span>
                        <span class="text-[10px] text-zinc-500 block mt-1">{{ 'TOURNAMENT_DASHBOARD.PARTICIPANTS.APPROVAL_HINT' | translate }}</span>
                    </div>
                    <input type="checkbox" formControlName="approvalRequired" class="toggle toggle-warning" />
                </label>
            </div>
        </div>
    </form>
    `
})
export class TournamentStatusComponent implements OnInit, OnChanges {
    /** settings.general — owns status + visibility. */
    @Input() generalData: any;
    /** settings.participants — owns approvalRequired. */
    @Input() participantsData: any;
    @Output() formReady = new EventEmitter<FormGroup>();

    private fb = inject(FormBuilder);
    form!: FormGroup;

    ngOnInit() { this.buildForm(); }
    ngOnChanges(changes: SimpleChanges) {
        if ((changes['generalData'] || changes['participantsData']) && this.generalData && this.participantsData) {
            this.buildForm();
        }
    }

    invalid(ctrl: string): boolean {
        const c = this.form?.controls[ctrl];
        return !!c && c.invalid && c.touched;
    }

    private buildForm() {
        if (!this.generalData || !this.participantsData) return;
        this.form = this.fb.group({
            status: [this.generalData.status || 'draft', [Validators.required]],
            visibility: [this.generalData.visibility || 'public', [Validators.required]],
            approvalRequired: [this.participantsData.approvalRequired ?? true]
        });
        this.form.valueChanges.subscribe(val => {
            this.generalData.status = val.status;
            this.generalData.visibility = val.visibility;
            this.participantsData.approvalRequired = val.approvalRequired;
        });
        this.formReady.emit(this.form);
    }
}
