import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Restricts a route to platform admins. Non-admin organizers are bounced to
 * their tournaments workspace (the only area they can access).
 */
export const AdminGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isAdmin) {
        return true;
    }

    router.navigate(['/admin/tournaments']);
    return false;
};
