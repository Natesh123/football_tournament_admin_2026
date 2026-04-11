import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <section id="register" class="section-padding bg-navy relative">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-16 space-y-4">
          <h2 class="text-gold uppercase tracking-[0.2em] font-semibold text-sm">Join the Battle</h2>
          <h3 class="text-4xl md:text-5xl font-bold text-white uppercase italic tracking-wider">Register Your Team</h3>
          <div class="w-32 h-1.5 bg-gold mx-auto rounded-full mt-4 bg-gradient-to-r from-gold via-gold-light to-gold-dark shadow-[0_0_20px_rgba(212,175,55,0.3)]"></div>
        </div>

        <div class="bg-navy-lighter rounded-3xl p-8 md:p-12 border border-gold/10 shadow-[0_0_100px_rgba(212,175,55,0.05)]">
           <form [formGroup]="regForm" (ngSubmit)="onSubmit()" class="space-y-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <!-- Team Name -->
                 <div class="space-y-2">
                    <label class="text-xs uppercase tracking-widest font-bold text-gray-500 ml-1">Team Name</label>
                    <input type="text" formControlName="name" placeholder="Enter Team Name"
                           class="w-full bg-navy border border-gold/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all">
                 </div>

                 <!-- Captain Name -->
                 <div class="space-y-2">
                    <label class="text-xs uppercase tracking-widest font-bold text-gray-500 ml-1">Captain Name</label>
                    <input type="text" formControlName="captainName" placeholder="Enter Full Name"
                           class="w-full bg-navy border border-gold/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all">
                 </div>

                 <!-- Email -->
                 <div class="space-y-2">
                    <label class="text-xs uppercase tracking-widest font-bold text-gray-500 ml-1">Contact Email</label>
                    <input type="email" formControlName="contactEmail" placeholder="email@example.com"
                           class="w-full bg-navy border border-gold/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all">
                 </div>

                 <!-- City -->
                 <div class="space-y-2">
                    <label class="text-xs uppercase tracking-widest font-bold text-gray-500 ml-1">City / Base</label>
                    <input type="text" formControlName="city" placeholder="e.g. New York, Berlin"
                           class="w-full bg-navy border border-gold/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all">
                 </div>
              </div>

              <!-- Final Checkbox -->
              <div class="flex items-center space-x-3 group cursor-pointer border border-gold/10 p-4 rounded-xl bg-navy/50">
                 <input type="checkbox" formControlName="terms" id="terms" class="checkbox checkbox-primary border-gold/30">
                 <label for="terms" class="text-gray-400 text-sm cursor-pointer group-hover:text-gold transition-colors underline decoration-dotted underline-offset-4">
                    I agree to the tournament regulations and conduct guidelines.
                 </label>
              </div>

              <div class="pt-4">
                 <button type="submit" 
                         [disabled]="regForm.invalid || isSubmitting"
                         class="w-full bg-gradient-to-r from-gold to-gold-dark text-navy font-black text-xl uppercase italic py-5 rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span *ngIf="!isSubmitting">Confirm Registration</span>
                    <span *ngIf="isSubmitting" class="loading loading-spinner loading-md"></span>
                    <svg *ngIf="!isSubmitting" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                 </button>
              </div>

              <div *ngIf="successMessage" class="mt-8 p-6 bg-green-500/10 border border-green-500/30 rounded-2xl text-green-500 text-center animate-bounce">
                  <span class="font-bold flex items-center justify-center space-x-2">
                     <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                     </svg>
                     <span>Registration successful! Our staff will contact you shortly.</span>
                  </span>
              </div>
           </form>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class RegistrationFormComponent {
  @Input() isSubmitting: boolean = false;
  @Input() successMessage: boolean = false;
  @Output() formSubmit = new EventEmitter<any>();

  regForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.regForm = this.fb.group({
      name: ['', Validators.required],
      captainName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.regForm.valid) {
      this.formSubmit.emit(this.regForm.value);
    }
  }
}
