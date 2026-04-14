import { Component, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-500" [class]="navClasses">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <a href="#hero" class="flex-shrink-0 group flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#996515] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.6)] transition-shadow">
              <svg class="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <span class="text-2xl font-black gradient-text tracking-wider transition-all group-hover:tracking-widest uppercase">ATB SPORTS</span>
          </a>
          
          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center space-x-2">
            <a href="#hero" class="nav-link px-5 py-2.5 rounded-xl text-white hover:text-gold font-medium transition-all flex items-center space-x-1 group">
              <span>Home</span>
              <svg class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
              </svg>
            </a>
            <a href="#about" class="nav-link px-5 py-2.5 rounded-xl text-white hover:text-gold font-medium transition-all flex items-center space-x-1 group">
              <span>About</span>
              <svg class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
              </svg>
            </a>
            <a href="#schedule" class="nav-link px-5 py-2.5 rounded-xl text-white hover:text-gold font-medium transition-all flex items-center space-x-1 group">
              <span>Schedule</span>
              <svg class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
              </svg>
            </a>
            <a href="#register" class="nav-link px-5 py-2.5 rounded-xl text-white hover:text-gold font-medium transition-all flex items-center space-x-1 group">
              <span>Register</span>
              <svg class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14" />
              </svg>
            </a>
          </div>
          
          <!-- Actions -->
          <div class="hidden lg:flex items-center space-x-4">
            <a href="/login" class="px-5 py-2.5 text-white hover:text-gold font-medium transition-colors">Login</a>
            <a href="#register" class="group relative px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-navy font-bold rounded-xl overflow-hidden transition-all hover:shadow-lg hover:shadow-gold/30 hover:scale-105">
              <span class="relative z-10 flex items-center space-x-2">
                <span>Register Now</span>
                <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </a>
          </div>
          
          <!-- Mobile Menu Button -->
          <button class="lg:hidden p-2 text-white hover:text-gold transition-colors" (click)="toggleMobileMenu()">
            <svg *ngIf="!mobileMenuOpen" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <svg *ngIf="mobileMenuOpen" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Mobile Menu -->
        <div *ngIf="mobileMenuOpen" class="lg:hidden pb-6">
          <div class="flex flex-col space-y-2 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <a href="#hero" (click)="closeMobileMenu()" class="px-5 py-3 rounded-xl text-white hover:text-gold hover:bg-white/5 font-medium transition-all">Home</a>
            <a href="#about" (click)="closeMobileMenu()" class="px-5 py-3 rounded-xl text-white hover:text-gold hover:bg-white/5 font-medium transition-all">About</a>
            <a href="#schedule" (click)="closeMobileMenu()" class="px-5 py-3 rounded-xl text-white hover:text-gold hover:bg-white/5 font-medium transition-all">Schedule</a>
            <a href="#register" (click)="closeMobileMenu()" class="px-5 py-3 rounded-xl text-white hover:text-gold hover:bg-white/5 font-medium transition-all">Register</a>
            <div class="pt-4 border-t border-white/10 mt-2">
              <a href="/login" class="block text-center px-5 py-3 rounded-xl text-white hover:text-gold font-medium transition-all">Login</a>
              <a href="#register" (click)="closeMobileMenu()" class="block text-center mt-2 px-5 py-3 bg-gradient-to-r from-gold to-gold-light text-navy font-bold rounded-xl">Register Now</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .gradient-text {
      background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 50%, #D4AF37 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  `]
})
export class NavbarComponent {
  isScrolled = false;
  mobileMenuOpen = false;
  
  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 50;
  }
  
  get navClasses(): string {
    if (this.isScrolled || this.mobileMenuOpen) {
      return 'bg-navy/95 backdrop-blur-xl border-b border-gold/20 shadow-2xl shadow-black/20';
    }
    return 'bg-transparent';
  }
  
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
  
  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}
