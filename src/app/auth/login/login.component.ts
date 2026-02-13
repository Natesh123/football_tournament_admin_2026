import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrl: './login.css',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class LoginComponent {

    loginForm: FormGroup;
    errorMessage: string = '';
    successMessage: string = '';
    isLoading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    login() {
        if (this.loginForm.invalid) {
            // Mark all fields as touched to show validation errors
            Object.keys(this.loginForm.controls).forEach(key => {
                this.loginForm.get(key)?.markAsTouched();
            });
            return;
        }

        this.errorMessage = '';
        this.successMessage = '';
        this.isLoading = true;

        this.auth.login(this.loginForm.value)
            .subscribe({
                next: (res: any) => {
                    this.isLoading = false;
                    // Store email for OTP verification
                    localStorage.setItem('email', this.loginForm.value.email);
                    this.successMessage = res.message || 'OTP sent to your email';
                    // Navigate to OTP page after a brief delay
                    setTimeout(() => {
                        this.router.navigate(['/auth/otp']);
                    }, 1500);
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error('Login error:', err);
                    this.errorMessage = err.error?.error || 'Login failed. Please try again.';
                }
            });
    }
}
