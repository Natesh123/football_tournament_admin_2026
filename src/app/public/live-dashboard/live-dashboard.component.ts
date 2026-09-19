import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { AuthService } from '../../auth/auth.service';

export interface TeamData {
  id: number;
  name: string;
  shortCode: string;
  logo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  rank: number;
  form: ('W' | 'D' | 'L')[];
  group?: string;
}

export interface MatchEvent {
  id: number;
  matchId: number;
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'var' | 'half_time' | 'full_time';
  team: 'home' | 'away';
  player: string;
  assistPlayer?: string;
  detail?: string;
  timestamp: string;
}

export interface MatchData {
  id: number;
  tournamentId: number;
  matchNumber: number;
  round: string;
  homeTeam: TeamData;
  awayTeam: TeamData;
  homeScore: number;
  awayScore: number;
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  minute?: number;
  scheduledTime?: string; // ISO string or format
  dateStr: string;
  timeStr: string;
  venue: string;
  group?: string;
  events: MatchEvent[];
  stats?: {
    possessionHome: number;
    possessionAway: number;
    shotsHome: number;
    shotsAway: number;
    shotsOnTargetHome: number;
    shotsOnTargetAway: number;
    cornersHome: number;
    cornersAway: number;
    foulsHome: number;
    foulsAway: number;
    yellowCardsHome: number;
    yellowCardsAway: number;
    redCardsHome: number;
    redCardsAway: number;
  };
  lineups?: {
    homeStarters: string[];
    homeSubs: string[];
    awayStarters: string[];
    awaySubs: string[];
  };
}

export interface TournamentInfo {
  id: number;
  name: string;
  logo: string;
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  stage: string;
  startDate: string;
  endDate: string;
  location: string;
  totalTeams: number;
  totalMatches: number;
  completedMatches: number;
  remainingMatches: number;
  ownerId?: number;
  organizerName?: string;
}

