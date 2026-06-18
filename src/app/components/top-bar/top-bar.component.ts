import { Component, signal, inject, HostListener, computed, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ProfilePopupComponent } from '../profile/profile-popup.component';
import { TournamentService, TournamentDTO } from '../../tournament/tournament.service';

@Component({
    selector: 'app-top-bar',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, RouterLink, RouterLinkActive, ProfilePopupComponent],
    templateUrl: './top-bar.component.html'
})
export class TopBarComponent {
    private translate = inject(TranslateService);
    auth = inject(AuthService);
    private tournamentService = inject(TournamentService);
    private router = inject(Router);

    /** Emitted when the mobile hamburger is tapped; the layout opens the sidebar drawer. */
    @Output() menuClick = new EventEmitter<void>();

    currentLang = signal('en');
    showProfile = signal(false);
    showProfilePopup = signal(false);

    // --- Tournament search ---
    searchQuery = signal('');
    showSearchResults = signal(false);
    private allTournaments = signal<TournamentDTO[]>([]);
    private tournamentsLoaded = false;

    searchResults = computed<TournamentDTO[]>(() => {
        const q = this.searchQuery().trim().toLowerCase();
        if (!q) return [];
        return this.allTournaments()
            .filter(t => t.name?.toLowerCase().includes(q))
            .slice(0, 8);
    });

    user = computed(() => this.auth.user);

    languages = [
        { code: 'en', label: 'English' },
        { code: 'de', label: 'German' },
        { code: 'fr', label: 'French' },
        { code: 'es', label: 'Spanish' }
    ];

    constructor() {
        const savedLang = localStorage.getItem('lang') || 'en';
        this.translate.use(savedLang);
    }

    setLang(event: Event) {
        const lang = (event.target as HTMLSelectElement).value;
        this.currentLang.set(lang);
        this.translate.use(lang);
        localStorage.setItem('lang', lang);
    }

    toggleProfile() {
        this.showProfile.update(v => !v);
    }

    logout() {
        this.showProfile.set(false);
        this.auth.logout();
    }

    // --- Tournament search ---

    private ensureTournamentsLoaded() {
        if (this.tournamentsLoaded) return;
        this.tournamentsLoaded = true;
        this.tournamentService.getAll().subscribe({
            next: (data) => this.allTournaments.set(data || []),
            error: () => { this.tournamentsLoaded = false; } // allow retry on next focus
        });
    }

    onSearchFocus() {
        this.ensureTournamentsLoaded();
        if (this.searchQuery().trim()) this.showSearchResults.set(true);
    }

    onSearchInput(value: string) {
        this.searchQuery.set(value);
        this.showSearchResults.set(!!value.trim());
    }

    selectResult(tournament: TournamentDTO) {
        // Filter the tournaments listing by the picked name rather than opening details
        this.filterListing(tournament.name || '');
    }

    submitSearch() {
        this.filterListing(this.searchQuery().trim());
    }

    private filterListing(term: string) {
        if (!term) return;
        this.showSearchResults.set(false);
        this.searchQuery.set('');
        this.router.navigate(['/admin/tournaments'], { queryParams: { search: term } });
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: Event) {
        const target = event.target as HTMLElement;
        if (!target.closest('.topbar-search')) {
            this.showSearchResults.set(false);
        }
        if (!target.closest('.profile-dropdown')) {
            this.showProfile.set(false);
        }
    }
}
