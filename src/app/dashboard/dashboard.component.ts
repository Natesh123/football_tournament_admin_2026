import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { HeroComponent } from './components/hero/hero.component';
import { MatchFeedComponent } from './components/match-feed/match-feed.component';
import { WidgetsComponent } from './components/widgets/widgets.component';
import { StatsBoard } from '../components/stats-board/stats-board';
import { TournamentService } from '../tournament/tournament.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css',
    standalone: true,
    imports: [CommonModule, HeroComponent, MatchFeedComponent, WidgetsComponent, StatsBoard, FormsModule, TranslateModule]
})
export class DashboardComponent {
    private tournamentService = inject(TournamentService);

    showCreateModal = signal(false);
    isCreating = signal(false);
    toastMessage = signal('');

    newTournament = {
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'draft',
        maxTeams: 16,
        prizePool: ''
    };

    openCreateModal() {
        this.showCreateModal.set(true);
    }

    closeCreateModal() {
        this.showCreateModal.set(false);
        this.resetForm();
    }

    createTournament() {
        if (!this.newTournament.name || !this.newTournament.startDate) return;
        this.isCreating.set(true);

        this.tournamentService.create({
            name: this.newTournament.name,
            description: this.newTournament.description,
            startDate: this.newTournament.startDate,
            endDate: this.newTournament.endDate || this.newTournament.startDate,
            maxTeams: this.newTournament.maxTeams,
            status: this.newTournament.status,
        }).subscribe({
            next: (created) => {
                this.isCreating.set(false);
                this.closeCreateModal();
                this.router.navigate(['/tournaments', created.id]);
            },
            error: (err) => {
                console.error('Failed to create tournament:', err);
                this.isCreating.set(false);
                this.showToast('Failed to create tournament. Please try again.');
            }
        });
    }

    showToast(message: string) {
        this.toastMessage.set(message);
        setTimeout(() => this.toastMessage.set(''), 3000);
    }

    resetForm() {
        this.newTournament = {
            name: '',
            description: '',
            startDate: '',
            endDate: '',
            status: 'draft',
            maxTeams: 16,
            prizePool: ''
        };
    }

    platformStats = [
        {
            label: 'Total Tournaments',
            value: '42',
            icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
        },
        {
            label: 'Finished Tournaments',
            value: '18',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        },
        {
            label: 'Total Teams / Clubs',
            value: '156',
            icon: 'M3 13h10a1 1 0 00.78-.37l2.83-4.24a1 1 0 011.66 0l2.83 4.24a1 1 0 00.78.37h5m-5 0V6a3 3 0 10-6 0v7m-5 0h12'
        },
        {
            label: 'Total Players',
            value: '2,400+',
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
        }
    ];

    activityStats = [
        {
            label: 'Tournaments Live Now',
            value: '3',
            type: 'live',
            colorClass: 'text-red-500',
            bgClass: 'bg-red-500/10',
            borderClass: 'border-red-500/20',
            icon: 'M13 10V3L4 14h7v7l9-11h-7z'
        },
        {
            label: 'Matches Live Now',
            value: '12',
            type: 'live',
            colorClass: 'text-red-500',
            bgClass: 'bg-red-500/10',
            borderClass: 'border-red-500/20',
            icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
        },
        {
            label: 'Today Upcoming Matches',
            value: '24',
            type: 'upcoming',
            colorClass: 'text-gold-400',
            bgClass: 'bg-gold-400/10',
            borderClass: 'border-gold-400/20',
            icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
        },
        {
            label: 'Today Finished Matches',
            value: '45',
            type: 'finished',
            colorClass: 'text-green-500',
            bgClass: 'bg-green-500/10',
            borderClass: 'border-green-500/20',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        }
    ];

    constructor(private router: Router, public auth: AuthService) {
        // Check if user is authenticated
        if (!this.auth.isAuthenticated()) {
            this.router.navigate(['/auth/login']);
        }
    }

    logout() {
        this.auth.logout();
    }
}
