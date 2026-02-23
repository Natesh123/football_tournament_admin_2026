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
        if (state.url === '/dashboard' || state.url === '/') {
            const firstModule = this.findFirstAvailableModule();
            if (firstModule) {
                this.router.navigate([firstModule]);
            } else {
                this.auth.logout();
            }
            return false;
        }

        this.router.navigate(['/dashboard']);
        return false;
    }

    private findFirstAvailableModule(): string | null {
        const user = this.auth.user;
        if (!user || !user.permissions?.module_access) return null;
        const access = user.permissions.module_access;

        if (access.can_dashboard) return '/dashboard';
        if (access.can_tournaments) return '/tournaments';
        if (access.can_teams) return '/tournaments';
        if (access.can_settings) return '/settings';

        return null;
    }
}
