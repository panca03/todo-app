import { Injectable, inject, signal } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationState {
  private notificationService = inject(NotificationService);

  readonly notifications = signal<Notification[]>([]);
  readonly unreadCount = signal(0);
  readonly loading = signal(false);

  loadNotifications() {
    this.loading.set(true);
    this.notificationService.list().subscribe({
      next: (notifications) => {
        this.notifications.set(notifications);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  loadUnreadCount() {
    this.notificationService.unreadCount().subscribe({
      next: (res) => this.unreadCount.set(res.count),
    });
  }

  addNotification(notification: Notification) {
    this.notifications.update((list) => [notification, ...list]);
    this.unreadCount.update((c) => c + 1);
  }

  markAsRead(id: number) {
    return this.notificationService.markAsRead(id);
  }

  markAllAsRead() {
    return this.notificationService.markAllAsRead();
  }
}
