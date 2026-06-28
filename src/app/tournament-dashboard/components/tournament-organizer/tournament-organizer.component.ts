import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ValidationComponent } from '../../../shared/components/validation/validation.component';
import { AuthService } from '../../../auth/auth.service';

/**
 * Dedicated Organizer tab. Owns all organizer-related fields (previously embedded
 * in the General tab) and validates the required ones via the shared
 * <app-validation> component. Writes back into the shared settings object so the
 * parent's single save payload is unchanged.
 */
@Component({
    selector: 'app-tournament-organizer',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, ValidationComponent],
    template: `
    <form [formGroup]="form" class="space-y-8">
        <div>
            <h1 class="text-3xl font-black text-white tracking-tight">{{ 'TOURNAMENT_DASHBOARD.ORGANIZER.TITLE' | translate }}</h1>
            <p class="text-zinc-500 mt-1.5">{{ 'TOURNAMENT_DASHBOARD.ORGANIZER.SUBTITLE' | translate }}</p>
        </div>

        <div class="bg-black-card border border-black-border rounded-xl p-6">
            <h2 class="text-lg font-bold text-white mb-6">{{ 'TOURNAMENT_DASHBOARD.ORGANIZER.DETAILS' | translate }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Name -->
                <div>
                    <label class="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block required-mark">{{ 'TOURNAMENT_DASHBOARD.ORGANIZER.NAME' | translate }}</label>
                    <input type="text" formControlName="name"
                        [placeholder]="'TOURNAMENT_DASHBOARD.ORGANIZER.PLACEHOLDERS.NAME' | translate"
                        class="w-full bg-white/5 border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                        [ngClass]="invalid('name') ? 'border-red-500 ring-1 ring-red-500/50' : 'border-black-border focus:border-gold-400'" />
                    <app-validation [control]="form.controls['name']" label="Organizer name" />
                </div>
                <!-- Email -->
                <div>
                    <label class="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block required-mark">{{ 'TOURNAMENT_DASHBOARD.ORGANIZER.EMAIL' | translate }}</label>
                    <input type="email" formControlName="email"
                        [placeholder]="'TOURNAMENT_DASHBOARD.ORGANIZER.PLACEHOLDERS.EMAIL' | translate"
                        class="w-full bg-white/5 border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                        [ngClass]="invalid('email') ? 'border-red-500 ring-1 ring-red-500/50' : 'border-black-border focus:border-gold-400'" />
                    <app-validation [control]="form.controls['email']" label="Organizer email" />
                </div>
                <!-- Phone -->
                <div>
                    <label class="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block required-mark">{{ 'TOURNAMENT_DASHBOARD.ORGANIZER.PHONE' | translate }}</label>
                    <input type="tel" formControlName="phone"
                        [placeholder]="'TOURNAMENT_DASHBOARD.ORGANIZER.PLACEHOLDERS.PHONE' | translate"
                        class="w-full bg-white/5 border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                        [ngClass]="invalid('phone') ? 'border-red-500 ring-1 ring-red-500/50' : 'border-black-border focus:border-gold-400'" />
                    <app-validation [control]="form.controls['phone']" label="Organizer phone number" />
                </div>
                <!-- Website (optional) -->
                <div>
                    <label class="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1 block">{{ 'TOURNAMENT_DASHBOARD.ORGANIZER.WEBSITE' | translate }}</label>
                    <input type="url" formControlName="website"
                        [placeholder]="'TOURNAMENT_DASHBOARD.ORGANIZER.PLACEHOLDERS.WEBSITE' | translate"
                        class="w-full bg-white/5 border border-black-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-gold-400 focus:outline-none transition-all" />
                    <app-validation [control]="form.controls['website']" label="Website" />
                </div>
            </div>
        </div>
    </form>
    `
})
export class TournamentOrganizerComponent implements OnInit, OnChanges {
    @Input() data: any;
    @Output() formReady = new EventEmitter<FormGroup>();

    private fb = inject(FormBuilder);
    private auth = inject(AuthService);
    form!: FormGroup;

    ngOnInit() { this.buildForm(); }
    ngOnChanges(changes: SimpleChanges) { if (changes['data'] && this.data) this.buildForm(); }

    invalid(ctrl: string): boolean {
        const c = this.form?.controls[ctrl];
        return !!c && c.invalid && c.touched;
    }

    private buildForm() {
        if (!this.data) return;

        // Pre-fill empty organizer fields with the logged-in admin's details, and
        // persist them back so the defaults are saved with the tournament.
        const admin = this.auth.user || {};
        const name = this.data.name || admin.name || admin.user_name || '';
        const email = this.data.email || admin.email || '';
        const phone = this.data.phone || admin.phone_number || admin.phone || '';
        this.data.name = name;
        this.data.email = email;
        this.data.phone = phone;

        this.form = this.fb.group({
            name: [name, [Validators.required, Validators.maxLength(80)]],
            email: [email, [Validators.required, Validators.email]],
            phone: [phone, [Validators.required, Validators.pattern(/^[0-9+\-\s()]{6,20}$/)]],
            website: [this.data.website || '', [Validators.pattern(/^https?:\/\/.+/)]]
        });
        this.form.valueChanges.subscribe(val => Object.assign(this.data, val));
        this.formReady.emit(this.form);
    }
}
