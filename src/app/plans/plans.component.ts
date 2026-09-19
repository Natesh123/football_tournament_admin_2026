import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Plan, PlanService, formatPlanPrice } from './plan.service';
import { PlanModalComponent } from './plan-modal.component';
import { LoaderComponent } from '../components/loader/loader.component';
import { UiService } from '../services/ui.service';

@Component({
    selector: 'app-plans',
    standalone: true,
    imports: [CommonModule, FormsModule, PlanModalComponent, LoaderComponent],
    template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Subscription Plans</h1>
          <p class="text-zinc-400 mt-1">Manage platform subscription plans and select which plans to display on the public Landing Page.</p>
        </div>
        <button (click)="openCreate()"
          class="px-5 py-2.5 bg-gold-400 hover:bg-gold-500 text-black font-bold rounded-xl transition-all shadow-lg shadow-gold-400/20 flex items-center gap-2 self-start sm:self-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Create Plan
        </button>
      </div>

      <!-- Bulk Landing Visibility Selection Bar -->
      <div class="bg-black-card border border-gold-400/20 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-gold-400/10 rounded-lg text-gold-400 border border-gold-400/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div>
            <div class="text-sm font-extrabold text-white">Show on Landing Page (Multiple-Select)</div>
            <div class="text-xs text-zinc-400">
              <span class="text-gold-400 font-bold">{{ landingVisibleCount() }}</span> of {{ plans().length }} plans currently set to display on the public Landing Page.
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto justify-end">
          @if (selectedIds().size > 0) {
            <span class="text-xs text-gold-400 font-bold mr-2">{{ selectedIds().size }} selected</span>
            <button (click)="applyBulkLandingVisibility(true)"
              class="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Show Selected on Landing Page
            </button>
            <button (click)="applyBulkLandingVisibility(false)"
              class="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 1.153 0 2.253.197 3.275.558M16.516 16.516l3.484 3.484M4.221 4.221l15.558 15.558" />
              </svg>
              Hide Selected
            </button>
          } @else {
            <span class="text-xs text-zinc-500 italic">Select plan checkboxes below for bulk actions</span>
          }
        </div>
      </div>

      <!-- Search & Filter -->
      <div class="bg-black-card border border-black-border rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" [(ngModel)]="searchQuery" placeholder="Search by name or code"
            class="w-full bg-black-main border border-black-border rounded-xl pl-12 pr-4 py-3 text-white placeholder-zinc-500 focus:border-gold-400 focus:outline-none focus:ring-1 focus:ring-gold-400/50 transition-all">
        </div>
        <select [(ngModel)]="statusFilter"
          class="bg-black-main border border-black-border rounded-xl px-4 py-3 text-white focus:border-gold-400 focus:outline-none">
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <!-- Table -->
      @if (isLoading()) {
        <div class="h-64 flex items-center justify-center"><app-loader></app-loader></div>
      } @else {
      <div class="bg-black-card border border-black-border rounded-2xl overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[880px]">
            <thead>
              <tr class="text-zinc-500 text-[10px] uppercase font-bold tracking-[0.2em] border-b border-black-border bg-black/20">
                <th class="px-4 py-4 text-center w-10">
                  <input type="checkbox" 
                    [checked]="isAllSelected()" 
                    (change)="toggleAllSelection()"
                    class="rounded border-zinc-700 bg-black-main text-gold-400 focus:ring-gold-400 cursor-pointer" 
                  />
                </th>
                <th class="px-5 py-4">Plan</th>
                <th class="px-5 py-4">Monthly</th>
                <th class="px-5 py-4">Yearly</th>
                <th class="px-5 py-4">Order</th>
                <th class="px-5 py-4 text-center">Show on Landing Page</th>
                <th class="px-5 py-4">Status</th>
                <th class="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-black-border/50">
              @for (plan of filteredPlans(); track plan.id) {
                <tr class="group text-zinc-300 hover:bg-gold-400/[0.02] transition-colors" [class.bg-gold-400/[0.04]]="selectedIds().has(plan.id)">
                  <td class="px-4 py-4 text-center">
                    <input type="checkbox" 
                      [checked]="selectedIds().has(plan.id)" 
                      (change)="toggleSelection(plan.id)"
                      class="rounded border-zinc-700 bg-black-main text-gold-400 focus:ring-gold-400 cursor-pointer" 
                    />
                  </td>
                  <td class="px-5 py-4">
                    <div class="font-bold text-white group-hover:text-gold-400 transition-colors flex items-center gap-2">
                      {{ plan.name }}
                      @if (plan.isPopular) {
                        <span class="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-gold-400/20 text-gold-400 border border-gold-400/30">Popular</span>
                      }
                    </div>
                    <div class="text-[11px] font-mono text-zinc-500 uppercase">{{ plan.code }}</div>
                  </td>
                  <td class="px-5 py-4 font-semibold text-white">{{ price(plan.monthlyPrice) }}</td>
                  <td class="px-5 py-4 text-zinc-400">{{ plan.yearlyPrice ? price(plan.yearlyPrice) : '—' }}</td>
                  <td class="px-5 py-4 text-zinc-400">{{ plan.displayOrder }}</td>
                  <td class="px-5 py-4 text-center">
                    <button 
                      (click)="toggleLandingVisibility(plan)" 
                      type="button"
                      class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                      [ngClass]="plan.landingVisible ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20' : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-300'"
                      title="Click to toggle Landing Page visibility"
                    >
                      <span class="relative flex h-2 w-2">
                        @if (plan.landingVisible) {
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        } @else {
                          <span class="relative inline-flex rounded-full h-2 w-2 bg-zinc-600"></span>
                        }
                      </span>
                      {{ plan.landingVisible ? 'Shown on Landing' : 'Hidden from Landing' }}
                    </button>
                  </td>
                  <td class="px-5 py-4">
                    <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border"
                      [ngClass]="plan.status === 'active' ? 'bg-green-500/5 text-green-500 border-green-500/20' : 'bg-red-500/5 text-red-500 border-red-500/20'">
                      {{ plan.status }}
                    </span>
                  </td>
                  <td class="px-5 py-4">
                    <div class="flex items-center justify-end gap-1">
                      <button (click)="view(plan)" title="View Details" class="p-2 text-gold-400 hover:bg-gold-400/20 rounded-md transition-all">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      </button>
                      <button (click)="openEdit(plan)" title="Edit Plan" class="p-2 text-gold-400 hover:bg-gold-400/20 rounded-md transition-all">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button (click)="confirmDelete(plan)" title="Delete Plan" class="p-2 text-red-500 hover:bg-red-500/20 rounded-md transition-all">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr><td colspan="8" class="px-6 py-16 text-center text-zinc-500 italic">No plans found. Create your first plan above.</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
      }
    </div>

    <!-- Create / Edit modal -->
    <app-plan-modal
      [isOpen]="isModalOpen()"
      [mode]="modalMode()"
      [planToEdit]="planToEdit()"
      (closeModal)="closeModal()"
      (saved)="onSaved()">
    </app-plan-modal>

    <!-- View modal -->
    @if (viewing(); as p) {
    <div class="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/70 backdrop-blur-sm p-4 sm:p-8" (click)="viewing.set(null)">
      <div class="relative w-full max-w-2xl bg-black-card border border-black-border rounded-2xl shadow-2xl my-4" (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between px-6 py-4 border-b border-black-border">
          <div>
            <h2 class="text-xl font-bold text-white">{{ p.name }} <span class="text-xs font-mono text-zinc-500 uppercase">({{ p.code }})</span></h2>
            <p class="text-sm text-zinc-400 mt-0.5">{{ p.description || 'No description' }}</p>
          </div>
          <button type="button" (click)="viewing.set(null)" class="p-2 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="px-6 py-5 space-y-5">
          <div class="flex items-baseline gap-4">
            <div class="text-3xl font-bold text-gold-400">{{ price(p.monthlyPrice) }}<span class="text-sm text-zinc-500 font-medium">/mo</span></div>
            @if (p.yearlyPrice) { <div class="text-zinc-400">{{ price(p.yearlyPrice) }}<span class="text-xs text-zinc-500">/yr</span></div> }
            @if (p.trialDays) { <div class="text-xs px-2 py-1 rounded-full bg-white/5 text-zinc-300">{{ p.trialDays }}-day trial</div> }
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div class="stat"><span class="k">Tournaments</span><span class="v">{{ p.maxTournaments === -1 ? 'Unlimited' : p.maxTournaments }}</span></div>
            <div class="stat"><span class="k">Teams</span><span class="v">{{ p.maxTeams === -1 ? 'Unlimited' : p.maxTeams }}</span></div>
            <div class="stat"><span class="k">Players</span><span class="v">{{ p.maxPlayers === -1 ? 'Unlimited' : p.maxPlayers }}</span></div>
            <div class="stat"><span class="k">Staff</span><span class="v">{{ p.maxStaff === -1 ? 'Unlimited' : p.maxStaff }}</span></div>
            <div class="stat"><span class="k">Grounds</span><span class="v">{{ p.maxGrounds }}</span></div>
            <div class="stat"><span class="k">Referees</span><span class="v">{{ p.maxReferees }}</span></div>
            <div class="stat"><span class="k">Vendors</span><span class="v">{{ p.maxVendors }}</span></div>
            <div class="stat"><span class="k">Storage</span><span class="v">{{ p.storageLimitMb }} MB</span></div>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-black-border text-xs">
            <div class="flex items-center gap-1.5"><span [class.text-green-500]="p.allowOnlineRegistration" [class.text-red-500]="!p.allowOnlineRegistration">{{ p.allowOnlineRegistration ? '✓' : '✕' }}</span><span class="text-zinc-300">Online Reg</span></div>
            <div class="flex items-center gap-1.5"><span [class.text-green-500]="p.allowPayment" [class.text-red-500]="!p.allowPayment">{{ p.allowPayment ? '✓' : '✕' }}</span><span class="text-zinc-300">Payment</span></div>
            <div class="flex items-center gap-1.5"><span class="text-gold-400">📊</span><span class="text-zinc-300">{{ p.reportsLevel || 'Basic' }} Reports</span></div>
            <div class="flex items-center gap-1.5"><span [class.text-green-500]="p.allowCustomBranding" [class.text-red-500]="!p.allowCustomBranding">{{ p.allowCustomBranding ? '✓' : '✕' }}</span><span class="text-zinc-300">Branding</span></div>
          </div>
          @if (p.features?.length) {
          <div>
            <h4 class="text-xs font-bold uppercase tracking-widest text-gold-400 mb-2">Features</h4>
            <ul class="space-y-1.5">
              @for (f of p.features; track f) {
                <li class="flex items-start gap-2 text-sm text-zinc-300"><span class="text-gold-400 mt-0.5">✓</span> {{ f }}</li>
              }
            </ul>
          </div>
          }
          <div class="flex flex-wrap gap-2 pt-2 border-t border-black-border text-[10px] uppercase font-bold tracking-widest">
            <span class="px-2 py-1 rounded-full border" [ngClass]="p.status === 'active' ? 'text-green-500 border-green-500/20' : 'text-red-500 border-red-500/20'">{{ p.status }}</span>
            <span class="px-2 py-1 rounded-full border border-white/10 text-zinc-400">Order {{ p.displayOrder }}</span>
            @if (p.isPopular) { <span class="px-2 py-1 rounded-full border border-gold-400/30 text-gold-400">Popular</span> }
            <span class="px-2 py-1 rounded-full border border-white/10" [ngClass]="p.landingVisible ? 'text-green-500' : 'text-zinc-500'">{{ p.landingVisible ? 'On landing' : 'Hidden' }}</span>
          </div>
        </div>
      </div>
    </div>
    }
  `,
    styles: [`
    .stat { display:flex; flex-direction:column; background:#0a0a0a; border:1px solid #1f1f1f; border-radius:0.6rem; padding:0.5rem 0.7rem; }
    .stat .k { font-size:0.6rem; text-transform:uppercase; letter-spacing:0.05em; color:#71717a; font-weight:700; }
    .stat .v { font-size:1rem; color:#fff; font-weight:700; }
  `]
})
export class PlansComponent {
    private planService = inject(PlanService);
    private ui = inject(UiService);

    plans = signal<Plan[]>([]);
    isLoading = signal(true);
    searchQuery = '';
    statusFilter = '';

    // Multi-Select Checkboxes State
    selectedIds = signal<Set<number>>(new Set());

    isModalOpen = signal(false);
    modalMode = signal<'create' | 'edit'>('create');
    planToEdit = signal<Plan | null>(null);
    viewing = signal<Plan | null>(null);

    landingVisibleCount = computed(() => {
        return this.plans().filter(p => p.landingVisible).length;
    });

    // Client-side filter
    filteredPlans = computed(() => {
        const q = this.searchQuery.trim().toLowerCase();
        const status = this.statusFilter;
        return this.plans().filter(p => {
            const matchesQ = !q || p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
            const matchesStatus = !status || p.status === status;
            return matchesQ && matchesStatus;
        });
    });

    constructor() {
        this.load();
    }

    price = (v?: number) => formatPlanPrice(v);

    load() {
        this.isLoading.set(true);
        this.planService.getAll().subscribe({
            next: (data) => { this.plans.set(data); this.isLoading.set(false); },
            error: () => this.isLoading.set(false),
        });
    }

    toggleSelection(id: number) {
        const next = new Set(this.selectedIds());
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        this.selectedIds.set(next);
    }

    isAllSelected(): boolean {
        const filtered = this.filteredPlans();
        if (filtered.length === 0) return false;
        return filtered.every(p => this.selectedIds().has(p.id));
    }

    toggleAllSelection() {
        const filtered = this.filteredPlans();
        const next = new Set(this.selectedIds());
        if (this.isAllSelected()) {
            filtered.forEach(p => next.delete(p.id));
        } else {
            filtered.forEach(p => next.add(p.id));
        }
        this.selectedIds.set(next);
    }

    toggleLandingVisibility(plan: Plan) {
        const updatedVisibility = !plan.landingVisible;
        this.planService.update(plan.id, { landingVisible: updatedVisibility }).subscribe({
            next: (updatedPlan) => {
                this.plans.update(list => list.map(p => p.id === plan.id ? { ...p, landingVisible: updatedVisibility } : p));
                this.ui.showToast(`Updated "${plan.name}" Landing Page visibility`, 'success');
            },
            error: (err) => this.ui.showToast('Failed to update visibility', 'error')
        });
    }

    applyBulkLandingVisibility(show: boolean) {
        const selected = Array.from(this.selectedIds());
        if (selected.length === 0) return;

        // Current visible plan IDs
        const currentlyVisibleIds = this.plans().filter(p => p.landingVisible).map(p => p.id);
        let newVisibleIds: number[] = [];

        if (show) {
            newVisibleIds = Array.from(new Set([...currentlyVisibleIds, ...selected]));
        } else {
            newVisibleIds = currentlyVisibleIds.filter(id => !selected.includes(id));
        }

        this.planService.updateLandingVisibility(newVisibleIds).subscribe({
            next: () => {
                this.ui.showToast(`Updated Landing Page plans selection`, 'success');
                this.selectedIds.set(new Set());
                this.load();
            },
            error: (err) => this.ui.showToast('Failed to update landing selection', 'error')
        });
    }

    openCreate() {
        this.modalMode.set('create');
        this.planToEdit.set(null);
        this.isModalOpen.set(true);
    }

    openEdit(plan: Plan) {
        this.modalMode.set('edit');
        this.planToEdit.set(plan);
        this.isModalOpen.set(true);
    }

    view(plan: Plan) {
        this.viewing.set(plan);
    }

    closeModal() {
        this.isModalOpen.set(false);
        this.planToEdit.set(null);
    }

    onSaved() {
        this.closeModal();
        this.load();
    }

    async confirmDelete(plan: Plan) {
        const confirmed = await this.ui.confirmAction('Delete Plan', `Delete "${plan.name}"? This cannot be undone.`);
        if (!confirmed) return;
        this.planService.delete(plan.id).subscribe({
            next: () => {
                this.plans.update(list => list.filter(p => p.id !== plan.id));
                this.ui.showToast('Plan deleted', 'success');
            },
            error: (err) => this.ui.showToast('Failed to delete plan', 'error')
        });
    }
}
