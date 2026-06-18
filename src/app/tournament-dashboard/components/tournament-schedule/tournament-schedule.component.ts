import { Component, Input, Output, EventEmitter, OnInit, signal, inject, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TournamentService } from '../../../tournament/tournament.service';
import { UiService } from '../../../services/ui.service';

@Component({
    selector: 'app-tournament-schedule',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule
    ],
    templateUrl: './tournament-schedule.component.html'
})
export class TournamentScheduleComponent implements OnInit {
    @Input() data!: any;
    @Input() tournamentId!: string;
    @Input() venues: any = null;
    @Input() showValidationErrors = false;
    @Output() requireVenue = new EventEmitter<void>();

    private translate = inject(TranslateService);
    private tournamentService = inject(TournamentService);
    public ui = inject(UiService);
    private elRef = inject(ElementRef);

    structure = signal<any>(null);
    isLoadingStructure = signal(false);
    isSavingMatch = signal(false);
    availableTeams = signal<{ id: number; name: string }[]>([]);

    // ─── Time Slot Dropdown ──────────────────────────────────────────────────
    isTimeSlotDropdownOpen = signal(false);
    timeSlotSearchQuery = signal('');

    availableTimeSlots = Array.from({ length: 48 }, (_, i) => {
        const hours = Math.floor(i / 2).toString().padStart(2, '0');
        const minutes = i % 2 === 0 ? '00' : '30';
        return `${hours}:${minutes}`;
    });

    @HostListener('document:click', ['$event'])
    onClickOutside(event: any) {
        if (event?.target && !this.elRef.nativeElement.contains(event.target)) {
            this.isTimeSlotDropdownOpen.set(false);
        }
    }

    toggleDropdown() {
        this.isTimeSlotDropdownOpen.set(!this.isTimeSlotDropdownOpen());
    }

    updateSearchQuery(val: string) {
        this.timeSlotSearchQuery.set(val);
    }

    get filteredTimeSlots() {
        const query = this.timeSlotSearchQuery().toLowerCase().trim();
        return this.availableTimeSlots.filter(t => t.toLowerCase().includes(query));
    }

    get selectedTimeSlots(): string[] {
        if (!this.data?.timeSlots) return [];
        return this.data.timeSlots.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    }

    toggleTimeSlot(slot: string) {
        let selected = [...this.selectedTimeSlots];
        if (selected.includes(slot)) {
            selected = selected.filter(s => s !== slot);
        } else {
            selected.push(slot);
            selected.sort();
        }
        this.data.timeSlots = selected.join(', ');
    }

    removeTimeSlot(slot: string, event: Event) {
        event.stopPropagation();
        this.toggleTimeSlot(slot);
    }

