import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-match-feed',
    standalone: true,
    imports: [CommonModule, LoaderComponent, TranslateModule],
    templateUrl: './match-feed.component.html'
})
export class MatchFeedComponent implements OnInit {
    isLoading = signal(true);
    currentTab = signal<'live' | 'upcoming' | 'past'>('live');

    ngOnInit() {
        setTimeout(() => {
            this.isLoading.set(false);
        }, 3000);
    }

    upcomingMatches = [
        {
            id: 1,
            date: 'FRI 22 OCT',
            time: '21:00',
            homeTeam: 'Berlin Giants',
            awayTeam: 'Turin United',
            homeLogo: '',
            awayLogo: '',
            venue: 'Olympiastadion'
        },
        {
            id: 2,
            date: 'SAT 23 OCT',
            time: '15:30',
            homeTeam: 'Amsterdam XI',
            awayTeam: 'Lisbon Stars',
            homeLogo: '',
            awayLogo: '',
            venue: 'Johan Cruijff Arena'
        },
        {
            id: 6,
            date: 'SAT 23 OCT',
            time: '19:45',
            homeTeam: 'London Lions',
            awayTeam: 'Liverpool Reds',
            homeLogo: '',
            awayLogo: '',
            venue: 'Wembley Stadium'
        },
        {
            id: 7,
            date: 'SAT 23 OCT',
            time: '21:00',
            homeTeam: 'Milan Rossoneri',
            awayTeam: 'Inter Nerazzurri',
            homeLogo: '',
            awayLogo: '',
            venue: 'San Siro'
        },
        {
            id: 3,
            date: 'SUN 24 OCT',
            time: '18:00',
            homeTeam: 'Roma FC',
            awayTeam: 'Napoli Blue',
            homeLogo: '',
            awayLogo: '',
            venue: 'Stadio Olimpico'
        }
    ];

    pastMatches = [
        {
            id: 4,
            date: 'SAT 16 OCT',
            homeTeam: 'Manchester Red',
            awayTeam: 'City Blue',
            score: '1 - 3',
            status: 'FT',
            venue: 'Old Trafford',
            winner: 'City Blue'
        },
        {
            id: 5,
            date: 'SUN 17 OCT',
            homeTeam: 'Madrid CF',
            awayTeam: 'Barcelona SC',
            score: '2 - 2',
            status: 'FT',
            venue: 'Santiago Bernabéu',
            winner: 'Draw'
        }
    ];

    get upcomingMatchesGrouped() {
        return this.groupByDate(this.upcomingMatches);
    }

    get pastMatchesGrouped() {
        return this.groupByDate(this.pastMatches);
    }

    private groupByDate(matches: any[]) {
        const groups: { date: string; matches: any[] }[] = [];
        matches.forEach(match => {
            const date = match.date;
            let group = groups.find(g => g.date === date);
            if (!group) {
                group = { date, matches: [] };
                groups.push(group);
            }
            group.matches.push(match);
        });
        return groups;
    }

    switchTab(tab: 'live' | 'upcoming' | 'past') {
        this.currentTab.set(tab);
    }
}
