import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Sponsor {
  id?: number;
  name: string;
  logo?: string;
  email?: string;
  phone?: string;
  website?: string;
  type?: string;
  display_order: number;
  status: 'active' | 'inactive';
  totalTournaments?: number;
  tournamentNames?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface TournamentSponsor {
  id: number;
  tournament_id: number;
  sponsor_id: number;
  sponsor?: Sponsor;
  tournament?: any;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class SponsorService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/sponsors`;

  getAll(filters: { search?: string, status?: string }): Observable<Sponsor[]> {
    let params = new HttpParams();
    if (filters.search) params = params.set('search', filters.search);
    if (filters.status) params = params.set('status', filters.status);
    return this.http.get<Sponsor[]>(this.baseUrl, { params });
  }

  getOne(id: number): Observable<Sponsor> {
    return this.http.get<Sponsor>(`${this.baseUrl}/${id}`);
  }

  create(formData: FormData): Observable<Sponsor> {
    return this.http.post<Sponsor>(this.baseUrl, formData);
  }

  update(id: number, formData: FormData): Observable<Sponsor> {
    return this.http.put<Sponsor>(`${this.baseUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Tournament Mappings
  getTournamentSponsors(tournamentId: number): Observable<TournamentSponsor[]> {
    return this.http.get<TournamentSponsor[]>(`${environment.apiUrl}/api/tournament-sponsors/tournament/${tournamentId}`);
  }

  assignSponsor(tournamentId: number, sponsorId: number): Observable<TournamentSponsor> {
    return this.http.post<TournamentSponsor>(`${environment.apiUrl}/api/tournament-sponsors`, { tournamentId, sponsorId });
  }

  removeSponsorMapping(mappingId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/api/tournament-sponsors/${mappingId}`);
  }
}
