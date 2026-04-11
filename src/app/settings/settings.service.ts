import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../core/config/app.config';

@Injectable({ providedIn: 'root' })
export class SettingsService {
    private baseUrl = `${API_URL}/api/settings`;

    constructor(private http: HttpClient) { }

    // Roles
    getRoles(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/roles`);
    }

    addRole(name: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/roles`, { name });
    }

    // Users
    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/users`);
    }

    saveUser(userData: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/users`, userData);
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/users/${id}`);
    }

    changePassword(data: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/change-password`, data);
    }

    getPermissions(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/permissions`);
    }

    savePermissions(data: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/permissions`, data);
    }

    deletePermission(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/permissions/${id}`);
    }
}