    onTimeSlotsChange(event: Event) {
        const select = event.target as HTMLSelectElement;
        const selected: string[] = [];
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].selected) selected.push(select.options[i].value);
        }
        this.data.timeSlots = selected.join(', ');
    }

    // ─── Venue (connected data) ──────────────────────────────────────────────
    get hasVenueDetails(): boolean {
        return !!this.venues?.primaryVenue?.trim();
    }

    get venueOptions(): string[] {
        const options: string[] = [];
        const primary = this.venues?.primaryVenue?.trim();
        if (primary) {
            options.push(primary);
            if (this.venues?.multipleVenues && Array.isArray(this.venues?.pitches)) {
                for (const pitch of this.venues.pitches) {
                    const name = pitch?.name?.trim();
                    if (name) options.push(`${primary} - ${name}`);
                }
            }
        }
        // Keep a venue already saved on the match selectable even if it is not
        // part of the tournament venue setup anymore
        const current = this.editingMatch?.venue?.trim();
        if (current && !options.includes(current)) options.push(current);
        return options;
    }

    // ─── Lifecycle ───────────────────────────────────────────────────────────
    ngOnInit() {
        if (this.tournamentId) {
            this.loadStructure();
            this.loadTeams();
        }
    }

    loadTeams() {
        this.tournamentService.getTeams(this.tournamentId).subscribe({
            next: (regs: any[]) => {
                const teams = (regs || [])
                    .filter(r => r.status === 'approved' && r.team)
                    .map(r => ({ id: r.team.id, name: r.team.name }));
                this.availableTeams.set(teams);
            },
            error: () => { /* non-blocking: team editing just won't be available */ }
        });
    }

    loadStructure() {
        this.isLoadingStructure.set(true);
        this.tournamentService.getStructure(this.tournamentId).subscribe({
            next: (data: any) => { this.structure.set(data); this.isLoadingStructure.set(false); },
            error: () => { this.isLoadingStructure.set(false); }
        });
    }

    // ─── Auto Generate ───────────────────────────────────────────────────────
    generateSchedule() {
        if (!this.tournamentId) return;

        // Matches are played at the tournament venue — require it before scheduling
        if (!this.hasVenueDetails) {
            this.requireVenue.emit();
            return;
        }
        if (!this.data?.startDate) {
            this.ui.showToast('TOURNAMENT_DASHBOARD.SCHEDULE.ERR_START_DATE', 'error');
            return;
        }
        if (this.selectedTimeSlots.length === 0) {
            this.ui.showToast('TOURNAMENT_DASHBOARD.SCHEDULE.ERR_TIME_SLOT', 'error');
            return;
        }

        this.ui.startAction();
        this.tournamentService.generateStructure(this.tournamentId, this.data).subscribe({
            next: (data: any) => {
                this.structure.set(data);
                this.ui.endAction();
                this.ui.showToast('TOURNAMENT_DASHBOARD.SCHEDULE.SUCCESS_GENERATE', 'success');
            },
            error: (err: any) => {
                this.ui.endAction();
                this.ui.showToast(err?.error?.message || 'TOURNAMENT_DASHBOARD.SCHEDULE.ERR_GENERATE', 'error');
            }
        });
    }

    toggleDay(day: string) {
        if (this.data?.matchDays) this.data.matchDays[day] = !this.data.matchDays[day];
    }

    // ─── Match Editor Modal ───────────────────────────────────────────────────
    editingMatch: any = null;

    startManualEditor() {
        const matches = this.structure()?.matches;
        if (matches && matches.length > 0) {
            this.openMatchEditor(matches[0]);
        }
    }

    openMatchEditor(match: any) {
        this.editingMatch = {
            ...match,
            // Default the match venue to the tournament's primary venue
            venue: match.venue || this.venues?.primaryVenue?.trim() || '',
            matchTime: match.startTime ? new Date(match.startTime).toISOString().slice(0, 16) : '',
            // TBD knockout slots come through as label objects (no id) -> null selection
            homeTeamId: match.homeTeam?.id ?? null,
            awayTeamId: match.awayTeam?.id ?? null,
            _origHomeTeamId: match.homeTeam?.id ?? null,
            _origAwayTeamId: match.awayTeam?.id ?? null
        };
    }

    closeMatchEditor() {
        this.editingMatch = null;
    }

    get hasPrevMatch(): boolean {
        if (!this.editingMatch || !this.structure()?.matches) return false;
        return this.structure().matches.findIndex((m: any) => m.id === this.editingMatch.id) > 0;
    }

    get hasNextMatch(): boolean {
        if (!this.editingMatch || !this.structure()?.matches) return false;
        const idx = this.structure().matches.findIndex((m: any) => m.id === this.editingMatch.id);
        return idx < this.structure().matches.length - 1;
    }

    editPrevMatch() {
        if (this.hasPrevMatch) {
            const idx = this.structure().matches.findIndex((m: any) => m.id === this.editingMatch.id);
            this.openMatchEditor(this.structure().matches[idx - 1]);
        }
    }

    editNextMatch() {
        if (this.hasNextMatch) {
            const idx = this.structure().matches.findIndex((m: any) => m.id === this.editingMatch.id);
            this.openMatchEditor(this.structure().matches[idx + 1]);
        }
    }

    saveMatchSchedule() {
        if (!this.editingMatch) return;

        const matchId = this.editingMatch.id;
        if (!matchId) {
            this.ui.showToast('TOURNAMENT_DASHBOARD.SCHEDULE.ERR_MATCH_ID', 'error');
            return;
        }

        // A scheduled match must have a venue
        if (!this.editingMatch.venue?.trim()) {
            this.ui.showToast('TOURNAMENT_DASHBOARD.SCHEDULE.ERR_MATCH_VENUE', 'error');
            return;
        }

        this.isSavingMatch.set(true);

        const payload: any = {
            venue: this.editingMatch.venue ?? null,
            matchTime: this.editingMatch.matchTime || null,
            breakDuration: this.editingMatch.breakDuration ?? null,
            matchReferees: this.editingMatch.matchReferees ?? null
        };

        // Only send team assignments when they actually changed, so editing the
        // time/venue of a finished match doesn't trip the backend's team guard.
        const normId = (v: any) => (v === '' || v === undefined ? null : v === null ? null : Number(v));
        const home = normId(this.editingMatch.homeTeamId);
        const away = normId(this.editingMatch.awayTeamId);
        if (home !== (this.editingMatch._origHomeTeamId ?? null)) payload.homeTeamId = home;
        if (away !== (this.editingMatch._origAwayTeamId ?? null)) payload.awayTeamId = away;

        if (payload.homeTeamId !== undefined && payload.awayTeamId !== undefined
            && payload.homeTeamId !== null && payload.homeTeamId === payload.awayTeamId) {
            this.ui.showToast('Home and away teams must be different.', 'error');
            this.isSavingMatch.set(false);
            return;
        }

        this.tournamentService.updateMatchSchedule(matchId, payload).subscribe({
            next: (res: any) => {
                const updated = res?.data || res;
                const struct = this.structure();
                if (struct?.matches) {
                    const idx = struct.matches.findIndex((m: any) => m.id === matchId);
                    if (idx !== -1) {
                        struct.matches[idx] = { ...struct.matches[idx], ...updated };
                        this.structure.set({ ...struct });
                    }
                }
                this.isSavingMatch.set(false);
                this.ui.showToast('TOURNAMENT_DASHBOARD.SCHEDULE.SUCCESS_SAVE', 'success');
                this.closeMatchEditor();
            },
            error: (err: any) => {
                this.isSavingMatch.set(false);
                this.ui.showToast(err?.error?.message || 'TOURNAMENT_DASHBOARD.SCHEDULE.ERR_SAVE', 'error');
            }
        });
    }
}
