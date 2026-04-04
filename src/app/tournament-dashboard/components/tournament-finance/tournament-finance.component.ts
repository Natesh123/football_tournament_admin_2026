import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-tournament-finance',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './tournament-finance.component.html'
})
export class TournamentFinanceComponent implements OnInit {
    @Input() data!: any;

    ngOnInit() {
        if (!this.data.prizeDistribution) {
            this.data.prizeDistribution = [0, 0, 0];
        }
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
