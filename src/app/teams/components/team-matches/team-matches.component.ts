import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-team-matches',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="space-y-6">
      <div class="bg-black-card border border-black-border rounded-xl p-6">
        <h2 class="text-xl font-bold text-white mb-1">{{ 'TEAM_MATCHES.TITLE' | translate }}</h2>
        <p class="text-zinc-500 text-sm mb-6">{{ 'TEAM_MATCHES.SUBTITLE' | translate }}</p>

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
      </div>
    </div>
  `
})
export class TeamMatchesComponent { }
