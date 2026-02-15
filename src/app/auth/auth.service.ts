import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

    baseUrl = 'http://127.0.0.1:3000/auth';
    private userEmailSignal = signal<string | null>(localStorage.getItem('user_email'));

    constructor(private http: HttpClient, private router: Router) { }

    get userEmail() {
        return this.userEmailSignal();
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

    setAuthenticatedUser(email: string, token: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('user_email', email);
        this.userEmailSignal.set(email);
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user_email');
        this.userEmailSignal.set(null);
        this.router.navigate(['/auth/login']);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }
}
