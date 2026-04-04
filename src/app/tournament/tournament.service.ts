import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TournamentDTO {
    id?: string;
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    maxTeams: number;
    status: string;
    shortName?: string;
    type?: string;
    visibility?: string;
    logo?: string;
    coverImage?: string;
    sponsors?: string;
    organizer?: any;
    participantType?: string;
    minTeams?: number;
    regOpenDate?: string;
    regCloseDate?: string;
    approvalRequired?: boolean;
    regFee?: number;
    playerLimit?: number;
    squadSize?: number;
    settings?: any;
    format?: any;
    createdAt?: string;
    updatedAt?: string;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

@Injectable({ providedIn: 'root' })
export class TournamentService {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiBaseUrl}/api/tournaments`;

    getAll(): Observable<TournamentDTO[]> {
        return this.http.get<ApiResponse<TournamentDTO[]>>(this.baseUrl).pipe(
            map(res => res.data)
        );
    }

    getById(id: string): Observable<TournamentDTO> {
        return this.http.get<ApiResponse<TournamentDTO>>(`${this.baseUrl}/${id}`).pipe(
            map(res => res.data)
        );
    }

    create(tournament: Partial<TournamentDTO>): Observable<TournamentDTO> {
        return this.http.post<ApiResponse<TournamentDTO>>(this.baseUrl, tournament).pipe(
            map(res => res.data)
        );
    }

    update(id: string, tournament: Partial<TournamentDTO>): Observable<TournamentDTO> {
        return this.http.put<ApiResponse<TournamentDTO>>(`${this.baseUrl}/${id}`, tournament).pipe(
            map(res => res.data)
        );
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    generateStructure(id: string, scheduleConfig?: any): Observable<any> {
        return this.http.post<ApiResponse<any>>(`${this.baseUrl}/${id}/generate-structure`, scheduleConfig || {}).pipe(
            map(res => res.data)
        );
    }

    getStructure(id: string): Observable<any> {
        return this.http.get<ApiResponse<any>>(`${this.baseUrl}/${id}/structure`).pipe(
            map(res => res.data)
        );
    }

    updateMatchSchedule(matchId: number | string, payload: any): Observable<any> {
        return this.http.patch<ApiResponse<any>>(`${environment.apiBaseUrl}/api/matches/${matchId}/schedule`, payload);
    }

    // Match Center & Event Management
    getMatchesByStatus(status: string, tournamentId?: string): Observable<any[]> {
        let url = `${environment.apiBaseUrl}/api/matches?status=${status}`;
        if (tournamentId) url += `&tournamentId=${tournamentId}`;
        return this.http.get<ApiResponse<any[]>>(url).pipe(
            map(res => res.data)
        );
    }

    getMatchEvents(matchId: number | string): Observable<any[]> {
        return this.http.get<ApiResponse<any[]>>(`${environment.apiBaseUrl}/api/matches/${matchId}/events`).pipe(
            map(res => res.data)
        );
    }

    addMatchEvent(matchId: number | string, eventData: any): Observable<any> {
        return this.http.post<ApiResponse<any>>(`${environment.apiBaseUrl}/api/matches/${matchId}/events`, eventData).pipe(
            map(res => res.data)
        );
    }

    updateMatchEvent(matchId: number | string, eventId: string, eventData: any): Observable<any> {
        return this.http.put<ApiResponse<any>>(`${environment.apiBaseUrl}/api/matches/${matchId}/events/${eventId}`, eventData).pipe(
            map(res => res.data)
        );
    }

    deleteMatchEvent(matchId: number | string, eventId: string): Observable<any> {
        return this.http.delete<ApiResponse<any>>(`${environment.apiBaseUrl}/api/matches/${matchId}/events/${eventId}`).pipe(
            map(res => res.data)
        );
    }
}
