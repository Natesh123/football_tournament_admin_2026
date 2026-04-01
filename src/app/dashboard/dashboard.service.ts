import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardStats {
    totalTournaments: number;
    finishedTournaments: number;
    liveTournaments: number;
    totalTeams: number;
    totalPlayers: number;
    liveMatches: number;
    todayUpcomingMatches: number;
    todayFinishedMatches: number;
}

export interface LiveMatch {
    id: number;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    liveMinute: number;
    period: string;
    tournament: string;
    tournamentId: string;
    stage: string;
    venue: string;
    startTime: string;
    goalScorers: string[];
}

export interface UpcomingMatch {
    id: number;
    date: string;
    time: string;
    homeTeam: string;
    awayTeam: string;
    venue: string;
    tournament: string;
    tournamentId: string;
}

export interface PastMatch {
    id: number;
    date: string;
    homeTeam: string;
    awayTeam: string;
    score: string;
    status: string;
    venue: string;
    winner: string;
    tournament: string;
    tournamentId: string;
}

export interface MatchGroup<T> {
    date: string;
    matches: T[];
}

export interface TopScorer {
    rank: number;
    name: string;
    team: string;
    goals: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private http = inject(HttpClient);
    private base = `${environment.apiBaseUrl}/api/dashboard`;

    private get headers(): HttpHeaders {
        const token = localStorage.getItem('token') ?? '';
        return new HttpHeaders({ Authorization: `Bearer ${token}` });
    }

    getStats(): Observable<DashboardStats> {
        return this.http.get<{ success: boolean; data: DashboardStats }>(`${this.base}/stats`, { headers: this.headers })
            .pipe(map(r => r.data));
    }

    getLiveMatches(): Observable<LiveMatch[]> {
        return this.http.get<{ success: boolean; data: LiveMatch[] }>(`${this.base}/live`, { headers: this.headers })
            .pipe(map(r => r.data));
    }

    getUpcomingMatches(): Observable<MatchGroup<UpcomingMatch>[]> {
        return this.http.get<{ success: boolean; data: MatchGroup<UpcomingMatch>[] }>(`${this.base}/upcoming`, { headers: this.headers })
            .pipe(map(r => r.data));
    }

    getPastMatches(): Observable<MatchGroup<PastMatch>[]> {
        return this.http.get<{ success: boolean; data: MatchGroup<PastMatch>[] }>(`${this.base}/past`, { headers: this.headers })
            .pipe(map(r => r.data));
    }

    getTopScorers(): Observable<TopScorer[]> {
        return this.http.get<{ success: boolean; data: TopScorer[] }>(`${this.base}/scorers`, { headers: this.headers })
            .pipe(map(r => r.data));
    }
}
