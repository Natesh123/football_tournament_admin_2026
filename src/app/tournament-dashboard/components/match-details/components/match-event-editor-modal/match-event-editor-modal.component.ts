import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamMemberService, TeamMember } from '../../../../../teams/team-member.service';

@Component({
    selector: 'app-match-event-editor-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './match-event-editor-modal.component.html'
})
export class MatchEventEditorModalComponent implements OnInit, OnChanges {
    private teamMemberService = inject(TeamMemberService);

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
            this.formData = { ...this.eventData };
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
            alert('Please fill in required fields: Player Name and Minute.');
            return;
        }
        this.isSubmitting = true;

        // If it's a goal and there's an assist, append it to details
        if (this.formData.type === 'goal' && this.formData.assistPlayerName) {
            const assistPrefix = 'Assist: ';
            // Remove existing assist from details if we're editing
            let cleanDetails = (this.formData.details || '').split(' (Assist:')[0].trim();
            this.formData.details = cleanDetails ? `${cleanDetails} (Assist: ${this.formData.assistPlayerName})` : `Assist: ${this.formData.assistPlayerName}`;
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
