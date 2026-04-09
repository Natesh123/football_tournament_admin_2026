import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Sponsor, SponsorService } from '../../services/sponsor.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sponsor-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="bg-black-card border border-black-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-black-border flex justify-between items-center bg-white/5">
          <h2 class="text-xl font-bold text-white">
            {{ (sponsor ? 'COMMON.EDIT' : 'SETTINGS.SPONSORS.CREATE') | translate }}
          </h2>
          <button (click)="close.emit()" class="p-2 text-zinc-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left Column: Details -->
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-zinc-400 mb-1.5">{{ 'SETTINGS.SPONSORS.FIELDS.NAME' | translate }}*</label>
                <input type="text" formControlName="name" 
                       class="w-full bg-black-input border border-black-border rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none transition-all"
                       [placeholder]="'SETTINGS.SPONSORS.FIELDS.NAME' | translate">
              </div>

              <div>
                <label class="block text-sm font-medium text-zinc-400 mb-1.5">{{ 'SETTINGS.SPONSORS.FIELDS.EMAIL' | translate }}</label>
                <input type="email" formControlName="email" 
                       class="w-full bg-black-input border border-black-border rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none transition-all"
                       placeholder="sponsor@example.com">
              </div>

              <div>
                <label class="block text-sm font-medium text-zinc-400 mb-1.5">{{ 'SETTINGS.SPONSORS.FIELDS.PHONE' | translate }}</label>
                <input type="text" formControlName="phone" 
                       class="w-full bg-black-input border border-black-border rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none transition-all"
                       placeholder="+1 234 567 890">
              </div>

              <div>
                <label class="block text-sm font-medium text-zinc-400 mb-1.5">{{ 'SETTINGS.SPONSORS.FIELDS.WEBSITE' | translate }}</label>
                <input type="text" formControlName="website" 
                       class="w-full bg-black-input border border-black-border rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none transition-all"
                       placeholder="https://example.com">
              </div>
            </div>

            <!-- Right Column: Logo & More -->
            <div class="space-y-4">
              <!-- Logo Upload -->
              <div>
                <label class="block text-sm font-medium text-zinc-400 mb-1.5">{{ 'SETTINGS.SPONSORS.FIELDS.LOGO' | translate }}</label>
                <div class="relative group">
                  <div class="w-full aspect-video bg-black-input border-2 border-dashed border-black-border rounded-xl overflow-hidden flex flex-col items-center justify-center hover:border-gold-400/50 transition-all cursor-pointer"
                       (click)="fileInput.click()">
                    
                    <img *ngIf="previewUrl" [src]="previewUrl" class="w-full h-full object-contain p-2">
                    
                    <div *ngIf="!previewUrl" class="text-center p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-zinc-600 mx-auto mb-2 group-hover:text-gold-400 shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p class="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">{{ 'COMMON.UPLOAD' | translate }}</p>
                    </div>
                  </div>
                  <input #fileInput type="file" (change)="onFileChange($event)" class="hidden" accept="image/*">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-zinc-400 mb-1.5">{{ 'SETTINGS.SPONSORS.FIELDS.TYPE' | translate }}</label>
                  <select formControlName="type" 
                          class="w-full bg-black-input border border-black-border rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none transition-all appearance-none cursor-pointer">
                    <option value="" disabled selected>Select Type</option>
                    <option value="Gold" class="bg-black text-white">Gold</option>
                    <option value="Silver" class="bg-black text-white">Silver</option>
                    <option value="Platinum" class="bg-black text-white">Platinum</option>
                    <option value="Partner" class="bg-black text-white">Partner</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-zinc-400 mb-1.5">{{ 'SETTINGS.SPONSORS.FIELDS.ORDER' | translate }}</label>
                  <input type="number" formControlName="display_order" 
                         class="w-full bg-black-input border border-black-border rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none transition-all">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-zinc-400 mb-1.5">{{ 'SETTINGS.SPONSORS.FIELDS.STATUS' | translate }}</label>
                <div class="flex items-center gap-4 p-2.5 bg-black-input border border-black-border rounded-lg">
                  <span class="text-sm" [class.text-gold-400]="form.get('status')?.value === 'active'" [class.text-zinc-500]="form.get('status')?.value !== 'active'">Active</span>
                  <button type="button" 
                          (click)="toggleStatus()"
                          class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                          [class.bg-gold-400]="form.get('status')?.value === 'active'"
                          [class.bg-zinc-700]="form.get('status')?.value !== 'active'">
                    <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                          [class.translate-x-5]="form.get('status')?.value === 'active'"
                          [class.translate-x-0]="form.get('status')?.value !== 'active'"></span>
                  </button>
                  <span class="text-sm" [class.text-zinc-400]="form.get('status')?.value === 'inactive'" [class.text-zinc-500]="form.get('status')?.value !== 'inactive'">Inactive</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="mt-8 flex justify-end gap-3 pt-6 border-t border-black-border">
            <button type="button" (click)="close.emit()" 
                    class="px-6 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all font-medium">
              {{ 'COMMON.CANCEL' | translate }}
            </button>
            <button type="submit" [disabled]="form.invalid || loading"
                    class="px-8 py-2.5 bg-gold-400 hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all shadow-lg active:scale-95">
              {{ (loading ? 'COMMON.LOADING' : (sponsor ? 'COMMON.SAVE' : 'COMMON.CREATE')) | translate }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class SponsorModalComponent {
  @Input() sponsor: Sponsor | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private sponsorService = inject(SponsorService);
  
  form: FormGroup;
  loading = false;
  previewUrl: string | null = null;
  selectedFile: File | null = null;

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      phone: [''],
      website: [''],
      type: [''],
      display_order: [0],
      status: ['active']
    });
  }

  ngOnInit() {
    if (this.sponsor) {
      this.form.patchValue(this.sponsor);
      if (this.sponsor.logo) {
        this.previewUrl = environment.apiBaseUrl.replace('/api', '') + this.sponsor.logo;
      }
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleStatus() {
    const currentStatus = this.form.get('status')?.value;
    this.form.patchValue({ status: currentStatus === 'active' ? 'inactive' : 'active' });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    const formData = new FormData();
    
    // Explicitly append fields, avoiding 'null' strings
    const formValues = this.form.value;
    Object.keys(formValues).forEach(key => {
      const value = formValues[key];
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value);
      }
    });

    if (this.selectedFile) {
      formData.append('logo', this.selectedFile);
    }

    const request = this.sponsor ? 
      this.sponsorService.update(this.sponsor.id!, formData) : 
      this.sponsorService.create(formData);

    request.subscribe({
      next: () => {
        this.saved.emit();
        this.close.emit();
      },
      error: (err) => {
        console.error('Error saving sponsor:', err);
        this.loading = false;
      }
    });
  }
}
