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
                path: 'settings',
                loadChildren: () => import('./settings/settings.routes').then(m => m.SETTINGS_ROUTES)
            }
        ]
    },

    // { path: 'auth', loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule) },
    // { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' }
];
