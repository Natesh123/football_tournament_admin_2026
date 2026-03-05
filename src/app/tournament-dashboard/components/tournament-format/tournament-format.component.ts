import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TournamentStage {
    id: string;
    name: string;
    type: 'Group' | 'Knockout' | 'Match';
}

// ── In-memory board models ──────────────────────────────────────────────────
export interface BoardTeamSlot { label: string; }
export interface BoardGroup {
    id: string;
    name: string;       // "Group A"
    slots: BoardTeamSlot[];
}
export interface BoardMatch {
    id: string;
    home: string;        // "EMPTY SLOT" or "Winner Match X"
    away: string;
    isPlaceholder?: boolean;
}
export interface BoardRound {
    name: string;        // "Quarter Final" etc.
    matches: BoardMatch[];
}
export interface BoardPhase {
    id: string;
    name: string;        // "Group phase" | "Knockout phase"
    kind: 'group' | 'knockout';
    groups?: BoardGroup[];
    rounds?: BoardRound[];
}
// ────────────────────────────────────────────────────────────────────────────

@Component({
    selector: 'app-tournament-format',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tournament-format.component.html'
})
export class TournamentFormatComponent implements OnInit {
    @Input() data!: any;
    @Output() formatChange = new EventEmitter<any>();

    selectedFormat: 'group' | 'group_knockout' | 'knockout' | 'custom' | null = null;
    customStages: TournamentStage[] = [];

    Math = Math;

    // Which modal is open
    activeModal: 'group' | 'group_knockout' | 'knockout' | null = null;

    // Structure board phases (shown after CREATE)
    boardPhases: BoardPhase[] = [];
    showBoard: boolean = false;

    // ─── Group Phase Only config ─────────────────────────────────────────────
    groupOnly_numGroups: number = 4;
    groupOnly_teamsPerGroup: number = 4;
    groupOnly_homeAway: boolean = false;

    // ─── Groups + Knockout config ────────────────────────────────────────────
    gk_numGroups: number = 4;
    gk_teamsPerGroup: number = 4;
    gk_advancingTeams: number = 2;

    // ─── Knockout Only config ────────────────────────────────────────────────
    knockout_totalTeams: number = 16;

    ngOnInit() {
        if (!this.data) { this.data = {}; }
    }

    selectFormat(format: 'group' | 'group_knockout' | 'knockout') {
        this.activeModal = format;
    }

    closeModal() { this.activeModal = null; }

