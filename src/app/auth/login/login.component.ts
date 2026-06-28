import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { UiService } from '../../services/ui.service';
import { ValidationComponent } from '../../shared/components/validation/validation.component';
import { revealAndFocusInvalid } from '../../shared/utils/form.util';

@Component({
    selector: 'app-login',
    templateUrl: './login.html',
    styleUrl: './login.css',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule, ValidationComponent]
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    errorMessage: string = '';
    successMessage: string = '';
    isLoading: boolean = false;
    showPassword = signal(false);

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private ui: UiService
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
                        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
                        if (returnUrl) {
                            const [path, fragment] = returnUrl.split('#');
                            this.router.navigate([path], { fragment });
                        } else {
                            this.router.navigate(['/admin/dashboard']);
                        }
                    }
                },
                error: () => {
                    // If validation fails, stay on login or redirect to register as per requirement?
                    // "If the token validation returns false, a message should be displayed asking 
                    // the user to create an account, and the user should be redirected to the registration page."
                    this.errorMessage = 'Session expired or account not found. Please register.';
                    setTimeout(() => this.router.navigate(['/register']), 2000);
                }
            });
        }
    }

    login() {
        // Reveal all validation messages and focus the first invalid field.
        if (!revealAndFocusInvalid(this.loginForm)) {
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
                        this.ui.showToast('Login successful! Redirecting...', 'success');

                        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
                        setTimeout(() => {
                            if (returnUrl) {
                                const [path, fragment] = returnUrl.split('#');
                                this.router.navigate([path], { fragment });
                            } else {
                                this.router.navigate(['/admin/dashboard']);
                            }
                        }, 1000);
                    }
                },
                error: (err) => {
                    this.isLoading = false;

                    if (err.error?.error === "User not found") {
                        this.errorMessage = 'Account not found. Please create an account.';
                        this.ui.showToast(this.errorMessage, 'error');
                        setTimeout(() => this.router.navigate(['/register']), 2000);
                    } else {
                        this.errorMessage = err.error?.error || 'Login failed. Please try again.';
                        this.ui.showToast(this.errorMessage, 'error');
                    }
                }
            });
    }
}
