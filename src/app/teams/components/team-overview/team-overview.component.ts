import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-team-overview',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="space-y-6">
      
      <!-- Performance Cards Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Card: Total Matches -->
        <div class="bg-black-card border border-black-border rounded-xl p-4 flex flex-col gap-1 relative overflow-hidden group hover:border-gold-500/30 transition-colors">
            <div class="absolute -right-4 -top-4 w-16 h-16 bg-gold-500/5 rounded-full blur-xl group-hover:bg-gold-500/10 transition-colors"></div>
            <span class="text-zinc-500 text-xs uppercase tracking-wider z-10">{{ 'TEAM_OVERVIEW.PERFORMANCE.TOTAL_MATCHES' | translate }}</span>
            <span class="text-2xl font-bold text-white z-10">{{ performance.totalMatches }}</span>
        </div>
        <!-- Card: Wins -->
        <div class="bg-black-card border border-black-border rounded-xl p-4 flex flex-col gap-1 relative overflow-hidden group hover:border-gold-500/30 transition-colors">
            <div class="absolute -right-4 -top-4 w-16 h-16 bg-gold-500/5 rounded-full blur-xl group-hover:bg-gold-500/10 transition-colors"></div>
            <span class="text-zinc-500 text-xs uppercase tracking-wider z-10">{{ 'TEAM_OVERVIEW.PERFORMANCE.WINS' | translate }}</span>
            <span class="text-2xl font-bold text-green-500 z-10">{{ performance.wins }}</span>
        </div>
        <!-- Card: Draws -->
        <div class="bg-black-card border border-black-border rounded-xl p-4 flex flex-col gap-1 relative overflow-hidden group hover:border-gold-500/30 transition-colors">
            <div class="absolute -right-4 -top-4 w-16 h-16 bg-gold-500/5 rounded-full blur-xl group-hover:bg-gold-500/10 transition-colors"></div>
            <span class="text-zinc-500 text-xs uppercase tracking-wider z-10">{{ 'TEAM_OVERVIEW.PERFORMANCE.DRAWS' | translate }}</span>
            <span class="text-2xl font-bold text-zinc-300 z-10">{{ performance.draws }}</span>
        </div>
        <!-- Card: Losses -->
        <div class="bg-black-card border border-black-border rounded-xl p-4 flex flex-col gap-1 relative overflow-hidden group hover:border-gold-500/30 transition-colors">
            <div class="absolute -right-4 -top-4 w-16 h-16 bg-gold-500/5 rounded-full blur-xl group-hover:bg-gold-500/10 transition-colors"></div>
            <span class="text-zinc-500 text-xs uppercase tracking-wider z-10">{{ 'TEAM_OVERVIEW.PERFORMANCE.LOSSES' | translate }}</span>
            <span class="text-2xl font-bold text-red-500 z-10">{{ performance.losses }}</span>
        </div>
        <!-- Card: Goals Scored -->
        <div class="bg-black-card border border-black-border rounded-xl p-4 flex flex-col gap-1 relative overflow-hidden group hover:border-gold-500/30 transition-colors">
            <div class="absolute -right-4 -top-4 w-16 h-16 bg-gold-500/5 rounded-full blur-xl group-hover:bg-gold-500/10 transition-colors"></div>
            <span class="text-zinc-500 text-xs uppercase tracking-wider z-10">{{ 'TEAM_OVERVIEW.PERFORMANCE.GOALS_SCORED' | translate }}</span>
            <span class="text-2xl font-bold text-white z-10">{{ performance.goalsScored }}</span>
        </div>
        <!-- Card: Goals Conceded -->
        <div class="bg-black-card border border-black-border rounded-xl p-4 flex flex-col gap-1 relative overflow-hidden group hover:border-gold-500/30 transition-colors">
            <div class="absolute -right-4 -top-4 w-16 h-16 bg-gold-500/5 rounded-full blur-xl group-hover:bg-gold-500/10 transition-colors"></div>
            <span class="text-zinc-500 text-xs uppercase tracking-wider z-10">{{ 'TEAM_OVERVIEW.PERFORMANCE.GOALS_CONCEDED' | translate }}</span>
            <span class="text-2xl font-bold text-white z-10">{{ performance.goalsConceded }}</span>
        </div>
        <!-- Card: Clean Sheets -->
        <div class="bg-black-card border border-black-border rounded-xl p-4 flex flex-col gap-1 relative overflow-hidden group hover:border-gold-500/30 transition-colors">
            <div class="absolute -right-4 -top-4 w-16 h-16 bg-gold-500/5 rounded-full blur-xl group-hover:bg-gold-500/10 transition-colors"></div>
            <span class="text-zinc-500 text-xs uppercase tracking-wider z-10">{{ 'TEAM_OVERVIEW.PERFORMANCE.CLEAN_SHEETS' | translate }}</span>
            <span class="text-2xl font-bold text-white z-10">{{ performance.cleanSheets }}</span>
        </div>
        <!-- Card: Win Percentage -->
        <div class="bg-black-card border border-black-border rounded-xl p-4 flex flex-col gap-1 relative overflow-hidden group hover:border-gold-500/30 transition-colors">
            <div class="absolute -right-4 -top-4 w-16 h-16 bg-gold-500/5 rounded-full blur-xl group-hover:bg-gold-500/10 transition-colors"></div>
            <span class="text-zinc-500 text-xs uppercase tracking-wider z-10">{{ 'TEAM_OVERVIEW.PERFORMANCE.WIN_PERCENTAGE' | translate }}</span>
            <span class="text-2xl font-bold text-gold-400 z-10">{{ performance.winPercentage }}%</span>
        </div>
      </div>

      <!-- Recent Matches -->
      <div class="bg-black-card border border-black-border rounded-xl relative overflow-hidden">
        <div class="p-6 border-b border-black-border flex justify-between items-center relative z-10">
          <div>
            <h2 class="text-xl font-bold text-white mb-1">{{ 'TEAM_OVERVIEW.RECENT_MATCHES.TITLE' | translate }}</h2>
          </div>
        </div>
        
        <div class="overflow-x-auto relative z-10">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-black-border bg-black/20 text-xs uppercase tracking-wider text-zinc-500">
                <th class="p-4 font-medium">{{ 'TEAM_OVERVIEW.RECENT_MATCHES.OPPONENT' | translate }}</th>
                <th class="p-4 font-medium">{{ 'TEAM_OVERVIEW.RECENT_MATCHES.SCORE' | translate }}</th>
                <th class="p-4 font-medium">{{ 'TEAM_OVERVIEW.RECENT_MATCHES.RESULT' | translate }}</th>
                <th class="p-4 font-medium">{{ 'TEAM_OVERVIEW.RECENT_MATCHES.DATE' | translate }}</th>
                <th class="p-4 font-medium">{{ 'TEAM_OVERVIEW.RECENT_MATCHES.TOURNAMENT' | translate }}</th>
              </tr>
            </thead>
            <tbody class="text-sm">
              <tr *ngFor="let match of recentMatches" class="border-b border-black-border/50 hover:bg-black/20 transition-colors">
                <td class="p-4 text-white font-medium flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 border border-zinc-700">
                    {{ match.opponent.substring(0,2) | uppercase }}
                  </div>
                  {{ match.opponent }}
                </td>
                <td class="p-4 text-white">{{ match.score }}</td>
                <td class="p-4">
                  <span class="px-2.5 py-1 rounded-md text-xs font-bold" 
                        [ngClass]="{
                          'bg-green-500/10 text-green-500': match.result === 'W',
                          'bg-zinc-500/10 text-zinc-400': match.result === 'D',
                          'bg-red-500/10 text-red-500': match.result === 'L'
                        }">
                    {{ match.result }}
                  </span>
                </td>
                <td class="p-4 text-zinc-400">{{ match.date }}</td>
                <td class="p-4 text-zinc-400">{{ match.tournament }}</td>
              </tr>
              <tr *ngIf="recentMatches.length === 0">
                <td colspan="5" class="p-8 text-center text-zinc-500">
                  {{ 'TEAM_OVERVIEW.RECENT_MATCHES.EMPTY' | translate }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  `
})
export class TeamOverviewComponent {
  // Mock Performance Data
  performance = {
    totalMatches: 24,
    wins: 15,
    draws: 5,
    losses: 4,
    goalsScored: 42,
    goalsConceded: 18,
    cleanSheets: 10,
    winPercentage: Math.round((15 / 24) * 100)
  };

  // Mock Recent Matches Data
  recentMatches = [
    { opponent: 'Lions FC', score: '2 - 0', result: 'W', date: 'Oct 24, 2026', tournament: 'Champions League' },
    { opponent: 'Eagles United', score: '1 - 1', result: 'D', date: 'Oct 18, 2026', tournament: 'Premier Cup' },
    { opponent: 'Tigers City', score: '3 - 1', result: 'W', date: 'Oct 10, 2026', tournament: 'Champions League' },
    { opponent: 'Wolves Athletic', score: '0 - 2', result: 'L', date: 'Oct 02, 2026', tournament: 'Champions League' },
    { opponent: 'Bears FC', score: '4 - 0', result: 'W', date: 'Sep 25, 2026', tournament: 'Premier Cup' }
  ];
}
