import { Component, Input, Output, EventEmitter, inject, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPlanService, PlanItem, ActiveTournamentInfo } from '../../services/user-plan.service';
import { AuthService } from '../../auth/auth.service';
import { UiService } from '../../services/ui.service';

@Component({
    selector: 'app-my-plan-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    @if (show) {
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in"
           (click)="closeModal()">
        
        <!-- Modal Card -->
        <div class="bg-neutral-950 border border-gold-400/30 rounded-2xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-[0_25px_70px_rgba(0,0,0,0.95)] relative text-white overflow-hidden"
             (click)="$event.stopPropagation()">

          <!-- Sticky Header -->
          <div class="p-6 sm:p-8 pb-4 border-b border-white/10 relative bg-neutral-900/80 backdrop-blur-sm shrink-0">
            <!-- Close Button -->
            <button (click)="closeModal()" 
                    class="absolute top-6 right-6 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-full transition-all duration-200">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            <div class="text-center">
              <span class="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-gold-400/10 text-gold-400 border border-gold-400/30">
                Subscription Management
              </span>
              <h2 class="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">MY PLAN</h2>
              <p class="text-zinc-400 text-xs sm:text-sm mt-1">
                Current Active Tier: <span class="text-gold-400 font-extrabold uppercase bg-gold-400/10 px-2 py-0.5 rounded border border-gold-400/30 ml-1">{{ currentPlanName() }}</span>
              </p>
            </div>
          </div>

          <!-- Scrollable Body Content -->
          <div class="p-6 sm:p-8 overflow-y-auto custom-scrollbar space-y-6">

            <!-- Active Plan Overview & Usage Card -->
            @if (planInfo(); as info) {
              <div class="bg-neutral-900/90 border border-gold-400/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-gold-400 text-black">Active Subscription</span>
                      @if (pendingPlanName()) {
                        <span class="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
                          Upgrade Pending: {{ pendingPlanName() }}
                        </span>
                      }
                    </div>
                    <h3 class="text-xl sm:text-2xl font-black text-white mt-1">{{ info.planName }} Plan Details</h3>
                    <p class="text-xs text-zinc-400 mt-0.5">Overview of active limits, usage metrics, and feature permissions for your account.</p>
                  </div>

                  <!-- Quick Stats Badges -->
                  <div class="flex flex-wrap items-center gap-3">
                    <div class="bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-center">
                      <div class="text-[10px] font-bold uppercase text-zinc-400">Total Created</div>
                      <div class="text-base font-black text-gold-400">{{ allTournamentsCount() }} <span class="text-xs text-zinc-400 font-normal">Tournaments</span></div>
                    </div>
                    <div class="bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-center">
                      <div class="text-[10px] font-bold uppercase text-zinc-400">Pending / In-Progress</div>
                      <div class="text-base font-black" [ngClass]="blockedInfo()?.tournaments?.length ? 'text-amber-400' : 'text-emerald-400'">
                        {{ blockedInfo()?.tournaments?.length || 0 }} <span class="text-xs text-zinc-400 font-normal">Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Plan Limits & Capabilities Grid -->
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div class="bg-black/40 border border-white/5 rounded-xl p-3">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Max Tournaments</span>
                    <span class="text-sm font-extrabold text-white">{{ info.maxTournaments === -1 ? 'Unlimited' : info.maxTournaments }}</span>
                  </div>
                  <div class="bg-black/40 border border-white/5 rounded-xl p-3">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Max Teams / Tournament</span>
                    <span class="text-sm font-extrabold text-white">{{ info.maxTeams === -1 ? 'Unlimited' : info.maxTeams }}</span>
                  </div>
                  <div class="bg-black/40 border border-white/5 rounded-xl p-3">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Max Squad Players</span>
                    <span class="text-sm font-extrabold text-white">{{ info.maxPlayers === -1 ? 'Unlimited' : info.maxPlayers }}</span>
                  </div>
                  <div class="bg-black/40 border border-white/5 rounded-xl p-3">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">Max Staff Members</span>
                    <span class="text-sm font-extrabold text-white">{{ info.maxStaff === -1 ? 'Unlimited' : info.maxStaff }}</span>
                  </div>
                </div>

                <!-- Feature Permissions Chips -->
                <div class="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/5 text-xs">
                  <span class="px-2.5 py-1 rounded-lg border flex items-center gap-1.5"
                        [ngClass]="info.allowOnlineRegistration ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'">
                    {{ info.allowOnlineRegistration ? '✓' : '✕' }} Online Reg
                  </span>
                  <span class="px-2.5 py-1 rounded-lg border flex items-center gap-1.5"
                        [ngClass]="info.allowPayment ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'">
                    {{ info.allowPayment ? '✓' : '✕' }} Payment Collection
                  </span>
                  <span class="px-2.5 py-1 rounded-lg border bg-gold-400/10 text-gold-400 border-gold-400/30 flex items-center gap-1.5">
                    📊 {{ info.reportsLevel || 'Basic' }} Reports
                  </span>
                  <span class="px-2.5 py-1 rounded-lg border flex items-center gap-1.5"
                        [ngClass]="info.allowCustomBranding ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700'">
                    {{ info.allowCustomBranding ? '✓' : '✕' }} Custom Branding
                  </span>
                </div>
              </div>
            }

            <!-- Tournament Blocked Warning Banner -->
            @if (blockedInfo(); as blocked) {
              <div class="p-5 bg-red-500/10 border border-red-500/40 rounded-xl animate-shake">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 text-red-400 font-bold text-lg">
                    ⚠️
                  </div>
                  <div class="flex-1">
                    <h4 class="text-base font-bold text-red-400">Plan Update Blocked (Pending / In-Progress Tournaments)</h4>
                    <p class="text-xs sm:text-sm text-zinc-300 mt-1">
                      Your current plan cannot be updated because you have <strong class="text-white">{{ blocked.tournaments.length }} pending or in-progress tournament(s)</strong> under your current plan. Please complete all existing tournaments before changing your plan.
                    </p>

                    <!-- Active Tournaments List -->
                    @if (blocked.tournaments.length > 0) {
                      <div class="mt-4 space-y-2 bg-black/60 p-3.5 rounded-lg border border-red-500/20">
                        <p class="text-xs font-bold text-red-300 uppercase tracking-wider flex items-center justify-between">
                          <span>Pending / In-Progress Tournaments:</span>
                          <span class="text-[10px] text-zinc-400 font-normal hidden sm:inline">Must be marked COMPLETED to unblock plan update</span>
                        </p>
                        @for (t of blocked.tournaments; track t.id) {
                          <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm py-2 border-b border-white/5 last:border-0 gap-1 sm:gap-4">
                            <div class="flex items-center gap-2">
                              <span class="font-bold text-white">🏆 {{ t.name }}</span>
                              <span class="text-[10px] font-mono text-zinc-400">(ID: #{{ t.id }})</span>
                            </div>
                            <div class="flex items-center gap-2">
                              @if (t.startDate) {
                                <span class="text-[11px] text-zinc-400">📅 {{ t.startDate | date:'shortDate' }}</span>
                              }
                              <span class="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                {{ (t.status || 'REGISTRATION_OPEN').replace('_', ' ') }}
                              </span>
                            </div>
                          </div>
                        }
                      </div>
                    }
                  </div>
                </div>
              </div>
            }

            <!-- Loading State -->
            @if (loading()) {
              <div class="flex justify-center py-16">
                <span class="loading loading-spinner loading-lg text-gold-400"></span>
              </div>
            } @else {
              <!-- Plan Cards Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                @for (plan of plans(); track plan.id) {
                  <div class="bg-neutral-900/60 border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative group hover:border-gold-400/50"
                       [ngClass]="{
                         'border-gold-400 shadow-[0_0_30px_rgba(212,175,55,0.2)] bg-gold-400/[0.04]': isCurrentPlan(plan.name),
                         'border-amber-500/60 bg-amber-500/[0.03]': isPendingPlan(plan.name),
                         'border-white/10 hover:bg-white/[0.02]': !isCurrentPlan(plan.name) && !isPendingPlan(plan.name)
                       }">

                    <!-- Current Plan Badge -->
                    @if (isCurrentPlan(plan.name)) {
                      <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gold-400 text-black text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg border border-gold-300">
                        ACTIVE PLAN
                      </div>
                    } @else if (isPendingPlan(plan.name)) {
                      <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg border border-amber-400 animate-pulse">
                        PENDING / IN PROGRESS
                      </div>
                    }

                    <div>
                      <!-- Plan Name & Price -->
                      <div class="text-center pb-5 border-b border-white/10">
                        <h3 class="text-lg font-black text-white uppercase tracking-wider">{{ plan.name }}</h3>
                        <p class="text-xs text-zinc-400 mt-1 min-h-[36px] line-clamp-2">{{ plan.description || 'Standard plan tier for organizers' }}</p>
                        <div class="mt-3">
                          <span class="text-3xl font-black text-gold-400">
                            {{ plan.monthlyPrice > 0 ? '₹' + plan.monthlyPrice : 'FREE' }}
                          </span>
                          @if (plan.monthlyPrice > 0) {
                            <span class="text-xs text-zinc-400"> / Month</span>
                          }
                        </div>
                      </div>

                      <!-- Features List -->
                      <ul class="py-5 space-y-2.5 text-xs text-zinc-300">
                        <li class="flex items-center gap-2">
                          <svg class="w-4 h-4 text-gold-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span>Max Tournaments: <strong class="text-white">{{ plan.maxTournaments === -1 ? 'Unlimited' : plan.maxTournaments }}</strong></span>
                        </li>
                        <li class="flex items-center gap-2">
                          <svg class="w-4 h-4 text-gold-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span>Max Teams: <strong class="text-white">{{ plan.maxTeams === -1 ? 'Unlimited' : plan.maxTeams }}</strong></span>
                        </li>
                        <li class="flex items-center gap-2">
                          <svg class="w-4 h-4 text-gold-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                          </svg>
                          <span>Max Players: <strong class="text-white">{{ plan.maxPlayers === -1 ? 'Unlimited' : plan.maxPlayers }}</strong></span>
                        </li>

                        @for (feat of getAdditionalFeatures(plan); track feat) {
                          <li class="flex items-center gap-2">
                            <svg class="w-4 h-4 text-gold-400/80 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                            </svg>
                            <span>{{ feat }}</span>
                          </li>
                        }
                      </ul>
                    </div>

                    <!-- Card Action Button -->
                    <div class="pt-4 border-t border-white/10 text-center mt-auto">
                      @if (isCurrentPlan(plan.name)) {
                        <button disabled
                                class="w-full py-2.5 rounded-xl bg-gold-400/15 border border-gold-400/30 text-gold-400 font-extrabold text-xs uppercase tracking-wider cursor-not-allowed">
                          ACTIVE PLAN
                        </button>
                      } @else if (isPendingPlan(plan.name)) {
                        <button (click)="updatePlan(plan.name)"
                                class="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-black text-xs uppercase tracking-wider hover:bg-amber-500/30 transition-all">
                          PENDING / IN PROGRESS
                        </button>
                      } @else {
                        <button (click)="updatePlan(plan.name)"
                                [disabled]="updatingPlan() === plan.name"
                                class="w-full py-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-black font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-gold-400/20 active:scale-[0.98]">
                          @if (updatingPlan() === plan.name) {
                            <span class="loading loading-spinner loading-xs"></span> Updating...
                          } @else {
                            UPDATE PLAN
                          }
                        </button>
                      }
                    </div>

                  </div>
                }
              </div>
            }

          </div>

        </div>
      </div>
    }
    `
})
export class MyPlanModalComponent implements OnChanges {
    @Input() show = false;
    @Output() onClose = new EventEmitter<void>();

    private userPlanService = inject(UserPlanService);
    private auth = inject(AuthService);
    private ui = inject(UiService);

    loading = signal(false);
    updatingPlan = signal<string | null>(null);
    currentPlanName = signal<string>('Free');
    pendingPlanName = signal<string | null>(null);
    plans = signal<PlanItem[]>([]);
    blockedInfo = signal<{ tournaments: ActiveTournamentInfo[] } | null>(null);
    planInfo = signal<any | null>(null);
    allTournamentsCount = signal<number>(0);

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['show'] && this.show) {
            this.loadMyPlanDetails();
        }
    }

    loadMyPlanDetails() {
        this.loading.set(true);
        this.blockedInfo.set(null);
        this.userPlanService.getMyPlan().subscribe({
            next: (res) => {
                this.currentPlanName.set(res.currentPlanName || 'Free');
                this.pendingPlanName.set(res.pendingPlanName || null);
                this.planInfo.set(res.planInfo || null);
                this.allTournamentsCount.set(res.allTournamentsCount || 0);
                this.plans.set(res.plans || []);

                if (res.activeTournaments && res.activeTournaments.length > 0) {
                    this.blockedInfo.set({ tournaments: res.activeTournaments });
                }

                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
            }
        });
    }

    isCurrentPlan(planName: string): boolean {
        return (planName || '').trim().toLowerCase() === (this.currentPlanName() || '').trim().toLowerCase();
    }

    isPendingPlan(planName: string): boolean {
        const pending = (this.pendingPlanName() || '').trim().toLowerCase();
        const current = (planName || '').trim().toLowerCase();
        return pending !== '' && pending === current;
    }

    /** Filter out duplicate items from features list if already rendered in limits */
    getAdditionalFeatures(plan: PlanItem): string[] {
        if (!plan.features || !Array.isArray(plan.features)) return [];
        return plan.features.filter(f => {
            const lower = (f || '').toLowerCase();
            return !lower.includes('tournaments limit') &&
                   !lower.includes('teams limit') &&
                   !lower.includes('players limit');
        });
    }

    updatePlan(planName: string) {
        if (this.isCurrentPlan(planName)) {
            this.ui.showToast(`You are already subscribed to the ${planName} plan.`, 'info');
            return;
        }

        this.updatingPlan.set(planName);

        this.userPlanService.updatePlan(planName).subscribe({
            next: (res: any) => {
                this.updatingPlan.set(null);
                if (res.blocked) {
                    this.pendingPlanName.set(planName);
                    this.blockedInfo.set({ tournaments: res.activeTournaments || [] });
                    this.ui.showToast('Plan update blocked: active tournaments exist.', 'error');
                } else if (res.alreadyActive) {
                    this.ui.showToast(res.message || 'You are already on this plan.', 'info');
                } else if (res.success) {
                    this.currentPlanName.set(res.planName || planName);
                    this.pendingPlanName.set(null);
                    this.blockedInfo.set(null);
                    // refresh user state in auth service
                    const currentUser = this.auth.user;
                    if (currentUser) {
                        this.auth.refreshUser({ ...currentUser, plan: res.planName || planName });
                    }
                    this.ui.showToast(res.message || 'Plan updated successfully!', 'success');
                }
            },
            error: (err) => {
                this.updatingPlan.set(null);
                if (err?.error?.blocked) {
                    this.pendingPlanName.set(planName);
                    this.blockedInfo.set({ tournaments: err.error.activeTournaments || [] });
                } else {
                    this.ui.showToast(err?.error?.message || 'Failed to update plan.', 'error');
                }
            }
        });
    }

    closeModal() {
        this.onClose.emit();
    }
}
