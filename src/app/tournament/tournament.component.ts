import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../components/loader/loader.component';

@Component({
    selector: 'app-tournament',
    standalone: true,
    imports: [CommonModule, LoaderComponent],
    templateUrl: './tournament.component.html',
})
export class TournamentComponent implements OnInit {
    currentTab = signal<'live' | 'upcoming' | 'past' | 'archived'>('live');
    isLoading = signal(true);

    ngOnInit() {
        setTimeout(() => {
            this.isLoading.set(false);
        }, 3000);
    }

    tournaments = [
        {
            id: 1,
            title: 'Champions League - Quarter Finals',
            status: 'LIVE NOW',
            statusClass: 'text-gold border-gold bg-gold/10',
            schedule: 'Oct 12, 2023',
            participants: '32 Elite Teams',
            prizePool: '$2.5M USD',
            currentRound: 'Matchday 3/8',
            image: 'https://cdn.example.com/ucl.jpg',
            tag: 'UCL'
        },
        {
            id: 2,
            title: 'Premier League Summer Cup',
            status: 'MATCH IN PROGRESS',
            statusClass: 'text-gold border-gold bg-gold/10',
            schedule: 'Oct 15, 2023',
            participants: '20 Pro Clubs',
            prizePool: '$800k USD',
            currentRound: 'Group Stage',
            image: 'https://cdn.example.com/epl.jpg',
            tag: 'EPL'
        },
        {
            id: 3,
            title: 'La Liga Youth Series',
            status: 'LIVE',
            statusClass: 'text-gold border-gold bg-gold/10',
            schedule: 'Oct 20, 2023',
            participants: '16 Academies',
            prizePool: 'Exhibition',
            currentRound: 'Semifinals',
            image: 'https://cdn.example.com/laliga.jpg',
            tag: 'LL'
        }
    ];

    upcomingTournaments = [
        {
            id: 4,
            title: 'World Cup Qualifiers 2026',
            status: 'STARTS NOV 15',
            statusClass: 'text-blue-400 border-blue-400 bg-blue-400/10',
            schedule: 'Nov 15, 2026',
            participants: '48 National Teams',
            prizePool: 'Qualification',
            currentRound: 'Group Stage Draw',
            image: 'https://cdn.example.com/wcq.jpg',
            tag: 'WCQ'
        },
        {
            id: 5,
            title: 'Winter League 2026',
            status: 'REGISTRATION OPEN',
            statusClass: 'text-green-400 border-green-400 bg-green-400/10',
            schedule: 'Dec 01, 2026',
            participants: '16 Regional Clubs',
            prizePool: '$150k USD',
            currentRound: 'Pre-Season',
            image: 'https://cdn.example.com/winter.jpg',
            tag: 'WL'
        }
    ];

    pastTournaments = [
        {
            id: 6,
            title: 'Summer Cup 2025',
            status: 'COMPLETED',
            statusClass: 'text-zinc-400 border-zinc-400 bg-zinc-400/10',
            schedule: 'Aug 20, 2025',
            participants: '32 Teams',
            prizePool: '$500k USD',
            currentRound: 'Winner: Madrid Kings',
            image: 'https://cdn.example.com/summer.jpg',
            tag: 'SC'
        },
        {
            id: 7,
            title: 'Euro 2024',
            status: 'COMPLETED',
            statusClass: 'text-zinc-400 border-zinc-400 bg-zinc-400/10',
            schedule: 'Jul 14, 2024',
            participants: '24 National Teams',
            prizePool: '€331M EUR',
            currentRound: 'Winner: Spain',
            image: 'https://cdn.example.com/euro.jpg',
            tag: 'EUR'
        }
    ];

    archivedTournaments = [
        {
            id: 8,
            title: 'Legacy Cup 2020',
            status: 'ARCHIVED',
            statusClass: 'text-zinc-600 border-zinc-600 bg-zinc-600/10',
            schedule: 'Jan 10, 2020',
            participants: '16 Teams',
            prizePool: '$50k USD',
            currentRound: 'Winner: Old Guard',
            image: 'https://cdn.example.com/legacy.jpg',
            tag: 'LC'
        },
        {
            id: 9,
            title: '2019 Season',
            status: 'ARCHIVED',
            statusClass: 'text-zinc-600 border-zinc-600 bg-zinc-600/10',
            schedule: 'May 20, 2019',
            participants: '12 Teams',
            prizePool: '$20k USD',
            currentRound: 'Winner: Pioneers',
            image: 'https://cdn.example.com/2019.jpg',
            tag: 'S19'
        }
    ];

    stats = [
        { label: 'ACTIVE CUPS', value: '24', icon: 'trophy' },
        { label: 'ACTIVE PLAYERS', value: '12,402', icon: 'users' },
        { label: 'GAMES TODAY', value: '156', icon: 'ticket' }
    ];

    get activeTournaments() {
        switch (this.currentTab()) {
            case 'upcoming': return this.upcomingTournaments;
            case 'past': return this.pastTournaments;
            case 'archived': return this.archivedTournaments;
            default: return this.tournaments;
        }
    }

    switchTab(tab: 'live' | 'upcoming' | 'past' | 'archived') {
        this.currentTab.set(tab);
    }
}
