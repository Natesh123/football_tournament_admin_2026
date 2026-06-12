import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, catchError, of } from 'rxjs';

export const AuthGuard: CanActivateFn = () => {
    const router = inject(Router);
    const auth = inject(AuthService);
    const token = localStorage.getItem('token');

    if (!token) {
        router.navigate(['/login']);
        return false;
    }

    return auth.validateToken(token).pipe(
        map((res: any) => {
            if (res?.valid) {
                // Sync the cached user with the server so role/permission changes
                // made in Settings take effect on the next navigation.
                if (res.user) auth.refreshUser(res.user);
                return true;
            }
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.navigate(['/login']);
            return false;
        }),
        catchError(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.navigate(['/login']);
            return of(false);
        })
    );
};
