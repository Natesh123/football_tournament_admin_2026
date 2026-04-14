import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(): boolean {
        const token = localStorage.getItem('token');
        if (token) {
            // User is already logged in — redirect to dashboard
            this.router.navigate(['/admin/dashboard']);
            return false;
        }
        return true;
    }
}
