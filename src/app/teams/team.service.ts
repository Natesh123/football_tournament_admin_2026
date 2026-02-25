import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Team {
    id: string;
    name: string;
    shortName?: string;
    logoUrl?: string;
    teamType?: 'Club' | 'School' | 'College' | 'Corporate' | 'Academy';
    city?: string;
    state?: string;
    country?: string;
    foundedYear?: number;
    homeGround?: string;
    description?: string;
    captainName?: string;
    contactEmail?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    private http = inject(HttpClient);
    readonly BASE_URL = 'http://localhost:3000';
    private apiUrl = `${this.BASE_URL}/api/teams`;

    getAll(search?: string): Observable<Team[]> {
        let params = new HttpParams();
        if (search) {
            params = params.set('search', search);
        }
        return this.http.get<Team[]>(this.apiUrl, { params });
    }

    getById(id: string): Observable<Team> {
        return this.http.get<Team>(`${this.apiUrl}/${id}`);
    }

    create(data: Partial<Team>): Observable<Team> {
        return this.http.post<Team>(this.apiUrl, data);
    }

    createWithFormData(formData: FormData): Observable<Team> {
        // Do NOT set Content-Type header — browser sets it automatically with multipart boundary
        return this.http.post<Team>(this.apiUrl, formData);
    }

    /** Returns array of fully-qualified photo URLs for this team's gallery */
    getGallery(teamId: string): Observable<{ teamId: string; photos: string[] }> {
        return this.http.get<{ teamId: string; photos: string[] }>(`${this.apiUrl}/${teamId}/gallery`);
    }

    /** Upload multiple gallery photos */
    uploadGallery(teamId: string, files: File[]): Observable<{ teamId: string; uploaded: number; photos: string[] }> {
        const formData = new FormData();
        files.forEach(f => formData.append('photos', f, f.name));
        return this.http.post<{ teamId: string; uploaded: number; photos: string[] }>(
            `${this.apiUrl}/${teamId}/gallery`, formData
        );
    }

    /** Delete a single gallery photo by filename */
    deleteGalleryPhoto(teamId: string, filename: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${teamId}/gallery/${filename}`);
    }

    /** Build full URL from a relative /uploads/... path */
    fullUrl(relativePath?: string | null): string | null {
        if (!relativePath) return null;
        return relativePath.startsWith('/uploads') ? `${this.BASE_URL}${relativePath}` : relativePath;
    }
}
