import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../settings/settings.service';
import { AuthService } from '../../auth/auth.service';
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
            <div>
              <h3 class="text-xl font-bold text-white tracking-wide">My Profile</h3>
              <p class="text-[11px] text-zinc-500 font-semibold">{{ isAdmin ? '👑 System Administrator' : 'User Account' }}</p>
            </div>
          </div>
          <button (click)="onClose.emit()" class="text-zinc-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-black-border bg-black/20 overflow-x-auto">
          <button 
            (click)="activeTab = 'info'"
            [ngClass]="activeTab === 'info' ? 'text-gold-400 border-b-2 border-gold-400' : 'text-zinc-500'"
            class="px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap"
          >
            Information
          </button>
          <button 
            (click)="activeTab = 'password'"
            [ngClass]="activeTab === 'password' ? 'text-gold-400 border-b-2 border-gold-400' : 'text-zinc-500'"
            class="px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap"
          >
            Change Password
          </button>
          <!-- ADMIN ONLY BANK TAB -->
          <button 
            *ngIf="isAdmin"
            (click)="setTab('bank')"
            [ngClass]="activeTab === 'bank' ? 'text-amber-400 border-b-2 border-amber-400' : 'text-zinc-500'"
            class="px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Bank Details 🏦
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
                <div class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2.5 text-zinc-500 font-medium bg-zinc-900/50 italic">{{ user?.role || (isAdmin ? 'Admin' : 'User') }}</div>
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

          <!-- ADMIN-ONLY BANK DETAILS TAB -->
          <div *ngIf="activeTab === 'bank' && isAdmin" class="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div class="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3">
              <span class="text-xl">🏦</span>
              <div>
                <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wider">Admin Bank Account Management</h4>
                <p class="text-[11px] text-zinc-400">Collect and update official bank account details for tournament payouts and admin operations.</p>
              </div>
            </div>

            <form [formGroup]="bankForm" (ngSubmit)="onBankSubmit()" class="space-y-3">
              <div class="space-y-1">
                <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Account Holder Name *</label>
                <input formControlName="accountHolderName" type="text" class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2 text-white focus:border-gold-400 focus:outline-none transition-all text-sm" placeholder="e.g. STAP Football Admin" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Bank Name *</label>
                  <input formControlName="bankName" type="text" class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2 text-white focus:border-gold-400 focus:outline-none transition-all text-sm" placeholder="e.g. State Bank of India" />
                </div>

                <div class="space-y-1">
                  <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Account Number *</label>
                  <input formControlName="accountNumber" type="text" class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2 text-white focus:border-gold-400 focus:outline-none transition-all text-sm" placeholder="e.g. 123456789012" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="space-y-1">
                  <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest">IFSC / Swift Code *</label>
                  <input formControlName="ifscCode" type="text" class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2 text-white focus:border-gold-400 focus:outline-none transition-all text-sm uppercase" placeholder="e.g. SBIN0001234" />
                </div>

                <div class="space-y-1">
                  <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Branch Name</label>
                  <input formControlName="branchName" type="text" class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2 text-white focus:border-gold-400 focus:outline-none transition-all text-sm" placeholder="e.g. Main Branch" />
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] text-zinc-500 uppercase font-black tracking-widest">UPI ID (Optional)</label>
                <input formControlName="upiId" type="text" class="w-full bg-black-bg border border-black-border rounded-lg px-4 py-2 text-white focus:border-gold-400 focus:outline-none transition-all text-sm" placeholder="e.g. admin@upi" />
              </div>

              <div class="pt-2">
                <button 
                  type="submit" 
                  [disabled]="bankForm.invalid || isBankLoading"
                  class="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-gray-950 font-black rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2"
                >
                  <span>{{ isBankLoading ? 'Saving Details...' : 'Save Bank Details' }}</span>
                </button>
              </div>

              <p *ngIf="bankMessage" [ngClass]="isBankError ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-green-500 bg-green-500/10 border-green-500/20'" class="text-center text-xs font-bold py-2 rounded-lg border">
                {{ bankMessage }}
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
export class ProfilePopupComponent implements OnChanges {
  @Input() show = false;
  @Input() user: any;
  @Output() onClose = new EventEmitter<void>();

  activeTab: 'info' | 'password' | 'bank' = 'info';
  isLoading = false;
  message = '';
  isError = false;

  // Bank Form State
  isBankLoading = false;
  bankMessage = '';
  isBankError = false;

  passwordForm: FormGroup;
  bankForm: FormGroup;

  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);
  public auth = inject(AuthService);

  constructor() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.bankForm = this.fb.group({
      accountHolderName: ['', [Validators.required]],
      bankName: ['', [Validators.required]],
      accountNumber: ['', [Validators.required]],
      ifscCode: ['', [Validators.required]],
      branchName: [''],
      upiId: ['']
    });
  }

  get isAdmin(): boolean {
    if (this.auth && this.auth.isAdmin) return true;
    const u = this.user || this.auth?.user;
    return u?.roleId === 1 || u?.role?.toLowerCase() === 'admin' || u?.userRole?.name?.toLowerCase() === 'admin';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['show'] && this.show) {
      this.loadBankDetails();
    }
  }

  setTab(tab: 'info' | 'password' | 'bank') {
    if (tab === 'bank' && !this.isAdmin) return;
    this.activeTab = tab;
  }

  loadBankDetails() {
    try {
      const saved = localStorage.getItem('admin_bank_details');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.bankForm.patchValue({
          accountHolderName: parsed.accountHolderName || '',
          bankName: parsed.bankName || '',
          accountNumber: parsed.accountNumber || '',
          ifscCode: parsed.ifscCode || '',
          branchName: parsed.branchName || '',
          upiId: parsed.upiId || ''
        });
      } else if (this.user?.bankDetails) {
        this.bankForm.patchValue(this.user.bankDetails);
      } else {
        // Initial default placeholder for admin
        this.bankForm.patchValue({
          accountHolderName: this.user?.user_name || 'Admin',
          bankName: 'State Bank of India',
          accountNumber: '389201948201',
          ifscCode: 'SBIN0001234',
          branchName: 'Central City Branch',
          upiId: 'admin@upi'
        });
      }
    } catch (e) {
      console.error('Error loading bank details', e);
    }
  }

  onBankSubmit() {
    if (!this.isAdmin || this.bankForm.invalid) return;

    this.isBankLoading = true;
    this.bankMessage = '';

    const bankData = this.bankForm.value;

    setTimeout(() => {
      try {
        localStorage.setItem('admin_bank_details', JSON.stringify(bankData));
        this.isBankLoading = false;
        this.isBankError = false;
        this.bankMessage = 'Admin Bank Account details saved successfully!';
      } catch (err) {
        this.isBankLoading = false;
        this.isBankError = true;
        this.bankMessage = 'Failed to save bank details';
      }
    }, 600);
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
