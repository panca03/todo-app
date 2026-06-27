import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '@environment';
import { Notification } from '../models/notification.model';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

(window as any).Pusher = Pusher;

@Injectable({ providedIn: 'root' })
export class WebSocketService implements OnDestroy {
  private echo: any = null;
  private notificationSubject = new Subject<Notification>();
  readonly onNotification = this.notificationSubject.asObservable();

  connect(userId: number) {
    if (this.echo) return;

    const token = localStorage.getItem('tf.token');
    if (!token) return;

    this.echo = new Echo({
      broadcaster: 'reverb',
      key: environment.reverb.key,
      wsHost: environment.reverb.host,
      wsPort: environment.reverb.port,
      wssPort: environment.reverb.port,
      forceTLS: environment.reverb.scheme === 'https',
      enabledTransports: ['ws', 'wss'],
      authEndpoint: `${environment.apiBaseUrl.replace('/api', '')}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    this.echo
      .private(`notifications.${userId}`)
      .listen('.NotificationCreated', (data: Notification) => {
        this.notificationSubject.next(data);
      });
  }

  disconnect() {
    if (this.echo) {
      this.echo.disconnect();
      this.echo = null;
    }
  }

  ngOnDestroy() {
    this.disconnect();
  }
}
