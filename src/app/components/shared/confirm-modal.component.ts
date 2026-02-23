import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirm-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div *ngIf="show" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div class="bg-black-card border-2 border-gold-400/30 rounded-2xl w-full max-w-md shadow-[0_0_50px_rgba(251,191,36,0.15)] overflow-hidden animate-in zoom-in-95 duration-200">
        <!-- Header -->
        <div class="p-6 border-b border-gold-400/10 flex items-center space-x-4">
          <div class="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">{{ title }}</h3>
            <p class="text-zinc-400 text-sm mt-1">{{ message }}</p>
          </div>
        </div>
        
        <!-- Footer Actions -->
        <div class="p-4 bg-white/[0.02] flex items-center justify-end space-x-3">
          <button 
            (click)="onCancel.emit()" 
            class="px-6 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest"
          >
            Cancel
          </button>
          <button 
            (click)="onConfirm.emit()" 
            class="px-8 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-black uppercase tracking-widest shadow-lg shadow-red-500/20 active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmModalComponent {
    @Input() show = false;
    @Input() title = 'Confirm Action';
    @Input() message = 'Are you sure you want to proceed?';

    @Output() onConfirm = new EventEmitter<void>();
    @Output() onCancel = new EventEmitter<void>();
}
