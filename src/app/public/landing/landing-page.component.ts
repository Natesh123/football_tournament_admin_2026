import { Component, OnInit, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutTournamentComponent } from './components/about/about.component';
import { MatchScheduleComponent } from './components/match-schedule/match-schedule.component';
import { RegistrationFormComponent } from './components/registration-form/registration-form.component';
import { SponsorBannersComponent } from './components/sponsor-banners/sponsor-banners.component';
import { FooterComponent } from './components/footer/footer.component';
import { MobilePromoComponent } from './components/mobile-promo/mobile-promo.component';
import { ScrollRevealDirective } from './directives/scroll-reveal.directive';
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
        FooterComponent,
        MobilePromoComponent,
        ScrollRevealDirective
    ],
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private dataService = inject(PublicDataService);
    public ui = inject(UiService);

    portalData = signal<PortalData | undefined>(undefined);
    isSubmitting = signal(false);
    showSuccess = signal(false);
    defaultTournamentId = 1;
    
    scrollProgress = signal(0);
    private scrollHandler: (() => void) | null = null;

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
        
        this.initScrollProgress();
        this.initSmoothScroll();
    }
    
    private initScrollProgress() {
        this.scrollHandler = () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            this.scrollProgress.set(scrolled);
        };
        
        window.addEventListener('scroll', this.scrollHandler, { passive: true });
    }
    
    private initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e: Event) => {
                e.preventDefault();
                const targetId = (anchor as HTMLAnchorElement).getAttribute('href')?.substring(1);
                if (targetId) {
                    const element = document.getElementById(targetId);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
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

        this.dataService.registerTeam(tournamentId, formData).subscribe({
            next: (team) => {
                this.dataService.addTeamToTournament(tournamentId, team.id).subscribe({
                    next: () => {
                        this.isSubmitting.set(false);
                        this.showSuccess.set(true);
                        this.ui.showToast('Registration successful!', 'success');
                        this.fetchPortalData(tournamentId);
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
    
    ngOnDestroy() {
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
        }
    }
}
