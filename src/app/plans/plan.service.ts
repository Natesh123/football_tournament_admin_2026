import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../core/config/app.config';

export interface Plan {
    id: number;
    name: string;
    code: string;
    description?: string;
    monthlyPrice: number;
    yearlyPrice?: number;
    maxTournaments: number;
    maxTeams: number;
    maxPlayers: number;
    maxStaff: number;
    maxGrounds: number;
    maxReferees: number;
    maxVendors: number;
    storageLimitMb: number;
    trialDays: number;
    features?: string[];
    displayOrder: number;
    isPopular: boolean;
    landingVisible: boolean;
    status: 'active' | 'inactive';
    createdAt?: string;
    updatedAt?: string;
}

/** Currency shown for plan prices across admin + landing (see plan build decision: EUR). */
export const PLAN_CURRENCY = '€';

/** Format a numeric price with the plan currency, e.g. 29 -> "€29". */
export function formatPlanPrice(value?: number | string | null): string {
    const n = Number(value ?? 0);
    if (!isFinite(n)) return `${PLAN_CURRENCY}0`;
    // Drop trailing .00 for whole numbers.
    const amount = Number.isInteger(n) ? `${n}` : n.toFixed(2);
    return `${PLAN_CURRENCY}${amount}`;
}

@Injectable({ providedIn: 'root' })
export class PlanService {
    private http = inject(HttpClient);
    private apiUrl = `${API_URL}/api/plans`;

    getAll(search?: string, status?: string): Observable<Plan[]> {
        let params = new HttpParams();
        if (search) params = params.set('search', search);
        if (status) params = params.set('status', status);
        return this.http.get<Plan[]>(this.apiUrl, { params });
    }

    getById(id: number): Observable<Plan> {
        return this.http.get<Plan>(`${this.apiUrl}/${id}`);
    }

    create(data: Partial<Plan>): Observable<Plan> {
        return this.http.post<Plan>(this.apiUrl, data);
    }

    update(id: number, data: Partial<Plan>): Observable<Plan> {
        return this.http.put<Plan>(`${this.apiUrl}/${id}`, data);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
