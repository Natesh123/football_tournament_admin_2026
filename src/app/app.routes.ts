import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'tournaments',
                loadComponent: () => import('./tournament/tournament.component').then(m => m.TournamentComponent)
            },
            {
                path: 'tournaments/:id',
                loadComponent: () => import('./tournament-dashboard/tournament-dashboard.component').then(m => m.TournamentDashboardComponent)
            },
            {
                path: 'teams',
                loadComponent: () => import('./teams/teams.component').then(m => m.TeamsComponent)
            },
            {
                path: 'teams/:id',
                loadComponent: () => import('./teams/team-layout.component').then(m => m.TeamLayoutComponent),
                children: [
                    { path: '', redirectTo: 'overview', pathMatch: 'full' },
                    { path: 'overview', loadComponent: () => import('./teams/components/team-overview/team-overview.component').then(m => m.TeamOverviewComponent) },
                    { path: 'members', loadComponent: () => import('./teams/components/team-members/team-members.component').then(m => m.TeamMembersComponent) },
                    { path: 'matches', loadComponent: () => import('./teams/components/team-matches/team-matches.component').then(m => m.TeamMatchesComponent) },
                    { path: 'statistics', loadComponent: () => import('./teams/components/team-statistics/team-statistics.component').then(m => m.TeamStatisticsComponent) },
                    { path: 'gallery', loadComponent: () => import('./teams/components/team-gallery/team-gallery.component').then(m => m.TeamGalleryComponent) }
                ]
            },
            {
                path: 'settings',
                loadChildren: () => import('./settings/settings.routes').then(m => m.SETTINGS_ROUTES)
            }
        ]
    },

    // { path: 'auth', loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule) },
    // { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];
