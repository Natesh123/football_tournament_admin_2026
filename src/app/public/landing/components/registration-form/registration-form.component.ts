import { Component, Input, Output, EventEmitter, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <section id="register" class="relative py-32 overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 bg-gradient-to-b from-navy via-navy-lighter to-navy"></div>
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
      
      <!-- Decorative Elements -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[150px]"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-[120px]"></div>
      
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <!-- Header -->
        <div class="text-center mb-16">
          <span class="inline-flex items-center px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-semibold tracking-wide mb-6">
            <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Join the Battle
          </span>
          <h2 class="text-5xl md:text-7xl font-black text-white mb-4 uppercase italic tracking-wider">Register Your Team</h2>
          <div class="w-32 h-1.5 bg-gradient-to-r from-gold via-gold-light to-gold mx-auto rounded-full shadow-[0_0_30px_rgba(212,175,55,0.5)]"></div>
        </div>

        <!-- Form Card -->
        <div class="relative">
          <div class="absolute -inset-6 bg-gradient-to-r from-gold/20 via-gold/5 to-gold/20 rounded-[3rem] blur-2xl"></div>
          
          <div class="relative rounded-[2rem] bg-gradient-to-br from-navy to-navy-lighter p-10 md:p-16 border border-gold/20 shadow-2xl overflow-hidden">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-5" style="background-image: radial-gradient(circle at 2px 2px, rgba(212,175,55,0.5) 1px, transparent 0); background-size: 20px 20px;"></div>
            
            <form [formGroup]="regForm" (ngSubmit)="onSubmit()" class="relative space-y-10">
               <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <!-- Team Name -->
                 <div class="space-y-3 group">
                    <label class="text-sm uppercase tracking-widest font-bold text-gray-400 ml-1 group-hover:text-gold transition-colors">Team Name</label>
                    <div class="relative">
                      <div class="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gold/50">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <input type="text" formControlName="name" placeholder="Enter Team Name"
                             class="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-14 pr-5 py-5 text-white text-lg focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all hover:border-white/20">
                    </div>
                 </div>

                 <!-- Captain Name -->
                 <div class="space-y-3 group">
                    <label class="text-sm uppercase tracking-widest font-bold text-gray-400 ml-1 group-hover:text-gold transition-colors">Captain Name</label>
                    <div class="relative">
                      <div class="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gold/50">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input type="text" formControlName="captainName" placeholder="Enter Full Name"
                             class="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-14 pr-5 py-5 text-white text-lg focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all hover:border-white/20">
                    </div>
                 </div>

                 <!-- Email -->
                 <div class="space-y-3 group">
                    <label class="text-sm uppercase tracking-widest font-bold text-gray-400 ml-1 group-hover:text-gold transition-colors">Contact Email</label>
                    <div class="relative">
                      <div class="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gold/50">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input type="email" formControlName="contactEmail" placeholder="email@example.com"
                             class="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-14 pr-5 py-5 text-white text-lg focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all hover:border-white/20">
                    </div>
                 </div>

                 <!-- City -->
                 <div class="space-y-3 group">
                    <label class="text-sm uppercase tracking-widest font-bold text-gray-400 ml-1 group-hover:text-gold transition-colors">City / Base</label>
                    <div class="relative">
                      <div class="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gold/50">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <input type="text" formControlName="city" placeholder="e.g. New York, Berlin"
                             class="w-full bg-white/5 border-2 border-white/10 rounded-2xl pl-14 pr-5 py-5 text-white text-lg focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all hover:border-white/20">
                    </div>
                 </div>
              </div>

              <!-- Terms Checkbox -->
              <div class="flex items-start space-x-4 group cursor-pointer p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all">
                 <input type="checkbox" formControlName="terms" id="terms" class="mt-1 checkbox checkbox-lg checkbox-primary border-gold/30 bg-white/5">
                 <label for="terms" class="text-gray-400 cursor-pointer group-hover:text-gray-300 transition-colors leading-relaxed">
                    I agree to the tournament regulations and conduct guidelines. I understand that my team must adhere to all rules and fair play policies.
                 </label>
              </div>

              <!-- Submit Button -->
              <div class="pt-4">
                 <button type="submit" 
                         [disabled]="regForm.invalid || isSubmitting"
                         class="group relative w-full py-6 rounded-2xl font-black text-xl uppercase italic overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                         [class]="isSubmitting ? 'bg-gray-600' : 'bg-gradient-to-r from-gold via-gold-light to-gold hover:shadow-[0_0_60px_rgba(212,175,55,0.5)] hover:scale-[1.02]'">
                    <span class="relative z-10 flex items-center justify-center space-x-3">
                       <span *ngIf="!isSubmitting" class="group-hover:tracking-wider transition-all">Confirm Registration</span>
                       <span *ngIf="isSubmitting" class="loading loading-spinner loading-lg"></span>
                       <svg *ngIf="!isSubmitting" class="w-7 h-7 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                       </svg>
                    </span>
                 </button>
              </div>

              <!-- Success Message -->
              <div *ngIf="successMessage" class="p-6 rounded-2xl bg-green-500/10 border border-green-500/30 backdrop-blur-sm">
                  <span class="font-bold flex items-center justify-center space-x-3 text-green-500 text-lg">
                     <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                     </svg>
                     <span>Registration successful! Our staff will contact you shortly.</span>
                  </span>
              </div>
           </form>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: []
})
export class RegistrationFormComponent implements OnInit, OnDestroy {
  @Input() isSubmitting: boolean = false;
  @Input() successMessage: boolean = false;
  @Output() formSubmit = new EventEmitter<any>();

  private el: ElementRef;
  private renderer: Renderer2;
  private observer: IntersectionObserver | null = null;

  regForm: FormGroup;

  constructor(private fb: FormBuilder, el: ElementRef, renderer: Renderer2) {
    this.el = el;
    this.renderer = renderer;
    this.regForm = this.fb.group({
      name: ['', Validators.required],
      captainName: ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit() {
    this.initScrollReveal();
  }

  private initScrollReveal() {
    const options: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.renderer.addClass(entry.target, 'revealed');
          this.renderer.addClass(entry.target, 'animate-fadeInUp');
          this.observer?.unobserve(entry.target);
        }
      });
    }, options);

    const elements = this.el.nativeElement.querySelectorAll('.scroll-reveal');
    elements.forEach((el: Element, index: number) => {
      this.renderer.setStyle(el, 'transition-delay', `${index * 0.1}s`);
      this.observer?.observe(el);
    });
  }

  onSubmit() {
    if (this.regForm.valid) {
      this.formSubmit.emit(this.regForm.value);
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
