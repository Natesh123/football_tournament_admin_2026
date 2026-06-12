import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const token = localStorage.getItem('token');

    // Skip auth header for public routes and translation files
    const isPublicRequest =
        req.url.includes('/assets/i18n/') ||
        req.url.includes('/auth/login') ||
        req.url.includes('/auth/register') ||
        req.url.includes('/auth/verify-otp') ||
        req.url.includes('/auth/resend-otp') ||
        req.url.includes('/api/public');

    const authReq = token && !isPublicRequest
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
};
