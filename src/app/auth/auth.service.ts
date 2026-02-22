import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

    baseUrl = 'http://localhost:3000/auth';
    private userSignal = signal<any | null>(JSON.parse(localStorage.getItem('user') || 'null'));

    constructor(private http: HttpClient, private router: Router) { }

    get user() {
        return this.userSignal();
    }

    get userEmail() {
        return this.userSignal()?.email;
    }

    register(data: any) {
        return this.http.post(`${this.baseUrl}/register`, data);
    }

    verifyOtp(data: any) {
        return this.http.post(`${this.baseUrl}/verify-otp`, data);
    }

    validateToken(token: string) {
        return this.http.post(`${this.baseUrl}/validate-token`, { token });
    }

    login(data: any) {
        return this.http.post(`${this.baseUrl}/login`, data);
    }

    resendOtp(data: any) {
        return this.http.post(`${this.baseUrl}/resend-otp`, data);
    }

    setAuthenticatedUser(user: any, token: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.userSignal.set(user);
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.userSignal.set(null);
        this.router.navigate(['/auth/login']);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    hasPermission(permission: string): boolean {
        const user = this.user;
        if (!user || !user.permissions) return false;
        const access = user.permissions.module_access || {};
        return !!access[permission];
    }
}
