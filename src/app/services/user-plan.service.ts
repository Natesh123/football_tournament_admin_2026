import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../core/config/app.config';

export interface PlanItem {
    id: number;
    name: string;
    code: string;
    description?: string;
    monthlyPrice: number;
    yearlyPrice?: number;
    maxTournaments: number;
    maxTeams: number;
    maxPlayers: number;
    features?: string[];
    status: string;
}

export interface ActiveTournamentInfo {
    id: number;
    name: string;
    status: string;
    startDate?: string;
    endDate?: string;
}

export interface MyPlanResponse {
    currentPlanName: string;
    pendingPlanName?: string;
    planInfo: any;
    activeTournaments: ActiveTournamentInfo[];
    allTournamentsCount: number;
    plans: PlanItem[];
}

export interface UpdatePlanResponse {
    success: boolean;
    blocked: boolean;
    status: string;
    message: string;
    planName?: string;
    activeTournaments?: ActiveTournamentInfo[];
}

@Injectable({ providedIn: 'root' })
export class UserPlanService {
    private http = inject(HttpClient);
    private baseUrl = `${API_URL}/api/user-plan`;

    getMyPlan(): Observable<MyPlanResponse> {
        return this.http.get<MyPlanResponse>(`${this.baseUrl}/my-plan`);
    }

    updatePlan(planName: string): Observable<UpdatePlanResponse> {
        return this.http.post<UpdatePlanResponse>(`${this.baseUrl}/update-plan`, { planName });
    }
}
