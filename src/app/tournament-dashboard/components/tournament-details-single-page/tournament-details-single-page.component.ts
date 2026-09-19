import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/auth.service';

export interface TeamDetail {
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
}

export interface DetailedMatch {
  id: number;
  tournamentId: number;
  matchNumber: number;
  round: string;
  homeTeam: TeamDetail;
  awayTeam: TeamDetail;
  homeScore: number;
  awayScore: number;
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  minute?: number;
  scheduledTime?: string;
  dateStr: string;
  timeStr: string;
  venue: string;
  winnerName?: string;
  events?: any[];
  stats?: any;
}

export interface KnockoutMatch {
  roundName: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  homeScore?: number;
  awayScore?: number;
  winner?: string;
  status: string;
}

@Component({
  selector: 'app-tournament-details-single-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tournament-details-single-page.component.html',
  styleUrls: ['./tournament-details-single-page.component.css']
})
export class TournamentDetailsSinglePageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  public auth = inject(AuthService);

  tournamentId = signal<number>(1);
  isLoading = signal<boolean>(true);
  activeMatchTab = signal<'all' | 'live' | 'upcoming' | 'completed'>('all');

  // Core Tournament Info
  tournament = signal<{
    id: number;
    name: string;
    logo: string;
    status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
    stage: string;
    location: string;
    startDate: string;
    endDate: string;
    format: string;
    totalTeams: number;
    totalMatches: number;
    completedMatches: number;
    remainingMatches: number;
  }>({
    id: 1,
    name: 'Loading Tournament...',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&auto=format&fit=crop&q=80',
    status: 'UPCOMING',
    stage: 'Registration Open',
    location: 'Central Sports Complex',
    startDate: 'TBD',
    endDate: 'TBD',
    format: 'Groups + Knockout',
    totalTeams: 0,
    totalMatches: 0,
    completedMatches: 0,
    remainingMatches: 0
  });

  teams = signal<TeamDetail[]>([]);
  matches = signal<DetailedMatch[]>([]);
  knockoutBracket = signal<KnockoutMatch[]>([]);

  // Selected Match Modal
  selectedMatch = signal<DetailedMatch | null>(null);
  showMatchModal = signal<boolean>(false);

  // Countdown timer for next upcoming match
  nextMatchCountdown = signal<{ days: string; hours: string; mins: string; secs: string }>({
    days: '00', hours: '00', mins: '00', secs: '00'
  });

  private timerInterval: any = null;
  private countdownInterval: any = null;

  // Computed Properties
  liveMatches = computed(() => this.matches().filter(m => m.status === 'LIVE'));
  upcomingMatches = computed(() => this.matches().filter(m => m.status === 'UPCOMING'));
  completedMatches = computed(() => this.matches().filter(m => m.status === 'COMPLETED'));

  nextUpcomingMatch = computed(() => {
    const upcoming = this.upcomingMatches();
    return upcoming.length > 0 ? upcoming[0] : null;
  });

  filteredMatches = computed(() => {
    const tab = this.activeMatchTab();
    if (tab === 'live') return this.liveMatches();
    if (tab === 'upcoming') return this.upcomingMatches();
    if (tab === 'completed') return this.completedMatches();
    return this.matches();
  });

  // Dynamically calculated standings
  standings = computed(() => {
    const teamMap = new Map<number, TeamDetail>();

    this.teams().forEach(t => {
      teamMap.set(Number(t.id), {
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

    this.matches().forEach(match => {
      if (match.status === 'COMPLETED' || match.status === 'LIVE') {
        let home = teamMap.get(Number(match.homeTeam.id));
        let away = teamMap.get(Number(match.awayTeam.id));

        // Fallback search by team name if ID search didn't find the team object
        if (!home) {
          home = Array.from(teamMap.values()).find(t => t.name.toLowerCase() === match.homeTeam.name?.toLowerCase());
        }
        if (!away) {
          away = Array.from(teamMap.values()).find(t => t.name.toLowerCase() === match.awayTeam.name?.toLowerCase());
        }

        if (home && away) {
          const homeScore = Number(match.homeScore) || 0;
          const awayScore = Number(match.awayScore) || 0;

          home.played += 1;
          away.played += 1;

          home.goalsFor += homeScore;
          home.goalsAgainst += awayScore;
          away.goalsFor += awayScore;
          away.goalsAgainst += homeScore;

          if (homeScore > awayScore) {
            home.won += 1;
            home.points += 3;
            away.lost += 1;
            if (match.status === 'COMPLETED') {
              home.form.unshift('W');
              away.form.unshift('L');
            }
          } else if (homeScore < awayScore) {
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

          home.form = home.form.slice(0, 5);
          away.form = away.form.slice(0, 5);
        }
      }
    });

    const sorted = Array.from(teamMap.values()).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });

    return sorted.map((t, idx) => ({ ...t, rank: idx + 1 }));
  });

  // Tournament Winner Computed Signal
  tournamentWinner = computed(() => {
    const isCompleted = this.tournament().status === 'COMPLETED' || (this.tournament().completedMatches > 0 && this.tournament().remainingMatches === 0);
    if (isCompleted) {
      const standingsList = this.standings();
      return standingsList.length > 0 ? standingsList[0] : null;
    }
    return null;
  });

  tournamentStages = [
    { name: 'Group Stage', isCurrent: true, isCompleted: false },
    { name: 'Round of 16', isCurrent: false, isCompleted: false },
    { name: 'Quarter Finals', isCurrent: false, isCompleted: false },
    { name: 'Semi Finals', isCurrent: false, isCompleted: false },
    { name: 'Final', isCurrent: false, isCompleted: false }
  ];

  ngOnInit() {
    this.route.params.subscribe(params => {
      const idStr = params['id'] || params['tournamentId'];
      const id = idStr ? parseInt(idStr, 10) : 1;
      this.tournamentId.set(id);
      this.loadTournamentDetails(id);
    });

    this.startLiveSimulation();
    this.startCountdownTimer();
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  loadTournamentDetails(id: number) {
    this.isLoading.set(true);

    forkJoin({
      tournament: this.http.get<any>(`${environment.apiUrl}/api/tournaments/${id}`).pipe(catchError(() => of(null))),
      teams: this.http.get<any>(`${environment.apiUrl}/api/tournaments/${id}/teams`).pipe(catchError(() => of(null))),
      structure: this.http.get<any>(`${environment.apiUrl}/api/tournaments/${id}/structure`).pipe(catchError(() => of(null)))
    }).subscribe({
      next: ({ tournament: tourRes, teams: teamsRes, structure: structRes }) => {
        const t = tourRes?.data || tourRes || {};

        // 1. Process Teams
        const rawTeamsList = (teamsRes && teamsRes.success && Array.isArray(teamsRes.data)) ? teamsRes.data :
                             (Array.isArray(teamsRes) ? teamsRes : []);

        const mappedTeams: TeamDetail[] = rawTeamsList.map((item: any, idx: number) => {
          const teamObj = item.team || item;
          return {
            id: teamObj.id || idx + 1,
            name: teamObj.name || `Team ${idx + 1}`,
            shortCode: teamObj.shortName || (teamObj.name ? teamObj.name.substring(0, 3).toUpperCase() : `T${idx + 1}`),
            logo: teamObj.logoUrl || teamObj.logo || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=80&auto=format&fit=crop&q=80',
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0,
            rank: idx + 1,
            form: []
          };
        });

        this.teams.set(mappedTeams);

        // 2. Process Matches & Structure
        const rawMatchesList = (structRes && structRes.data && Array.isArray(structRes.data.matches)) ? structRes.data.matches :
                              (structRes && Array.isArray(structRes.matches) ? structRes.matches : []);

        const mappedMatches: DetailedMatch[] = rawMatchesList.map((m: any, idx: number) => {
          const homeTeamId = m.homeTeamId || m.home_team_id || m.homeTeam?.id;
          const homeTeamName = m.homeTeamName || m.home_team_name || m.homeTeam?.name || m.homeTeam?.label || 'TBD';
          
          const awayTeamId = m.awayTeamId || m.away_team_id || m.awayTeam?.id;
          const awayTeamName = m.awayTeamName || m.away_team_name || m.awayTeam?.name || m.awayTeam?.label || 'TBD';

          const home = mappedTeams.find(tItem => 
            (homeTeamId && Number(tItem.id) === Number(homeTeamId)) || 
            (tItem.name.toLowerCase() === homeTeamName.toLowerCase())
          ) || {
            id: homeTeamId || 900 + idx,
            name: homeTeamName,
            shortCode: homeTeamName.length > 4 ? homeTeamName.substring(0, 3).toUpperCase() : homeTeamName,
            logo: m.homeTeam?.logoUrl || m.homeTeam?.logo || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=80&auto=format&fit=crop&q=80',
            played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, rank: 1, form: []
          };

          const away = mappedTeams.find(tItem => 
            (awayTeamId && Number(tItem.id) === Number(awayTeamId)) || 
            (tItem.name.toLowerCase() === awayTeamName.toLowerCase())
          ) || {
            id: awayTeamId || 950 + idx,
            name: awayTeamName,
            shortCode: awayTeamName.length > 4 ? awayTeamName.substring(0, 3).toUpperCase() : awayTeamName,
            logo: m.awayTeam?.logoUrl || m.awayTeam?.logo || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=80&auto=format&fit=crop&q=80',
            played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, rank: 1, form: []
          };

          const rawStatus = (m.status || 'UPCOMING').toUpperCase();
          let status: 'LIVE' | 'UPCOMING' | 'COMPLETED' = 'UPCOMING';
          if (rawStatus === 'LIVE' || rawStatus === 'IN_PROGRESS') {
            status = 'LIVE';
          } else if (rawStatus === 'COMPLETED' || rawStatus === 'FINISHED') {
            status = 'COMPLETED';
          }

          let roundName = m.roundName || m.round_name;
          if (!roundName) {
            if (m.group?.group_name) {
              roundName = m.group.group_name;
            } else if (m.stage?.stage_type === 'group') {
              roundName = m.stage?.stage_name || 'Group Stage';
            } else if (m.stage?.stage_type === 'knockout') {
              roundName = m.stage?.stage_name || 'Knockout Stage';
            } else if (typeof m.round === 'number') {
              roundName = `Round ${m.round}`;
            } else {
              roundName = m.round || m.stage?.stage_name || 'Group Stage';
            }
          }

          const hScore = Number(m.homeScore ?? m.home_score) || 0;
          const aScore = Number(m.awayScore ?? m.away_score) || 0;

          let winnerName = m.winnerName || m.winner_name;
          if (!winnerName && status === 'COMPLETED') {
            if (hScore > aScore) winnerName = home.name;
            else if (aScore > hScore) winnerName = away.name;
          }

          return {
            id: m.id || idx + 1,
            tournamentId: id,
            matchNumber: m.matchNumber || idx + 1,
            round: roundName,
            homeTeam: home,
            awayTeam: away,
            homeScore: hScore,
            awayScore: aScore,
            status: status,
            minute: m.minute || (status === 'LIVE' ? 45 : undefined),
            scheduledTime: m.startTime || m.scheduledTime,
            dateStr: m.startTime ? new Date(m.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : (m.dateStr || 'TBD'),
            timeStr: m.startTime ? new Date(m.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : (m.timeStr || 'TBD'),
            venue: m.venue || t.settings?.venues?.primaryVenue || 'Main Pitch',
            winnerName: winnerName,
            events: m.events || []
          };
        });

        mappedMatches.sort((a, b) => {
          const timeA = a.scheduledTime ? new Date(a.scheduledTime).getTime() : 0;
          const timeB = b.scheduledTime ? new Date(b.scheduledTime).getTime() : 0;
          if (timeA !== timeB) return timeA - timeB;
          return a.id - b.id;
        });

        mappedMatches.forEach((m, idx) => {
          m.matchNumber = idx + 1;
        });

        this.matches.set(mappedMatches);

        // 3. Process Knockout Brackets
        const rawBrackets = (structRes && structRes.data && Array.isArray(structRes.data.brackets)) ? structRes.data.brackets : [];
        let mappedBracket: KnockoutMatch[] = rawBrackets.map((b: any) => ({
          roundName: b.roundName || b.round || 'Knockout Match',
          homeTeam: b.homeTeamName || 'TBD',
          awayTeam: b.awayTeamName || 'TBD',
          homeLogo: b.homeLogo || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=80&auto=format&fit=crop&q=80',
          awayLogo: b.awayLogo || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=80&auto=format&fit=crop&q=80',
          homeScore: b.homeScore,
          awayScore: b.awayScore,
          winner: b.winnerName,
          status: (b.status || 'UPCOMING').toUpperCase()
        }));

        const knockoutMatchesList = mappedMatches.filter(m => 
          m.round.toLowerCase().includes('knockout') || 
          m.round.toLowerCase().includes('quarter') || 
          m.round.toLowerCase().includes('semi') || 
          m.round.toLowerCase().includes('final') || 
          m.round.toLowerCase().includes('round of')
        );

        if (mappedBracket.length === 0 && knockoutMatchesList.length > 0) {
          mappedBracket = knockoutMatchesList.map(m => ({
            roundName: m.round,
            homeTeam: m.homeTeam.name,
            awayTeam: m.awayTeam.name,
            homeLogo: m.homeTeam.logo,
            awayLogo: m.awayTeam.logo,
            homeScore: m.homeScore,
            awayScore: m.awayScore,
            winner: m.winnerName,
            status: m.status
          }));
        }

        // If no explicit knockout matches exist yet but all matches are completed, generate final standing bracket representation
        const completedCount = mappedMatches.filter(m => m.status === 'COMPLETED').length;
        const totalMatchesCount = mappedMatches.length;
        const remainingCount = totalMatchesCount - completedCount;

        if (mappedBracket.length === 0 && completedCount > 0 && remainingCount === 0 && mappedTeams.length >= 2) {
          const topTeams = this.standings();
          mappedBracket = [
            {
              roundName: 'Final Match',
              homeTeam: topTeams[0]?.name || 'Team 1',
              awayTeam: topTeams[1]?.name || 'Team 2',
              homeLogo: topTeams[0]?.logo || '',
              awayLogo: topTeams[1]?.logo || '',
              homeScore: topTeams[0]?.goalsFor || 0,
              awayScore: topTeams[1]?.goalsFor || 0,
              winner: topTeams[0]?.name,
              status: 'COMPLETED'
            }
          ];
        }

        this.knockoutBracket.set(mappedBracket);

        // 4. Update Core Tournament Signal & Completion Status
        const isFinished = (t.status === 'completed' || t.status === 'finished') || (totalMatchesCount > 0 && remainingCount === 0);

        const statusText: 'LIVE' | 'UPCOMING' | 'COMPLETED' = isFinished ? 'COMPLETED' : 
          ((t.status === 'active' || t.status === 'in_progress' || t.status === 'LIVE' || completedCount > 0) ? 'LIVE' : 'UPCOMING');

        let stageText = 'Registration Open';
        if (isFinished) {
          stageText = 'Tournament Completed / Final';
        } else if (mappedMatches.length > 0) {
          stageText = mappedMatches.find(m => m.status === 'LIVE')?.round || 'Group Stage';
        }

        this.tournamentStages = [
          { name: 'Group Stage', isCurrent: !isFinished, isCompleted: completedCount > 0 },
          { name: 'Round of 16', isCurrent: false, isCompleted: isFinished },
          { name: 'Quarter Finals', isCurrent: false, isCompleted: isFinished },
          { name: 'Semi Finals', isCurrent: false, isCompleted: isFinished },
          { name: 'Final', isCurrent: isFinished, isCompleted: isFinished }
        ];

        this.tournament.set({
          id: t.id || id,
          name: t.name || `Tournament #${id}`,
          logo: t.logo || t.coverImage || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&auto=format&fit=crop&q=80',
          status: statusText,
          stage: stageText,
          location: t.settings?.venues?.primaryVenue || t.location || 'Central Sports Complex',
          startDate: t.startDate || 'TBD',
          endDate: t.endDate || 'TBD',
          format: t.type || t.format?.type || 'Group Stage + Knockout',
          totalTeams: mappedTeams.length,
          totalMatches: totalMatchesCount,
          completedMatches: completedCount,
          remainingMatches: remainingCount < 0 ? 0 : remainingCount
        });

        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }



  startLiveSimulation() {
    this.timerInterval = setInterval(() => {
      const updated = this.matches().map(m => {
        if (m.status === 'LIVE' && m.minute !== undefined && m.minute < 90) {
          return { ...m, minute: m.minute + 1 };
        }
        return m;
      });
      this.matches.set(updated);
    }, 4000);
  }

  startCountdownTimer() {
    this.countdownInterval = setInterval(() => {
      const next = this.nextUpcomingMatch();
      if (!next || !next.scheduledTime) {
        this.nextMatchCountdown.set({ days: '00', hours: '00', mins: '00', secs: '00' });
        return;
      }

      const matchDate = new Date(next.scheduledTime).getTime();
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

  openMatchModal(match: DetailedMatch) {
    this.selectedMatch.set(match);
    this.showMatchModal.set(true);
  }

  closeMatchModal() {
    this.showMatchModal.set(false);
  }

  manageTournament() {
    this.router.navigate(['/admin/tournaments', this.tournamentId()]);
  }

  goBack() {
    this.router.navigate(['/admin/tournaments']);
  }
}
