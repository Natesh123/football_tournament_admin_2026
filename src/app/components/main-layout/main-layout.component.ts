import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, TopBarComponent, FooterComponent, LoaderComponent],
    template: `
    <div class="min-h-screen flex flex-col bg-neutral-950 text-gold-100 font-['Inter',sans-serif]">
      <app-top-bar></app-top-bar>
      <main class="flex-grow p-4 md:p-6 lg:p-8 relative">
        @if (isLoading()) {
          <div class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950/80 backdrop-blur-sm min-h-[50vh]">
              <app-loader></app-loader>
              <p class="text-zinc-500 text-sm mt-4 font-bold tracking-wider uppercase animate-pulse">Loading View...</p>
          </div>
        }
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `
})
export class MainLayoutComponent {
  private router = inject(Router);
  isLoading = signal(false);
  private lastBaseRoute = '';

  constructor() {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        const newBase = event.url.split('?')[0].split('/')[1] || '';
        if (newBase !== this.lastBaseRoute) {
            this.isLoading.set(true);
        }
      }
      if (event instanceof NavigationEnd) {
        this.lastBaseRoute = event.urlAfterRedirects.split('?')[0].split('/')[1] || '';
        // Add a tiny delay so the loader doesn't flash too fast
        setTimeout(() => this.isLoading.set(false), 300);
      }
      if (event instanceof NavigationCancel || event instanceof NavigationError) {
        setTimeout(() => this.isLoading.set(false), 300);
      }
    });
  }
}
