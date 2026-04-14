import { Component, inject, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterModule, TranslateModule],
    templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit, OnDestroy {
    private translate = inject(TranslateService);
    private cdr = inject(ChangeDetectorRef);
    private langSub?: Subscription;

    ngOnInit() {
        // With zoneless CD, force re-check when language changes so translate pipes update
        this.langSub = this.translate.onLangChange.subscribe(() => {
            this.cdr.markForCheck();
        });
    }

    ngOnDestroy() {
        this.langSub?.unsubscribe();
    }
}
