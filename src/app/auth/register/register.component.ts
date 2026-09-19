import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { ValidationComponent } from '../../shared/components/validation/validation.component';
import { CustomValidators } from '../../shared/validators/custom-validators';
import { revealAndFocusInvalid } from '../../shared/utils/form.util';

@Component({
    selector: 'app-register',
    templateUrl: './register.html',
    styleUrl: './register.css',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule, ValidationComponent]
})
export class RegisterComponent implements OnInit {

    registerForm: FormGroup;
    errorMessage: string = '';
    successMessage: string = '';
    isLoading: boolean = false;
    showPassword = signal(false);
    showConfirmPassword = signal(false);
    
    publicPlans = signal<any[]>([]);
    isLoadingPlans = signal<boolean>(true);
    Number = Number;

    constructor(
        private fb: FormBuilder,
        private auth: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.registerForm = this.fb.group({
            name: ['', [Validators.required]],
            user_name: ['', [Validators.required]],
            phone_number: ['', [Validators.required, CustomValidators.mobile]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, CustomValidators.passwordStrength]],
            confirmPassword: ['', [Validators.required]],
            plan: ['Starter', [Validators.required]],
            planId: [1, [Validators.required]],
            agreeTerms: [false, [Validators.requiredTrue]]
        }, { validators: CustomValidators.matchFields('password', 'confirmPassword') });
    }

    ngOnInit() {
        this.fetchPublicPlans();
    }

    fetchPublicPlans() {
        this.isLoadingPlans.set(true);
        this.auth.getPublicPlans().subscribe({
            next: (res: any) => {
                const data = res?.data || [];
                this.publicPlans.set(data);
                this.isLoadingPlans.set(false);

                // Read query param
                const queryPlan = this.route.snapshot.queryParams['plan'] || this.route.snapshot.queryParams['planId'];
                if (data.length > 0) {
                    let target = data[0]; // fallback
                    if (queryPlan) {
                        const q = String(queryPlan).toLowerCase();
                        const found = data.find((p: any) => 
                            p.name.toLowerCase() === q || 
                            p.code.toLowerCase() === q || 
                            String(p.id) === q
                        );
                        if (found) target = found;
                    }
                    this.selectPlan(target);
                }
            },
            error: (err) => {
                console.error("Failed to load public plans:", err);
                this.isLoadingPlans.set(false);
            }
        });
    }

    selectPlan(planObj: any) {
        if (!planObj) return;
        this.registerForm.patchValue({
            plan: planObj.name,
            planId: planObj.id
        });
    }

    submit() {
        if (!revealAndFocusInvalid(this.registerForm)) {
            return;
        }

        this.errorMessage = '';
        this.successMessage = '';
        this.isLoading = true;

        const { name, email, password, user_name, phone_number, plan, planId } = this.registerForm.value;

        this.auth.register({ name, email, password, user_name, phone_number, plan, planId })
            .subscribe({
                next: (res: any) => {
                    this.isLoading = false;
                    localStorage.setItem('email', email);
                    this.successMessage = res.message || 'OTP sent to your email';
                    setTimeout(() => {
                        this.router.navigate(['/otp']);
                    }, 1500);
                },
                error: (err) => {
                    this.isLoading = false;
                    this.errorMessage = err.error?.error || 'Registration failed. Please try again.';
                }
            });
    }
}
