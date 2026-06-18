import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { NoAuthGuard } from './auth/no-auth.guard';
import { PermissionGuard } from './auth/permission.guard';
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
        canActivate: [NoAuthGuard],
        loadComponent: () => import('./public/landing/components/premium-landing/premium-landing.component').then(m => m.PremiumLandingComponent)
    },
    {
        path: '',
        canActivate: [NoAuthGuard],
        loadComponent: () => import('./public/landing/components/premium-landing/premium-landing.component').then(m => m.PremiumLandingComponent)
    },
    {
        path: 'login',
        canActivate: [NoAuthGuard],
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        canActivate: [NoAuthGuard],
        loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'otp',
        canActivate: [NoAuthGuard],
        loadComponent: () => import('./auth/otp/otp.component').then(m => m.OtpComponent)
    },
    {
        path: 'forgot-password',
        canActivate: [NoAuthGuard],
        loadComponent: () => import('./auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
    },
    {
        path: 'reset-password',
        canActivate: [NoAuthGuard],
        loadComponent: () => import('./auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
    },
    {
        path: 'admin',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                canActivate: [PermissionGuard],
                data: { permission: 'can_dashboard' },
                loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'tournaments',
                canActivate: [PermissionGuard],
                data: { permission: 'can_tournaments' },
                loadComponent: () => import('./tournament/tournament.component').then(m => m.TournamentComponent)
            },
            {
                path: 'tournaments/:id',
                canActivate: [PermissionGuard],
                data: { permission: 'can_tournaments' },
                loadComponent: () => import('./tournament-dashboard/tournament-dashboard.component').then(m => m.TournamentDashboardComponent)
            },
            {
                path: 'tournaments/:id/match-center',
                canActivate: [PermissionGuard],
                data: { permission: 'can_tournaments' },
                loadComponent: () => import('./tournament-dashboard/components/match-center/match-center.component').then(m => m.MatchCenterComponent)
            },
            {
                path: 'tournaments/:id/matches/:matchId',
                canActivate: [PermissionGuard],
                data: { permission: 'can_tournaments' },
                loadComponent: () => import('./tournament-dashboard/components/match-details/match-details.component').then(m => m.MatchDetailsComponent)
            },
            {
                // Deep-link a dashboard tab by path, e.g. tournaments/:id/matches.
                // Kept after the literal routes above so they continue to win.
                path: 'tournaments/:id/:tab',
                canActivate: [PermissionGuard],
                data: { permission: 'can_tournaments' },
                loadComponent: () => import('./tournament-dashboard/tournament-dashboard.component').then(m => m.TournamentDashboardComponent)
            },
            {
                path: 'teams',
                canActivate: [PermissionGuard],
                data: { permission: 'can_teams' },
                loadComponent: () => import('./teams/teams.component').then(m => m.TeamsComponent)
            },
            {
                path: 'teams/:id',
                canActivate: [PermissionGuard],
                data: { permission: 'can_teams' },
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
                canActivate: [PermissionGuard],
                data: { permission: 'can_settings' },
                loadChildren: () => import('./settings/settings.routes').then(m => m.SETTINGS_ROUTES)
            }
        ]
    },

    // Legal / Info Pages
    {
        path: 'privacy',
        loadComponent: () => import('./public/legal/privacy/privacy.component').then(m => m.PrivacyComponent)
    },
    {
        path: 'terms',
        loadComponent: () => import('./public/legal/terms/terms.component').then(m => m.TermsComponent)
    },
    {
        path: 'cookie',
        loadComponent: () => import('./public/legal/cookie/cookie.component').then(m => m.CookieComponent)
    },
    {
        path: 'support',
        loadComponent: () => import('./public/legal/support/support.component').then(m => m.SupportComponent)
    },

    // Error Pages
    {
        path: '500',
        loadComponent: () => import('./public/errors/server-error/server-error.component').then(m => m.ServerErrorComponent)
    },
    {
        path: '**',
        loadComponent: () => import('./public/errors/not-found/not-found.component').then(m => m.NotFoundComponent)
    }
];
