import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderComponent } from '../components/loader/loader.component';
import { TournamentService, TournamentDTO } from './tournament.service';

@Component({
    selector: 'app-tournament',
    standalone: true,
    imports: [CommonModule, FormsModule, LoaderComponent],
    templateUrl: './tournament.component.html',
})
export class TournamentComponent implements OnInit {
    private tournamentService = inject(TournamentService);
    private router = inject(Router);

    currentTab = signal<'live' | 'upcoming' | 'past' | 'archived'>('live');
    isLoading = signal(true);
    showCreateModal = signal(false);
    isCreating = signal(false);
    toastMessage = signal('');

    // Filters
    searchQuery = '';
    filterStatus = 'all';
    filterDateFrom = '';
    filterDateTo = '';
    sortBy = 'name';

    newTournament = {
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'draft',
        maxTeams: 16,
        prizePool: ''
    };

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

    ngOnInit() {
        setTimeout(() => {
            this.isLoading.set(false);
        }, 3000);
    }

    tournaments = [
        {
            id: 1,
            title: 'Champions League - Quarter Finals',
            status: 'LIVE NOW',
            statusClass: 'text-gold-400 border-gold-400 bg-gold-400/10',
            schedule: 'Oct 12, 2023',
            participants: '32 Elite Teams',
            prizePool: '$2.5M USD',
            currentRound: 'Matchday 3/8',
            image: 'https://cdn.example.com/ucl.jpg',
            tag: 'UCL'
        },
        {
            id: 2,
            title: 'Premier League Summer Cup',
            status: 'MATCH IN PROGRESS',
            statusClass: 'text-gold-400 border-gold-400 bg-gold-400/10',
            schedule: 'Oct 15, 2023',
            participants: '20 Pro Clubs',
            prizePool: '$800k USD',
            currentRound: 'Group Stage',
            image: 'https://cdn.example.com/epl.jpg',
            tag: 'EPL'
        },
        {
            id: 3,
            title: 'La Liga Youth Series',
            status: 'LIVE',
            statusClass: 'text-gold-400 border-gold-400 bg-gold-400/10',
            schedule: 'Oct 20, 2023',
            participants: '16 Academies',
            prizePool: 'Exhibition',
            currentRound: 'Semifinals',
            image: 'https://cdn.example.com/laliga.jpg',
            tag: 'LL'
        }
    ];

    upcomingTournaments = [
        {
            id: 4,
            title: 'World Cup Qualifiers 2026',
            status: 'STARTS NOV 15',
            statusClass: 'text-blue-400 border-blue-400 bg-blue-400/10',
            schedule: 'Nov 15, 2026',
            participants: '48 National Teams',
            prizePool: 'Qualification',
            currentRound: 'Group Stage Draw',
            image: 'https://cdn.example.com/wcq.jpg',
            tag: 'WCQ'
        },
        {
            id: 5,
            title: 'Winter League 2026',
            status: 'REGISTRATION OPEN',
            statusClass: 'text-green-400 border-green-400 bg-green-400/10',
            schedule: 'Dec 01, 2026',
            participants: '16 Regional Clubs',
            prizePool: '$150k USD',
            currentRound: 'Pre-Season',
            image: 'https://cdn.example.com/winter.jpg',
            tag: 'WL'
        }
    ];

    pastTournaments = [
        {
            id: 6,
            title: 'Summer Cup 2025',
            status: 'COMPLETED',
            statusClass: 'text-zinc-400 border-zinc-400 bg-zinc-400/10',
            schedule: 'Aug 20, 2025',
            participants: '32 Teams',
            prizePool: '$500k USD',
            currentRound: 'Winner: Madrid Kings',
            image: 'https://cdn.example.com/summer.jpg',
            tag: 'SC'
        },
        {
            id: 7,
            title: 'Euro 2024',
            status: 'COMPLETED',
            statusClass: 'text-zinc-400 border-zinc-400 bg-zinc-400/10',
            schedule: 'Jul 14, 2024',
            participants: '24 National Teams',
            prizePool: '€331M EUR',
            currentRound: 'Winner: Spain',
            image: 'https://cdn.example.com/euro.jpg',
            tag: 'EUR'
        }
    ];

    archivedTournaments = [
        {
            id: 8,
            title: 'Legacy Cup 2020',
            status: 'ARCHIVED',
            statusClass: 'text-zinc-600 border-zinc-600 bg-zinc-600/10',
            schedule: 'Jan 10, 2020',
            participants: '16 Teams',
            prizePool: '$50k USD',
            currentRound: 'Winner: Old Guard',
            image: 'https://cdn.example.com/legacy.jpg',
            tag: 'LC'
        },
        {
            id: 9,
            title: '2019 Season',
            status: 'ARCHIVED',
            statusClass: 'text-zinc-600 border-zinc-600 bg-zinc-600/10',
            schedule: 'May 20, 2019',
            participants: '12 Teams',
            prizePool: '$20k USD',
            currentRound: 'Winner: Pioneers',
            image: 'https://cdn.example.com/2019.jpg',
            tag: 'S19'
        }
    ];

    stats = [
        { label: 'ACTIVE CUPS', value: '24', icon: 'trophy' },
        { label: 'ACTIVE PLAYERS', value: '12,402', icon: 'users' },
        { label: 'GAMES TODAY', value: '156', icon: 'ticket' }
    ];

    get activeTournaments() {
        let list: any[];
        switch (this.currentTab()) {
            case 'upcoming': list = this.upcomingTournaments; break;
            case 'past': list = this.pastTournaments; break;
            case 'archived': list = this.archivedTournaments; break;
            default: list = this.tournaments;
        }

        // Search filter
        if (this.searchQuery.trim()) {
            const q = this.searchQuery.toLowerCase();
            list = list.filter(t =>
                t.title.toLowerCase().includes(q) ||
                t.participants.toLowerCase().includes(q) ||
                t.tag.toLowerCase().includes(q)
            );
        }

        // Status filter
        if (this.filterStatus !== 'all') {
            list = list.filter(t => t.status.toLowerCase().includes(this.filterStatus.toLowerCase()));
        }

        // Date range filter
        if (this.filterDateFrom) {
            const from = new Date(this.filterDateFrom).getTime();
            list = list.filter(t => new Date(t.schedule).getTime() >= from);
        }
        if (this.filterDateTo) {
            const to = new Date(this.filterDateTo).getTime();
            list = list.filter(t => new Date(t.schedule).getTime() <= to);
        }

        // Sort
        switch (this.sortBy) {
            case 'name':
                list = [...list].sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'date':
                list = [...list].sort((a, b) => new Date(a.schedule).getTime() - new Date(b.schedule).getTime());
                break;
            case 'participants':
                list = [...list].sort((a, b) => {
                    const numA = parseInt(a.participants) || 0;
                    const numB = parseInt(b.participants) || 0;
                    return numB - numA;
                });
                break;
        }

        return list;
    }

    get activeFilterCount(): number {
        let count = 0;
        if (this.searchQuery.trim()) count++;
        if (this.filterStatus !== 'all') count++;
        if (this.filterDateFrom) count++;
        if (this.filterDateTo) count++;
        if (this.sortBy !== 'name') count++;
        return count;
    }

    clearFilters() {
        this.searchQuery = '';
        this.filterStatus = 'all';
        this.filterDateFrom = '';
        this.filterDateTo = '';
        this.sortBy = 'name';
    }

    switchTab(tab: 'live' | 'upcoming' | 'past' | 'archived') {
        this.currentTab.set(tab);
    }

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
                // Navigate to the tournament dashboard
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
}
