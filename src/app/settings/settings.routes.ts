import { Routes } from '@angular/router';
import { SettingsLayoutComponent } from './settings-layout.component';
import { RolesComponent } from './components/roles/roles.component';
import { UsersComponent } from './components/users/users.component';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { SponsorsComponent } from './components/sponsors/sponsors.component';

export const SETTINGS_ROUTES: Routes = [
    {
        path: '',
        component: SettingsLayoutComponent,
        children: [
            { path: '', redirectTo: 'roles', pathMatch: 'full' },
            { path: 'roles', component: RolesComponent },
            { path: 'users', component: UsersComponent },
            { path: 'permissions', component: PermissionsComponent },
            { path: 'sponsors', component: SponsorsComponent }
        ]
    }
];
