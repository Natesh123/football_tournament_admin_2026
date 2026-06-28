import { Injectable, signal } from '@angular/core';
import Swal from 'sweetalert2';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  text: string;
  type: ToastType;
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

  showToast(text: string, type: ToastType = 'success') {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#1a1a1a',
      color: '#ffffff',
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    if (type === 'error') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: text,
        confirmButtonColor: '#FBBF24',
        background: '#1a1a1a',
        color: '#ffffff',
        customClass: {
          popup: 'border border-gold-400/20 shadow-[0_0_20px_rgba(251,191,36,0.1)] rounded-xl',
          confirmButton: 'text-black font-bold uppercase tracking-widest'
        }
      });
    } else if (type === 'success') {
      Toast.fire({
        icon: 'success',
        title: text
      });
    } else if (type === 'warning') {
      Toast.fire({
        icon: 'warning',
        title: text
      });
    } else {
      Toast.fire({
        icon: 'info',
        title: text
      });
    }
  }

  confirmAction(title: string, text: string, confirmText: string = 'Yes, delete it!'): Promise<boolean> {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#27272a',
      confirmButtonText: confirmText,
      cancelButtonText: 'Cancel',
      background: '#1a1a1a',
      color: '#ffffff',
      customClass: {
        popup: 'border border-gold-400/20 shadow-[0_0_30px_rgba(251,191,36,0.15)] rounded-2xl',
        confirmButton: 'font-bold uppercase tracking-widest text-sm px-6 py-2.5 rounded-lg border border-red-500/20',
        cancelButton: 'font-bold uppercase tracking-widest text-sm px-6 py-2.5 rounded-lg text-zinc-300 hover:bg-zinc-700'
      }
    }).then((result) => result.isConfirmed);
  }
}
