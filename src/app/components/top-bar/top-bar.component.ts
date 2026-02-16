import { Component, signal, inject, HostListener, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-top-bar',
    standalone: true,
    imports: [CommonModule, TranslateModule, RouterLink, RouterLinkActive],
    templateUrl: './top-bar.component.html'
})
export class TopBarComponent {
    private translate = inject(TranslateService);
    private router = inject(Router);
    auth = inject(AuthService);

    currentLang = signal('en');
    isDropdownOpen = signal(false);
    showNotifications = signal(false);
    showProfile = signal(false);

    user = computed(() => this.auth.user);

    languages = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'de', label: 'German', flag: '🇩🇪' },
        { code: 'fr', label: 'French', flag: '🇫🇷' },
        { code: 'es', label: 'Spanish', flag: '🇪🇸' }
    ];

    notifications = [
        {
            id: 1, type: 'match', read: false, time: '2m ago',
            title: 'Goal! Madrid CF 2 - 1 London Blue',
            message: 'Vinicius Jr scores in the 58th minute',
            icon: '⚽'
        },
        {
            id: 2, type: 'tournament', read: false, time: '15m ago',
            title: 'Tournament Update',
            message: 'Champions League Quarter-Finals draw completed',
            icon: '🏆'
        },
        {
            id: 3, type: 'system', read: false, time: '1h ago',
            title: 'New Team Registered',
            message: 'Bayern Munich joined the Winter League 2026',
            icon: '👥'
        },
        {
            id: 4, type: 'match', read: true, time: '2h ago',
            title: 'Match Started',
            message: 'Munich FC vs Paris SG - Gold Cup Semi-Final',
            icon: '📣'
        },
        {
            id: 5, type: 'system', read: true, time: '5h ago',
            title: 'System Maintenance',
            message: 'Scheduled maintenance completed successfully',
            icon: '🔧'
        }
    ];

    get unreadCount(): number {
        return this.notifications.filter(n => !n.read).length;
    }

    constructor() {
        this.translate.use('en');
    }

    setLang(event: Event) {
        const lang = (event.target as HTMLSelectElement).value;
        this.currentLang.set(lang);
        this.translate.use(lang);
    }

    toggleDropdown() {
        this.isDropdownOpen.update(v => !v);
    }

    toggleNotifications() {
        this.showNotifications.update(v => !v);
    }

    markAsRead(id: number) {
        const notif = this.notifications.find(n => n.id === id);
        if (notif) notif.read = true;
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
    }

    getTypeClass(type: string): string {
        switch (type) {
            case 'match': return 'bg-green-500/20 text-green-400';
            case 'tournament': return 'bg-gold-400/20 text-gold-400';
            case 'system': return 'bg-blue-500/20 text-blue-400';
            default: return 'bg-zinc-800 text-zinc-400';
        }
    }

    toggleProfile() {
        this.showProfile.update(v => !v);
        this.showNotifications.set(false);
    }

    logout() {
        this.showProfile.set(false);
        this.auth.logout();
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        const target = event.target as HTMLElement;
        if (!target.closest('.notification-panel') && !target.closest('.notification-bell')) {
            this.showNotifications.set(false);
        }
        if (!target.closest('.profile-dropdown')) {
            this.showProfile.set(false);
        }
    }
}
