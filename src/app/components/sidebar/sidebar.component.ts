import { Component, signal, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

interface NavItem {
    label: string;
    path: string;
    icon: string;
    exact?: boolean;
    /** module_access key that controls visibility (admins always see it). */
    permission: string;
}

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [RouterLink, RouterLinkActive],
    template: `
    <aside class="fixed left-0 top-0 h-full w-64 bg-neutral-900 border-r border-white/5 z-40 flex flex-col transition-transform duration-300"
           [class.-translate-x-full]="collapsed()"
           [class.translate-x-0]="!collapsed()">

      <!-- Logo -->
      <div class="flex items-center gap-3 px-6 py-5 border-b border-white/5">
        <div class="w-9 h-9 flex items-center justify-center">
          <img src="assets/images/logo-gold.png" alt="ATB" class="h-9 w-auto object-contain mix-blend-screen">
        </div>
        <span class="text-base font-black tracking-widest text-[#D4AF37]">ATB SPORTS</span>
        <button (click)="collapsed.set(true)"
                class="ml-auto text-zinc-500 hover:text-white lg:hidden">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Nav Items -->
      <nav class="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        @for (item of visibleNavItems(); track item.path) {
          <a [routerLink]="item.path"
             routerLinkActive="bg-[#D4AF37]/10 text-[#D4AF37] border-l-2 border-[#D4AF37]"
             [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
             class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200 border-l-2 border-transparent">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" [attr.d]="item.icon"/>
            </svg>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <!-- Bottom: User + Logout -->
      <div class="px-4 py-4 border-t border-white/5">
        <div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] mb-2">
          <div class="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold text-sm flex-shrink-0">
            {{ userInitial() }}
          </div>
          <div class="min-w-0">
            <p class="text-white text-sm font-semibold truncate">{{ userName() }}</p>
            <p class="text-zinc-500 text-xs truncate">{{ roleLabel() }}</p>
          </div>
        </div>
        <button (click)="logout()"
                class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- Mobile Overlay -->
    @if (!collapsed()) {
      <div class="fixed inset-0 bg-black/60 z-30 lg:hidden"
           (click)="collapsed.set(true)">
      </div>
    }
    `
})
export class SidebarComponent {
    private auth = inject(AuthService);
    private router = inject(Router);

    collapsed = signal(true);

    navItems: NavItem[] = [
        {
            label: 'Dashboard',
            path: '/admin/dashboard',
            icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
            exact: true,
            permission: 'can_dashboard'
        },
        {
            label: 'Tournaments',
            path: '/admin/tournaments',
            icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
            permission: 'can_tournaments'
        },
        {
            label: 'Teams',
            path: '/admin/teams',
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
            permission: 'can_teams'
        },
        {
            label: 'Settings',
            path: '/admin/settings',
            icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
            permission: 'can_settings'
        },
    ];

    // Visibility is driven by each role's module_access permissions (admins see
    // all). Reading auth.user keeps this reactive to permission refreshes.
    visibleNavItems = computed(() => {
        const user = this.auth.user;
        return user ? this.navItems.filter(item => this.auth.canAccess(item.permission)) : [];
    });

    roleLabel() {
        if (this.auth.isAdmin) return 'Administrator';
        const role = this.auth.userRole || 'organizer';
        return role.charAt(0).toUpperCase() + role.slice(1);
    }

    userName() {
        const user = this.auth.user;
        return user?.name || user?.email?.split('@')[0] || 'Admin';
    }

    userInitial() {
        return this.userName().charAt(0).toUpperCase();
    }

    open() {
        this.collapsed.set(false);
    }

    logout() {
        this.auth.logout();
    }
}
