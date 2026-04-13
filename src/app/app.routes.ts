import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: 'public/tournament/:id',
        loadComponent: () => import('./public/tournament-portal/tournament-portal.component').then(m => m.TournamentPortalComponent)
    },
    {
        path: 'public/tournament/:tournamentId/match/:id',
        loadComponent: () => import('./public/match-scoreboard/match-scoreboard.component').then(m => m.MatchScoreboardComponent)
    },
    {
        path: 'landing',
        loadComponent: () => import('./public/landing/landing-page.component').then(m => m.LandingPageComponent)
    },
    {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'admin',
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
                path: 'tournaments/:id/match-center',
                loadComponent: () => import('./tournament-dashboard/components/match-center/match-center.component').then(m => m.MatchCenterComponent)
            },
            {
                path: 'tournaments/:id/matches/:matchId',
                loadComponent: () => import('./tournament-dashboard/components/match-details/match-details.component').then(m => m.MatchDetailsComponent)
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
    { path: '**', redirectTo: '' }
];
