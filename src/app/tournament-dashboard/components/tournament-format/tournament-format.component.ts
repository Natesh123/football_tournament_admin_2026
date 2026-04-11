import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface TournamentStage {
    id: string;
    name: string;
    type: 'Group' | 'Knockout' | 'Match';
}

// ── In-memory board models ──────────────────────────────────────────────────
export interface BoardTeamSlot { label: string; }
export interface BoardGroup {
    id: string;
    name: string;
    slots: BoardTeamSlot[];
}
export interface BoardMatch {
    id: string;
    home: string;
    away: string;
    isPlaceholder?: boolean;
}
export interface BoardRound {
    name: string;
    matches: BoardMatch[];
}
export interface BoardPhase {
    id: string;
    name: string;
    kind: 'group' | 'knockout';
    groups?: BoardGroup[];
    rounds?: BoardRound[];
}

interface TournamentTeam {
    id: string;
    status: string;
    paymentStatus: string;
    team: {
        id: string;
        name: string;
        shortName?: string;
    };
}

@Component({
    selector: 'app-tournament-format',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: './tournament-format.component.html'
})
export class TournamentFormatComponent implements OnInit, OnChanges {
    @Input() data!: any;
    @Input() tournamentId!: string;
    @Input() maxTeams: number = 16;
    @Output() formatChange = new EventEmitter<any>();

    private cdr = inject(ChangeDetectorRef);
    private http = inject(HttpClient);

    selectedFormat: 'group' | 'group_knockout' | 'knockout' | 'custom' | null = null;
    customStages: TournamentStage[] = [];

    Math = Math;

    // Which modal is open
    activeModal: 'group' | 'group_knockout' | 'knockout' | 'custom_group' | 'custom_knockout' | null = null;

    // Structure board phases (shown after CREATE)
    boardPhases: BoardPhase[] = [];
    showBoard: boolean = false;

    // Edit-mode tracking
    editingGroupId: string | null = null;
    editingSlotKeys = new Set<string>();

    /** Precomputed available teams per group slot key 'groupId:slotIndex' */
    slotOptions: { [key: string]: string[] } = {};
    /** Precomputed available teams per knockout match slot key 'phaseId:ri:mi:home|away' */
    matchSlotOptions: { [key: string]: string[] } = {};

    // Teams registered to this tournament
    registeredTeams: TournamentTeam[] = [];
    teamNames: string[] = []; // dropdown list

