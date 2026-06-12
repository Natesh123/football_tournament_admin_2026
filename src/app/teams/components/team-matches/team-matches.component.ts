import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TeamService, TeamStats } from '../../team.service';

@Component({
  selector: 'app-team-matches',
  standalone: true,
  imports: [CommonModule, TranslateModule, DatePipe],
  template: `
    <div class="space-y-6">
      <!-- Upcoming Matches -->
      <div class="bg-black-card border border-black-border rounded-xl p-6">
        <h2 class="text-xl font-bold text-white mb-1">{{ 'TEAM_MATCHES.TITLE' | translate }}</h2>
        <p class="text-zinc-500 text-sm mb-6">{{ 'TEAM_MATCHES.SUBTITLE' | translate }}</p>

        @if ((stats()?.upcomingMatches?.length ?? 0) > 0) {
          <div class="space-y-3">
            @for (m of stats()!.upcomingMatches; track m.id) {
              <div class="flex items-center justify-between bg-black-main border border-black-border rounded-xl px-4 py-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 border border-zinc-700 shrink-0">
                    {{ m.opponent.substring(0,2) | uppercase }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-white font-medium truncate">vs {{ m.opponent }}</p>
                    <p class="text-zinc-500 text-xs truncate">{{ m.tournament }}{{ m.venue ? ' · ' + m.venue : '' }}</p>
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-zinc-300 text-sm">{{ m.date | date:'mediumDate' }}</p>
                  <span class="text-xs uppercase tracking-wider font-bold"
                        [ngClass]="m.status === 'live' ? 'text-red-500' : 'text-zinc-500'">{{ m.status }}</span>
                </div>
              </div>
            }
          </div>
        } @else {
          <!-- Empty state -->
          <div class="flex flex-col items-center justify-center py-16 text-center">
            <div class="w-16 h-16 rounded-2xl bg-black-main border border-black-border flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p class="text-zinc-400 font-medium">{{ 'TEAM_MATCHES.EMPTY' | translate }}</p>
            <p class="text-zinc-600 text-sm mt-1">{{ 'TEAM_MATCHES.EMPTY_SUBTITLE' | translate }}</p>
          </div>
        }
      </div>

      <!-- Recent Results -->
      @if ((stats()?.recentMatches?.length ?? 0) > 0) {
        <div class="bg-black-card border border-black-border rounded-xl p-6">
          <h2 class="text-xl font-bold text-white mb-4">{{ 'TEAM_OVERVIEW.RECENT_MATCHES.TITLE' | translate }}</h2>
          <div class="space-y-3">
            @for (m of stats()!.recentMatches; track m.id) {
              <div class="flex items-center justify-between bg-black-main border border-black-border rounded-xl px-4 py-3">
                <div class="flex items-center gap-3 min-w-0">
                  <span class="px-2.5 py-1 rounded-md text-xs font-bold"
                        [ngClass]="{
                          'bg-green-500/10 text-green-500': m.result === 'W',
                          'bg-zinc-500/10 text-zinc-400': m.result === 'D',
                          'bg-red-500/10 text-red-500': m.result === 'L'
                        }">{{ m.result }}</span>
                  <div class="min-w-0">
                    <p class="text-white font-medium truncate">vs {{ m.opponent }}</p>
                    <p class="text-zinc-500 text-xs truncate">{{ m.tournament }}</p>
                  </div>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-white font-bold">{{ m.score }}</p>
                  <p class="text-zinc-500 text-xs">{{ m.date | date:'mediumDate' }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class TeamMatchesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private teamService = inject(TeamService);

  stats = signal<TeamStats | null>(null);

  ngOnInit() {
    const teamId = this.route.parent?.snapshot.paramMap.get('id');
    if (!teamId) return;
    this.teamService.getStats(teamId).subscribe({
      next: (data) => this.stats.set(data),
      error: () => this.stats.set(null)
    });
  }
}
