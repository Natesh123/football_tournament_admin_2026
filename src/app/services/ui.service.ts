import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class UiService {
  isLoadingAction = signal(false);
  toastMessage = signal<ToastMessage | null>(null);

  startAction() {
    this.isLoadingAction.set(true);
  }

  endAction() {
    this.isLoadingAction.set(false);
  }

  showToast(text: string, type: 'success' | 'error' | 'info' = 'success') {
    this.toastMessage.set({ text, type });
    setTimeout(() => {
        if (this.toastMessage()?.text === text) {
            this.toastMessage.set(null);
        }
    }, 4000);
  }
}