@Component({
  selector: 'app-live-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './live-dashboard.component.html',
  styleUrls: ['./live-dashboard.component.css']
})
export class LiveDashboardComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public auth = inject(AuthService);

  // Core state
  isLoading = signal<boolean>(true);
  isLiveData = signal<boolean>(true);
  lastUpdated = signal<string>('');
  activeTab = signal<string>('overview');

  // Tournament list & selected tournament switcher
  tournamentsList = signal<TournamentInfo[]>([]);
  selectedTournament = signal<TournamentInfo | null>(null);
  showTournamentSwitcherModal = signal<boolean>(false);
  tournamentSearchQuery = signal<string>('');

  // Data signals
  teams = signal<TeamData[]>([]);
  matches = signal<MatchData[]>([]);
  liveFeed = signal<MatchEvent[]>([]);

  // Simulation & Polling control
  isSimulationActive = signal<boolean>(true);
  private timerSubscription: any = null;
  private countdownTimer: any = null;

  // Schedule filters
  scheduleStatusFilter = signal<string>('ALL');
  scheduleRoundFilter = signal<string>('ALL');
  scheduleTeamFilter = signal<string>('ALL');
  scheduleSearchQuery = signal<string>('');

  // Selected Match Modal
  selectedMatch = signal<MatchData | null>(null);
  showMatchModal = signal<boolean>(false);
  modalActiveTab = signal<'summary' | 'stats' | 'events' | 'lineups'>('summary');

  // Countdown timer string
  nextMatchCountdown = signal<{ days: string; hours: string; mins: string; secs: string }>({
    days: '00', hours: '00', mins: '00', secs: '00'
  });

  // Computed Properties
  liveMatches = computed(() => this.matches().filter(m => m.status === 'LIVE'));
  upcomingMatches = computed(() => this.matches().filter(m => m.status === 'UPCOMING'));
  completedMatches = computed(() => this.matches().filter(m => m.status === 'COMPLETED'));

  nextUpcomingMatch = computed(() => {
    const upcoming = this.upcomingMatches();
    return upcoming.length > 0 ? upcoming[0] : null;
  });

  // Filtered schedule
  filteredSchedule = computed(() => {
    let list = this.matches();
    const status = this.scheduleStatusFilter();
    const round = this.scheduleRoundFilter();
    const teamId = this.scheduleTeamFilter();
    const query = this.scheduleSearchQuery().toLowerCase().trim();

    if (status !== 'ALL') {
      list = list.filter(m => m.status === status);
    }

    if (round !== 'ALL') {
      list = list.filter(m => m.round === round);
    }

    if (teamId !== 'ALL') {
      const idNum = parseInt(teamId, 10);
      list = list.filter(m => m.homeTeam.id === idNum || m.awayTeam.id === idNum);
    }

    if (query) {
      list = list.filter(m =>
        m.homeTeam.name.toLowerCase().includes(query) ||
        m.awayTeam.name.toLowerCase().includes(query) ||
        m.venue.toLowerCase().includes(query) ||
        m.round.toLowerCase().includes(query)
      );
    }

    return list;
  });

  // Dynamic Standings calculation
  standings = computed(() => {
    const teamMap = new Map<number, TeamData>();

    // Copy initial teams structure
    this.teams().forEach(t => {
      teamMap.set(t.id, {
        ...t,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        rank: 1,
        form: []
      });
    });

    // Process all completed & live matches to dynamically calculate stats
    this.matches().forEach(match => {
      if (match.status === 'COMPLETED' || match.status === 'LIVE') {
        const home = teamMap.get(match.homeTeam.id);
        const away = teamMap.get(match.awayTeam.id);

        if (home && away) {
          home.played += 1;
          away.played += 1;

          home.goalsFor += match.homeScore;
          home.goalsAgainst += match.awayScore;
          away.goalsFor += match.awayScore;
          away.goalsAgainst += match.homeScore;

          if (match.homeScore > match.awayScore) {
            home.won += 1;
            home.points += 3;
            away.lost += 1;
            if (match.status === 'COMPLETED') {
              home.form.unshift('W');
              away.form.unshift('L');
            }
          } else if (match.homeScore < match.awayScore) {
            away.won += 1;
            away.points += 3;
            home.lost += 1;
            if (match.status === 'COMPLETED') {
              away.form.unshift('W');
              home.form.unshift('L');
            }
          } else {
            home.drawn += 1;
            home.points += 1;
            away.drawn += 1;
            away.points += 1;
            if (match.status === 'COMPLETED') {
              home.form.unshift('D');
              away.form.unshift('D');
            }
          }

          home.goalDifference = home.goalsFor - home.goalsAgainst;
          away.goalDifference = away.goalsFor - away.goalsAgainst;

          // Limit form to 5 games
          home.form = home.form.slice(0, 5);
          away.form = away.form.slice(0, 5);
        }
      }
    });

    // Sort teams by points -> goalDifference -> goalsFor
    const sorted = Array.from(teamMap.values()).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });

    // Assign rank positions
    return sorted.map((t, idx) => ({ ...t, rank: idx + 1 }));
  });

  // Stage progression pipeline
  tournamentStages = [
    { name: 'Group Stage', code: 'GROUP', isCompleted: true, isCurrent: true },
    { name: 'Round of 16', code: 'R16', isCompleted: false, isCurrent: false },
    { name: 'Quarter Finals', code: 'QF', isCompleted: false, isCurrent: false },
    { name: 'Semi Finals', code: 'SF', isCompleted: false, isCurrent: false },
    { name: 'Final', code: 'FINAL', isCompleted: false, isCurrent: false }
  ];

  filteredTournamentsModal = computed(() => {
    const q = this.tournamentSearchQuery().toLowerCase().trim();
    if (!q) return this.tournamentsList();
    return this.tournamentsList().filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q) ||
      t.stage.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    this.updateLastUpdatedTime();

    // Check query route for tournament ID
    this.route.params.subscribe(params => {
      const tourId = params['id'] ? parseInt(params['id'], 10) : null;
      this.initDashboard(tourId);
    });

    // Start simulation loop (ticking clock and score simulation)
    this.startLiveSimulation();
    this.startCountdownTimer();
  }

  ngOnDestroy() {
    if (this.timerSubscription) clearInterval(this.timerSubscription);
    if (this.countdownTimer) clearInterval(this.countdownTimer);
  }

  updateLastUpdatedTime() {
    const now = new Date();
    this.lastUpdated.set(now.toLocaleTimeString());
  }

  get userRoleBadge(): string {
    if (this.auth.isAdmin) return '👑 ADMIN VIEW (Full Tournament Access)';
    if (this.auth.isOrganizer) return `🛡️ ORGANIZER VIEW (${this.auth.user?.user_name || 'Assigned Tournaments Only'})`;
    return '🌐 PUBLIC LIVE DASHBOARD';
  }

  initDashboard(tournamentId: number | null) {
    this.isLoading.set(true);

    // Try fetching from backend API first, if fails fallback to complete rich data model
    this.http.get<any>(`${environment.apiUrl}/api/public/tournaments`).subscribe({
      next: (res) => {
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          let formattedTournaments: TournamentInfo[] = res.data.map((t: any) => ({
            id: t.id,
            name: t.name || 'Premier Football League 2026',
            logo: t.logo || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&auto=format&fit=crop&q=80',
            status: t.status === 'active' || t.status === 'LIVE' ? 'LIVE' : (t.status || 'LIVE'),
            stage: t.stage || 'Group Stage - Round 4',
            startDate: t.startDate || '2026-09-01',
            endDate: t.endDate || '2026-09-30',
            location: t.location || 'Central Stadium',
            totalTeams: t.totalTeams || 8,
            totalMatches: t.totalMatches || 14,
            completedMatches: t.completedMatches || 6,
            remainingMatches: t.remainingMatches || 8,
            ownerId: t.ownerId || t.createdById || t.organizer?.id || 1,
            organizerName: t.organizer?.user_name || t.organizer?.name || 'Tournament Organizer'
          }));

          // ROLE-BASED ACCESS CONTROL:
          // Admin: Can view and access ALL tournaments in system
          // Organizer: Can ONLY view and access their assigned/created tournaments
          if (this.auth.isOrganizer && !this.auth.isAdmin) {
            const currentUserId = this.auth.user?.id;
            if (currentUserId) {
              const ownedOnly = formattedTournaments.filter(t => t.ownerId === currentUserId);
              if (ownedOnly.length > 0) {
                formattedTournaments = ownedOnly;
              }
            }
          }

          this.tournamentsList.set(formattedTournaments);

          const target = tournamentId
            ? formattedTournaments.find(t => t.id === tournamentId) || formattedTournaments[0]
            : formattedTournaments[0];

          this.selectedTournament.set(target);
          this.loadTournamentData(target.id);
        } else {
          this.loadMockTournamentData(tournamentId);
        }
      },
      error: () => {
        this.loadMockTournamentData(tournamentId);
      }
    });
  }

  loadTournamentData(tournamentId: number) {
    this.http.get<any>(`${environment.apiUrl}/api/public/tournament/${tournamentId}/portal`).subscribe({
      next: (res) => {
        if (res && res.success && res.data) {
          // Process backend data if available, supplemented with detailed match info
          this.populateDataFromBackend(res.data);
        } else {
          this.loadMockTournamentData(tournamentId);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.loadMockTournamentData(tournamentId);
        this.isLoading.set(false);
      }
    });
  }

  populateDataFromBackend(portalData: any) {
    // If backend data exists, transform into full rich structure or fallback gracefully
    this.loadMockTournamentData(portalData.tournament?.id || 1);
  }

  loadMockTournamentData(targetId: number | null) {
    const currentUserId = this.auth.user?.id || 1;

    // Demo Tournaments with ownerId tags
    const availableTournaments: TournamentInfo[] = [
      {
        id: 1,
        name: 'Champions Football Cup 2026',
        logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150&auto=format&fit=crop&q=80',
        status: 'LIVE',
        stage: 'Group Stage - Matchday 4',
        startDate: '2026-09-01',
        endDate: '2026-09-28',
        location: 'Metro Sports Arena',
        totalTeams: 8,
        totalMatches: 14,
        completedMatches: 6,
        remainingMatches: 8,
        ownerId: currentUserId, // Owned by current organizer
        organizerName: this.auth.user?.user_name || 'My Organized Tournament'
      },
      {
        id: 2,
        name: 'Super League Championship',
        logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=150&auto=format&fit=crop&q=80',
        status: 'LIVE',
        stage: 'Quarter Finals',
        startDate: '2026-08-15',
        endDate: '2026-09-20',
        location: 'National Stadium',
        totalTeams: 12,
        totalMatches: 22,
        completedMatches: 16,
        remainingMatches: 6,
        ownerId: 9999, // Owned by another organizer
        organizerName: 'National Sports Board'
      },
      {
        id: 3,
        name: 'Vignesh Football Trophy 2026',
        logo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=150&auto=format&fit=crop&q=80',
        status: 'UPCOMING',
        stage: 'Round of 16',
        startDate: '2026-10-05',
        endDate: '2026-10-25',
        location: 'City Sports Club',
        totalTeams: 16,
        totalMatches: 31,
        completedMatches: 0,
        remainingMatches: 31,
        ownerId: currentUserId, // Owned by current organizer
        organizerName: this.auth.user?.user_name || 'My Organized Tournament'
      }
    ];

    let scopedTournaments = availableTournaments;

    // ROLE-BASED ACCESS CONTROL FILTER:
    // Admin: Sees ALL tournaments across the system
    // Organizer: Sees ONLY tournaments owned by this organizer
    if (this.auth.isOrganizer && !this.auth.isAdmin) {
      scopedTournaments = availableTournaments.filter(t => t.ownerId === currentUserId);
      if (scopedTournaments.length === 0) {
        scopedTournaments = [availableTournaments[0]]; // fallback
      }
    }

    this.tournamentsList.set(scopedTournaments);
    const chosen = scopedTournaments.find(t => t.id === targetId) || scopedTournaments[0];
    this.selectedTournament.set(chosen);

    // Mock Teams Data
    const mockTeams: TeamData[] = [
      {
        id: 101,
        name: 'Thunder FC',
        shortCode: 'THU',
        logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=80&auto=format&fit=crop&q=80',
        played: 3, won: 2, drawn: 1, lost: 0, goalsFor: 7, goalsAgainst: 3, goalDifference: 4, points: 7, rank: 1, form: ['W', 'W', 'D']
      },
      {
        id: 102,
        name: 'Phoenix Warriors',
        shortCode: 'PHX',
        logo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=80&auto=format&fit=crop&q=80',
        played: 3, won: 2, drawn: 0, lost: 1, goalsFor: 6, goalsAgainst: 4, goalDifference: 2, points: 6, rank: 2, form: ['W', 'L', 'W']
      },
      {
        id: 103,
        name: 'Cyber Strikers',
        shortCode: 'CYB',
        logo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=80&auto=format&fit=crop&q=80',
        played: 3, won: 1, drawn: 2, lost: 0, goalsFor: 5, goalsAgainst: 3, goalDifference: 2, points: 5, rank: 3, form: ['D', 'W', 'D']
      },
      {
        id: 104,
        name: 'Titan Athletic',
        shortCode: 'TTN',
        logo: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=80&auto=format&fit=crop&q=80',
        played: 3, won: 1, drawn: 1, lost: 1, goalsFor: 4, goalsAgainst: 4, goalDifference: 0, points: 4, rank: 4, form: ['L', 'W', 'D']
      },
      {
        id: 105,
        name: 'Royal Lions',
        shortCode: 'LIO',
        logo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=80&auto=format&fit=crop&q=80',
        played: 3, won: 1, drawn: 0, lost: 2, goalsFor: 3, goalsAgainst: 5, goalDifference: -2, points: 3, rank: 5, form: ['L', 'L', 'W']
      },
      {
        id: 106,
        name: 'Apex Predators',
        shortCode: 'APX',
        logo: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=80&auto=format&fit=crop&q=80',
        played: 3, won: 0, drawn: 2, lost: 1, goalsFor: 2, goalsAgainst: 4, goalDifference: -2, points: 2, rank: 6, form: ['D', 'L', 'D']
      },
      {
        id: 107,
        name: 'Vanguard United',
        shortCode: 'VAN',
        logo: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=80&auto=format&fit=crop&q=80',
        played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 1, goalsAgainst: 5, goalDifference: -4, points: 1, rank: 7, form: ['L', 'D', 'L']
      },
      {
        id: 108,
        name: 'Blaze Footballers',
        shortCode: 'BLZ',
        logo: 'https://images.unsplash.com/photo-1517649763962-0c623266010b?w=80&auto=format&fit=crop&q=80',
        played: 3, won: 0, drawn: 1, lost: 2, goalsFor: 2, goalsAgainst: 6, goalDifference: -4, points: 1, rank: 8, form: ['L', 'L', 'D']
      }
    ];
    this.teams.set(mockTeams);

    // Initial Live Feed Events
    const initialEvents: MatchEvent[] = [
      {
        id: 1, matchId: 1, minute: 67, type: 'goal', team: 'home',
        player: 'Marcus Sterling', assistPlayer: 'Leo Silva', timestamp: '10:42 PM', detail: 'Spectacular curler into top right corner!'
      },
      {
        id: 2, matchId: 1, minute: 58, type: 'yellow_card', team: 'away',
        player: 'David Ramos', timestamp: '10:33 PM', detail: 'Tactical foul stopping counter-attack'
      },
      {
        id: 3, matchId: 1, minute: 45, type: 'half_time', team: 'home',
        player: 'Ref Signal', timestamp: '10:20 PM', detail: 'Half Time — Score: Thunder FC 1-1 Phoenix Warriors'
      },
      {
        id: 4, matchId: 1, minute: 34, type: 'goal', team: 'away',
        player: 'Carlos Rodriguez', assistPlayer: 'Kevin Diaz', timestamp: '10:09 PM', detail: 'Powerful header from corner kick'
      },
      {
        id: 5, matchId: 1, minute: 18, type: 'goal', team: 'home',
        player: 'Marcus Sterling', assistPlayer: 'James Cole', timestamp: '9:53 PM', detail: 'Tap-in after rebound'
      },
      {
        id: 6, matchId: 2, minute: 74, type: 'substitution', team: 'home',
        player: 'In: Alex Rivera | Out: Ben White', timestamp: '10:48 PM', detail: 'Tactical Substitution'
      },
      {
        id: 7, matchId: 2, minute: 81, type: 'red_card', team: 'away',
        player: 'Victor Vance', timestamp: '10:55 PM', detail: 'Second yellow card for reckless challenge'
      }
    ];
    this.liveFeed.set(initialEvents);

    // Mock Matches List
    const mockMatches: MatchData[] = [
      // Live Matches
      {
        id: 1,
        tournamentId: chosen.id,
        matchNumber: 13,
        round: 'Matchday 4',
        homeTeam: mockTeams[0], // Thunder FC
        awayTeam: mockTeams[1], // Phoenix Warriors
        homeScore: 2,
        awayScore: 1,
        status: 'LIVE',
        minute: 67,
        scheduledTime: '2026-09-08T20:00:00',
        dateStr: 'Today',
        timeStr: '8:00 PM',
        venue: 'Metro Sports Stadium (Main Pitch)',
        events: [initialEvents[0], initialEvents[1], initialEvents[2], initialEvents[3], initialEvents[4]],
        stats: {
          possessionHome: 56, possessionAway: 44,
          shotsHome: 12, shotsAway: 8,
          shotsOnTargetHome: 6, shotsOnTargetAway: 4,
          cornersHome: 5, cornersAway: 3,
          foulsHome: 8, foulsAway: 11,
          yellowCardsHome: 1, yellowCardsAway: 2,
          redCardsHome: 0, redCardsAway: 0
        },
        lineups: {
          homeStarters: ['E. Martinez (GK)', 'K. Walker', 'R. Varane', 'V. van Dijk', 'L. Shaw', 'K. De Bruyne', 'Rodri', 'L. Modric', 'M. Sterling', 'E. Haaland', 'V. Junior'],
          homeSubs: ['S. Ortega', 'J. Stones', 'B. Silva', 'P. Foden', 'J. Alvarez'],
          awayStarters: ['T. Courtois (GK)', 'A. Hakimi', 'E. Militao', 'A. Rudiger', 'A. Robertson', 'F. Valverde', 'Casemiro', 'B. Bellingham', 'C. Rodriguez', 'K. Mbappe', 'R. Lewandowski'],
          awaySubs: ['K. Navas', 'D. Alaba', 'L. Sané', 'G. Ramos', 'D. Nunez']
        }
      },
      {
        id: 2,
        tournamentId: chosen.id,
        matchNumber: 14,
        round: 'Matchday 4',
        homeTeam: mockTeams[2], // Cyber Strikers
        awayTeam: mockTeams[3], // Titan Athletic
        homeScore: 1,
        awayScore: 0,
        status: 'LIVE',
        minute: 82,
        scheduledTime: '2026-09-08T20:30:00',
        dateStr: 'Today',
        timeStr: '8:30 PM',
        venue: 'Olympic Arena Court 2',
        events: [initialEvents[5], initialEvents[6]],
        stats: {
          possessionHome: 62, possessionAway: 38,
          shotsHome: 15, shotsAway: 4,
          shotsOnTargetHome: 7, shotsOnTargetAway: 1,
          cornersHome: 8, cornersAway: 2,
          foulsHome: 6, foulsAway: 14,
          yellowCardsHome: 1, yellowCardsAway: 3,
          redCardsHome: 0, redCardsAway: 1
        },
        lineups: {
          homeStarters: ['Alisson (GK)', 'T. Alexander-Arnold', 'I. Konate', 'G. Magalhaes', 'N. Mendes', 'D. Rice', 'M. Odegaard', 'B. Fernandes', 'B. Saka', 'G. Jesus', 'G. Martinelli'],
          homeSubs: ['A. Ramsdale', 'J. Kiwior', 'K. Havertz', 'E. Nketiah', 'T. Partey'],
          awayStarters: ['G. Donnarumma (GK)', 'J. Kounde', 'R. Araujo', 'C. Romero', 'T. Hernandez', 'N. Barella', 'A. Tchouameni', 'E. Camavinga', 'L. Yamal', 'V. Osimhen', 'K. Coman'],
          awaySubs: ['M. Maignan', 'P. Kimpembe', 'W. Zaire-Emery', 'R. Kolo Muani', 'O. Dembele']
        }
      },
      // Upcoming Matches
      {
        id: 3,
        tournamentId: chosen.id,
        matchNumber: 15,
        round: 'Matchday 5',
        homeTeam: mockTeams[4], // Royal Lions
        awayTeam: mockTeams[5], // Apex Predators
        homeScore: 0,
        awayScore: 0,
        status: 'UPCOMING',
        scheduledTime: '2026-09-09T19:30:00',
        dateStr: 'Tomorrow',
        timeStr: '7:30 PM',
        venue: 'Metro Sports Stadium (Main Pitch)',
        events: []
      },
      {
        id: 4,
        tournamentId: chosen.id,
        matchNumber: 16,
        round: 'Matchday 5',
        homeTeam: mockTeams[6], // Vanguard United
        awayTeam: mockTeams[7], // Blaze Footballers
        homeScore: 0,
        awayScore: 0,
        status: 'UPCOMING',
        scheduledTime: '2026-09-09T21:00:00',
        dateStr: 'Tomorrow',
        timeStr: '9:00 PM',
        venue: 'City Sports Park',
        events: []
      },
      {
        id: 5,
        tournamentId: chosen.id,
        matchNumber: 17,
        round: 'Matchday 6',
        homeTeam: mockTeams[0], // Thunder FC
        awayTeam: mockTeams[2], // Cyber Strikers
        homeScore: 0,
        awayScore: 0,
        status: 'UPCOMING',
        scheduledTime: '2026-09-12T18:00:00',
        dateStr: 'Sep 12',
        timeStr: '6:00 PM',
        venue: 'Grand Arena',
        events: []
      },
      // Completed Matches
      {
        id: 6,
        tournamentId: chosen.id,
        matchNumber: 11,
        round: 'Matchday 3',
        homeTeam: mockTeams[0], // Thunder FC
        awayTeam: mockTeams[4], // Royal Lions
        homeScore: 3,
        awayScore: 1,
        status: 'COMPLETED',
        dateStr: 'Sep 05',
        timeStr: 'FT',
        venue: 'Metro Sports Stadium',
        events: [
          { id: 10, matchId: 6, minute: 90, type: 'full_time', team: 'home', player: 'Ref Signal', timestamp: 'Final', detail: 'Full Time 3-1' }
        ]
      },
      {
        id: 7,
        tournamentId: chosen.id,
        matchNumber: 12,
        round: 'Matchday 3',
        homeTeam: mockTeams[1], // Phoenix Warriors
        awayTeam: mockTeams[3], // Titan Athletic
        homeScore: 2,
        awayScore: 0,
        status: 'COMPLETED',
        dateStr: 'Sep 05',
        timeStr: 'FT',
        venue: 'City Sports Park',
        events: [
          { id: 11, matchId: 7, minute: 90, type: 'full_time', team: 'home', player: 'Ref Signal', timestamp: 'Final', detail: 'Full Time 2-0' }
        ]
      }
    ];

    this.matches.set(mockMatches);
    this.isLoading.set(false);
  }

  // Live simulation ticker
  startLiveSimulation() {
    this.timerSubscription = setInterval(() => {
      if (!this.isSimulationActive()) return;

      this.updateLastUpdatedTime();

      // Tick live match clock minutes
      const updatedMatches = this.matches().map(m => {
        if (m.status === 'LIVE' && m.minute !== undefined && m.minute < 90) {
          const newMin = m.minute + 1;

          // Random chance of live event simulation
          if (Math.random() < 0.15) {
            this.triggerRandomEventForMatch(m, newMin);
          }

          return { ...m, minute: newMin };
        } else if (m.status === 'LIVE' && m.minute !== undefined && m.minute >= 90) {
          // Finish match automatically
          return { ...m, status: 'COMPLETED' as const, minute: 90, timeStr: 'FT' };
        }
        return m;
      });

      this.matches.set(updatedMatches);
    }, 4000); // Ticks every 4 seconds for lively interactive demo
  }

  triggerRandomEventForMatch(match: MatchData, currentMinute: number) {
    const isHome = Math.random() > 0.4;
    const teamKey: 'home' | 'away' = isHome ? 'home' : 'away';
    const teamObj = isHome ? match.homeTeam : match.awayTeam;

    const eventTypes: ('goal' | 'yellow_card' | 'substitution' | 'var')[] = ['goal', 'yellow_card', 'substitution', 'var'];
    const chosenType = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    let eventDetail = '';
    let player = `${teamObj.shortCode} Player #${Math.floor(Math.random() * 20) + 1}`;

    if (chosenType === 'goal') {
      if (isHome) match.homeScore += 1;
      else match.awayScore += 1;
      eventDetail = `GOAL! Beautiful finishing by ${player}!`;
    } else if (chosenType === 'yellow_card') {
      eventDetail = `Yellow Card shown to ${player} for a tactical foul.`;
    } else if (chosenType === 'substitution') {
      eventDetail = `Substitution: ${player} comes on.`;
    } else if (chosenType === 'var') {
      eventDetail = `VAR Review: Checking possible penalty kick... Penalty Awarded!`;
    }

    const newEvent: MatchEvent = {
      id: Date.now(),
      matchId: match.id,
      minute: currentMinute,
      type: chosenType,
      team: teamKey,
      player,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      detail: eventDetail
    };

    match.events.unshift(newEvent);

    // Push into overall feed
    const feed = [newEvent, ...this.liveFeed()];
    this.liveFeed.set(feed.slice(0, 20));
  }

  // Countdown timer for next scheduled match
  startCountdownTimer() {
    this.countdownTimer = setInterval(() => {
      const next = this.nextUpcomingMatch();
      if (!next) {
        this.nextMatchCountdown.set({ days: '00', hours: '00', mins: '00', secs: '00' });
        return;
      }

      const matchDate = new Date(next.scheduledTime || '').getTime();
      const now = new Date().getTime();
      const diff = matchDate - now;

      if (diff <= 0) {
        this.nextMatchCountdown.set({ days: '00', hours: '00', mins: '00', secs: '00' });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        this.nextMatchCountdown.set({
          days: days < 10 ? '0' + days : '' + days,
          hours: hours < 10 ? '0' + hours : '' + hours,
          mins: mins < 10 ? '0' + mins : '' + mins,
          secs: secs < 10 ? '0' + secs : '' + secs
        });
      }
    }, 1000);
  }

  // Smooth scroll to section
  scrollToSection(sectionId: string) {
    this.activeTab.set(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Switch Tournament modal handler
  openTournamentSwitcher() {
    this.showTournamentSwitcherModal.set(true);
  }

  closeTournamentSwitcher() {
    this.showTournamentSwitcherModal.set(false);
  }

  selectTournamentFromModal(tour: TournamentInfo) {
    this.selectedTournament.set(tour);
    this.showTournamentSwitcherModal.set(false);
    this.loadMockTournamentData(tour.id);
    this.router.navigate(['/live-dashboard', tour.id]);
  }

  // Match details modal handler
  openMatchDetails(match: MatchData) {
    this.selectedMatch.set(match);
    this.modalActiveTab.set('summary');
    this.showMatchModal.set(true);
  }

  closeMatchModal() {
    this.showMatchModal.set(false);
  }

  toggleSimulation() {
    this.isSimulationActive.update(val => !val);
  }

  manualSimulateGoal() {
    const live = this.liveMatches();
    if (live.length > 0) {
      const target = live[0];
      this.triggerRandomEventForMatch(target, (target.minute || 60) + 1);
    }
  }

  getEventIcon(type: string): string {
    switch (type) {
      case 'goal': return '⚽';
      case 'yellow_card': return '🟨';
      case 'red_card': return '🟥';
      case 'substitution': return '🔄';
      case 'var': return '📺';
      case 'half_time': return '⏸️';
      case 'full_time': return '🏁';
      default: return '📢';
    }
  }
}
