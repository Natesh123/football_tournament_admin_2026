import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { PhysicsBallDirective } from '../physics-ball.directive';

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrl: './login.css',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, PhysicsBallDirective]
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
                    // Store token directly — no OTP step for login
                    if (res.token) {
                        localStorage.setItem('token', res.token);
                    }
                    this.successMessage = res.message || 'Login successful';
                    // Navigate directly to dashboard
                    this.router.navigate(['/dashboard']);
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error('Login error:', err);
                    this.errorMessage = err.error?.error || 'Login failed. Please try again.';
                }
            });
    }
}
