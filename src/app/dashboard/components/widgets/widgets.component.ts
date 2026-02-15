import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-widgets',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './widgets.component.html'
})
export class WidgetsComponent {
    standings = [
        {
            pos: 1, team: 'Liverpool', short: 'LIV', played: 24, won: 18, drawn: 4, lost: 2,
            gf: 52, ga: 18, gd: 34, pts: 58, form: ['W', 'W', 'W', 'D', 'W'],
            zone: 'ucl'
        },
        {
            pos: 2, team: 'Man City', short: 'MCI', played: 24, won: 17, drawn: 5, lost: 2,
            gf: 55, ga: 22, gd: 33, pts: 56, form: ['W', 'D', 'W', 'W', 'L'],
            zone: 'ucl'
        },
        {
            pos: 3, team: 'Arsenal', short: 'ARS', played: 24, won: 16, drawn: 4, lost: 4,
            gf: 48, ga: 20, gd: 28, pts: 52, form: ['W', 'W', 'L', 'W', 'D'],
            zone: 'ucl'
        },
        {
            pos: 4, team: 'Aston Villa', short: 'AVL', played: 24, won: 15, drawn: 4, lost: 5,
            gf: 46, ga: 28, gd: 18, pts: 49, form: ['D', 'W', 'W', 'L', 'W'],
            zone: 'ucl'
        },
        {
            pos: 5, team: 'Tottenham', short: 'TOT', played: 24, won: 14, drawn: 3, lost: 7,
            gf: 50, ga: 35, gd: 15, pts: 45, form: ['L', 'W', 'W', 'W', 'D'],
            zone: 'uel'
        },
        {
            pos: 6, team: 'Man United', short: 'MUN', played: 24, won: 12, drawn: 3, lost: 9,
            gf: 34, ga: 32, gd: 2, pts: 39, form: ['L', 'D', 'W', 'L', 'W'],
            zone: ''
        },
    ];

    topScorers = [
        { name: 'Erling Haaland', team: 'Man City', goals: 21, assists: 5, matches: 22 },
        { name: 'Mohamed Salah', team: 'Liverpool', goals: 18, assists: 10, matches: 24 },
        { name: 'Alexander Isak', team: 'Newcastle', goals: 15, assists: 3, matches: 23 },
        { name: 'Ollie Watkins', team: 'Aston Villa', goals: 14, assists: 8, matches: 24 },
    ];

    getFormClass(result: string): string {
        switch (result) {
            case 'W': return 'bg-green-500 text-white';
            case 'D': return 'bg-zinc-500 text-white';
            case 'L': return 'bg-red-500 text-white';
            default: return 'bg-zinc-700 text-zinc-400';
        }
    }

    getZoneClass(zone: string): string {
        switch (zone) {
            case 'ucl': return 'border-l-2 border-l-blue-500';
            case 'uel': return 'border-l-2 border-l-orange-500';
            case 'rel': return 'border-l-2 border-l-red-500';
            default: return 'border-l-2 border-l-transparent';
        }
    }
}
