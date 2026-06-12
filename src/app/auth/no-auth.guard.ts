import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const NoAuthGuard: CanActivateFn = () => {
    const router = inject(Router);
    const token = localStorage.getItem('token');

    if (token) {
        router.navigate(['/admin/dashboard']);
        return false;
    }
    return true;
};
