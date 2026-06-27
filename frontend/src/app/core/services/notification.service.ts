import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { Notification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private api = inject(ApiService);

  list(): Observable<Notification[]> {
    return this.api.get<Notification[]>('notifications');
  }

  unreadCount(): Observable<{ count: number }> {
    return this.api.get<{ count: number }>('notifications/unread-count');
  }

  markAsRead(id: number): Observable<void> {
    return this.api.patch<void>(`notifications/${id}/read`);
  }

  markAllAsRead(): Observable<void> {
    return this.api.patch<void>('notifications/read-all');
  }
}
