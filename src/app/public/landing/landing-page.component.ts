import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutTournamentComponent } from './components/about/about.component';
import { MatchScheduleComponent } from './components/match-schedule/match-schedule.component';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { SponsorBannersComponent } from './components/sponsor-banners/sponsor-banners.component';
import { FooterComponent } from './components/footer/footer.component';
import { PublicDataService } from '../../services/public-data.service';
import { PortalData } from '../../models/portal.model';
import { UiService } from '../../services/ui.service';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [
        CommonModule,
        NavbarComponent,
        HeroComponent,
        AboutTournamentComponent,
        MatchScheduleComponent,
        RegistrationFormComponent,
        SponsorBannersComponent,
        FooterComponent
    ],
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private dataService = inject(PublicDataService);
    public ui = inject(UiService);

    portalData = signal<PortalData | undefined>(undefined);
    isSubmitting = signal(false);
    showSuccess = signal(false);
    defaultTournamentId = 1;

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.fetchPortalData(parseInt(id, 10));
            } else {
                this.dataService.getLatestTournamentId().subscribe({
                    next: (latestId) => {
                        this.fetchPortalData(latestId);
                    },
                    error: (err) => {
                        console.error('Error fetching latest tournament:', err);
                        this.fetchPortalData(this.defaultTournamentId);
                    }
                });
            }
        });
    }

    fetchPortalData(tournamentId: number) {
        this.dataService.getPortalData(tournamentId).subscribe({
            next: (data) => {
                this.portalData.set(data);
            },
            error: (err) => {
                console.error('Error fetching portal data:', err);
                this.ui.showToast('Failed to load tournament data.', 'error');
            }
        });
    }

    handleRegistration(formData: any) {
        const tournamentId = this.portalData()?.tournament?.id || this.defaultTournamentId;
        this.isSubmitting.set(true);

        // Step 1: Register Team
        this.dataService.registerTeam(tournamentId, formData).subscribe({
            next: (team) => {
                // Step 2: Add Team to Tournament
                this.dataService.addTeamToTournament(tournamentId, team.id).subscribe({
                    next: () => {
                        this.isSubmitting.set(false);
                        this.showSuccess.set(true);
                        this.ui.showToast('Registration successful!', 'success');
                        this.fetchPortalData(tournamentId); // Refresh data
                        setTimeout(() => this.showSuccess.set(false), 5000);
                    },
                    error: (err) => {
                        console.error('Error linking team to tournament:', err);
                        this.ui.showToast('Team registered but failed to join tournament.', 'info');
                        this.isSubmitting.set(false);
                    }
                });
            },
            error: (err) => {
                console.error('Error registering team:', err);
                this.ui.showToast('Failed to register team.', 'error');
                this.isSubmitting.set(false);
            }
        });
    }
}
