import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <nav class="sticky top-0 z-50 bg-navy/80 backdrop-blur-md border-b border-gold/20 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <span class="text-2xl font-bold text-gold-gradient tracking-wider">FOOTBALL TURNO</span>
            </div>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-8">
                <a href="#hero" class="text-white hover:text-gold px-3 py-2 rounded-md font-medium transition-colors">Home</a>
                <a href="#about" class="text-white hover:text-gold px-3 py-2 rounded-md font-medium transition-colors">About</a>
                <a href="#schedule" class="text-white hover:text-gold px-3 py-2 rounded-md font-medium transition-colors">Schedule</a>
              </div>
            </div>
          </div>
          <div class="hidden md:flex items-center space-x-4">
            <a href="/login" class="text-white hover:text-gold font-medium transition-colors">Login</a>
            <a href="#register" class="btn btn-primary border-none text-navy font-bold hover:scale-105 transition-transform">Register Now</a>
          </div>
          <div class="md:hidden">
            <button class="p-2 text-gold">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent { }
