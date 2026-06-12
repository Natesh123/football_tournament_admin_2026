import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
    private auth = inject(AuthService);
    private router = inject(Router);

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const requiredPermission = route.data['permission'] as string;

        if (!requiredPermission || this.auth.hasPermission(requiredPermission)) {
            return true;
        }

        // If no permission, redirect to dashboard or access denied
        // Prevent loop if they are already trying to access /dashboard but don't have permission
        if (state.url === '/admin/dashboard' || state.url === '/') {
            const firstModule = this.findFirstAvailableModule();
            if (firstModule) {
                this.router.navigate([firstModule]);
            } else {
                this.auth.logout();
            }
            return false;
        }

        this.router.navigate(['/admin/dashboard']);
        return false;
    }

    private findFirstAvailableModule(): string | null {
        const user = this.auth.user;
        if (!user) return null;

        // Admin has all modules
        if (this.auth.isAdmin) return '/admin/dashboard';

        if (!user.permissions?.module_access) return null;
        const access = user.permissions.module_access;

        if (access.can_dashboard) return '/admin/dashboard';
        if (access.can_tournaments) return '/admin/tournaments';
        if (access.can_teams) return '/admin/teams';
        if (access.can_settings) return '/admin/settings';

        return null;
    }
}
