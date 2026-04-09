import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService, TournamentDTO } from '../tournament/tournament.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { TournamentGeneralComponent } from './components/tournament-general/tournament-general.component';
import { TournamentParticipantsComponent } from './components/tournament-participants/tournament-participants.component';
import { TournamentFormatComponent } from './components/tournament-format/tournament-format.component';
import { TournamentScheduleComponent } from './components/tournament-schedule/tournament-schedule.component';
import { TournamentRulesComponent } from './components/tournament-rules/tournament-rules.component';
import { TournamentVenuesComponent } from './components/tournament-venues/tournament-venues.component';
import { TournamentFinanceComponent } from './components/tournament-finance/tournament-finance.component';
import { TournamentPresentationComponent } from './components/tournament-presentation/tournament-presentation.component';
import { TournamentResultsComponent } from './components/tournament-results/tournament-results.component';
import { TournamentTeamsComponent } from './components/tournament-teams/tournament-teams.component';
import { TournamentMatchesComponent } from './components/tournament-matches/tournament-matches.component';
import { TournamentSponsorsComponent } from './components/tournament-sponsors/tournament-sponsors.component';
import { LoaderComponent } from '../components/loader/loader.component';

import { UiService } from '../services/ui.service';

export interface TournamentSettings {
    general: {
        name: string;
        shortName: string;
        description: string;
        status: string;
        visibility: string;
        type: string;
        logo?: string;
        coverImage?: string;
        organizer: {
            name: string;
            email: string;
            phone: string;
            website: string;
        };
        sponsors: string[];
    };
    participants: {
        type: string;
        minTeams: number;
        maxTeams: number;
        regOpenDate: string;
        regCloseDate: string;
        approvalRequired: boolean;
        regFee: number;
        playerLimit: number;
        squadSize: number;
    };
    format: {
        type: string;
        numGroups: number;
        teamsPerGroup: number;
        homeAway: boolean;
        winPoints: number;
        drawPoints: number;
        lossPoints: number;
        tieBreaker: string;
        qualRules: string;
        format_data?: any[];
    };
    schedule: {
        startDate: string;
        endDate: string;
        matchDuration: number;
        halfDuration: number;
        breakTime: number;
        matchDays: Record<string, boolean>;
        timeSlots: string;
    };
    rules: {
        govBody: string;
        playersOnField: number;
        minPlayers: number;
        subsAllowed: number;
        offsideRule: boolean;
        ballSize: number;
        pitchType: string;
        extraTimeRule: string;
        penaltiesRule: boolean;
        yellowSuspensionLimit: number;
        redSuspensionLength: number;
        gkRules: string;
    };
    venues: {
        multipleVenues: boolean;
        primaryVenue: string;
        venueAddress: string;
        pitchCount: number;
        fieldType: string;
    };
    finance: {
        paymentMethod: string;
        prizePool: number;
        prizeMoney: number;
        paymentInfo: string;
        prizeDist: string;
        refundPolicy: string;
        regFee: number;
    };
    presentation: {
        themeColor: string;
        urlSlug: string;
        showStandings: boolean;
        showPlayerStats: boolean;
        showTopScorers: boolean;
        welcomeMsg: string;
        showLiveScores: boolean;
        showRecentResults: boolean;
        showCommentary: boolean;
        liveStreamLink: string;
    };

}

