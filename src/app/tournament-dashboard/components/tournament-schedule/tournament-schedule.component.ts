import { Component, Input, OnInit, signal, inject, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TournamentService } from '../../../tournament/tournament.service';
import { UiService } from '../../../services/ui.service';

@Component({
    selector: 'app-tournament-schedule',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tournament-schedule.component.html'
})
export class TournamentScheduleComponent implements OnInit {
    @Input() data!: any;
    @Input() tournamentId!: string;

    private tournamentService = inject(TournamentService);
    public ui = inject(UiService);
    private elRef = inject(ElementRef);

    structure = signal<any>(null);
    isLoadingStructure = signal(false);
    isSavingMatch = signal(false);

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

    // ─── Lifecycle ───────────────────────────────────────────────────────────
    ngOnInit() {
        if (this.tournamentId) this.loadStructure();
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

        if (!this.data?.startDate) {
            this.ui.showToast('Please select a Tournament Start Date.', 'error');
            return;
        }
        if (this.selectedTimeSlots.length === 0) {
            this.ui.showToast('Please select at least one Allowed Time Slot.', 'error');
            return;
        }

        this.ui.startAction();
        this.tournamentService.generateStructure(this.tournamentId, this.data).subscribe({
            next: (data: any) => {
                this.structure.set(data);
                this.ui.endAction();
                this.ui.showToast('Schedule generated successfully!', 'success');
            },
            error: (err: any) => {
                this.ui.endAction();
                this.ui.showToast(err?.error?.message || 'Failed to generate schedule', 'error');
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
            matchTime: match.startTime ? new Date(match.startTime).toISOString().slice(0, 16) : ''
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
            this.ui.showToast('Cannot save: match ID is missing', 'error');
            return;
        }

        this.isSavingMatch.set(true);

        const payload = {
            venue: this.editingMatch.venue ?? null,
            matchTime: this.editingMatch.matchTime || null,
            breakDuration: this.editingMatch.breakDuration ?? null,
            matchReferees: this.editingMatch.matchReferees ?? null
        };

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
                this.ui.showToast('Schedule saved successfully', 'success');
                this.closeMatchEditor();
            },
            error: (err: any) => {
                this.isSavingMatch.set(false);
                this.ui.showToast(err?.error?.message || 'Failed to save schedule', 'error');
            }
        });
    }
}
