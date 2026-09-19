import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-match-info',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './match-info.component.html'
})
export class MatchInfoComponent {
    @Input() match: any;
    @Input() homeLineup: any;
    @Input() awayLineup: any;

    get refereeName(): string {
        const m = this.match;
        if (!m) return '';
        if (typeof m.referees === 'string' && m.referees.trim()) return m.referees.trim();
        if (m.referees && typeof m.referees === 'object') {
            if (m.referees.main && String(m.referees.main).trim()) return String(m.referees.main).trim();
            if (m.referees.name && String(m.referees.name).trim()) return String(m.referees.name).trim();
        }
        if (m.matchReferees && String(m.matchReferees).trim()) return String(m.matchReferees).trim();
        const pool = m.tournament?.referees;
        if (Array.isArray(pool) && pool.length > 0 && pool[0]?.name?.trim()) {
            return pool[0].name.trim();
        }
        return '';
    }

    get assistant1Name(): string {
        const m = this.match;
        if (!m) return '';
        if (m.referees && typeof m.referees === 'object' && m.referees.assistant1 && String(m.referees.assistant1).trim()) {
            return String(m.referees.assistant1).trim();
        }
        const pool = m.tournament?.referees;
        if (Array.isArray(pool) && pool.length > 1 && pool[1]?.name?.trim()) {
            return pool[1].name.trim();
        }
        return '';
    }

    get assistant2Name(): string {
        const m = this.match;
        if (!m) return '';
        if (m.referees && typeof m.referees === 'object' && m.referees.assistant2 && String(m.referees.assistant2).trim()) {
            return String(m.referees.assistant2).trim();
        }
        const pool = m.tournament?.referees;
        if (Array.isArray(pool) && pool.length > 2 && pool[2]?.name?.trim()) {
            return pool[2].name.trim();
        }
        return '';
    }

    get fourthOfficialName(): string {
        const m = this.match;
        if (!m) return '';
        if (m.referees && typeof m.referees === 'object' && m.referees.fourthOfficial && String(m.referees.fourthOfficial).trim()) {
            return String(m.referees.fourthOfficial).trim();
        }
        const pool = m.tournament?.referees;
        if (Array.isArray(pool) && pool.length > 3 && pool[3]?.name?.trim()) {
            return pool[3].name.trim();
        }
        return '';
    }
}
