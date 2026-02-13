import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {

    baseUrl = 'http://localhost:3000/auth';

    constructor(private http: HttpClient) { }

    register(data: any) {
        return this.http.post(`${this.baseUrl}/register`, data);
    }

    verifyOtp(data: any) {
        return this.http.post(`${this.baseUrl}/verify-otp`, data);
    }

    login(data: any) {
        return this.http.post(`${this.baseUrl}/login`, data);
    }

    resendOtp(data: any) {
        return this.http.post(`${this.baseUrl}/resend-otp`, data);
    }
}
