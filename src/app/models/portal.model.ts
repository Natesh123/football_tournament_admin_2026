export interface Tournament {
  id: number;
  name: string;
  logo?: string;
  status: string;
  visibility: string;
}

export interface Presentation {
  brandColor: string;
  welcomeMessage: string;
  showStandings: boolean;
  showTopScorers: boolean;
  showLiveMatches: boolean;
  showRecentResults: boolean;
  liveStreamLink: string;
}

export interface Standing {
  teamId: number;
  teamName: string;
  teamLogo?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  groupName?: string;
  form: string[];
}

export interface Match {
  id: number;
  homeTeamName: string;
  homeTeamLogo?: string;
  awayTeamName: string;
  awayTeamLogo?: string;
  homeScore: number;
  awayScore: number;
  status: string;
  startTime?: string;
  minute?: number;
}

export interface TopScorer {
  playerName: string;
  playerPhoto?: string;
  teamName: string;
  teamLogo?: string;
  goals: number;
}

export interface PortalData {
  tournament: Tournament;
  presentation: Presentation;
  standings: Standing[];
  liveMatches: Match[];
  completedMatches: Match[];
  topScorers: TopScorer[];
}
