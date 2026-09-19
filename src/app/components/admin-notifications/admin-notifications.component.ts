import { Component, Input, Output, EventEmitter, inject, signal, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService, AppNotification } from '../../services/notification.service';

interface GroupedNotifications {
    dateLabel: string;
    items: AppNotification[];
}

@Component({
    selector: 'app-admin-notifications',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    @if (show) {
      <div class="absolute right-0 top-14 w-80 sm:w-96 bg-neutral-900 border border-gold-400/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden z-50 text-white animate-fade-in"
           (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div class="flex items-center gap-2">
            <span class="text-lg">🔔</span>
            <h3 class="font-black text-base uppercase tracking-wider text-gold-400">Notifications</h3>
            @if (notificationService.unreadCount() > 0) {
              <span class="px-2 py-0.5 rounded-full bg-gold-400 text-black text-xs font-black">
                {{ notificationService.unreadCount() }}
              </span>
            }
          </div>
          <div class="flex items-center gap-2">
            @if (notificationService.unreadCount() > 0) {
              <button (click)="markAllRead()" 
                      class="text-[11px] font-bold text-zinc-400 hover:text-gold-400 transition-colors">
                Mark all read
              </button>
            }
            <button (click)="onClose.emit()" class="text-zinc-400 hover:text-white p-1">
              ✕
            </button>
          </div>
        </div>

        <!-- Filter Tabs: All | Unread | Read -->
        <div class="p-3 border-b border-white/5 bg-white/[0.02] flex items-center gap-2">
          <button (click)="setFilter('all')"
                  class="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                  [ngClass]="activeTab() === 'all' ? 'bg-gold-400 text-black' : 'text-zinc-400 hover:bg-white/5'">
            All
          </button>
          <button (click)="setFilter('unread')"
                  class="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                  [ngClass]="activeTab() === 'unread' ? 'bg-gold-400 text-black' : 'text-zinc-400 hover:bg-white/5'">
            Unread
          </button>
          <button (click)="setFilter('read')"
                  class="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                  [ngClass]="activeTab() === 'read' ? 'bg-gold-400 text-black' : 'text-zinc-400 hover:bg-white/5'">
            Read
          </button>
        </div>

        <!-- Date Range Filter -->
        <div class="px-3 py-2 border-b border-white/5 bg-black/20 flex items-center gap-2 text-xs">
          <input type="date" [(ngModel)]="startDate" class="bg-black/50 border border-white/10 text-white rounded px-2 py-1 flex-1 text-[11px]" />
          <span class="text-zinc-500">to</span>
          <input type="date" [(ngModel)]="endDate" class="bg-black/50 border border-white/10 text-white rounded px-2 py-1 flex-1 text-[11px]" />
          <button (click)="applyDateFilter()" class="bg-gold-400/20 hover:bg-gold-400/30 text-gold-400 font-bold px-2.5 py-1 rounded text-[11px] border border-gold-400/40">
            Filter
          </button>
        </div>

        <!-- Notification Content List -->
        <div class="max-h-96 overflow-y-auto custom-scrollbar p-3 space-y-4">
          @if (notificationService.loading()) {
            <div class="py-8 text-center">
              <span class="loading loading-spinner loading-sm text-gold-400"></span>
            </div>
          } @else if (groupedNotifications().length === 0) {
            <div class="py-8 text-center text-zinc-500 text-xs">
              No notifications found
            </div>
          } @else {
            @for (group of groupedNotifications(); track group.dateLabel) {
              <div>
                <!-- Date Header -->
                <div class="text-[11px] font-black uppercase tracking-wider text-gold-400/80 mb-2 px-1 pb-1 border-b border-white/5">
                  {{ group.dateLabel }}
                </div>

                <!-- Notifications in Date Group -->
                <div class="space-y-2">
                  @for (item of group.items; track item.id) {
                    <div (click)="onNotificationClick(item)"
                         class="p-3 rounded-xl border transition-all cursor-pointer relative"
                         [ngClass]="!item.isRead ? 'bg-gold-400/10 border-gold-400/30 hover:bg-gold-400/15' : 'bg-black/30 border-white/5 hover:bg-white/5 text-zinc-400'">

                      <!-- Unread Indicator Dot -->
                      @if (!item.isRead) {
                        <span class="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-gold-400 animate-pulse"></span>
                      }

                      <div class="pr-4">
                        <div class="flex items-center gap-2">
                          <h4 class="text-xs font-bold text-white">{{ item.title }}</h4>
                          @if (item.status) {
                            <span class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded"
                                  [ngClass]="getStatusClass(item.status)">
                              {{ item.status }}
                            </span>
                          }
                        </div>
                        <p class="text-[11px] text-zinc-300 mt-1 line-clamp-2">{{ item.message }}</p>
                        <p class="text-[10px] text-zinc-500 mt-2 font-mono">{{ formatTime(item.createdAt) }}</p>
                      </div>

                    </div>
                  }
                </div>
              </div>
            }
          }
        </div>

      </div>
    }
    `
})
export class AdminNotificationsComponent implements OnInit, OnChanges {
    @Input() show = false;
    @Output() onClose = new EventEmitter<void>();

    notificationService = inject(NotificationService);

    activeTab = signal<'all' | 'unread' | 'read'>('all');
    startDate = '';
    endDate = '';

    ngOnInit(): void {
        this.loadNotifications();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['show'] && this.show) {
            this.loadNotifications();
        }
    }

    loadNotifications() {
        this.notificationService.fetchNotifications({
            filter: this.activeTab(),
            startDate: this.startDate,
            endDate: this.endDate
        }).subscribe();
    }

    setFilter(tab: 'all' | 'unread' | 'read') {
        this.activeTab.set(tab);
        this.loadNotifications();
    }

    applyDateFilter() {
        this.loadNotifications();
    }

    markAllRead() {
        this.notificationService.markAllAsRead().subscribe();
    }

    onNotificationClick(item: AppNotification) {
        if (!item.isRead) {
            this.notificationService.markAsRead(item.id).subscribe();
        }
    }

    groupedNotifications(): GroupedNotifications[] {
        const list = this.notificationService.notifications();
        const groups: { [key: string]: AppNotification[] } = {};

        list.forEach(item => {
            const dateStr = this.formatDateLabel(item.createdAt);
            if (!groups[dateStr]) groups[dateStr] = [];
            groups[dateStr].push(item);
        });

        return Object.keys(groups).map(key => ({
            dateLabel: key,
            items: groups[key]
        }));
    }

    formatDateLabel(dateIso: string): string {
        if (!dateIso) return 'Unknown Date';
        const d = new Date(dateIso);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (d.toDateString() === today.toDateString()) return 'Today';
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';

        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    formatTime(dateIso: string): string {
        if (!dateIso) return '';
        const d = new Date(dateIso);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    getStatusClass(status: string): string {
        switch ((status || '').toLowerCase()) {
            case 'completed':
                return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
            case 'in_progress':
            case 'in progress':
                return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
            case 'blocked':
            case 'failed':
                return 'bg-red-500/20 text-red-400 border border-red-500/30';
            default:
                return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
        }
    }
}
