import { Component, Input, ChangeDetectorRef, inject, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { API_URL } from '../../../core/config/app.config';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-tournament-general',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule
    ],
    templateUrl: './tournament-general.component.html'
})
export class TournamentGeneralComponent {
    private translate = inject(TranslateService);
    @Input() data: any;
    private cdr = inject(ChangeDetectorRef);

    availableSponsors = [
        'Nike', 'Adidas', 'Puma', 'Under Armour', 'Red Bull',
        'Qatar Airways', 'Emirates', 'Heineken', 'Coca-Cola',
        'Pepsi', 'Visa', 'Mastercard', 'Local Partner'
    ];

    sponsorDropdownOpen = false;
    sponsorSearchQuery = '';

    @ViewChild('sponsorDropdown') sponsorDropdown!: ElementRef;

    @HostListener('document:click', ['$event'])
    onClickOutside(event: Event) {
        if (this.sponsorDropdownOpen && this.sponsorDropdown && !this.sponsorDropdown.nativeElement.contains(event.target)) {
            this.sponsorDropdownOpen = false;
            this.cdr.detectChanges();
        }
    }

    get filteredSponsors() {
        if (!this.sponsorSearchQuery) return this.availableSponsors;
        const q = this.sponsorSearchQuery.toLowerCase();
        return this.availableSponsors.filter(s => s.toLowerCase().includes(q));
    }

    toggleSponsor(sponsor: string) {
        if (!this.data.sponsors) this.data.sponsors = [];
        const index = this.data.sponsors.indexOf(sponsor);
        if (index === -1) {
            this.data.sponsors.push(sponsor);
        } else {
            this.data.sponsors.splice(index, 1);
        }
        this.cdr.detectChanges();
    }

    onFileSelected(event: any, field: 'logo' | 'coverImage') {
        const input = event.target;
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.data[field] = e.target.result;
                this.cdr.detectChanges(); // Required for Zoneless
            };
            reader.readAsDataURL(file);
        }

        // Reset the input value so the same file can be selected again if removed
        input.value = '';
    }

    removeImage(field: 'logo' | 'coverImage', event: Event) {
        event.stopPropagation();
        this.data[field] = '';
        this.cdr.detectChanges(); // Required for Zoneless
    }

    getImageUrl(path?: string): string {
        if (!path) return '';
        if (path.startsWith('http') || path.startsWith('data:')) return path;
        return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
    }
}
