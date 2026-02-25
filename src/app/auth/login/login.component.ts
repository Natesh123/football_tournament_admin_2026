import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { PhysicsBallDirective } from '../physics-ball.directive';

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrl: './login.css',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, PhysicsBallDirective, TranslateModule]
})
export class LoginComponent implements OnInit {

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

    ngOnInit() {
        // Redirection logic: If token exists and validation returns true, redirect to dashboard
        const token = localStorage.getItem('token');
        if (token) {
            this.auth.validateToken(token).subscribe({
                next: (res: any) => {
                    if (res.valid) {
                        this.router.navigate(['/dashboard']);
                    }
                },
                error: () => {
                    // If validation fails, stay on login or redirect to register as per requirement?
                    // "If the token validation returns false, a message should be displayed asking 
                    // the user to create an account, and the user should be redirected to the registration page."
                    this.errorMessage = 'Session expired or account not found. Please register.';
                    setTimeout(() => this.router.navigate(['/auth/register']), 2000);
                }
            });
        }
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

        const loginData = {
            ...this.loginForm.value,
            email: this.loginForm.value.email.trim()
        };

        this.auth.login(loginData)
            .subscribe({
                next: (res: any) => {
                    this.isLoading = false;
                    // Directly handle success without OTP
                    if (res.token) {
                        this.auth.setAuthenticatedUser(res.user, res.token);
                        this.successMessage = 'Login successful! Redirecting...';
                        setTimeout(() => this.router.navigate(['/dashboard']), 1000);
                    }
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error('Login error:', err);

                    if (err.error?.error === "User not found") {
                        this.errorMessage = 'Account not found. Please create an account.';
                        setTimeout(() => this.router.navigate(['/auth/register']), 2000);
                    } else {
                        this.errorMessage = err.error?.error || 'Login failed. Please try again.';
                    }
                }
            });
    }
}
