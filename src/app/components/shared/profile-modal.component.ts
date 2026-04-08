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
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300" (click)="onClose.emit()"></div>
      
      <!-- Modal Content -->
      <div class="relative w-full max-w-xl transform overflow-hidden rounded-2xl border border-gold-400/30 bg-black-card text-left align-middle shadow-[0_0_80px_rgba(0,0,0,0.9),0_0_30px_rgba(251,191,36,0.15)] transition-all animate-in zoom-in-95 duration-300">
          <!-- Header -->
          <div class="px-8 py-5 border-b border-black-border flex items-center justify-between bg-gradient-to-r from-black-card to-white/[0.03]">
            <div class="flex items-center gap-3">
               <div class="w-2 h-2 rounded-full bg-gold-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]"></div>
               <h3 class="text-xl font-black text-white uppercase tracking-[0.2em]">User Profile</h3>
            </div>
            <button (click)="onClose.emit()" class="w-10 h-10 rounded-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Modal Body -->
          <div class="p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
            <!-- User Stats/Badge -->
            <div class="relative group">
              <div class="absolute -inset-0.5 bg-gradient-to-r from-gold-400/50 to-amber-600/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div class="relative flex items-center gap-6 p-5 bg-black-bg/50 rounded-xl border border-gold-400/20">
                <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-400/5 flex items-center justify-center border border-gold-400/30 shadow-inner">
                  <span class="text-4xl font-black text-gold-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">{{ user?.user_name?.charAt(0)?.toUpperCase() }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <h4 class="text-2xl font-black text-white truncate">{{ user?.user_name }}</h4>
                  <p class="text-zinc-500 font-medium truncate mb-2">{{ user?.email }}</p>
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] bg-gold-400/10 text-gold-400 border border-gold-400/20">
                      {{ user?.userRole?.name }}
                    </span>
                    <span class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] border border-green-500/20 text-green-500 bg-green-500/10">
                      {{ user?.state === 1 ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Basic Info Section -->
            <div class="space-y-4">
              <h4 class="text-[11px] text-zinc-500 uppercase font-black tracking-[0.3em] pl-1 border-l-2 border-gold-400/50 ml-1">Identity & Contact</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <div class="space-y-1.5">
                    <label class="text-[9px] text-zinc-600 uppercase font-black tracking-widest px-1">Display Name</label>
                    <div class="bg-black-bg/40 border border-black-border rounded-xl px-4 py-3 text-white font-bold shadow-inner">
                      {{ user?.user_name || 'N/A' }}
                    </div>
                 </div>
                 <div class="space-y-1.5">
                    <label class="text-[9px] text-zinc-600 uppercase font-black tracking-widest px-1">Email Connection</label>
                    <div class="bg-black-bg/40 border border-black-border rounded-xl px-4 py-3 text-zinc-400 text-sm truncate shadow-inner">
                      {{ user?.email || 'N/A' }}
                    </div>
                 </div>
                 <div class="space-y-1.5">
                    <label class="text-[9px] text-zinc-600 uppercase font-black tracking-widest px-1">Secure Mobile</label>
                    <div class="bg-black-bg/40 border border-black-border rounded-xl px-4 py-3 text-white font-mono text-sm shadow-inner group-hover:border-gold-400/30 transition-colors">
                      {{ user?.phone_number || 'N/A' }}
                    </div>
                 </div>
                 <div class="space-y-1.5">
                    <label class="text-[9px] text-zinc-600 uppercase font-black tracking-widest px-1">System Privilege</label>
                    <div class="bg-black-bg/40 border border-black-border rounded-xl px-4 py-3 text-zinc-500 italic shadow-inner">
                      {{ user?.userRole?.name || 'User' }}
                    </div>
                 </div>
                 <div class="space-y-1.5 sm:col-span-2">
                    <label class="text-[9px] text-zinc-600 uppercase font-black tracking-widest px-1">Account Visibility</label>
                    <div class="bg-black-bg/40 border border-black-border rounded-xl px-4 py-3 flex items-center gap-3 shadow-inner">
                      <span class="w-3 h-3 rounded-full animate-pulse" [ngClass]="user?.state === 1 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'"></span>
                      <span class="text-sm font-black uppercase tracking-widest" [ngClass]="user?.state === 1 ? 'text-green-500' : 'text-red-500'">
                        {{ user?.state === 1 ? 'Current Status: Active' : 'Current Status: Inactive' }}
                      </span>
                      <div class="flex items-center gap-1 ml-auto text-[9px] text-zinc-600 font-bold uppercase tracking-tighter bg-white/5 px-2 py-1 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Read-only
                      </div>
                    </div>
                 </div>
              </div>
            </div>

            <!-- Password Change Section -->
            <div class="pt-8 border-t border-black-border space-y-6">
              <div class="flex items-center justify-between">
                 <div class="flex items-center gap-3">
                   <div class="w-8 h-8 rounded-lg bg-gold-400/10 flex items-center justify-center border border-gold-400/20 text-gold-400">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                     </svg>
                   </div>
                   <h4 class="text-sm font-black text-white uppercase tracking-[0.2em]">Security Upgrade</h4>
                 </div>
                 <span class="text-[9px] text-zinc-500 font-bold uppercase tracking-widest italic opacity-50">Last updated recently</span>
              </div>

              <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="space-y-5">
                <div class="space-y-2">
                  <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest px-1">Current Password</label>
                  <div class="relative">
                    <input formControlName="oldPassword" type="password" placeholder="Verify your current identity"
                      class="w-full bg-black-bg/60 border border-black-border rounded-xl px-4 py-3.5 text-white placeholder-zinc-700 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all font-medium" />
                  </div>
                </div>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div class="space-y-2">
                    <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest px-1">New Password</label>
                    <input formControlName="newPassword" type="password" placeholder="New credentials"
                      class="w-full bg-black-bg/60 border border-black-border rounded-xl px-4 py-3.5 text-white placeholder-zinc-700 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all font-medium" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest px-1">Confirm New</label>
                    <input formControlName="confirmPassword" type="password" placeholder="Repeat to confirm"
                      class="w-full bg-black-bg/60 border border-black-border rounded-xl px-4 py-3.5 text-white placeholder-zinc-700 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/30 transition-all font-medium" />
                  </div>
                </div>

                <div *ngIf="message" [ngClass]="isSuccess ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'" class="p-4 rounded-xl border text-xs font-black text-center uppercase tracking-widest animate-in slide-in-from-top-2">
                  <div class="flex items-center justify-center gap-2">
                    <svg *ngIf="isSuccess" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ message }}
                  </div>
                </div>

                <button type="submit" [disabled]="passwordForm.invalid || isLoading"
                  class="w-full py-4 bg-gold-400 text-black font-black rounded-xl hover:bg-gold-500 transition-all shadow-[0_10px_20px_-5px_rgba(212,175,55,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(212,175,55,0.6)] active:scale-95 disabled:opacity-30 disabled:grayscale uppercase tracking-[0.2em] text-xs mt-4 flex items-center justify-center gap-2 group">
                  @if (isLoading) {
                    <svg class="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  } @else {
                    Commit Changes
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  }
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

    <style>
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(212, 175, 55, 0.2);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(212, 175, 55, 0.4);
      }
    </style>
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
