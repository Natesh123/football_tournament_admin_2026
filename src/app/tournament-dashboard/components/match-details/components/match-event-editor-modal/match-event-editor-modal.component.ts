import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TeamMemberService, TeamMember } from '../../../../../teams/team-member.service';
import { UiService } from '../../../../../services/ui.service';

@Component({
    selector: 'app-match-event-editor-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: './match-event-editor-modal.component.html'
})
export class MatchEventEditorModalComponent implements OnInit, OnChanges {
    private teamMemberService = inject(TeamMemberService);
    public ui = inject(UiService);

    @Input() isOpen = false;
    @Input() match: any;
    @Input() eventData: any = null; // If passed, it's edit mode

    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<any>();

    formData: any = {
        type: 'goal',
        minute: '',
        team: 'home', // 'home' or 'away'
        playerName: '',
        details: '',
        assistPlayerName: '' // Added for goal assists
    };

    homePlayers: TeamMember[] = [];
    awayPlayers: TeamMember[] = [];
    isSubmitting = false;

    ngOnInit() {
        this.fetchTeamMembers();
    }

    ngOnChanges(changes: SimpleChanges) {
        // When the modal is opened (isOpen becomes true)
        if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
            this.resetForm();
        }
    }

    private resetForm() {
        this.isSubmitting = false;
        if (this.eventData) {
            this.formData = { 
                ...this.eventData,
                team: this.eventData.teamSide || (typeof this.eventData.team === 'string' ? this.eventData.team : 'home')
            };
        } else {
            this.formData = {
                type: 'goal',
                minute: '',
                team: 'home',
                playerName: '',
                details: '',
                assistPlayerName: ''
            };
            
            // Auto-calculate minute if match is live
            if (this.match?.status === 'live') {
                this.formData.minute = this.calculateLiveMinute();
            }
        }
    }

    private calculateLiveMinute(): number {
        if (!this.match?.periodStartedAt) return 1;
        const start = new Date(this.match.periodStartedAt).getTime();
        const now = new Date().getTime();
        const diffMs = now - start;
        const diffMins = Math.floor(diffMs / 60000);
        
        // Base minute (e.g. 45 for second half) plus elapsed time in current period
        const currentMinute = (this.match.live_minute || 0) + diffMins + 1;
        
        // Cap it at a reasonable max or let it reflect stoppage time (e.g. 90+)
        return currentMinute;
    }

    private fetchTeamMembers() {
        const homeTeamId = this.match?.homeTeam?.id;
        const awayTeamId = this.match?.awayTeam?.id;

        if (homeTeamId) {
            this.teamMemberService.getByTeamId(homeTeamId).subscribe({
                next: (players) => this.homePlayers = players.sort((a, b) => a.name.localeCompare(b.name)),
                error: (err) => console.error('Failed to fetch home players', err)
            });
        }
        if (awayTeamId) {
            this.teamMemberService.getByTeamId(awayTeamId).subscribe({
                next: (players) => this.awayPlayers = players.sort((a, b) => a.name.localeCompare(b.name)),
                error: (err) => console.error('Failed to fetch away players', err)
            });
        }
    }

    get currentTeamPlayers(): TeamMember[] {
        return this.formData.team === 'home' ? this.homePlayers : this.awayPlayers;
    }

    get homeLineupData() {
        if (!this.match?.homeLineup) return null;
        try {
            return typeof this.match.homeLineup === 'string' ? JSON.parse(this.match.homeLineup) : this.match.homeLineup;
        } catch (e) { return null; }
    }

    get awayLineupData() {
        if (!this.match?.awayLineup) return null;
        try {
            return typeof this.match.awayLineup === 'string' ? JSON.parse(this.match.awayLineup) : this.match.awayLineup;
        } catch (e) { return null; }
    }

    get currentTeamStartingPlayers(): TeamMember[] {
        const lineup = this.formData.team === 'home' ? this.homeLineupData : this.awayLineupData;
        const players = this.currentTeamPlayers;
        if (lineup && lineup.starting && Array.isArray(lineup.starting)) {
            const names = lineup.starting.map((obj: any) => {
                if (typeof obj === 'string' || typeof obj === 'number') {
                    const foundP = players.find(p => p.id?.toString() === obj.toString());
                    return foundP ? foundP.name : obj.toString();
                }
                return obj?.name;
            });
            const filtered = players.filter(p => names.includes(p.name));
            // Ensure currently selected player is included even if state changed (e.g. they were since subbed out)
            if (this.formData.playerName && !filtered.find(p => p.name === this.formData.playerName)) {
                const selectedP = players.find(p => p.name === this.formData.playerName);
                if (selectedP) filtered.push(selectedP);
            }
            return filtered;
        }
        return players;
    }

    get currentTeamSubPlayers(): TeamMember[] {
        const lineup = this.formData.team === 'home' ? this.homeLineupData : this.awayLineupData;
        const players = this.currentTeamPlayers;
        if (lineup && lineup.subs && Array.isArray(lineup.subs)) {
            const names = lineup.subs.map((obj: any) => {
                if (typeof obj === 'string' || typeof obj === 'number') {
                    const foundP = players.find(p => p.id?.toString() === obj.toString());
                    return foundP ? foundP.name : obj.toString();
                }
                return obj?.name;
            });
            const filtered = players.filter(p => names.includes(p.name));
            // Ensure currently selected assist player (incoming sub) is included 
            if (this.formData.assistPlayerName && !filtered.find(p => p.name === this.formData.assistPlayerName)) {
                const selectedP = players.find(p => p.name === this.formData.assistPlayerName);
                if (selectedP) filtered.push(selectedP);
            }
            return filtered;
        }
        return players;
    }

    onTeamSwitch(team: 'home' | 'away') {
        this.formData.team = team;
        this.formData.playerName = '';
        this.formData.assistPlayerName = '';
    }

    onClose() {
        this.close.emit();
    }

    onSubmit() {
        if (!this.formData.playerName || !this.formData.minute) {
            this.ui.showToast('Please fill in required fields: Player Name and Minute.', 'error');
            return;
        }
        if (this.formData.type === 'substitution' && !this.formData.assistPlayerName) {
            this.ui.showToast('Please select a substitute player to come in.', 'error');
            return;
        }
        this.isSubmitting = true;

        // If it's a goal and there's an assist, append it to details
        if (this.formData.type === 'goal' && this.formData.assistPlayerName) {
            const assistPrefix = 'Assist: ';
            // Remove existing assist from details if we're editing
            let cleanDetails = (this.formData.details || '').split(' (Assist:')[0].trim();
            this.formData.details = cleanDetails ? `${cleanDetails} (Assist: ${this.formData.assistPlayerName})` : `Assist: ${this.formData.assistPlayerName}`;
        } else if (this.formData.type === 'substitution' && this.formData.assistPlayerName) {
            // Include assistPlayerName in the payload directly
            this.formData.details = `Sub: ${this.formData.playerName} out, ${this.formData.assistPlayerName} in`;
        }

        // The teamId is important so backend knows exactly which team.
        if (this.formData.team === 'home') {
            this.formData.teamId = this.match?.homeTeam?.id?.toString();
        } else {
            this.formData.teamId = this.match?.awayTeam?.id?.toString();
        }

        this.save.emit(this.formData);
    }
}
