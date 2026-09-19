import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpContext } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../core/config/app.config';
import { SKIP_ERROR_TOAST } from '../core/interceptors/error.interceptor';

export interface AppNotification {
    id: number;
    userId: number;
    type: string;
    title: string;
    message: string;
    referenceId?: number | null;
    referenceType?: string | null;
    status: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private http = inject(HttpClient);
    private baseUrl = `${API_URL}/api/notifications`;

    notifications = signal<AppNotification[]>([]);
    unreadCount = signal<number>(0);
    loading = signal<boolean>(false);

    fetchUnreadCount(): Observable<{ unreadCount: number }> {
        return this.http.get<{ unreadCount: number }>(`${this.baseUrl}/unread-count`, {
            context: new HttpContext().set(SKIP_ERROR_TOAST, true)
        }).pipe(
            tap(res => this.unreadCount.set(res.unreadCount || 0))
        );
    }

    fetchNotifications(filters: { filter?: 'all' | 'unread' | 'read'; startDate?: string; endDate?: string } = {}): Observable<AppNotification[]> {
        this.loading.set(true);
        let params = new HttpParams();

        if (filters.filter && filters.filter !== 'all') {
            params = params.set('filter', filters.filter);
        }
        if (filters.startDate) {
            params = params.set('startDate', filters.startDate);
        }
        if (filters.endDate) {
            params = params.set('endDate', filters.endDate);
        }

        return this.http.get<AppNotification[]>(this.baseUrl, { params }).pipe(
            tap(list => {
                this.notifications.set(list || []);
                this.loading.set(false);
                // update unread count as well
                const unread = list.filter(n => !n.isRead).length;
                this.unreadCount.set(unread);
            })
        );
    }

    markAsRead(id: number): Observable<AppNotification> {
        return this.http.patch<AppNotification>(`${this.baseUrl}/${id}/read`, {}).pipe(
            tap(updated => {
                this.notifications.update(items =>
                    items.map(item => (item.id === id ? { ...item, isRead: true } : item))
                );
                this.unreadCount.update(c => Math.max(0, c - 1));
            })
        );
    }

    markAllAsRead(): Observable<{ success: boolean }> {
        return this.http.patch<{ success: boolean }>(`${this.baseUrl}/read-all`, {}).pipe(
            tap(() => {
                this.notifications.update(items =>
                    items.map(item => ({ ...item, isRead: true }))
                );
                this.unreadCount.set(0);
            })
        );
    }
}
