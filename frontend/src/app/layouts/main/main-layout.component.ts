import { Component, ChangeDetectionStrategy, inject, signal, OnInit, OnDestroy, effect } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthState } from '../../core/state/auth.state';
import { NotificationState } from '../../core/state/notification.state';
import { WebSocketService } from '../../core/services/websocket.service';
import { ConfirmModalComponent } from '../../shared/confirm-modal.component';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ConfirmModalComponent],
  template: `
    <div class="min-h-screen flex">
      <aside class="w-60 bg-surface border-r border-border flex flex-col">
        <div class="p-4 border-b border-border">
          <a routerLink="/dashboard" class="text-xl font-bold text-accent">TaskFlow</a>
        </div>
        <nav class="flex-1 p-3 space-y-1">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="bg-accent-soft text-accent font-medium"
              class="flex items-center gap-2 px-3 py-2 rounded-md text-text-muted hover:bg-surface-2 transition-colors"
            >
              <span [innerHTML]="item.icon"></span>
              {{ item.label }}
            </a>
          }
        </nav>
        <div class="p-3 border-t border-border">
          <div class="flex items-center gap-2 px-3 py-2">
            <div class="w-7 h-7 rounded-full bg-accent text-accent-fg flex items-center justify-center text-xs font-bold">
              {{ authState.currentUser()?.name?.charAt(0)?.toUpperCase() || '?' }}
            </div>
            <span class="text-sm truncate flex-1">{{ authState.currentUser()?.name || 'User' }}</span>
          </div>
        </div>
      </aside>
      <div class="flex-1 flex flex-col">
        <header class="h-14 bg-surface border-b border-border flex items-center justify-between px-6">
          <div class="flex items-center gap-2">
            <span class="text-sm text-text-muted">
              {{ authState.currentUser()?.name ? 'Welcome, ' + authState.currentUser()!.name : '' }}
            </span>
          </div>
          <div class="flex items-center gap-3">
            <a routerLink="/notifications" class="relative p-2 text-text-muted hover:text-text transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              @if (notificationState.unreadCount() > 0) {
                <span class="absolute -top-0.5 -right-0.5 bg-danger text-accent-fg text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {{ notificationState.unreadCount() }}
                </span>
              }
            </a>
            <button (click)="onLogout()" class="text-sm text-text-muted hover:text-danger transition-colors">
              Logout
            </button>
          </div>
        </header>
        <main class="flex-1 p-6 overflow-auto">
          <router-outlet />
        </main>
      </div>
    </div>

    @if (showLogoutModal()) {
      <app-confirm-modal
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        [danger]="true"
        (confirm)="onLogoutConfirm()"
        (cancel)="showLogoutModal.set(false)"
      />
    }

    @if (toastMessage()) {
      <div class="fixed bottom-6 right-6 z-50 px-6 py-3 rounded-lg bg-accent text-accent-fg text-sm shadow-lg anim-slide-up">
        {{ toastMessage() }}
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  protected authState = inject(AuthState);
  protected notificationState = inject(NotificationState);
  private webSocket = inject(WebSocketService);
  protected showLogoutModal = signal(false);
  protected toastMessage = signal('');

  constructor() {
    effect(() => {
      const user = this.authState.currentUser();
      if (user) {
        this.webSocket.connect(user.id);
      } else {
        this.webSocket.disconnect();
      }
    });
  }

  ngOnInit() {
    this.notificationState.loadUnreadCount();

    this.webSocket.onNotification.subscribe((notification) => {
      this.notificationState.addNotification(notification);
      this.toastMessage.set(notification.message);
      setTimeout(() => this.toastMessage.set(''), 5000);
    });
  }

  ngOnDestroy() {
    this.webSocket.disconnect();
  }

  protected navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>' },
    { path: '/tasks', label: 'Tasks', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>' },
    { path: '/notifications', label: 'Notifications', icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>' },
  ];

  protected onLogout() {
    this.showLogoutModal.set(true);
  }

  protected onLogoutConfirm() {
    this.showLogoutModal.set(false);
    this.authState.logout();
  }
}
