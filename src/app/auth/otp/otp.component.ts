import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-otp',
    templateUrl: './otp.html',
    styleUrl: './otp.css',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class OtpComponent {

    otpForm: FormGroup;
    errorMessage: string = '';
    isLoading: boolean = false;
    email: string | null = localStorage.getItem('email');

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router
    ) {
        this.otpForm = this.fb.group({
            otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
        });

        // Redirect if no email in storage
        if (!this.email) {
            this.router.navigate(['/auth/login']);
        }
    }

    verify() {
        if (this.otpForm.invalid || !this.email) {
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        this.auth.verifyOtp({
            email: this.email,
            otp: this.otpForm.value.otp
        }).subscribe({
            next: (res: any) => {
                this.isLoading = false;
                // Store the token
                if (res.token) {
                    localStorage.setItem('token', res.token);
                }
                // Clear email from storage
                localStorage.removeItem('email');
                // Navigate to dashboard or home
                this.router.navigate(['/dashboard']);
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err.error?.error || 'OTP verification failed. Please try again.';
            }
        });
    }

    resendOTP() {
        if (!this.email) {
            this.errorMessage = 'Email not found. Please login again.';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        // Call resend OTP endpoint
        this.auth.resendOtp({ email: this.email }).subscribe({
            next: (res: any) => {
                this.isLoading = false;
                alert(res.message || 'OTP resent successfully');
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err.error?.error || 'Failed to resend OTP. Please try again.';
            }
        });
    }
}
