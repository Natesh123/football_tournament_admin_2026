import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-team-statistics',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="space-y-6">
      <div class="bg-black-card border border-black-border rounded-xl p-6">
        <h2 class="text-xl font-bold text-white mb-1">{{ 'TEAM_STATISTICS.TITLE' | translate }}</h2>
        <p class="text-zinc-500 text-sm mb-6">{{ 'TEAM_STATISTICS.SUBTITLE' | translate }}</p>

        <!-- Stat Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-black-main border border-black-border rounded-xl p-4 flex flex-col gap-1">
            <span class="text-zinc-500 text-xs uppercase tracking-wider">{{ 'TEAM_STATISTICS.STATS.PLAYED' | translate }}</span>
            <span class="text-2xl font-bold text-white">0</span>
          </div>
          <div class="bg-black-main border border-black-border rounded-xl p-4 flex flex-col gap-1">
            <span class="text-zinc-500 text-xs uppercase tracking-wider">{{ 'TEAM_STATISTICS.STATS.WINS' | translate }}</span>
            <span class="text-2xl font-bold text-white">0</span>
          </div>
          <div class="bg-black-main border border-black-border rounded-xl p-4 flex flex-col gap-1">
            <span class="text-zinc-500 text-xs uppercase tracking-wider">{{ 'TEAM_STATISTICS.STATS.DRAWS' | translate }}</span>
            <span class="text-2xl font-bold text-white">0</span>
          </div>
          <div class="bg-black-main border border-black-border rounded-xl p-4 flex flex-col gap-1">
            <span class="text-zinc-500 text-xs uppercase tracking-wider">{{ 'TEAM_STATISTICS.STATS.LOSSES' | translate }}</span>
            <span class="text-2xl font-bold text-white">0</span>
          </div>
        </div>

        <!-- Empty chart area -->
        <div class="flex flex-col items-center justify-center py-12 text-center border border-dashed border-black-border rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-zinc-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p class="text-zinc-400 font-medium">{{ 'TEAM_STATISTICS.EMPTY' | translate }}</p>
          <p class="text-zinc-600 text-sm mt-1">{{ 'TEAM_STATISTICS.EMPTY_SUBTITLE' | translate }}</p>
        </div>
      </div>
    </div>
  `
})
export class TeamStatisticsComponent { }
