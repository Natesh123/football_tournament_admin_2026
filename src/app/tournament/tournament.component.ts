import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderComponent } from '../components/loader/loader.component';
import { TournamentService, TournamentDTO } from './tournament.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-tournament',
    standalone: true,
    imports: [CommonModule, FormsModule, LoaderComponent, TranslateModule],
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

    allTournaments: TournamentDTO[] = [];

    ngOnInit() {
        this.loadTournaments();
    }

    loadTournaments() {
        this.isLoading.set(true);
        this.tournamentService.getAll().subscribe({
            next: (data) => {
                this.allTournaments = data;
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to load tournaments', err);
                this.isLoading.set(false);
                this.showToast('Failed to load tournaments');
            }
        });
    }

    manageTournament(id: string | undefined) {
        if (id) {
            this.router.navigate(['/tournaments', id]);
        }
    }

    getStatusLabel(status: string): string {
        const map: Record<string, string> = {
            draft: 'Draft',
            registration_open: 'Registration Open',
            in_progress: 'In Progress',
            completed: 'Completed',
            archived: 'Archived'
        };
        return map[status?.toLowerCase()] || status || 'Unknown';
    }

    getStatusClass(status: string): string {
        const map: Record<string, string> = {
            draft: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
            registration_open: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
            in_progress: 'text-gold-400 border-gold-400/30 bg-gold-400/10',
            completed: 'text-zinc-400 border-zinc-400/30 bg-zinc-400/10',
            archived: 'text-zinc-600 border-zinc-600/30 bg-zinc-600/10'
        };
        return map[status?.toLowerCase()] || 'text-zinc-400 border-zinc-400/30 bg-zinc-400/10';
    }



    stats = [
        { label: 'ACTIVE CUPS', value: '24', icon: 'trophy' },
        { label: 'ACTIVE PLAYERS', value: '12,402', icon: 'users' },
        { label: 'GAMES TODAY', value: '156', icon: 'ticket' }
    ];

    get activeTournaments() {
        let list: TournamentDTO[];
        switch (this.currentTab()) {
            case 'upcoming':
                list = this.allTournaments.filter(t => t.status === 'draft' || t.status === 'registration_open');
                break;
            case 'past':
            case 'archived':
                list = this.allTournaments.filter(t => t.status === 'completed');
                break;
            case 'live':
            default:
                list = this.allTournaments.filter(t => t.status === 'in_progress');
                break;
        }

        // Search filter
        if (this.searchQuery.trim()) {
            const q = this.searchQuery.toLowerCase();
            list = list.filter(t =>
                t.name.toLowerCase().includes(q) ||
                (t.maxTeams?.toString().includes(q))
            );
        }

        // Status filter
        if (this.filterStatus !== 'all') {
            list = list.filter(t => t.status.toLowerCase().includes(this.filterStatus.toLowerCase()));
        }

        // Date range filter
        if (this.filterDateFrom) {
            const from = new Date(this.filterDateFrom).getTime();
            list = list.filter(t => t.startDate && new Date(t.startDate).getTime() >= from);
        }
        if (this.filterDateTo) {
            const to = new Date(this.filterDateTo).getTime();
            list = list.filter(t => t.startDate && new Date(t.startDate).getTime() <= to);
        }

        // Sort
        switch (this.sortBy) {
            case 'name':
                list = [...list].sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'date':
                list = [...list].sort((a, b) => {
                    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
                    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
                    return dateA - dateB;
                });
                break;
            case 'participants':
                list = [...list].sort((a, b) => {
                    const numA = typeof a.maxTeams === 'number' ? a.maxTeams : 0;
                    const numB = typeof b.maxTeams === 'number' ? b.maxTeams : 0;
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
