import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

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
}
