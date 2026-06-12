import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../core/config/app.config';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [FormsModule, RouterLink],
    template: `
    <div class="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-10">
          <a routerLink="/" class="inline-flex items-center gap-3">
            <img src="assets/images/logo-gold.png" alt="ATB" class="h-12 mix-blend-screen">
            <span class="text-2xl font-black tracking-widest text-[#D4AF37]">ATB SPORTS</span>
          </a>
        </div>

        <div class="bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-10">
          @if (!token()) {
            <div class="text-center py-4">
              <p class="text-red-400 mb-4">Invalid or missing reset token.</p>
              <a routerLink="/forgot-password" class="text-[#D4AF37] hover:underline text-sm">Request a new link</a>
            </div>
          } @else if (success()) {
            <div class="text-center">
              <div class="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
                <svg class="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white mb-3">Password Updated!</h2>
              <p class="text-zinc-400 text-sm mb-6">Your password has been reset successfully. You can now log in with your new password.</p>
              <a routerLink="/login"
                 class="inline-block px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all">
                Go to Login
              </a>
            </div>
          } @else {
            <div class="mb-8">
              <h1 class="text-2xl font-bold text-white mb-2">Set New Password</h1>
              <p class="text-zinc-400 text-sm">Choose a strong password of at least 8 characters.</p>
            </div>

            @if (error()) {
              <div class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {{ error() }}
              </div>
            }

            <form (ngSubmit)="submit()">
              <div class="mb-5">
                <label class="block text-sm font-medium text-zinc-400 mb-2">New Password</label>
                <input type="password" [(ngModel)]="newPassword" name="newPassword" required minlength="8"
                       placeholder="Minimum 8 characters"
                       class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-[#D4AF37]/5 transition-all">
              </div>
              <div class="mb-8">
                <label class="block text-sm font-medium text-zinc-400 mb-2">Confirm Password</label>
                <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required
                       placeholder="Repeat your new password"
                       class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-[#D4AF37]/5 transition-all">
              </div>

              <button type="submit" [disabled]="loading()"
                      class="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                {{ loading() ? 'Updating...' : 'Reset Password' }}
              </button>
            </form>
          }
        </div>
      </div>
    </div>
    `
})
export class ResetPasswordComponent implements OnInit {
    token = signal('');
    newPassword = '';
    confirmPassword = '';
    loading = signal(false);
    success = signal(false);
    error = signal('');

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        const t = this.route.snapshot.queryParamMap.get('token') || '';
        this.token.set(t);
    }

    submit() {
        this.error.set('');
        if (this.newPassword.length < 8) {
            this.error.set('Password must be at least 8 characters.');
            return;
        }
        if (this.newPassword !== this.confirmPassword) {
            this.error.set('Passwords do not match.');
            return;
        }
        if (this.loading()) return;

        this.loading.set(true);
        this.http.post(`${API_URL}/api/auth/reset-password`, {
            token: this.token(),
            newPassword: this.newPassword
        }).subscribe({
            next: () => {
                this.loading.set(false);
                this.success.set(true);
            },
            error: (err) => {
                this.loading.set(false);
                this.error.set(err?.error?.error || 'Reset failed. The link may have expired.');
            }
        });
    }
}
