import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket;
    public isConnected = signal<boolean>(false);

    constructor() {
        this.socket = io(environment.apiBaseUrl, {
            autoConnect: true,
            reconnection: true
        });

        this.socket.on('connect', () => {
            console.log('Socket connected');
            this.isConnected.set(true);
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
            this.isConnected.set(false);
        });
    }

    // Example method to listen for events
    on(eventName: string, callback: (data: any) => void) {
        this.socket.on(eventName, callback);
    }

    // Example method to emit events
    emit(eventName: string, data: any) {
        this.socket.emit(eventName, data);
    }
}