@Component({
    selector: 'app-tournament-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TournamentGeneralComponent,
        TournamentParticipantsComponent,
        TournamentFormatComponent,
        TournamentScheduleComponent,
        TournamentRulesComponent,
        TournamentVenuesComponent,
        TournamentFinanceComponent,
        TournamentPresentationComponent,
        TournamentResultsComponent,
        TournamentTeamsComponent,
        TournamentMatchesComponent,
        TournamentMatchesComponent,
        TournamentSponsorsComponent,
        LoaderComponent,
        TranslateModule
    ],
    templateUrl: './tournament-dashboard.component.html',
})
export class TournamentDashboardComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private tournamentService = inject(TournamentService);
    public ui = inject(UiService);
    private translate = inject(TranslateService);

    tournament = signal<TournamentDTO | null>(null);
    isLoading = signal(true);
    activeTab = signal<string>('general');
    formatChanged = false;

    settings: TournamentSettings = this.getDefaultSettings();

    sidebarItems = [
        { id: 'general', label: 'TOURNAMENT_DASHBOARD.SIDEBAR.GENERAL', icon: 'settings' },
        { id: 'participants', label: 'TOURNAMENT_DASHBOARD.SIDEBAR.PARTICIPANTS', icon: 'users' },
        { id: 'teams', label: 'TOURNAMENT_DASHBOARD.SIDEBAR.TEAMS', icon: 'shield' },
        { id: 'matches', label: 'TOURNAMENT_DASHBOARD.SIDEBAR.MATCHES', icon: 'list' },
        { id: 'format', label: 'TOURNAMENT_DASHBOARD.SIDEBAR.FORMAT', icon: 'grid' },
        { id: 'schedule', label: 'TOURNAMENT_DASHBOARD.SIDEBAR.SCHEDULE', icon: 'calendar' },
        { id: 'rules', label: 'TOURNAMENT_DASHBOARD.SIDEBAR.RULES', icon: 'scale-balanced' },
        { id: 'venues', label: 'TOURNAMENT_DASHBOARD.SIDEBAR.VENUES', icon: 'map-pin' },
        { id: 'finance', label: 'TOURNAMENT_DASHBOARD.SIDEBAR.FINANCE', icon: 'coins' },
        { id: 'presentation', label: 'TOURNAMENT_DASHBOARD.SIDEBAR.PRESENTATION', icon: 'monitor' },
        { id: 'sponsors', label: 'Sponsors', icon: 'list' },
        { id: 'results', label: 'TOURNAMENT_DASHBOARD.SIDEBAR.RESULTS', icon: 'bar-chart' }
    ];

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.loadTournament(id);
            }
        });
    }

    setActiveTab(tabId: string) {
        this.syncRegFee();
        this.setTab(tabId);
    }

    private syncRegFee() {
        // Synchronize the registration fee across sub-settings before switching tabs or saving
        if (this.activeTab() === 'participants') {
            if (this.settings.finance) this.settings.finance.regFee = this.settings.participants.regFee;
        } else if (this.activeTab() === 'finance') {
            if (this.settings.participants) this.settings.participants.regFee = this.settings.finance.regFee;
        }
    }

    getDefaultSettings(): TournamentSettings {
        return {
            general: {
                name: '',
                shortName: '',
                description: '',
                status: 'draft',
                visibility: 'public',
                type: '11aside',
                logo: '',
                coverImage: '',
                organizer: {
                    name: '',
                    email: '',
                    phone: '',
                    website: ''
                },
                sponsors: [] as string[]
            },
            participants: {
                type: 'team',
                minTeams: 8,
                maxTeams: 16,
                regOpenDate: '',
                regCloseDate: '',
                approvalRequired: true,
                regFee: 0,
                playerLimit: 25,
                squadSize: 18
            },
            format: {
                type: 'knockout',
                numGroups: 4,
                teamsPerGroup: 4,
                homeAway: false,
                winPoints: 3,
                drawPoints: 1,
                lossPoints: 0,
                tieBreaker: Object.keys({ 'head-to-head': true, 'goal-difference': true, 'goals-scored': true }).join(','),
                qualRules: 'Top 2 Advance'
            },
            schedule: {
                startDate: '',
                endDate: '',
                matchDuration: 90,
                halfDuration: 45,
                breakTime: 15,
                matchDays: { MON: true, TUE: true, WED: true, THU: true, FRI: true, SAT: true, SUN: true },
                timeSlots: '18:00, 20:00'
            },
            rules: {
                govBody: 'FIFA',
                playersOnField: 11,
                minPlayers: 7,
                subsAllowed: 5,
                offsideRule: true,
                ballSize: 5,
                pitchType: 'Grass',
                extraTimeRule: 'None',
                penaltiesRule: true,
                yellowSuspensionLimit: 3,
                redSuspensionLength: 1,
                gkRules: 'Standard'
            },
            venues: {
                multipleVenues: false,
                primaryVenue: '',
                venueAddress: '',
                pitchCount: 1,
                fieldType: 'grass'
            },
            finance: {
                paymentMethod: 'bank',
                prizePool: 10000,
                prizeMoney: 10000,
                paymentInfo: '',
                prizeDist: '1st: 60%, 2nd: 30%, 3rd: 10%',
                refundPolicy: 'No Refunds',
                regFee: 0
            },
            presentation: {
                themeColor: 'gold',
                urlSlug: '',
                showStandings: true,
                showPlayerStats: true,
                showTopScorers: true,
                welcomeMsg: '',
                showLiveScores: true,
                showCommentary: false,
                liveStreamLink: '',
                showRecentResults: true
            }
        };
    }

    loadTournament(id: string) {
        this.isLoading.set(true);
        this.tournamentService.getById(id).subscribe({
            next: (tournament) => {
                this.tournament.set(tournament);
                this.mergeTournamentToSettings(tournament);
                this.isLoading.set(false);
            },
            error: (err) => {
                console.error('Failed to load tournament:', err);
                this.isLoading.set(false);
            }
        });
    }

    mergeTournamentToSettings(tournament: TournamentDTO) {
        this.settings.general.name = tournament.name;
        this.settings.general.description = tournament.description || '';
        this.settings.schedule.startDate = tournament.startDate?.split('T')[0] || '';
        this.settings.schedule.endDate = tournament.endDate?.split('T')[0] || '';
        this.settings.participants.maxTeams = tournament.maxTeams || 16;
        this.settings.general.status = tournament.status || 'draft';
        this.settings.general.shortName = tournament.shortName || '';
        this.settings.general.type = tournament.type || '11aside';
        this.settings.general.visibility = tournament.visibility || 'public';
        this.settings.general.logo = tournament.logo || '';
        this.settings.general.coverImage = tournament.coverImage || '';
        this.settings.participants.type = tournament.participantType || 'team';
        this.settings.participants.minTeams = tournament.minTeams || 8;
        this.settings.participants.regOpenDate = tournament.regOpenDate?.split('T')[0] || '';
        this.settings.participants.regCloseDate = tournament.regCloseDate?.split('T')[0] || '';
        this.settings.participants.approvalRequired = tournament.approvalRequired !== undefined ? tournament.approvalRequired : true;
        this.settings.participants.regFee = tournament.regFee || 0;
        this.settings.participants.playerLimit = tournament.playerLimit || 25;
        this.settings.participants.squadSize = tournament.squadSize || 18;
        if (tournament.organizer) {
            this.settings.general.organizer = tournament.organizer;
        }

        if (tournament.sponsors) {
            try {
                this.settings.general.sponsors = JSON.parse(tournament.sponsors);
            } catch (e) {
                this.settings.general.sponsors = tournament.sponsors.split(',').map(s => s.trim()).filter(Boolean);
            }
        } else {
            this.settings.general.sponsors = [];
        }

        if (tournament.settings) {
            // Deep merge to avoid losing fields like general.type if settings.general is partially returned
            this.settings.rules = { ...this.settings.rules, ...(tournament.settings.rules || {}) };
            this.settings.schedule = { ...this.settings.schedule, ...(tournament.settings.schedule || {}) };
            this.settings.venues = { ...this.settings.venues, ...(tournament.settings.venues || {}) };
            this.settings.finance = { ...this.settings.finance, ...(tournament.settings.finance || {}) };
            this.settings.presentation = { ...this.settings.presentation, ...(tournament.settings.presentation || {}) };
        }

        // Force sync regFee from top-level to all sub-settings
        const unifiedRegFee = tournament.regFee || 0;
        this.settings.participants.regFee = unifiedRegFee;
        this.settings.finance.regFee = unifiedRegFee;

        // Ensure we load the format entity data directly if available
        if (tournament.format) {
            // Normalize backend (plural/mismatched) to frontend naming
            let normalizedType = tournament.format.format_type || (tournament.format as any).type || this.settings.format.type;
            if (normalizedType === 'groups') normalizedType = 'group';
            if (normalizedType === 'groups_knockout') normalizedType = 'group_knockout';

            let incomingFormatData = tournament.format.format_data;
            if (typeof incomingFormatData === 'string') {
                try {
                    incomingFormatData = JSON.parse(incomingFormatData);
                } catch (e) {
                    console.error('[TournamentDashboard] Failed to parse format_data:', e);
                }
            }

            // If incoming format_data is valid, use it. Otherwise keep what we have if it exists.
            const finalFormatData = (incomingFormatData && Array.isArray(incomingFormatData) && incomingFormatData.length > 0)
                ? incomingFormatData
                : (this.settings.format.format_data || []);

            this.settings.format = {
                ...this.settings.format,
                type: normalizedType,
                format_data: finalFormatData,
                homeAway: tournament.format.home_away_enabled !== undefined ? tournament.format.home_away_enabled : (tournament.format as any).homeAway ?? this.settings.format.homeAway,
                winPoints: tournament.format.win_points ?? (tournament.format as any).winPoints ?? this.settings.format.winPoints,
                drawPoints: tournament.format.draw_points ?? (tournament.format as any).drawPoints ?? this.settings.format.drawPoints,
                lossPoints: tournament.format.loss_points ?? (tournament.format as any).lossPoints ?? this.settings.format.lossPoints
            };
        }
    }

    setTab(tab: string) {
        this.activeTab.set(tab);
        if (tab === 'format' && this.settings.format) {
            // Force a new object reference so ngOnChanges fires in the child component
            this.settings.format = { ...this.settings.format };
        }
    }

    handleSettingsUpdate(key: keyof TournamentSettings, data: any) {
        this.settings[key] = { ...this.settings[key], ...data };

        // If tournament type changed, update playersOnField and other relevant rules
        if (key === 'general' && data.type) {
            const type = data.type;
            if (type === 'futsal') {
                this.settings.rules.playersOnField = 5;
                this.settings.rules.minPlayers = 3;
                this.settings.rules.subsAllowed = 99; // Rolling
                this.settings.participants.squadSize = 12;
            } else if (type === '7aside') {
                this.settings.rules.playersOnField = 7;
                this.settings.rules.minPlayers = 5;
                this.settings.rules.subsAllowed = 5;
                this.settings.participants.squadSize = 14;
            } else if (type === '11aside') {
                this.settings.rules.playersOnField = 11;
                this.settings.rules.minPlayers = 7;
                this.settings.rules.subsAllowed = 5;
                this.settings.participants.squadSize = 25;
            }
        }

        this.formatChanged = true;
    }

    onFormatChange(newFormat: any) {
        this.settings.format = newFormat;
        this.formatChanged = true;
    }

    saveChanges() {
        const t = this.tournament();
        if (!t || !t.id) return;
        this.syncRegFee();
        this.ui.startAction();

        this.tournamentService.update(t.id, {
            name: this.settings.general.name,
            description: this.settings.general.description,
            startDate: this.settings.schedule.startDate,
            endDate: this.settings.schedule.endDate,
            maxTeams: this.settings.participants.maxTeams,
            status: this.settings.general.status,
            shortName: this.settings.general.shortName,
            type: this.settings.general.type,
            visibility: this.settings.general.visibility,
            logo: this.settings.general.logo,
            coverImage: this.settings.general.coverImage,
            sponsors: JSON.stringify(this.settings.general.sponsors),
            organizer: this.settings.general.organizer,
            participantType: this.settings.participants.type,
            minTeams: this.settings.participants.minTeams,
            regOpenDate: this.settings.participants.regOpenDate,
            regCloseDate: this.settings.participants.regCloseDate,
            approvalRequired: this.settings.participants.approvalRequired,
            regFee: this.settings.participants.regFee,
            playerLimit: this.settings.participants.playerLimit,
            squadSize: this.settings.participants.squadSize,
            settings: this.settings,
            format: {
                format_type: this.settings.format.type === 'group' ? 'groups' :
                    this.settings.format.type === 'group_knockout' ? 'groups_knockout' :
                        this.settings.format.type,
                format_data: (this.settings.format as any).format_data,
                home_away_enabled: this.settings.format.homeAway,
                win_points: this.settings.format.winPoints,
                draw_points: this.settings.format.drawPoints,
                loss_points: this.settings.format.lossPoints
            },
        }).subscribe({
            next: (updated) => {
                this.tournament.set(updated);

                // If format changed, also let's generate the structure
                if (this.formatChanged && t.id) {
                    this.tournamentService.generateStructure(t.id).subscribe({
                        next: () => {
                            this.formatChanged = false;
                            this.ui.endAction();
                            this.showToast('TOURNAMENT_DASHBOARD.TOAST.STRUCTURE_SUCCESS', 'success');
                        },
                        error: (err) => {
                            console.error('Failed to generate structure:', err);
                            this.ui.endAction();
                            this.showToast('TOURNAMENT_DASHBOARD.TOAST.STRUCTURE_ERROR', 'error');
                        }
                    });
                } else {
                    this.ui.endAction();
                    this.showToast('TOURNAMENT_DASHBOARD.TOAST.SAVE_SUCCESS', 'success');
                }
            },
            error: (err) => {
                console.error('Failed to save:', err);
                this.ui.endAction();
                this.showToast('TOURNAMENT_DASHBOARD.TOAST.SAVE_ERROR', 'error');
            }
        });
    }

    discardChanges() {
        const t = this.tournament();
        if (!t) return;
        this.mergeTournamentToSettings(t);
        this.showToast('TOURNAMENT_DASHBOARD.TOAST.DISCARD_SUCCESS', 'info');
    }

    goBack() {
        this.router.navigate(['/admin/tournaments']);
    }

    showToast(key: string, type: 'success' | 'error' | 'info' = 'success') {
        this.ui.showToast(key, type);
    }

    getStatusLabel(status: string): string {
        const map: Record<string, string> = {
            draft: 'TOURNAMENT_DASHBOARD.STATUS.DRAFT',
            registration_open: 'TOURNAMENT_DASHBOARD.STATUS.REGISTRATION_OPEN',
            in_progress: 'TOURNAMENT_DASHBOARD.STATUS.IN_PROGRESS',
            completed: 'TOURNAMENT_DASHBOARD.STATUS.COMPLETED',
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
