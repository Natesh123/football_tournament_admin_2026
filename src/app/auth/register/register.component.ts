import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.html',
    styleUrl: './register.css',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class RegisterComponent {

    registerForm: FormGroup;
    errorMessage: string = '';
    successMessage: string = '';
    isLoading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    submit() {
        if (this.registerForm.invalid) {
            // Mark all fields as touched to show validation errors
            Object.keys(this.registerForm.controls).forEach(key => {
                this.registerForm.get(key)?.markAsTouched();
            });
            return;
        }

        this.errorMessage = '';
        this.successMessage = '';
        this.isLoading = true;

        this.auth.register(this.registerForm.value)
            .subscribe({
                next: (res: any) => {
                    this.isLoading = false;
                    // Store email for OTP verification
                    localStorage.setItem('email', this.registerForm.value.email);
                    this.successMessage = res.message || 'OTP sent to your email';
                    // Navigate to OTP page after a brief delay
                    setTimeout(() => {
                        this.router.navigate(['/auth/otp']);
                    }, 1500);
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error('Registration error:', err);
                    this.errorMessage = err.error?.error || 'Registration failed. Please try again.';
                }
            });
    }
}
