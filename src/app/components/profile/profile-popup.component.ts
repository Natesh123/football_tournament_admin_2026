import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../settings/settings.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-profile-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  template: `
    <div *ngIf="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" (click)="onClose.emit()"></div>
      
      <!-- Modal Content -->
      <div class="relative w-full max-w-lg bg-black-card border border-gold-400/30 rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-black-border bg-gradient-to-r from-black-card to-gold-400/5 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gold-400/20 flex items-center justify-center border border-gold-400/30">
              <span class="text-gold-400 font-black text-lg">{{ user?.user_name?.charAt(0)?.toUpperCase() }}</span>
            </div>
            <h3 class="text-xl font-bold text-white tracking-wide">My Profile</h3>
          </div>
          <button (click)="onClose.emit()" class="text-zinc-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-black-border bg-black/20">
          <button 
            (click)="activeTab = 'info'"
            [ngClass]="activeTab === 'info' ? 'text-gold-400 border-b-2 border-gold-400' : 'text-zinc-500'"
            class="px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all"
          >
            Information
          </button>
          <button 
            (click)="activeTab = 'password'"
            [ngClass]="activeTab === 'password' ? 'text-gold-400 border-b-2 border-gold-400' : 'text-zinc-500'"
            class="px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all"
          >
            Change Password
          </button>
        </div>

        <!-- Body -->
        <div class="p-6">
          <!-- Info Tab -->
          <div *ngIf="activeTab === 'info'" class="space-y-4 animate-in fade-in slide-in-from-left-4 duration-300">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Username</label>
                <div class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2.5 text-zinc-300 font-medium">{{ user?.user_name }}</div>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Email Address</label>
                <div class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2.5 text-zinc-300 font-medium truncate">{{ user?.email }}</div>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Phone Number</label>
                <div class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2.5 text-zinc-300 font-medium opacity-80">{{ user?.phone_number || user?.phone || 'Not Provided' }}</div>
              </div>
              <div class="space-y-1 opacity-60">
                <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Role</label>
                <div class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2.5 text-zinc-500 font-medium bg-zinc-900/50 italic">{{ user?.role || 'Admin' }}</div>
              </div>
            </div>
            <div class="p-4 bg-gold-400/5 border border-gold-400/20 rounded-xl">
               <div class="flex items-center gap-3 mb-2">
                 <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 <span class="text-xs font-bold text-gold-400 uppercase tracking-widest">Account Status: Active</span>
               </div>
               <p class="text-[11px] text-zinc-500 leading-relaxed italic">Your account is fully verified and has access to system features based on your assigned role.</p>
            </div>
          </div>

          <!-- Password Tab -->
          <div *ngIf="activeTab === 'password'" class="animate-in fade-in slide-in-from-right-4 duration-300">
            <form [formGroup]="passwordForm" (ngSubmit)="onPasswordSubmit()" class="space-y-4">
              <div class="space-y-1">
                <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Current Password</label>
                <input formControlName="oldPassword" type="password" class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2.5 text-white focus:border-gold-400 focus:outline-none transition-all" placeholder="••••••••" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest">New Password</label>
                <input formControlName="newPassword" type="password" class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2.5 text-white focus:border-gold-400 focus:outline-none transition-all" placeholder="••••••••" />
              </div>
              <div class="space-y-1">
                <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Confirm New Password</label>
                <input formControlName="confirmPassword" type="password" class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2.5 text-white focus:border-gold-400 focus:outline-none transition-all" placeholder="••••••••" />
                <p *ngIf="passwordForm.errors?.['mismatch'] && passwordForm.get('confirmPassword')?.touched" class="text-red-500 text-[10px] font-bold mt-1">Passwords do not match</p>
              </div>

              <div class="pt-2">
                <button 
                  type="submit" 
                  [disabled]="passwordForm.invalid || isLoading"
                  class="w-full py-3 bg-gold-400 text-black font-black rounded-xl hover:bg-gold-500 transition-all shadow-lg active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em] text-xs"
                >
                  {{ isLoading ? 'Updating...' : 'Update Password' }}
                </button>
              </div>
              <p *ngIf="message" [ngClass]="isError ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-green-500 bg-green-500/10 border-green-500/20'" class="text-center text-xs font-bold py-2 rounded-lg border">
                {{ message }}
              </p>
            </form>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-black-border bg-black/40 flex justify-end">
          <button (click)="onClose.emit()" class="px-6 py-2 bg-zinc-800 text-zinc-400 font-bold rounded-lg hover:text-white transition-all text-sm uppercase tracking-widest">Close</button>
        </div>
      </div>
    </div>
  `
})
export class ProfilePopupComponent {
  @Input() show = false;
  @Input() user: any;
  @Output() onClose = new EventEmitter<void>();

  activeTab: 'info' | 'password' = 'info';
  isLoading = false;
  message = '';
  isError = false;
  passwordForm: FormGroup;

  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);

  constructor() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  onPasswordSubmit() {
    if (this.passwordForm.invalid) return;

    this.isLoading = true;
    this.message = '';

    const data = {
      userId: this.user.id,
      oldPassword: this.passwordForm.value.oldPassword,
      newPassword: this.passwordForm.value.newPassword
    };

    this.settingsService.changePassword(data).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.isError = false;
        this.message = res.message || 'Password updated successfully!';
        this.passwordForm.reset();
      },
      error: (err: any) => {
        this.isLoading = false;
        this.isError = true;
        this.message = err.error?.error || 'Failed to update password';
      }
    });
  }
}
