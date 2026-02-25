import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TeamMember {
    id: string;
    name: string;
    role: 'player' | 'captain' | 'vice_captain' | 'coach' | 'manager';
    position?: string;
    jerseyNumber?: number;
    teamId: string;
    createdAt: string;
    // UI Mock fields
    status?: 'active' | 'injured' | 'suspended';
    photoUrl?: string;
    dob?: string;
    preferredFoot?: 'right' | 'left' | 'both';
    mockStats?: {
        matches: number;
        goals: number;
        assists: number;
    };
}

@Injectable({
    providedIn: 'root'
})
export class TeamMemberService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/teams';

    getByTeamId(teamId: string): Observable<TeamMember[]> {
        return this.http.get<TeamMember[]>(`${this.apiUrl}/${teamId}/members`);
    }

    create(teamId: string, data: Partial<TeamMember>): Observable<TeamMember> {
        return this.http.post<TeamMember>(`${this.apiUrl}/${teamId}/members`, data);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`http://localhost:3000/api/teams/members/${id}`);
    }
}
