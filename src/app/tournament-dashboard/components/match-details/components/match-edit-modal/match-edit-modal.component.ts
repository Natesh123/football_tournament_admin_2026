import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UiService } from '../../../../../services/ui.service';

@Component({
    selector: 'app-match-edit-modal',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule],
    templateUrl: './match-edit-modal.component.html'
})
export class MatchEditModalComponent implements OnInit {
    private ui = inject(UiService);
    @Input() isOpen = false;
    @Input() match: any;

    @Output() close = new EventEmitter<void>();
    @Output() save = new EventEmitter<any>();

    formData: any = {
        startTime: '',
        venue: '',
        status: 'scheduled',
        matchReferees: ''
    };

    isSubmitting = false;

    ngOnInit() {
        if (this.match) {
            // strip away potential microseconds or seconds, keep to exact precision needed by step="60" inputs
            let dateStr = this.match.startTime;
            if (dateStr) {
                const dateObj = new Date(dateStr);
                // Adjust for local timezone offset when assigning to datetime-local
                const shift = dateObj.getTime() - dateObj.getTimezoneOffset() * 60000;
                dateStr = new Date(shift).toISOString().slice(0, 16);
            }

            this.formData = {
                startTime: dateStr || '',
                venue: this.match.venue || '',
                status: this.match.status || 'scheduled',
                matchReferees: this.match.matchReferees || ''
            };
        }
    }

    onClose() {
        this.close.emit();
    }

    onSubmit() {
        if (!this.formData.startTime) {
            this.ui.showToast('Please select a start time for the match.', 'error');
            return;
        }

        this.isSubmitting = true;
        // Convert local time back to UTC string format before saving
        const localDate = new Date(this.formData.startTime);
        const dataToSave = {
            ...this.formData,
            startTime: localDate.toISOString()
        };

        this.save.emit(dataToSave);
    }
}
