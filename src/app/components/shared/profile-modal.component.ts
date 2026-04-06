import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../settings/settings.service';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div *ngIf="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" (click)="onClose.emit()"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-black-card border border-gold-400/30 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(251,191,36,0.15)] overflow-hidden animate-in zoom-in-95 duration-200">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-black-border flex items-center justify-between bg-white/5">
          <h3 class="text-xl font-bold text-white uppercase tracking-wider italic">User Profile</h3>
          <button (click)="onClose.emit()" class="text-zinc-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <!-- User Stats/Badge -->
          <div class="flex items-center gap-4 p-4 bg-gold-400/5 rounded-xl border border-gold-400/10">
            <div class="w-16 h-16 rounded-full bg-gold-400/20 flex items-center justify-center border-2 border-gold-400/30">
              <span class="text-2xl font-black text-gold-400">{{ user?.user_name?.charAt(0)?.toUpperCase() }}</span>
            </div>
            <div>
              <h4 class="text-lg font-bold text-white">{{ user?.user_name }}</h4>
              <p class="text-sm text-zinc-500">{{ user?.email }}</p>
              <div class="mt-1 flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-gold-400 text-black">
                  {{ user?.userRole?.name }}
                </span>
                <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-green-500/30 text-green-500 bg-green-500/5">
                  {{ user?.state === 1 ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Basic Info (Read Only) -->
          <div class="grid grid-cols-2 gap-4">
             <div class="space-y-1">
                <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Phone Number</label>
                <div class="bg-black-bg border border-black-border rounded-lg px-4 py-2.5 text-white font-mono">
                  {{ user?.phone_number || 'N/A' }}
                </div>
             </div>
             <div class="space-y-1">
                <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Role (Disabled)</label>
                <div class="bg-black-bg border border-black-border rounded-lg px-4 py-2.5 text-zinc-500 italic">
                  {{ user?.userRole?.name || 'User' }}
                </div>
             </div>
          </div>

          <!-- Password Change Section -->
          <div class="pt-6 border-t border-black-border">
            <div class="flex items-center gap-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h4 class="text-sm font-bold text-white uppercase tracking-wider">Security Settings</h4>
            </div>

            <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="space-y-4">
              <div class="space-y-1">
                <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest px-1">Current Password</label>
                <input formControlName="oldPassword" type="password" placeholder="Enter current password"
                  class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2.5 text-white focus:border-gold-400 focus:outline-none transition-all" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest px-1">New Password</label>
                  <input formControlName="newPassword" type="password" placeholder="New password"
                    class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2.5 text-white focus:border-gold-400 focus:outline-none transition-all" />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest px-1">Confirm New</label>
                  <input formControlName="confirmPassword" type="password" placeholder="Confirm new"
                    class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2.5 text-white focus:border-gold-400 focus:outline-none transition-all" />
                </div>
              </div>

              <div *ngIf="message" [ngClass]="isSuccess ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'" class="p-3 rounded-lg border text-xs font-bold text-center italic">
                {{ message }}
              </div>

              <button type="submit" [disabled]="passwordForm.invalid || isLoading"
                class="w-full py-3 bg-gold-400 text-black font-black rounded-xl hover:bg-gold-500 transition-all shadow-lg active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs mt-2">
                {{ isLoading ? 'Updating Security...' : 'Update Password' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileModalComponent implements OnInit {
  @Input() show = false;
  @Input() user: any;
  @Output() onClose = new EventEmitter<void>();

  passwordForm: FormGroup;
  isLoading = false;
  message = '';
  isSuccess = false;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService
  ) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {}

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  changePassword() {
    if (this.passwordForm.invalid) return;

    this.isLoading = true;
    this.message = '';
    
    const payload = {
      userId: this.user.id,
      oldPassword: this.passwordForm.value.oldPassword,
      newPassword: this.passwordForm.value.newPassword
    };

    this.settingsService.changePassword(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isSuccess = true;
        this.message = res.message || 'Password updated successfuly!';
        this.passwordForm.reset();
        setTimeout(() => {
          this.message = '';
          this.onClose.emit();
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.isSuccess = false;
        this.message = err.error?.error || 'Failed to update password';
      }
    });
  }
}
