import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService, TournamentDTO } from '../tournament/tournament.service';

@Component({
    selector: 'app-tournament-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tournament-dashboard.component.html',
})
export class TournamentDashboardComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private tournamentService = inject(TournamentService);

    tournament = signal<TournamentDTO | null>(null);
    isLoading = signal(true);
    isSaving = signal(false);
    activeTab = signal<string>('general');
    toastMessage = signal('');

    // Editable form fields
    editName = '';
    editDescription = '';
    editStartDate = '';
    editEndDate = '';
    editMaxTeams = 16;
    editStatus = 'draft';

    // Match days
    matchDays: Record<string, boolean> = {
        MON: false, TUE: false, WED: false, THU: false, FRI: false, SAT: false, SUN: false
    };

    sidebarItems = [
        { id: 'general', label: 'General', icon: 'settings' },
        { id: 'participants', label: 'Participants', icon: 'users' },
        { id: 'format', label: 'Format', icon: 'grid' },
        { id: 'schedule', label: 'Schedule', icon: 'calendar' },
        { id: 'presentation', label: 'Presentation', icon: 'monitor' },
        { id: 'results', label: 'Results', icon: 'bar-chart' },
    ];

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadTournament(id);
        }
    }

    loadTournament(id: string) {
        this.isLoading.set(true);
        this.tournamentService.getById(id).subscribe({
            next: (tournament) => {
                this.tournament.set(tournament);
                this.editName = tournament.name;
                this.editDescription = tournament.description || '';
                this.editStartDate = tournament.startDate?.split('T')[0] || '';
                this.editEndDate = tournament.endDate?.split('T')[0] || '';
                this.editMaxTeams = tournament.maxTeams;
                this.editStatus = tournament.status;
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to load tournament:', err);
                this.isLoading.set(false);
            }
        });
    }

    setTab(tab: string) {
        this.activeTab.set(tab);
    }

    toggleDay(day: string) {
        this.matchDays[day] = !this.matchDays[day];
    }

    saveChanges() {
        const t = this.tournament();
        if (!t || !t.id) return;
        this.isSaving.set(true);

        this.tournamentService.update(t.id, {
            name: this.editName,
            description: this.editDescription,
            startDate: this.editStartDate,
            endDate: this.editEndDate,
            maxTeams: this.editMaxTeams,
            status: this.editStatus,
        }).subscribe({
            next: (updated) => {
                this.tournament.set(updated);
                this.isSaving.set(false);
                this.showToast('Changes saved successfully!');
            },
            error: (err) => {
                console.error('Failed to save:', err);
                this.isSaving.set(false);
                this.showToast('Failed to save changes.');
            }
        });
    }

    discardChanges() {
        const t = this.tournament();
        if (!t) return;
        this.editName = t.name;
        this.editDescription = t.description || '';
        this.editStartDate = t.startDate?.split('T')[0] || '';
        this.editEndDate = t.endDate?.split('T')[0] || '';
        this.editMaxTeams = t.maxTeams;
        this.editStatus = t.status;
        this.showToast('Changes discarded.');
    }

    goBack() {
        this.router.navigate(['/tournaments']);
    }

    showToast(message: string) {
        this.toastMessage.set(message);
        setTimeout(() => this.toastMessage.set(''), 3000);
    }

    getStatusLabel(status: string): string {
        const map: Record<string, string> = {
            draft: 'Draft',
            registration_open: 'Registration Open',
            in_progress: 'In Progress',
            completed: 'Completed',
        };
        return map[status] || status;
    }

    getStatusClass(status: string): string {
        const map: Record<string, string> = {
            draft: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
            registration_open: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
            in_progress: 'text-gold-400 border-gold-400/30 bg-gold-400/10',
            completed: 'text-zinc-400 border-zinc-400/30 bg-zinc-400/10',
        };
        return map[status] || '';
    }
}
