import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { PhysicsBallDirective } from '../physics-ball.directive';

@Component({
    selector: 'app-register',
    templateUrl: './register.html',
    styleUrl: './register.css',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, PhysicsBallDirective]
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
            name: ['', [Validators.required]],
            user_name: ['', [Validators.required]],
            phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]],
            agreeTerms: [false, [Validators.requiredTrue]]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password');
        const confirmPassword = form.get('confirmPassword');

        if (!password || !confirmPassword) {
            return null;
        }

        if (password.value !== confirmPassword.value) {
            confirmPassword.setErrors({ ...confirmPassword.errors, mismatch: true });
        } else {
            if (confirmPassword.hasError('mismatch')) {
                const errors = { ...confirmPassword.errors };
                delete errors['mismatch'];
                confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
            }
        }
        return null;
    }

    submit() {
        if (this.registerForm.invalid) {
            Object.keys(this.registerForm.controls).forEach(key => {
                this.registerForm.get(key)?.markAsTouched();
            });
            return;
        }

        this.errorMessage = '';
        this.successMessage = '';
        this.isLoading = true;

        const { name, email, password, user_name, phone_number } = this.registerForm.value;

        this.auth.register({ name, email, password, user_name, phone_number })
            .subscribe({
                next: (res: any) => {
                    this.isLoading = false;
                    // Store email for OTP verification
                    localStorage.setItem('email', email);
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
