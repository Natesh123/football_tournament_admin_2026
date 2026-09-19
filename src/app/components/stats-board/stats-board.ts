import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stats-board',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './stats-board.html',
  styleUrl: './stats-board.css',
})
export class StatsBoard {
  @Input() platformStats: any[] = [];
  @Input() activityStats: any[] = [];
  @Input() showAllSections: boolean = true;
  private router = inject(Router);

  navigateTo(stat: any) {
    if (stat?.value === 0 || stat?.value === '0' || stat?.value === '—') {
        return;
    }
    if (stat?.route) {
        this.router.navigate([stat.route], { queryParams: stat.queryParams || {} });
    }
  }
}
