import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { PortalData } from '../models/portal.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicDataService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) { }

  getPortalData(tournamentId: number): Observable<PortalData> {
    return this.http.get<{ success: boolean; data: PortalData }>(`${this.apiUrl}/public/tournament/${tournamentId}/portal`)
      .pipe(map(response => response.data));
  }

  getLatestTournamentId(): Observable<number> {
    return this.http.get<{ success: boolean; id: number }>(`${this.apiUrl}/public/tournament/latest/id`)
      .pipe(map(response => response.id));
  }

  registerTeam(tournamentId: number, teamData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/teams`, teamData);
  }

  addTeamToTournament(tournamentId: number, teamId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tournaments/${tournamentId}/teams/${teamId}`, {});
  }

  getMatchData(matchId: string): Observable<any> {
    return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/public/match/${matchId}`)
      .pipe(map(response => response.data));
  }
}
