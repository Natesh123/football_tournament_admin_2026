import { Component, inject, computed } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

interface Crumb {
    label: string;
    path: string | null;
}

@Component({
    selector: 'app-breadcrumb',
    standalone: true,
    imports: [RouterLink],
    template: `
    @if (crumbs().length > 1) {
      <nav class="flex items-center gap-1.5 px-6 py-3 border-b border-white/5 bg-neutral-950/50">
        @for (crumb of crumbs(); track crumb.label; let last = $last) {
          @if (!last) {
            <a [routerLink]="crumb.path"
               class="text-xs text-zinc-500 hover:text-[#D4AF37] transition-colors font-medium">
              {{ crumb.label }}
            </a>
            <svg class="w-3 h-3 text-zinc-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          } @else {
            <span class="text-xs text-[#D4AF37] font-semibold">{{ crumb.label }}</span>
          }
        }
      </nav>
    }
    `
})
export class BreadcrumbComponent {
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);

    private routeUrl = toSignal(
        this.router.events.pipe(
            filter(e => e instanceof NavigationEnd),
            map(() => this.router.url),
            startWith(this.router.url)
        ),
        { initialValue: this.router.url }
    );

    crumbs = computed((): Crumb[] => {
        const url = this.routeUrl() ?? '';
        const segments = url.split('?')[0].split('/').filter(Boolean);

        if (!segments.includes('admin')) return [];

        const adminIdx = segments.indexOf('admin');
        const adminSegments = segments.slice(adminIdx + 1);

        const crumbs: Crumb[] = [{ label: 'Dashboard', path: '/admin/dashboard' }];

        const labelMap: Record<string, string> = {
            dashboard: 'Dashboard',
            tournaments: 'Tournaments',
            teams: 'Teams',
            settings: 'Settings',
            'match-center': 'Match Center',
            matches: 'Matches',
            overview: 'Overview',
            members: 'Members',
            statistics: 'Statistics',
            gallery: 'Gallery',
            profile: 'Profile',
            security: 'Security',
            notifications: 'Notifications',
        };

        let builtPath = '/admin';
        for (let i = 0; i < adminSegments.length; i++) {
            const seg = adminSegments[i];
            builtPath += '/' + seg;
            // Skip the 'dashboard' segment — it's already represented by the base crumb,
            // so the dashboard page doesn't show a duplicate "Dashboard / Dashboard".
            if (seg === 'dashboard') continue;
            const isId = /^\d+$/.test(seg) || (seg.length > 8 && /^[a-f0-9-]+$/i.test(seg));
            const label = isId
                ? (adminSegments[i - 1] === 'tournaments' ? 'Tournament Details'
                    : adminSegments[i - 1] === 'teams' ? 'Team Details'
                    : adminSegments[i - 1] === 'matches' ? 'Match Details'
                    : 'Details')
                : (labelMap[seg] ?? seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
            crumbs.push({ label, path: i < adminSegments.length - 1 ? builtPath : null });
        }

        return crumbs;
    });
}
