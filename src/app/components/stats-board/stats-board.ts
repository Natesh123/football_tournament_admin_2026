import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-board.html',
  styleUrl: './stats-board.css',
})
export class StatsBoard {
  @Input() platformStats: any[] = [];
  @Input() activityStats: any[] = [];
  @Input() showAllSections: boolean = true;
}
