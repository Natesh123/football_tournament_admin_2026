import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Plan, PlanService, PLAN_CURRENCY } from './plan.service';
import { UiService } from '../services/ui.service';

@Component({
    selector: 'app-plan-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    @if (isOpen) {
    <div class="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4 sm:p-8"
         (click)="onBackdrop($event)">
      <div class="relative w-full max-w-3xl bg-black-card border border-black-border rounded-2xl shadow-2xl my-4"
           (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-black-border">
          <h2 class="text-xl font-bold text-white">{{ mode === 'edit' ? 'Edit Plan' : 'Create Plan' }}</h2>
          <button type="button" (click)="close()" class="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="px-6 py-5 space-y-6">
          <!-- Details -->
          <div>
            <h3 class="text-xs font-bold uppercase tracking-widest text-gold-400 mb-3">Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs text-zinc-500 uppercase font-bold">Plan Name *</label>
                <input formControlName="name" type="text" class="inp" />
              </div>
              <div class="space-y-1">
                <label class="text-xs text-zinc-500 uppercase font-bold">Plan Code *</label>
                <input formControlName="code" type="text" placeholder="e.g. LEAGUE" class="inp uppercase" />
              </div>
              <div class="space-y-1 md:col-span-2">
                <label class="text-xs text-zinc-500 uppercase font-bold">Description</label>
                <textarea formControlName="description" rows="2" class="inp"></textarea>
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div>
            <h3 class="text-xs font-bold uppercase tracking-widest text-gold-400 mb-3">Pricing ({{ currency }})</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-1">
                <label class="text-xs text-zinc-500 uppercase font-bold">Monthly Price *</label>
                <input formControlName="monthlyPrice" type="number" min="0" step="0.01" class="inp" />
              </div>
              <div class="space-y-1">
                <label class="text-xs text-zinc-500 uppercase font-bold">Yearly Price</label>
                <input formControlName="yearlyPrice" type="number" min="0" step="0.01" class="inp" />
              </div>
              <div class="space-y-1">
                <label class="text-xs text-zinc-500 uppercase font-bold">Trial Days</label>
                <input formControlName="trialDays" type="number" min="0" step="1" class="inp" />
              </div>
            </div>
          </div>

          <!-- Limits -->
          <div>
            <h3 class="text-xs font-bold uppercase tracking-widest text-gold-400 mb-3">Limits</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="space-y-1"><label class="lbl">Max Tournaments</label><input formControlName="maxTournaments" type="number" min="0" class="inp" /></div>
              <div class="space-y-1"><label class="lbl">Max Teams</label><input formControlName="maxTeams" type="number" min="0" class="inp" /></div>
              <div class="space-y-1"><label class="lbl">Max Players</label><input formControlName="maxPlayers" type="number" min="0" class="inp" /></div>
              <div class="space-y-1"><label class="lbl">Max Staff</label><input formControlName="maxStaff" type="number" min="0" class="inp" /></div>
              <div class="space-y-1"><label class="lbl">Max Grounds</label><input formControlName="maxGrounds" type="number" min="0" class="inp" /></div>
              <div class="space-y-1"><label class="lbl">Max Referees</label><input formControlName="maxReferees" type="number" min="0" class="inp" /></div>
              <div class="space-y-1"><label class="lbl">Max Vendors</label><input formControlName="maxVendors" type="number" min="0" class="inp" /></div>
              <div class="space-y-1"><label class="lbl">Storage (MB)</label><input formControlName="storageLimitMb" type="number" min="0" class="inp" /></div>
            </div>
          </div>

          <!-- Features -->
          <div>
            <h3 class="text-xs font-bold uppercase tracking-widest text-gold-400 mb-3">Features</h3>
            <label class="text-xs text-zinc-500 uppercase font-bold">One feature per line</label>
            <textarea formControlName="features" rows="4" placeholder="Up to 32 teams&#10;Live scoring&#10;Priority support" class="inp mt-1"></textarea>
          </div>

          <!-- Flags & visibility -->
          <div>
            <h3 class="text-xs font-bold uppercase tracking-widest text-gold-400 mb-3">Visibility & Order</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="lbl">Display Order</label>
                <input formControlName="displayOrder" type="number" min="0" class="inp" />
              </div>
              <div class="space-y-1">
                <label class="lbl">Status</label>
                <select formControlName="status" class="inp">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <label class="flex items-center gap-3 cursor-pointer select-none">
                <input formControlName="isPopular" type="checkbox" class="w-4 h-4 accent-gold-400" />
                <span class="text-sm text-zinc-300">Popular plan (highlighted)</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer select-none">
                <input formControlName="landingVisible" type="checkbox" class="w-4 h-4 accent-gold-400" />
                <span class="text-sm text-zinc-300">Show on landing page</span>
              </label>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-2 border-t border-black-border">
            <button type="button" (click)="close()" class="px-5 py-2.5 rounded-xl text-sm font-bold text-zinc-300 hover:bg-white/5 transition-colors">Cancel</button>
            <button type="submit" [disabled]="form.invalid || saving()"
              class="px-6 py-2.5 bg-gold-400 hover:bg-gold-500 text-black font-bold rounded-xl transition-colors disabled:opacity-50">
              {{ saving() ? 'Saving...' : (mode === 'edit' ? 'Update Plan' : 'Create Plan') }}
            </button>
          </div>
        </form>
      </div>
    </div>
    }
  `,
    styles: [`
    .inp { width:100%; background:#0a0a0a; border:1px solid #262626; border-radius:0.75rem; padding:0.6rem 0.9rem; color:#fff; font-size:0.9rem; }
    .inp:focus { outline:none; border-color:#FBBF24; box-shadow:0 0 0 1px rgba(251,191,36,0.3); }
    .lbl { font-size:0.65rem; color:#71717a; text-transform:uppercase; font-weight:700; letter-spacing:0.05em; }
  `]
})
export class PlanModalComponent implements OnChanges {
    @Input() isOpen = false;
    @Input() mode: 'create' | 'edit' = 'create';
    @Input() planToEdit: Plan | null = null;

    @Output() closeModal = new EventEmitter<void>();
    @Output() saved = new EventEmitter<void>();

    private fb = inject(FormBuilder);
    private planService = inject(PlanService);
    private ui = inject(UiService);

    currency = PLAN_CURRENCY;
    saving = signal(false);

    form: FormGroup = this.fb.group({
        name: ['', [Validators.required]],
        code: ['', [Validators.required]],
        description: [''],
        monthlyPrice: [0, [Validators.required, Validators.min(0)]],
        yearlyPrice: [null],
        trialDays: [0, [Validators.min(0)]],
        maxTournaments: [0, [Validators.min(0)]],
        maxTeams: [0, [Validators.min(0)]],
        maxPlayers: [0, [Validators.min(0)]],
        maxStaff: [0, [Validators.min(0)]],
        maxGrounds: [0, [Validators.min(0)]],
        maxReferees: [0, [Validators.min(0)]],
        maxVendors: [0, [Validators.min(0)]],
        storageLimitMb: [0, [Validators.min(0)]],
        features: [''],
        displayOrder: [0, [Validators.min(0)]],
        isPopular: [false],
        landingVisible: [true],
        status: ['active'],
    });

    ngOnChanges(changes: SimpleChanges) {
        if (changes['isOpen'] && this.isOpen) {
            if (this.mode === 'edit' && this.planToEdit) {
                const p = this.planToEdit;
                this.form.reset({
                    name: p.name, code: p.code, description: p.description ?? '',
                    monthlyPrice: p.monthlyPrice, yearlyPrice: p.yearlyPrice ?? null, trialDays: p.trialDays,
                    maxTournaments: p.maxTournaments, maxTeams: p.maxTeams, maxPlayers: p.maxPlayers,
                    maxStaff: p.maxStaff, maxGrounds: p.maxGrounds, maxReferees: p.maxReferees, maxVendors: p.maxVendors,
                    storageLimitMb: p.storageLimitMb,
                    features: (p.features ?? []).join('\n'),
                    displayOrder: p.displayOrder, isPopular: p.isPopular, landingVisible: p.landingVisible, status: p.status,
                });
            } else {
                this.form.reset({
                    name: '', code: '', description: '', monthlyPrice: 0, yearlyPrice: null, trialDays: 0,
                    maxTournaments: 0, maxTeams: 0, maxPlayers: 0, maxStaff: 0, maxGrounds: 0, maxReferees: 0,
                    maxVendors: 0, storageLimitMb: 0, features: '', displayOrder: 0, isPopular: false,
                    landingVisible: true, status: 'active',
                });
            }
        }
    }

    onBackdrop(_event: MouseEvent) {
        this.close();
    }

    close() {
        this.closeModal.emit();
    }

    submit() {
        if (this.form.invalid) return;
        this.saving.set(true);

        const raw = this.form.value;
        const payload: Partial<Plan> = {
            ...raw,
            code: String(raw.code || '').trim().toUpperCase(),
            features: String(raw.features || '')
                .split('\n')
                .map((f: string) => f.trim())
                .filter(Boolean),
            yearlyPrice: raw.yearlyPrice === '' || raw.yearlyPrice === null ? undefined : Number(raw.yearlyPrice),
        };

        const req = this.mode === 'edit' && this.planToEdit
            ? this.planService.update(this.planToEdit.id, payload)
            : this.planService.create(payload);

        req.subscribe({
            next: () => {
                this.saving.set(false);
                this.ui.showToast(this.mode === 'edit' ? 'Plan updated' : 'Plan created', 'success');
                this.saved.emit();
            },
            error: (err) => {
                this.saving.set(false);
                this.ui.showToast(err.error?.message || 'Failed to save plan', 'error');
            }
        });
    }
}
