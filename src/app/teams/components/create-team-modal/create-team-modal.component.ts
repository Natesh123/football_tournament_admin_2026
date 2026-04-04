import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamService } from '../../team.service';

@Component({
  selector: 'app-create-team-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/75 backdrop-blur-sm" (click)="close()"></div>

        <!-- Modal -->
        <div class="relative bg-black-card border border-black-border rounded-2xl w-full max-w-2xl shadow-[0_0_60px_rgba(250,204,21,0.12)] flex flex-col max-h-[90vh]">

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-black-border shrink-0">
            <div>
              <h2 class="text-xl font-bold text-white">Register New Team</h2>
              <p class="text-zinc-500 text-xs mt-0.5">Fill in the details to create a team profile</p>
            </div>
            <button (click)="close()" class="text-zinc-400 hover:text-white transition-colors p-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Scrollable Body -->
          <div class="overflow-y-auto flex-1 p-6 space-y-5">

            <!-- Logo Upload -->
            <div class="flex items-center gap-5">
              <div class="w-20 h-20 rounded-xl bg-black-main border-2 border-dashed border-black-border flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-gold-400/50 transition-colors relative"
                   (click)="logoInput.click()">
                @if (logoPreview()) {
                  <img [src]="logoPreview()" alt="Logo Preview" class="w-full h-full object-cover">
                } @else {
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              </div>
              <input #logoInput type="file" accept="image/*" class="hidden" (change)="onLogoSelected($event)">
              <div>
                <p class="text-sm font-semibold text-white mb-1">Team Logo</p>
                <p class="text-xs text-zinc-500 mb-2">Click the box to upload a logo (PNG, JPG, SVG)</p>
                @if (logoPreview()) {
                  <button type="button" (click)="removeLogo()" class="text-xs text-red-400 hover:text-red-300 transition-colors">Remove logo</button>
                } @else {
                  <button type="button" (click)="logoInput.click()" class="text-xs text-gold-400 hover:text-gold-300 transition-colors">Browse file…</button>
                }
              </div>
            </div>

            <!-- Team Name + Short Name -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Team Name <span class="text-gold-400">*</span></label>
                <input type="text" [(ngModel)]="team.name" placeholder="e.g. Manchester FC"
                  class="w-full bg-white/5 border border-black-border rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all">
              </div>
              <div>
                <label class="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Short Name <span class="text-zinc-600 normal-case font-normal">(3–5 letters)</span></label>
                <input type="text" [(ngModel)]="team.shortName" placeholder="e.g. MFC" maxlength="5"
                  class="w-full bg-white/5 border border-black-border rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all uppercase"
                  (input)="team.shortName = $any($event.target).value.toUpperCase()">
              </div>
            </div>

            <!-- Team Type -->
            <div>
              <label class="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Team Type</label>
              <select [(ngModel)]="team.teamType"
                class="w-full bg-black-main border border-black-border rounded-lg px-4 py-3 text-white focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all appearance-none">
                <option value="" disabled selected class="text-zinc-500">Select type…</option>
                <option value="Club">Club</option>
                <option value="School">School</option>
                <option value="College">College</option>
                <option value="Corporate">Corporate</option>
                <option value="Academy">Academy</option>
              </select>
            </div>

            <!-- City / State / Country -->
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">City</label>
                <input type="text" [(ngModel)]="team.city" placeholder="e.g. Mumbai"
                  class="w-full bg-white/5 border border-black-border rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all">
              </div>
              <div>
                <label class="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">State</label>
                <input type="text" [(ngModel)]="team.state" placeholder="e.g. Maharashtra"
                  class="w-full bg-white/5 border border-black-border rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all">
              </div>
              <div>
                <label class="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Country</label>
                <input type="text" [(ngModel)]="team.country" placeholder="e.g. India"
                  class="w-full bg-white/5 border border-black-border rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all">
              </div>
            </div>

            <!-- Founded Year + Home Ground -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Founded Year <span class="text-zinc-600 normal-case font-normal">(optional)</span></label>
                <input type="number" [(ngModel)]="team.foundedYear" placeholder="e.g. 2005" min="1800" [max]="currentYear"
                  class="w-full bg-white/5 border border-black-border rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all">
              </div>
              <div>
                <label class="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Home Ground</label>
                <input type="text" [(ngModel)]="team.homeGround" placeholder="e.g. Wankhede Stadium"
                  class="w-full bg-white/5 border border-black-border rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all">
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Team Description</label>
              <textarea [(ngModel)]="team.description" placeholder="Brief description about the team…" rows="3"
                class="w-full bg-white/5 border border-black-border rounded-lg px-4 py-3 text-white placeholder-zinc-600 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all resize-none"></textarea>
            </div>

          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between gap-3 px-6 py-4 border-t border-black-border bg-white/[0.02] shrink-0">
            <p class="text-xs text-zinc-600">Fields marked <span class="text-gold-400">*</span> are required</p>
            <div class="flex items-center gap-3">
              <button (click)="close()" [disabled]="isSubmitting()"
                class="px-5 py-2.5 rounded-lg border border-black-border text-zinc-400 hover:text-white hover:border-zinc-500 font-bold transition-all disabled:opacity-50">
                Cancel
              </button>
              <button (click)="submit()" [disabled]="!team.name || isSubmitting()"
                class="px-6 py-2.5 rounded-lg bg-gold-400 hover:bg-gold-500 text-black font-bold transition-all shadow-lg shadow-gold-400/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                @if (isSubmitting()) {
                  <span class="loading loading-spinner loading-sm"></span>
                }
                Create Team
              </button>
            </div>
          </div>

        </div>
      </div>
    }
  `
})
export class CreateTeamModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() teamCreated = new EventEmitter<string>();

  private teamService = inject(TeamService);
  isSubmitting = signal(false);
  logoPreview = signal<string | null>(null);
  private selectedLogoFile: File | null = null;

  currentYear = new Date().getFullYear();

  team: {
    name: string;
    shortName: string;
    logoUrl: string;
    teamType: string;
    city: string;
    state: string;
    country: string;
    foundedYear: number | null;
    homeGround: string;
    description: string;
  } = this.emptyForm();

  emptyForm() {
    return {
      name: '',
      shortName: '',
      logoUrl: '',
      teamType: '',
      city: '',
      state: '',
      country: '',
      foundedYear: null,
      homeGround: '',
      description: '',
    };
  }

  onLogoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.selectedLogoFile = file;
    const reader = new FileReader();
    reader.onload = (e) => this.logoPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
    // Don't store base64 in team.logoUrl — we'll send the file directly via FormData
    this.team.logoUrl = '';
  }

  removeLogo() {
    this.logoPreview.set(null);
    this.selectedLogoFile = null;
    this.team.logoUrl = '';
  }

  close() {
    this.closeModal.emit();
    this.resetForm();
  }

  resetForm() {
    this.team = this.emptyForm();
    this.logoPreview.set(null);
    this.selectedLogoFile = null;
  }

  submit() {
    if (!this.team.name) return;

    const formData = new FormData();

    // Append text fields (skip empty values)
    const fields: Record<string, any> = { ...this.team };
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined && key !== 'logoUrl') {
        formData.append(key, String(value));
      }
    });

    // Append logo file if selected
    if (this.selectedLogoFile) {
      formData.append('logo', this.selectedLogoFile, this.selectedLogoFile.name);
    }

    this.isSubmitting.set(true);
    this.teamService.createWithFormData(formData).subscribe({
      next: (createdTeam: any) => {
        this.isSubmitting.set(false);
        this.teamCreated.emit(createdTeam.id);
        this.resetForm();
      },
      error: (err: any) => {
        console.error('Failed to create team', err);
        this.isSubmitting.set(false);
      }
    });
  }
}
