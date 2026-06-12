import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../core/config/app.config';

@Component({
    selector: 'app-forgot-password',
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
          @if (!sent()) {
            <div class="mb-8">
              <h1 class="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
              <p class="text-zinc-400 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            @if (error()) {
              <div class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {{ error() }}
              </div>
            }

            <form (ngSubmit)="submit()">
              <div class="mb-6">
                <label class="block text-sm font-medium text-zinc-400 mb-2">Email Address</label>
                <input type="email" [(ngModel)]="email" name="email" required
                       placeholder="you@example.com"
                       class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#D4AF37]/50 focus:bg-[#D4AF37]/5 transition-all">
              </div>

              <button type="submit" [disabled]="loading()"
                      class="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                {{ loading() ? 'Sending...' : 'Send Reset Link' }}
              </button>
            </form>
          } @else {
            <div class="text-center">
              <div class="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-5">
                <svg class="w-8 h-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white mb-3">Check Your Email</h2>
              <p class="text-zinc-400 text-sm mb-6">
                If an account with <span class="text-[#D4AF37]">{{ email }}</span> exists, a reset link has been sent. Check your inbox and spam folder.
              </p>
              <button (click)="reset()" class="text-sm text-[#D4AF37] hover:underline">Send again</button>
            </div>
          }

          <div class="mt-8 text-center">
            <a routerLink="/login" class="text-sm text-zinc-500 hover:text-[#D4AF37] transition-colors">
              ← Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
    `
})
export class ForgotPasswordComponent {
    email = '';
    loading = signal(false);
    sent = signal(false);
    error = signal('');

    constructor(private http: HttpClient) {}

    submit() {
        if (!this.email || this.loading()) return;
        this.loading.set(true);
        this.error.set('');

        this.http.post(`${API_URL}/api/auth/forgot-password`, { email: this.email }).subscribe({
            next: () => {
                this.loading.set(false);
                this.sent.set(true);
            },
            error: (err) => {
                this.loading.set(false);
                this.error.set(err?.error?.error || 'Something went wrong. Please try again.');
            }
        });
    }

    reset() {
        this.sent.set(false);
        this.error.set('');
    }
}
