
import { Component, inject, signal, ViewChild } from '@angular/core';
import { RouterOutlet, Router, Event as RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { LoaderComponent } from '../loader/loader.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [RouterOutlet, TopBarComponent, FooterComponent, LoaderComponent, SidebarComponent, BreadcrumbComponent],
    template: `
    <div class="min-h-screen flex bg-neutral-950 text-gold-100 font-['Inter',sans-serif]">
      <!-- Sidebar -->
      <app-sidebar #sidebar></app-sidebar>

      <!-- Main Content -->
      <div class="flex flex-col flex-1 min-w-0">
        <!-- Top Bar with mobile hamburger -->
        <div class="flex items-center gap-3 px-4 border-b border-white/5 bg-neutral-950 lg:hidden">
          <button (click)="sidebar.open()"
                  class="p-2 text-zinc-400 hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <span class="text-sm font-bold text-[#D4AF37] tracking-widest">ATB SPORTS</span>
        </div>
        <app-top-bar></app-top-bar>
        <app-breadcrumb></app-breadcrumb>
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
          
    </div>
  `
})
export class MainLayoutComponent {
  private router = inject(Router);
  isLoading = signal(false);
  private lastBaseRoute = '';
  private showLoaderTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        const newBase = event.url.split('?')[0].split('/')[1] || '';
        if (newBase !== this.lastBaseRoute) {
          // Defer showing the loader: navigations that resolve quickly (e.g. a
          // preloaded chunk) finish before this fires, so the loader never flashes.
          this.showLoaderTimer = setTimeout(() => this.isLoading.set(true), 150);
        }
      }
      if (event instanceof NavigationEnd) {
        this.lastBaseRoute = event.urlAfterRedirects.split('?')[0].split('/')[1] || '';
        this.endNavigation();
      }
      if (event instanceof NavigationCancel || event instanceof NavigationError) {
        this.endNavigation();
      }
    });
  }

  private endNavigation() {
    if (this.showLoaderTimer) {
      clearTimeout(this.showLoaderTimer);
      this.showLoaderTimer = null;
    }
    this.isLoading.set(false);
  }
}
