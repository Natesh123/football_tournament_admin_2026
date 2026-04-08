import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-tournament-participants',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule
    ],
    templateUrl: './tournament-participants.component.html'
})
export class TournamentParticipantsComponent {
    private translate = inject(TranslateService);
    @Input() data: any;
}
