import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamMemberService, TeamMember } from '../../../../../teams/team-member.service';

@Component({
    selector: 'app-lineup-editor',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './lineup-editor.component.html'
})
export class LineupEditorComponent implements OnInit {
    private teamMemberService = inject(TeamMemberService);

    @Input() match: any;
    @Input() lineups: any;
    @Input() isOpen = false;

    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<any>();

    activeTeam: 'home' | 'away' = 'home';

    homeData: any = { formation: '4-3-3', coach: '', starting: [], subs: [] };
    awayData: any = { formation: '4-3-3', coach: '', starting: [], subs: [] };

    homePlayers: TeamMember[] = [];
    awayPlayers: TeamMember[] = [];

    // Multi-select Picker State
    showPlayerPicker = false;
    pickerType: 'starting' | 'subs' = 'starting';
    selectedInPicker: Set<string> = new Set(); // Stores player names

    get playersOnField(): number {
        return (this.match as any)?.tournament?.rules?.playersOnField || 11;
    }

    get squadSize(): number {
        return (this.match as any)?.tournament?.squadSize || 18;
    }

    get subsLimit(): number {
        return Math.max(0, this.squadSize - this.playersOnField);
    }

    get currentStartingCount(): number {
        return this.currentData.starting.length;
    }

    get currentSubsCount(): number {
        return this.currentData.subs.length;
    }

    get canAddMoreStarting(): boolean {
        return this.currentStartingCount < this.playersOnField;
    }

    get canAddMoreSubs(): boolean {
        return this.currentSubsCount < this.subsLimit;
    }

    ngOnInit() {
        this.initializeData();
    }

    ngOnChanges() {
        if (this.isOpen) {
            this.initializeData();
            this.fetchTeamMembers();
        }
    }

    private initializeData() {
        if (this.lineups?.homeLineup) {
            this.homeData = JSON.parse(JSON.stringify(this.lineups.homeLineup));
        } else {
            this.homeData = { formation: '4-3-3', coach: '', starting: [], subs: [] };
        }

        if (this.lineups?.awayLineup) {
            this.awayData = JSON.parse(JSON.stringify(this.lineups.awayLineup));
        } else {
            this.awayData = { formation: '4-3-3', coach: '', starting: [], subs: [] };
        }
    }

    private fetchTeamMembers() {
        const homeTeamId = (this.match as any)?.homeTeam?.id;
        const awayTeamId = (this.match as any)?.awayTeam?.id;

        if (homeTeamId) {
            this.teamMemberService.getByTeamId(homeTeamId).subscribe({
                next: (players: TeamMember[]) => {
                    this.homePlayers = players;
                    // Sort players by name or number
                    this.homePlayers.sort((a, b) => a.name.localeCompare(b.name));
                },
                error: (err: any) => console.error('Failed to fetch home players', err)
            });
        }
        if (awayTeamId) {
            this.teamMemberService.getByTeamId(awayTeamId).subscribe({
                next: (players: TeamMember[]) => {
                    this.awayPlayers = players;
                    this.awayPlayers.sort((a, b) => a.name.localeCompare(b.name));
                },
                error: (err: any) => console.error('Failed to fetch away players', err)
            });
        }
    }

    // Picker Logic
    openPicker(type: 'starting' | 'subs') {
        this.pickerType = type;
        this.selectedInPicker.clear();
        this.showPlayerPicker = true;
    }

    closePicker() {
        this.showPlayerPicker = false;
    }

    isPlayerSelected(playerName: string): boolean {
        // Already in the current starting or subs list?
        const inStarting = this.currentData.starting.some((p: any) => p.name === playerName);
        const inSubs = this.currentData.subs.some((p: any) => p.name === playerName);
        return inStarting || inSubs;
    }

    toggleInPicker(playerName: string) {
        if (this.selectedInPicker.has(playerName)) {
            this.selectedInPicker.delete(playerName);
        } else {
            if (this.isPlayerSelected(playerName)) return;
            // Check limit
            const currentCount = this.pickerType === 'starting' ? this.currentStartingCount : this.currentSubsCount;
            const limit = this.pickerType === 'starting' ? this.playersOnField : this.subsLimit;
            const projectedCount = currentCount + this.selectedInPicker.size + 1;
            
            if (projectedCount > limit) {
                // Prevent adding beyond limit
                return;
            }
            this.selectedInPicker.add(playerName);
        }
    }

    addSelectedPlayers() {
        this.selectedInPicker.forEach(name => {
            const player = this.currentTeamPlayers.find(p => p.name === name);
            if (player) {
                const pos = (player.position || '').toUpperCase();
                this.currentData[this.pickerType].push({
                    number: player.jerseyNumber || '',
                    name: player.name,
                    position: ['GK', 'DF', 'MF', 'FW'].includes(pos) ? pos : 'OUTFIELD',
                    isCaptain: false
                });
            }
        });
        this.closePicker();
    }

    getAvailablePlayers(type: 'starting' | 'subs', currentIndex: number): TeamMember[] {
        const allSelectedNames = [
            ...this.currentData.starting.map((p: any) => p.name),
            ...this.currentData.subs.map((p: any) => p.name)
        ];
        
        const currentName = this.currentData[type][currentIndex].name;
        
        return this.currentTeamPlayers.filter(p => {
            // Include the player if it's the one currently in this row
            if (p.name === currentName) return true;
            // Otherwise, exclude if already selected elsewhere
            return !allSelectedNames.includes(p.name);
        });
    }

    // Helpers to get active team data
    get currentData() {
        return this.activeTeam === 'home' ? this.homeData : this.awayData;
    }

    get currentTeamPlayers() {
        return this.activeTeam === 'home' ? this.homePlayers : this.awayPlayers;
    }

    addPlayer(type: 'starting' | 'subs') {
        if (type === 'starting' && !this.canAddMoreStarting) return;
        if (type === 'subs' && !this.canAddMoreSubs) return;
        
        this.currentData[type].push({ number: '', name: '', position: 'OUTFIELD', isCaptain: false });
    }

    removePlayer(type: 'starting' | 'subs', index: number) {
        this.currentData[type].splice(index, 1);
    }

    onPlayerSelect(playerName: string, type: 'starting' | 'subs', index: number) {
        const player = this.currentTeamPlayers.find(p => p.name === playerName);
        if (player) {
            this.currentData[type][index].number = player.jerseyNumber || '';
            const pos = (player.position || '').toUpperCase();
            if (['GK', 'DF', 'MF', 'FW'].includes(pos)) {
                this.currentData[type][index].position = pos;
            } else {
                this.currentData[type][index].position = 'OUTFIELD';
            }
        }
    }

    onSave() {
        if (this.homeData.starting.length !== this.playersOnField) {
            alert(`Home Team Starting XI must have exactly ${this.playersOnField} players.`);
            return;
        }
        if (this.awayData.starting.length !== this.playersOnField) {
            alert(`Away Team Starting XI must have exactly ${this.playersOnField} players.`);
            return;
        }
        
        const homeSubsLimit = (this.match as any)?.tournament?.squadSize - this.playersOnField || 0;
        const awaySubsLimit = (this.match as any)?.tournament?.squadSize - this.playersOnField || 0;
        
        if (this.homeData.subs.length > homeSubsLimit || this.awayData.subs.length > awaySubsLimit) {
            alert(`Substitutes cannot exceed ${homeSubsLimit} players.`);
            return;
        }

        this.save.emit({
            homeLineup: this.homeData,
            awayLineup: this.awayData
        });
    }
}
