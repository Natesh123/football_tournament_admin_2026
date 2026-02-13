import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
    selector: 'app-top-bar',
    standalone: true,
    imports: [CommonModule, TranslateModule, RouterLink, RouterLinkActive],
    templateUrl: './top-bar.component.html'
})
export class TopBarComponent {
    private translate = inject(TranslateService);
    private router = inject(Router);

    currentLang = signal('en');
    isDropdownOpen = signal(false);



    languages = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'de', label: 'German', flag: '🇩🇪' },
        { code: 'fr', label: 'French', flag: '🇫🇷' },
        { code: 'es', label: 'Spanish', flag: '🇪🇸' }
    ];

    constructor() {
        this.translate.setDefaultLang('en');
        this.translate.use('en');
    }

    setLang(event: Event) {
        const lang = (event.target as HTMLSelectElement).value;
        this.currentLang.set(lang);
        this.translate.use(lang);
    }

    toggleDropdown() {
        this.isDropdownOpen.update(v => !v);
    }
}
