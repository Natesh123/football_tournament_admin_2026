import { Injectable, signal, computed } from '@angular/core';
import { SocketService } from './socket.service';

export interface AppNotification {
    id: number;
    type: 'goal' | 'match_start' | 'match_end' | 'card' | 'system';
    title: string;
    message: string;
    time: string;
    read: boolean;
    matchId?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private _notifications = signal<AppNotification[]>([]);
    private _idCounter = 0;

    notifications = computed(() => this._notifications());
    unreadCount = computed(() => this._notifications().filter(n => !n.read).length);

    constructor(private socket: SocketService) {
        this.socket.on('match_update', (data: any) => this.handleMatchUpdate(data));
    }

    private handleMatchUpdate(data: any) {
        const { matchId, homeTeam, awayTeam, homeScore, awayScore, status, match_period, event } = data;

        if (event?.type === 'goal') {
            this.push({
                type: 'goal',
                title: 'Goal Scored!',
                message: `${homeTeam ?? 'Home'} ${homeScore ?? 0} - ${awayScore ?? 0} ${awayTeam ?? 'Away'}${event.playerName ? ` — ${event.playerName}` : ''}`,
                matchId
            });
            return;
        }

        if (status === 'live' && match_period === 'first_half') {
            this.push({
                type: 'match_start',
                title: 'Match Started',
                message: `${homeTeam ?? 'Home'} vs ${awayTeam ?? 'Away'} has kicked off`,
                matchId
            });
            return;
        }

        if (status === 'completed') {
            this.push({
                type: 'match_end',
                title: 'Full Time',
                message: `${homeTeam ?? 'Home'} ${homeScore ?? 0} - ${awayScore ?? 0} ${awayTeam ?? 'Away'}`,
                matchId
            });
        }
    }

    private push(n: Omit<AppNotification, 'id' | 'time' | 'read'>) {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this._notifications.update(list => [
            { ...n, id: ++this._idCounter, time, read: false },
            ...list.slice(0, 49)
        ]);
    }

    markRead(id: number) {
        this._notifications.update(list =>
            list.map(n => n.id === id ? { ...n, read: true } : n)
        );
    }

    markAllRead() {
        this._notifications.update(list => list.map(n => ({ ...n, read: true })));
    }

    clear() {
        this._notifications.set([]);
    }
}
