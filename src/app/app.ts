import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('football_tournament_admin_2026');

  constructor(private auth: AuthService) {
    const token = localStorage.getItem('token');
    if (token) {
      this.auth.validateToken(token).subscribe({
        next: (res: any) => {
          if (res.valid && res.user) {
            this.auth.setAuthenticatedUser(res.user, token);
          }
        },
        error: () => {
          this.auth.logout();
        }
      });
    }
  }
}
