import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TeamService } from '../../team.service';

@Component({
  selector: 'app-team-gallery',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="space-y-6">
      <div class="bg-black-card border border-black-border rounded-xl p-6">

        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-xl font-bold text-white mb-1">{{ 'TEAM_GALLERY.TITLE' | translate }}</h2>
            <p class="text-zinc-500 text-sm">
              @if (photos().length > 0) { {{ photos().length }} photo{{ photos().length === 1 ? '' : 's' }} · stored in <code class="text-gold-400 text-xs">teams/{{ teamId }}/gallery/</code> }
              @else { Upload photos to build the team gallery. }
            </p>
          </div>
          <label class="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400/10 text-gold-400 border border-gold-400/30 hover:bg-gold-400/20 transition-all text-sm font-medium cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            @if (isUploading()) { {{ 'TEAM_GALLERY.UPLOADING' | translate }} } @else { {{ 'TEAM_GALLERY.UPLOAD' | translate }} }
            <input #fileInput type="file" accept="image/*" multiple class="hidden"
                   [disabled]="isUploading()"
                   (change)="onFilesSelected($event)">
          </label>
        </div>

        <!-- Upload error/success toast -->
        @if (toast()) {
          <div class="mb-4 px-4 py-3 rounded-lg text-sm font-medium"
               [ngClass]="toast()!.type === 'success'
                 ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                 : 'bg-red-500/10 text-red-400 border border-red-500/20'">
            {{ toast()!.message }}
          </div>
        }

        <!-- Loading -->
        @if (isLoading()) {
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            @for (_ of [1,2,3,4,5,6]; track $index) {
              <div class="aspect-square rounded-xl bg-black-main border border-black-border animate-pulse"></div>
            }
          </div>
        }

        <!-- Photo Grid -->
        @else if (photos().length > 0) {
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            @for (photo of photos(); track photo) {
              <div class="group relative aspect-square rounded-xl overflow-hidden border border-black-border bg-black-main cursor-pointer"
                   (click)="openLightbox(photo)">
                <img [src]="fullUrl(photo)" [alt]="fileName(photo)"
                     class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                     loading="lazy">
                <!-- Hover overlay -->
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
                  <span class="text-white text-xs truncate">{{ fileName(photo) }}</span>
                </div>
                <!-- Delete button -->
                <button class="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        (click)="deletePhoto(photo, $event)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            }
          </div>
        }

        <!-- Empty state -->
        @else {
          <div class="flex flex-col items-center justify-center py-16 text-center border border-dashed border-black-border rounded-xl">
            <div class="w-16 h-16 rounded-2xl bg-black-main border border-black-border flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p class="text-zinc-400 font-medium">{{ 'TEAM_GALLERY.EMPTY' | translate }}</p>
            <p class="text-zinc-600 text-sm mt-1">{{ 'TEAM_GALLERY.EMPTY_SUBTITLE' | translate }}</p>
          </div>
        }
      </div>
    </div>

    <!-- Lightbox -->
    @if (lightboxSrc()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
           (click)="closeLightbox()">
        <button class="absolute top-4 right-4 text-white/60 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
        <img [src]="lightboxSrc()!" alt="Gallery photo"
             class="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
             (click)="$event.stopPropagation()">
      </div>
    }
    `
})
export class TeamGalleryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private teamService = inject(TeamService);

  teamId = this.route.parent?.snapshot.paramMap.get('id') ?? '';

  photos = signal<string[]>([]);
  isLoading = signal(true);
  isUploading = signal(false);
  lightboxSrc = signal<string | null>(null);
  toast = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  ngOnInit() {
    this.loadGallery();
  }

  loadGallery() {
    this.isLoading.set(true);
    this.teamService.getGallery(this.teamId).subscribe({
      next: (res) => {
        this.photos.set(res.photos);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    if (!files.length) return;

    this.isUploading.set(true);
    this.teamService.uploadGallery(this.teamId, files).subscribe({
      next: (res) => {
        this.photos.update(prev => [...prev, ...res.photos]);
        this.showToast('success', `${res.uploaded} photo${res.uploaded === 1 ? '' : 's'} uploaded successfully`);
        this.isUploading.set(false);
        input.value = '';
      },
      error: (err) => {
        this.showToast('error', err?.error?.message ?? 'Upload failed. Please try again.');
        this.isUploading.set(false);
      }
    });
  }

  deletePhoto(photo: string, event: MouseEvent) {
    event.stopPropagation();
    const name = this.fileName(photo);
    if (!confirm(`Delete "${name}"?`)) return;
    this.teamService.deleteGalleryPhoto(this.teamId, name).subscribe({
      next: () => this.photos.update(prev => prev.filter(p => p !== photo)),
      error: () => this.showToast('error', 'Failed to delete photo.')
    });
  }

  openLightbox(photo: string) { this.lightboxSrc.set(this.fullUrl(photo)); }
  closeLightbox() { this.lightboxSrc.set(null); }

  fullUrl(path: string): string {
    return path.startsWith('/uploads') ? `${this.teamService.BASE_URL}${path}` : path;
  }

  fileName(path: string): string {
    return path.split('/').pop() ?? path;
  }

  private showToast(type: 'success' | 'error', message: string) {
    this.toast.set({ type, message });
    setTimeout(() => this.toast.set(null), 4000);
  }
}
