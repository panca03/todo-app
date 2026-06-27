import { Component, ChangeDetectionStrategy, inject, computed, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NotificationState } from '../../core/state/notification.state';

@Component({
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-text">Notifications</h1>
          <p class="text-sm text-text-muted mt-1">
            Stay updated with your task activity
            @if (notificationState.notifications().length > 0) {
              <span class="ml-2 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                {{ unreadCount() }} unread
              </span>
            }
          </p>
        </div>
        @if (notificationState.notifications().length > 0) {
          <button
            (click)="onMarkAllRead()"
            class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border text-text-muted font-medium hover:bg-surface-2 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Mark all as read
          </button>
        }
      </div>

      <!-- Notification List -->
      @if (notificationState.loading()) {
        <div class="space-y-3">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="h-20 rounded-xl bg-surface-2 dark:bg-surface-3 animate-pulse border border-border">
              <div class="p-4 space-y-2">
                <div class="h-4 w-1/3 bg-border rounded"></div>
                <div class="h-3 w-2/3 bg-border rounded"></div>
                <div class="h-2 w-1/4 bg-border rounded"></div>
              </div>
            </div>
          }
        </div>
      } @else if (notificationState.notifications().length === 0) {
        <div class="text-center py-16 bg-surface rounded-xl border border-border">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 dark:bg-accent/20 flex items-center justify-center">
            <svg class="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h10v2H4v-2z"/>
            </svg>
          </div>
          <h3 class="text-base font-medium text-text mb-2">All caught up!</h3>
          <p class="text-sm text-text-muted">You have no notifications at the moment</p>
        </div>
      } @else {
        <div class="space-y-3">
          @for (notif of notificationState.notifications(); track notif.id) {
            <div
              class="group flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer
              {{ notif.is_read ? 'bg-surface border-border hover:border-border-strong' : 'bg-accent/5 border-accent/20 hover:bg-accent/10' }}"
              (click)="onMarkRead(notif)"
            >
              <!-- Icon -->
              <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                {{ notif.is_read ? 'bg-surface-2 text-text-muted' : 'bg-accent/10 text-accent' }}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 17h5l-5 5v-5zM4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h10v2H4v-2z"/>
                </svg>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-3">
                  <h3 class="text-sm font-medium text-text group-hover:text-accent transition-colors">
                    {{ notif.title }}
                  </h3>
                  @if (!notif.is_read) {
                    <span class="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0"></span>
                  }
                </div>
                <p class="text-sm text-text-muted mt-1 line-clamp-2">{{ notif.message }}</p>
                <div class="flex items-center gap-2 mt-2 text-xs text-text-subtle">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6" stroke-linecap="round"/>
                    <line x1="8" y1="2" x2="8" y2="6" stroke-linecap="round"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {{ notif.created_at | date:'dd MMM yyyy, HH:mm' }}
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent implements OnInit {
  protected notificationState = inject(NotificationState);

  protected unreadCount = computed(() =>
    this.notificationState.notifications().filter((n) => !n.is_read).length
  );

  ngOnInit() {
    this.notificationState.loadNotifications();
  }

  protected onMarkRead(notif: any) {
    if (notif.is_read) return;
    this.notificationState.markAsRead(notif.id).subscribe({
      next: () => {
        this.notificationState.loadNotifications();
        this.notificationState.loadUnreadCount();
      },
    });
  }

  protected onMarkAllRead() {
    this.notificationState.markAllAsRead().subscribe({
      next: () => {
        this.notificationState.loadNotifications();
        this.notificationState.loadUnreadCount();
      },
    });
  }
}