    // ─── Custom Builder config ───────────────────────────────────────────────
    customGroup_numTeams: number = 4;
    customGroup_encounters: number = 1;
    customKnockout_numTeams: number = 8;
    customKnockout_roundNames: string[] = ['MATCH_DETAILS.ROUNDS.QUARTER_FINAL', 'MATCH_DETAILS.ROUNDS.SEMI_FINAL', 'MATCH_DETAILS.ROUNDS.FINAL'];

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
        this.calculateDefaults();
        this.initializeFromData();
        this.loadTeams();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['maxTeams'] && !changes['data']?.isFirstChange()) {
            this.calculateDefaults();
        }
        if (changes['data']) {
            this.calculateDefaults();
            this.initializeFromData();
            // Also load teams if tournamentId is already available but teams haven't loaded yet
            if (this.tournamentId && this.teamNames.length <= 1) {
                this.loadTeams();
            }
        }
        if (changes['tournamentId'] && this.tournamentId) {
            this.loadTeams();
        }
    }

    private calculateDefaults() {
        if (!this.maxTeams) this.maxTeams = 16;
        
        let groups = 4;
        let teamsPerG = 4;

        if (this.maxTeams <= 4) {
            groups = 1;
            teamsPerG = this.maxTeams;
        } else if (this.maxTeams <= 8) {
            groups = 2;
            teamsPerG = Math.floor(this.maxTeams / 2);
        } else if (this.maxTeams <= 12) {
            groups = 4;
            teamsPerG = 3;
        } else if (this.maxTeams <= 24) {
            groups = 4;
            teamsPerG = Math.floor(this.maxTeams / 4);
        } else if (this.maxTeams <= 32) {
            groups = 8;
            teamsPerG = Math.floor(this.maxTeams / 8);
        } else {
            groups = 8;
            teamsPerG = Math.floor(this.maxTeams / 8);
        }

        this.groupOnly_numGroups = groups;
        this.groupOnly_teamsPerGroup = teamsPerG;
        
        this.gk_numGroups = groups;
        this.gk_teamsPerGroup = teamsPerG;
        // Default advancing: top 2 if possible, else 1
        this.gk_advancingTeams = teamsPerG > 2 ? 2 : 1; 

        // Knockout must be a power of 2
        let koTeams = 2;
        while (koTeams * 2 <= this.maxTeams) {
            koTeams *= 2;
        }
        if (this.maxTeams === 4) koTeams = 4;
        this.knockout_totalTeams = koTeams;

        // Custom defaults
        this.customGroup_numTeams = this.groupOnly_numGroups * this.groupOnly_teamsPerGroup;
        this.customKnockout_numTeams = koTeams;
    }

    private loadTeams() {
        if (!this.tournamentId) {
            // tournamentId may arrive late - retry once it comes via ngOnChanges
            return;
        }
        this.http.get<{ success: boolean; data: TournamentTeam[] }>(
            `${environment.apiUrl}/api/tournaments/${this.tournamentId}/teams`
        ).subscribe({
            next: (res) => {
                // Only show approved teams in the dropdown
                const approved = (res.data || []).filter(t => t.status === 'approved');
                this.registeredTeams = approved;
                this.teamNames = ['EMPTY SLOT', ...approved.map(r => r.team.name)];
                this.recomputeSlotOptions();
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Failed to load teams for format board:', err)
        });
    }

    private initializeFromData() {
        if (!this.data) return;

        let incomingData = this.data.format_data || (this.data as any).format?.format_data;
        
        if (typeof incomingData === 'string') {
            try {
                incomingData = JSON.parse(incomingData);
            } catch (e) {
                // Ignore parse error
            }
        }

        // Handle the case where format_data is { phases: [...] }
        if (incomingData && !Array.isArray(incomingData) && incomingData.phases && Array.isArray(incomingData.phases)) {
            incomingData = incomingData.phases;
        }

        if (incomingData && Array.isArray(incomingData) && incomingData.length > 0) {
            this.boardPhases = incomingData;
            this.showBoard = true;
            this.selectedFormat = this.data.type || this.data.format?.type || 'group';
            this.cdr.detectChanges();
        } else {
            // Also ensure selectedFormat is set even if board isn't shown
            this.selectedFormat = this.data.type || this.data.format?.type || null;
            
            if (this.selectedFormat && this.selectedFormat !== 'custom') {
                // If the format is already chosen, show the figures (board).
                // Auto-generate default structure based on selected format since `format_data` is missing
                if (this.selectedFormat === 'group') {
                    this.boardPhases = [{
                        id: 'phase-group', name: 'TOURNAMENT_DASHBOARD.FORMAT.MODAL_GENERIC_GROUPS_TITLE', kind: 'group',
                        groups: this.buildGroups(this.groupOnly_numGroups || 4, this.groupOnly_teamsPerGroup || 4)
                    }];
                } else if (this.selectedFormat === 'group_knockout') {
                    this.boardPhases = [
                        {
                            id: 'phase-group', name: 'TOURNAMENT_DASHBOARD.FORMAT.MODAL_GENERIC_GROUPS_TITLE', kind: 'group',
                            groups: this.buildGroups(this.gk_numGroups || 4, this.gk_teamsPerGroup || 4)
                        },
                        {
                            id: 'phase-knockout', name: 'TOURNAMENT_DASHBOARD.FORMAT.MODAL_GENERIC_KO_TITLE', kind: 'knockout',
                            rounds: this.buildKnockoutRounds((this.gk_numGroups || 4) * (this.gk_advancingTeams || 2) || 8)
                        }
                    ];
                } else if (this.selectedFormat === 'knockout') {
                    this.boardPhases = [{
                        id: 'phase-knockout', name: 'TOURNAMENT_DASHBOARD.FORMAT.MODAL_GENERIC_KO_TITLE', kind: 'knockout',
                        rounds: this.buildKnockoutRounds(this.knockout_totalTeams || 16)
                    }];
                }
                this.showBoard = true;
                this.emitChange();
            } else {
                this.showBoard = false;
            }
            this.cdr.detectChanges();
        }
    }

    private emitChange() {
        this.data.format_data = this.boardPhases;
        this.formatChange.emit(this.data);
        this.recomputeSlotOptions();
        this.cdr.detectChanges();
    }

    /** Rebuild available-teams map for every slot across all group phases AND knockout phases */
    private recomputeSlotOptions() {
        // ── Group phase slots ────────────────────────────────────────────────
        const slotOpts: { [key: string]: string[] } = {};
        const usedInGroups: { key: string; team: string }[] = [];

        for (const phase of this.boardPhases) {
            if (phase.kind === 'group') {
                for (const group of phase.groups || []) {
                    for (let si = 0; si < group.slots.length; si++) {
                        if (group.slots[si].label !== 'EMPTY SLOT') {
                            usedInGroups.push({ key: `${group.id}:${si}`, team: group.slots[si].label });
                        }
                    }
                }
            }
        }
        const allUsedGroupTeams = new Set(usedInGroups.map(u => u.team));

        for (const phase of this.boardPhases) {
            if (phase.kind !== 'group') continue;
            for (const group of phase.groups || []) {
                for (let si = 0; si < group.slots.length; si++) {
                    const currentKey = `${group.id}:${si}`;
                    const usedElsewhere = new Set(
                        [...allUsedGroupTeams].filter(t =>
                            !usedInGroups.some(u => u.key === currentKey && u.team === t)
                        )
                    );
                    slotOpts[currentKey] =
                        this.teamNames.filter(t => t === 'EMPTY SLOT' || !usedElsewhere.has(t));
                }
            }
        }
        this.slotOptions = slotOpts;

        // ── Knockout phase placeholder match slots ───────────────────────────
        const matchOpts: { [key: string]: string[] } = {};
        for (const phase of this.boardPhases) {
            if (phase.kind !== 'knockout') continue;
            // Collect all assigned teams in the first (placeholder) round of this phase
            const usedInPhase: { key: string; team: string }[] = [];
            const rounds = phase.rounds || [];
            for (let ri = 0; ri < rounds.length; ri++) {
                const round = rounds[ri];
                for (let mi = 0; mi < (round.matches || []).length; mi++) {
                    const match = round.matches[mi];
                    if (!match.isPlaceholder) continue;
                    if (match.home && match.home !== 'EMPTY SLOT') {
                        usedInPhase.push({ key: `${phase.id}:${ri}:${mi}:home`, team: match.home });
                    }
                    if (match.away && match.away !== 'EMPTY SLOT') {
                        usedInPhase.push({ key: `${phase.id}:${ri}:${mi}:away`, team: match.away });
                    }
                }
            }
            const allUsedTeams = new Set(usedInPhase.map(u => u.team));
            for (let ri = 0; ri < rounds.length; ri++) {
                const round = rounds[ri];
                for (let mi = 0; mi < (round.matches || []).length; mi++) {
                    const match = round.matches[mi];
                    if (!match.isPlaceholder) continue;
                    const homeKey = `${phase.id}:${ri}:${mi}:home`;
                    const awayKey = `${phase.id}:${ri}:${mi}:away`;
                    // Home slot: exclude teams used ELSEWHERE (not this home slot itself)
                    const usedExceptHome = new Set(
                        [...allUsedTeams].filter(t =>
                            // Remove only if used in another slot (not this one)
                            !usedInPhase.some(u => u.key === homeKey && u.team === t)
                        )
                    );
                    matchOpts[homeKey] = this.teamNames.filter(
                        t => t === 'EMPTY SLOT' || !usedExceptHome.has(t)
                    );
                    const usedExceptAway = new Set(
                        [...allUsedTeams].filter(t =>
                            !usedInPhase.some(u => u.key === awayKey && u.team === t)
                        )
                    );
                    matchOpts[awayKey] = this.teamNames.filter(
                        t => t === 'EMPTY SLOT' || !usedExceptAway.has(t)
                    );
                }
            }
        }
        this.matchSlotOptions = matchOpts;
    }

    selectFormat(format: 'group' | 'group_knockout' | 'knockout') {
        this.activeModal = format;
    }

    resetFormat() {
        this.showBoard = false;
        this.selectedFormat = null;
        this.data.type = null;
        this.boardPhases = [];
        this.customStages = [];
        this.emitChange();
        this.formatChange.emit(this.data);
    }

    closeModal() { this.activeModal = null; }

    // ── Helpers ───────────────────────────────────────────────────────────────
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
            2: 'MATCH_DETAILS.ROUNDS.FINAL', 4: 'MATCH_DETAILS.ROUNDS.SEMI_FINAL', 8: 'MATCH_DETAILS.ROUNDS.QUARTER_FINAL',
            16: 'MATCH_DETAILS.ROUNDS.R16', 32: 'MATCH_DETAILS.ROUNDS.R32', 64: 'MATCH_DETAILS.ROUNDS.R64'
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

    // ─── Apply formats ───────────────────────────────────────────────────────
    get groupOnly_advancingOptions(): number[] {
        const max = this.groupOnly_teamsPerGroup > 1 ? this.groupOnly_teamsPerGroup - 1 : 1;
        return Array.from({ length: max }, (_, i) => i + 1);
    }

    applyGroupOnly() {
        if (this.groupOnly_numGroups >= 1 && this.groupOnly_teamsPerGroup >= 2) {
            this.selectedFormat = 'group';
            this.data.type = 'group';
            this.customStages = [];
            this.activeModal = null;
            this.boardPhases = [{
                id: 'phase-group', name: 'TOURNAMENT_DASHBOARD.FORMAT.MODAL_GENERIC_GROUPS_TITLE', kind: 'group',
                groups: this.buildGroups(this.groupOnly_numGroups, this.groupOnly_teamsPerGroup)
            }];
            this.showBoard = true;
            this.emitChange();
        }
    }

    get gk_advancingOptions(): number[] {
        const max = this.gk_teamsPerGroup > 1 ? this.gk_teamsPerGroup - 1 : 1;
        return Array.from({ length: max }, (_, i) => i + 1);
    }

    applyGroupKnockout() {
        if (this.gk_numGroups >= 1 && this.gk_teamsPerGroup >= 2) {
            this.selectedFormat = 'group_knockout';
            this.data.type = 'group_knockout';
            this.customStages = [];
            this.activeModal = null;
            const totalKnockoutTeams = this.gk_numGroups * this.gk_advancingTeams;
            this.boardPhases = [
                {
                    id: 'phase-group', name: 'Group phase', kind: 'group',
                    groups: this.buildGroups(this.gk_numGroups, this.gk_teamsPerGroup)
                },
                {
                    id: 'phase-knockout', name: 'TOURNAMENT_DASHBOARD.FORMAT.MODAL_GENERIC_KO_TITLE', kind: 'knockout',
                    rounds: this.buildKnockoutRounds(totalKnockoutTeams)
                }
            ];
            this.showBoard = true;
            this.emitChange();
        }
    }

    get knockout_roundNames(): string[] {
        if (this.knockout_totalTeams < 2) return [];
        const rounds: string[] = [];
        let teams = this.knockout_totalTeams;
        const names: Record<number, string> = {
            2: 'MATCH_DETAILS.ROUNDS.FINAL', 4: 'MATCH_DETAILS.ROUNDS.SEMI_FINAL', 8: 'MATCH_DETAILS.ROUNDS.QUARTER_FINAL',
            16: 'MATCH_DETAILS.ROUNDS.R16', 32: 'MATCH_DETAILS.ROUNDS.R32', 64: 'MATCH_DETAILS.ROUNDS.R64'
        };
        while (teams >= 2) { rounds.push(names[teams] ?? `Round of ${teams}`); teams = Math.floor(teams / 2); }
        return rounds;
    }

    applyKnockoutOnly() {
        if (this.knockout_totalTeams >= 2) {
            this.selectedFormat = 'knockout';
            this.data.type = 'knockout';
            this.customStages = [];
            this.activeModal = null;
            this.boardPhases = [{
                id: 'phase-knockout', name: 'TOURNAMENT_DASHBOARD.FORMAT.MODAL_GENERIC_KO_TITLE', kind: 'knockout',
                rounds: this.buildKnockoutRounds(this.knockout_totalTeams)
            }];
            this.showBoard = true;
            this.emitChange();
        }
    }

    matchesInRound(teams: number, roundIndex: number): number {
        return Math.round(teams / Math.pow(2, roundIndex + 1));
    }

    // ─── Edit-mode helpers ───────────────────────────────────────────────────
    toggleGroupEdit(group: BoardGroup) {
        this.editingGroupId = this.editingGroupId === group.id ? null : group.id;
    }

    isSlotEditing(group: BoardGroup, slotIdx: number): boolean {
        return this.editingSlotKeys.has(`${group.id}:${slotIdx}`);
    }

    toggleSlotEdit(group: BoardGroup, slotIdx: number) {
        const key = `${group.id}:${slotIdx}`;
        if (this.editingSlotKeys.has(key)) {
            this.editingSlotKeys.delete(key);
        } else {
            this.editingSlotKeys.add(key);
        }
    }

    // ─── Group editing ───────────────────────────────────────────────────────
    onGroupNameChange(group: BoardGroup) {
        this.emitChange();
    }

    onSlotLabelChange(slot: BoardTeamSlot, group?: BoardGroup, si?: number) {
        this.emitChange();
        if (group && si !== undefined) {
            this.editingSlotKeys.delete(`${group.id}:${si}`);
        }
    }

    addSlotToGroup(group: BoardGroup) {
        if (!group.slots) group.slots = [];
        group.slots.push({ label: 'EMPTY SLOT' });
        this.emitChange();
    }

    removeSlotFromGroup(group: BoardGroup, idx: number) {
        group.slots.splice(idx, 1);
        this.emitChange();
    }

    addGroupToPhase(phase: BoardPhase) {
        if (!phase.groups) phase.groups = [];
        const idx = phase.groups.length;
        phase.groups.push({
            id: `g${Date.now()}`, name: `Group ${this.groupLetter(idx)}`,
            slots: this.buildSlots(this.groupOnly_teamsPerGroup || this.gk_teamsPerGroup || 4)
        });
        this.emitChange();
    }

    removeGroupFromPhase(phase: BoardPhase, idx: number) {
        if (!phase.groups) return;
        phase.groups.splice(idx, 1);
        this.emitChange();
    }

    // ─── Knockout editing ────────────────────────────────────────────────────
    onMatchSlotChange(match: BoardMatch) {
        this.emitChange();
    }

    addMatchToRound(round: BoardRound) {
        const nextNum = round.matches.length + 1;
        round.matches.push({
            id: `m${nextNum}`,
            home: 'EMPTY SLOT',
            away: 'EMPTY SLOT',
            isPlaceholder: true
        });
        this.emitChange();
    }

    removeMatchFromRound(round: BoardRound, idx: number) {
        round.matches.splice(idx, 1);
        this.emitChange();
    }

    // ─── Phase actions ────────────────────────────────────────────────────────
    editPhase(phase: BoardPhase) {
        if (phase.kind === 'group') {
            this.activeModal = this.selectedFormat === 'group_knockout' ? 'group_knockout' : 'group';
        } else {
            this.activeModal = 'knockout';
        }
    }

    addKnockoutPhase() {
        const idx = this.boardPhases.length;
        this.boardPhases.push({
            id: `phase-knockout-${idx}`,
            name: 'TOURNAMENT_DASHBOARD.FORMAT.MODAL_GENERIC_KO_TITLE',
            kind: 'knockout',
            rounds: this.buildKnockoutRounds(this.gk_numGroups * this.gk_advancingTeams || 8)
        });
        this.emitChange();
    }

    addSingleMatchPhase() {
        const idx = this.boardPhases.length;
        this.boardPhases.push({
            id: `phase-match-${idx}`,
            name: 'Final',
            kind: 'knockout',
            rounds: [{
                name: 'Final',
                matches: [{
                    id: `m${Date.now()}`,
                    home: 'EMPTY SLOT',
                    away: 'EMPTY SLOT',
                    isPlaceholder: true
                }]
            }]
        });
        this.emitChange();
    }

    addPhase() {
        const idx = this.boardPhases.length;
        this.boardPhases.push({
            id: `phase-extra-${idx}`, name: `Extra Phase ${idx + 1}`, kind: 'group',
            groups: [{ id: `g${Date.now()}`, name: 'Group A', slots: this.buildSlots(4) }]
        });
        this.emitChange();
    }

    removePhase(idx: number) {
        this.boardPhases.splice(idx, 1);
        if (idx < this.customStages.length) {
            this.customStages.splice(idx, 1);
        }

        if (this.boardPhases.length === 0) {
            this.showBoard = false;
        }
        if (this.customStages.length === 0) {
            this.selectedFormat = null;
        }
        this.emitChange();
        this.formatChange.emit(this.data);
    }

    // ─── Custom Builder ──────────────────────────────────────────────────────
    get customKnockout_roundNamesArray(): string[] {
        if (this.customKnockout_numTeams < 2) return [];
        const rounds: string[] = [];
        let teams = this.customKnockout_numTeams;
        const names: Record<number, string> = {
            2: 'MATCH_DETAILS.ROUNDS.FINAL', 4: 'MATCH_DETAILS.ROUNDS.SEMI_FINAL', 8: 'MATCH_DETAILS.ROUNDS.QUARTER_FINAL',
            16: 'MATCH_DETAILS.ROUNDS.R16', 32: 'MATCH_DETAILS.ROUNDS.R32', 64: 'MATCH_DETAILS.ROUNDS.R64'
        };
        while (teams >= 2) { rounds.push(names[teams] ?? `Round of ${teams}`); teams = Math.floor(teams / 2); }
        return rounds;
    }

    addStage(type: 'Group' | 'Knockout' | 'Match') {
        if (this.selectedFormat !== 'custom') {
            this.boardPhases = [];
            this.customStages = [];
        }

        this.selectedFormat = 'custom';
        this.data.type = 'custom';

        if (type === 'Group') {
            this.activeModal = 'custom_group' as any;
            return;
        }

        if (type === 'Knockout') {
            this.activeModal = 'custom_knockout' as any;
            return;
        }

        // Single Match: Add instantly
        const newStage: TournamentStage = {
            id: Math.random().toString(36).substring(2, 9),
            name: `Match Stage ${this.customStages.length + 1}`,
            type
        };
        this.customStages.push(newStage);

        const idx = this.boardPhases.length;
        this.boardPhases.push({
            id: `phase-match-${idx}`,
            name: `Single Match ${idx + 1}`,
            kind: 'knockout',
            rounds: [{
                name: 'Final',
                matches: [{
                    id: `m${Date.now()}`,
                    home: 'EMPTY SLOT',
                    away: 'EMPTY SLOT',
                    isPlaceholder: true
                }]
            }]
        });

        this.showBoard = true;
        this.emitChange();
        this.formatChange.emit(this.data);
    }

    applyCustomGroup() {
        const newStage: TournamentStage = {
            id: Math.random().toString(36).substring(2, 9),
            name: `Group Stage ${this.customStages.length + 1}`,
            type: 'Group'
        };
        this.customStages.push(newStage);

        const idx = this.boardPhases.length;
        const groupCount = Math.max(1, Math.ceil(this.customGroup_numTeams / 4)); // Default to 4 teams per group approx

        // Let's create a single large group for "custom group" if encounters are specified, or distribute.
        // For simplicity and to match the standard behavior, we'll create one group containing all teams
        // with the specified encounters stored (can be handled backend).
        this.boardPhases.push({
            id: `phase-group-${idx}`,
            name: `Group Stage ${idx + 1} (${this.customGroup_numTeams} Teams, ${this.customGroup_encounters} Encounters)`,
            kind: 'group',
            groups: [{
                id: `g${Date.now()}`,
                name: 'Group 1',
                slots: this.buildSlots(this.customGroup_numTeams)
            }]
        });

        this.activeModal = null;
        this.showBoard = true;
        this.emitChange();
        this.formatChange.emit(this.data);
    }

    applyCustomKnockout() {
        const newStage: TournamentStage = {
            id: Math.random().toString(36).substring(2, 9),
            name: `Knockout Stage ${this.customStages.length + 1}`,
            type: 'Knockout'
        };
        this.customStages.push(newStage);

        const idx = this.boardPhases.length;
        this.boardPhases.push({
            id: `phase-knockout-${idx}`,
            name: `Knockout Stage ${idx + 1}`,
            kind: 'knockout',
            rounds: this.buildKnockoutRounds(this.customKnockout_numTeams)
        });

        this.activeModal = null;
        this.showBoard = true;
        this.emitChange();
        this.formatChange.emit(this.data);
    }

    removeStage(index: number) {
        this.customStages.splice(index, 1);
        if (index < this.boardPhases.length) {
            this.boardPhases.splice(index, 1);
        }

        if (this.customStages.length === 0) {
            this.selectedFormat = null;
            if (this.boardPhases.length === 0) {
                this.showBoard = false;
            }
        }

        this.emitChange();
        this.formatChange.emit(this.data);
    }
}
