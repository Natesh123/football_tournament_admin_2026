import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-tournament-finance',
    standalone: true,
    // FormsModule kept for the prize-distribution array (ngModel); ReactiveForms for the validated income card.
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
    templateUrl: './tournament-finance.component.html'
})
export class TournamentFinanceComponent implements OnInit, OnChanges {
    @Input() data!: any;
    /** Base entry fee set in the Participation step — the single source of truth for the registration fee. */
    @Input() baseEntryFee?: number;
    @Output() formReady = new EventEmitter<FormGroup>();

    private fb = inject(FormBuilder);
    form!: FormGroup;

    ngOnInit() {
        if (!this.data.prizeDistribution) {
            this.data.prizeDistribution = [0, 0, 0];
        }
        this.buildForm();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['data'] && this.data) {
            if (!this.data.prizeDistribution) this.data.prizeDistribution = [0, 0, 0];
            this.buildForm();
        } else if (changes['baseEntryFee'] && this.form) {
            // Keep the (read-only) registration fee mirroring the Base Entry Fee.
            this.form.patchValue({ regFee: this.baseEntryFee ?? 0 });
        }
    }

    private buildForm() {
        if (!this.data) return;
        // The registration fee is sourced from the Base Entry Fee (Participation step); it is
        // displayed read-only here so it can't diverge from the single source of truth.
        const regFee = this.baseEntryFee ?? this.data.regFee ?? 0;
        this.form = this.fb.group({
            regFee: [regFee, [Validators.required, Validators.min(0)]],
            paymentMethod: [this.data.paymentMethod || 'bank'],
            paymentInfo: [this.data.paymentInfo || '', [Validators.maxLength(1000)]]
        });
        this.form.valueChanges.subscribe(val => Object.assign(this.data, val));
        this.formReady.emit(this.form);
    }
    
    getTotalDistribution(): number {
        if (!this.data.prizeDistribution) return 0;
        return this.data.prizeDistribution.reduce((a: number, b: number) => a + b, 0);
    }
    
    getRemaining(): number {
        const total = this.data.prizeMoney || 0;
        return Math.max(0, total - this.getTotalDistribution());
    }

    onPrizeChange(index: number) {
        const totalPrize = this.data.prizeMoney || 0;
        let otherSum = 0;
        for (let i = 0; i < this.data.prizeDistribution.length; i++) {
            if (i !== index) {
                otherSum += (this.data.prizeDistribution[i] || 0);
            }
        }
        
        const maxAllowed = Math.max(0, totalPrize - otherSum);
        
        if ((this.data.prizeDistribution[index] || 0) > maxAllowed) {
            setTimeout(() => {
                this.data.prizeDistribution[index] = maxAllowed;
            });
        }
    }

    onTotalPrizeChange() {
        const totalPrize = this.data.prizeMoney || 0;
        let currentSum = this.getTotalDistribution();
        
        if (currentSum > totalPrize) {
            let excess = currentSum - totalPrize;
            for (let i = 2; i >= 0; i--) {
                if (excess <= 0) break;
                
                const currentVal = this.data.prizeDistribution[i] || 0;
                const reduction = Math.min(currentVal, excess);
                
                this.data.prizeDistribution[i] -= reduction;
                excess -= reduction;
            }
        }
    }
}
