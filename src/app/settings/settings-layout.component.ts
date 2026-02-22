import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-settings-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-theme(spacing.28)-theme(spacing.16))]">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 shrink-0">
        <div class="sticky top-28 bg-black-card border border-black-border rounded-xl overflow-hidden shadow-lg">
          <div class="p-4 border-b border-black-border">
            <h3 class="font-bold text-white uppercase tracking-wider text-sm">Settings</h3>
          </div>
          <nav class="flex flex-col p-2 space-y-1">
            <a routerLink="roles" 
               routerLinkActive="bg-gold-400/10 text-gold-400 border-gold-400/50" 
               class="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent transition-all font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Roles
            </a>
            <a routerLink="users" 
               routerLinkActive="bg-gold-400/10 text-gold-400 border-gold-400/50" 
               class="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent transition-all font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Users
            </a>
            <a routerLink="permissions" 
               routerLinkActive="bg-gold-400/10 text-gold-400 border-gold-400/50" 
               class="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent transition-all font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Permissions
            </a>
          </nav>
        </div>
      </aside>

      <!-- Content Area -->
      <main class="flex-1 min-w-0">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class SettingsLayoutComponent {
  auth = inject(AuthService);
}