    // ── Helpers: letter labels ────────────────────────────────────────────────
    private groupLetter(i: number): string {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i] ?? `${i + 1}`;
    }

    private buildSlots(count: number): BoardTeamSlot[] {
        return Array.from({ length: count }, () => ({ label: 'EMPTY SLOT' }));
    }

    private buildGroups(count: number, teamsPerGroup: number): BoardGroup[] {
        return Array.from({ length: count }, (_, i) => ({
            id: `g${i}`,
            name: `Group ${this.groupLetter(i)}`,
            slots: this.buildSlots(teamsPerGroup)
        }));
    }

    private buildKnockoutRounds(totalTeams: number, matchIdOffset: number = 1): BoardRound[] {
        if (totalTeams < 2) return [];
        const roundNames: Record<number, string> = {
            2: 'Final', 4: 'Semi Final', 8: 'Quarter Final',
            16: 'Round of 16', 32: 'Round of 32', 64: 'Round of 64'
        };
        const rounds: BoardRound[] = [];
        let teams = totalTeams;
        let matchNum = matchIdOffset;
        const allRounds: { name: string; matchCount: number }[] = [];
        while (teams >= 2) {
            allRounds.push({ name: roundNames[teams] ?? `Round of ${teams}`, matchCount: teams / 2 });
            teams = Math.floor(teams / 2);
        }
        for (const r of allRounds) {
            const matches: BoardMatch[] = Array.from({ length: r.matchCount }, (_, i) => ({
                id: `m${matchNum + i}`,
                home: 'EMPTY SLOT',
                away: 'EMPTY SLOT',
                isPlaceholder: true
            }));
            rounds.push({ name: r.name, matches });
            matchNum += r.matchCount;
        }
        // Link later round placeholders to previous winners
        for (let ri = 1; ri < rounds.length; ri++) {
            const prevRound = rounds[ri - 1];
            for (let mi = 0; mi < rounds[ri].matches.length; mi++) {
                const m = rounds[ri].matches[mi];
                m.home = `Winner Match ${prevRound.matches[mi * 2]?.id.toUpperCase() ?? '?'}`;
                m.away = `Winner Match ${prevRound.matches[mi * 2 + 1]?.id.toUpperCase() ?? '?'}`;
                m.isPlaceholder = false;
            }
        }
        return rounds;
    }

    // ─── Apply: Group Phase Only ─────────────────────────────────────────────
    get groupOnly_advancingOptions(): number[] {
        const max = this.groupOnly_teamsPerGroup > 1 ? this.groupOnly_teamsPerGroup - 1 : 1;
        return Array.from({ length: max }, (_, i) => i + 1);
    }

    applyGroupOnly() {
        if (this.groupOnly_numGroups >= 1 && this.groupOnly_teamsPerGroup >= 2) {
            this.selectedFormat = 'group';
            this.data.type = 'group';
            this.data.total_groups = this.groupOnly_numGroups;
            this.data.teams_per_group = this.groupOnly_teamsPerGroup;
            this.data.home_away = this.groupOnly_homeAway;
            this.customStages = [];
            this.activeModal = null;

            this.boardPhases = [{
                id: 'phase-group', name: 'Group phase', kind: 'group',
                groups: this.buildGroups(this.groupOnly_numGroups, this.groupOnly_teamsPerGroup)
            }];
            this.showBoard = true;
            this.formatChange.emit(this.data);
        }
    }

    // ─── Apply: Groups + Knockout ────────────────────────────────────────────
    get gk_advancingOptions(): number[] {
        const max = this.gk_teamsPerGroup > 1 ? this.gk_teamsPerGroup - 1 : 1;
        return Array.from({ length: max }, (_, i) => i + 1);
    }

    applyGroupKnockout() {
        if (this.gk_numGroups >= 1 && this.gk_teamsPerGroup >= 2) {
            this.selectedFormat = 'group_knockout';
            this.data.type = 'group_knockout';
            this.data.total_groups = this.gk_numGroups;
            this.data.teams_per_group = this.gk_teamsPerGroup;
            this.data.qualification_rule = `Top ${this.gk_advancingTeams} Advance`;
            this.customStages = [];
            this.activeModal = null;

            const totalKnockoutTeams = this.gk_numGroups * this.gk_advancingTeams;
            this.boardPhases = [
                {
                    id: 'phase-group', name: 'Group phase', kind: 'group',
                    groups: this.buildGroups(this.gk_numGroups, this.gk_teamsPerGroup)
                },
                {
                    id: 'phase-knockout', name: 'Knockout phase', kind: 'knockout',
                    rounds: this.buildKnockoutRounds(totalKnockoutTeams)
                }
            ];
            this.showBoard = true;
            this.formatChange.emit(this.data);
        }
    }

    // ─── Apply: Knockout Only ────────────────────────────────────────────────
    get knockout_roundNames(): string[] {
        if (this.knockout_totalTeams < 2) return [];
        const rounds: string[] = [];
        let teams = this.knockout_totalTeams;
        const names: Record<number, string> = {
            2: 'Final', 4: 'Semi Final', 8: 'Quarter Final',
            16: 'Round of 16', 32: 'Round of 32', 64: 'Round of 64'
        };
        while (teams >= 2) { rounds.push(names[teams] ?? `Round of ${teams}`); teams = Math.floor(teams / 2); }
        return rounds;
    }

    applyKnockoutOnly() {
        if (this.knockout_totalTeams >= 2) {
            this.selectedFormat = 'knockout';
            this.data.type = 'knockout';
            this.data.total_teams = this.knockout_totalTeams;
            this.customStages = [];
            this.activeModal = null;

            this.boardPhases = [{
                id: 'phase-knockout', name: 'Knockout phase', kind: 'knockout',
                rounds: this.buildKnockoutRounds(this.knockout_totalTeams)
            }];
            this.showBoard = true;
            this.formatChange.emit(this.data);
        }
    }

    matchesInRound(teams: number, roundIndex: number): number {
        return Math.round(teams / Math.pow(2, roundIndex + 1));
    }

    // ─── Board actions ───────────────────────────────────────────────────────
    editPhase(phase: BoardPhase) {
        if (phase.kind === 'group') {
            this.activeModal = this.selectedFormat === 'group_knockout' ? 'group_knockout' : 'group';
        } else {
            this.activeModal = 'knockout';
        }
    }

    addGroupToPhase(phase: BoardPhase) {
        if (!phase.groups) phase.groups = [];
        const idx = phase.groups.length;
        phase.groups.push({
            id: `g${Date.now()}`, name: `Group ${this.groupLetter(idx)}`,
            slots: this.buildSlots(this.groupOnly_teamsPerGroup || this.gk_teamsPerGroup || 4)
        });
    }

    addKnockoutBracket(phase: BoardPhase) {
        // add a new bracket round at end
        if (!phase.rounds) phase.rounds = [];
        const teams = 2;
        const m: BoardMatch = { id: `m${Date.now()}`, home: 'EMPTY SLOT', away: 'EMPTY SLOT', isPlaceholder: true };
        phase.rounds.push({ name: `Extra Round`, matches: [m] });
    }

    addPhase() {
        const idx = this.boardPhases.length;
        this.boardPhases.push({
            id: `phase-extra-${idx}`, name: `Extra Phase ${idx + 1}`, kind: 'group',
            groups: [{ id: `g${Date.now()}`, name: 'Group A', slots: this.buildSlots(4) }]
        });
        this.formatChange.emit(this.data);
    }

    removePhase(idx: number) {
        this.boardPhases.splice(idx, 1);
        if (this.boardPhases.length === 0) { this.showBoard = false; }
        this.formatChange.emit(this.data);
    }

    // ─── Custom Builder ──────────────────────────────────────────────────────
    addStage(type: 'Group' | 'Knockout' | 'Match') {
        this.selectedFormat = 'custom';
        this.data.type = 'custom';
        const newStage: TournamentStage = {
            id: Math.random().toString(36).substring(2, 9),
            name: `${type} Stage ${this.customStages.length + 1}`,
            type
        };
        this.customStages.push(newStage);
        this.formatChange.emit(this.data);
    }

    removeStage(index: number) {
        this.customStages.splice(index, 1);
        if (this.customStages.length === 0) { this.selectedFormat = null; }
        this.formatChange.emit(this.data);
    }
}
