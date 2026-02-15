import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface TournamentDTO {
    id?: string;
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    maxTeams: number;
    status: string;
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
    private baseUrl = 'http://localhost:3000/api/tournaments';

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
}
