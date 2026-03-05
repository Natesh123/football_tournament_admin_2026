import { Component, Input, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-tournament-general',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tournament-general.component.html'
})
export class TournamentGeneralComponent {
    @Input() data!: any;
    private cdr = inject(ChangeDetectorRef);

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
        return `${environment.apiBaseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    }
}
