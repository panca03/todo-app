import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthState {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = computed(() => !!this.currentUser());

  initialize() {
    const token = this.authService.getToken();
    if (token) {
      this.authService.me().subscribe({
        next: (user) => this.currentUser.set(user),
        error: () => {
          this.authService.removeToken();
          this.router.navigate(['/auth/login']);
        },
      });
    }
  }

  login(email: string, password: string) {
    return this.authService.login(email, password).pipe(
      tap((res) => {
        this.authService.saveToken(res.token);
        this.currentUser.set(res.user);
        this.router.navigate(['/dashboard']);
      }),
    );
  }

  register(name: string, email: string, password: string, password_confirmation: string) {
    return this.authService.register(name, email, password, password_confirmation);
  }

  logout() {
    this.authService.logout().subscribe({
      complete: () => {
        this.authService.removeToken();
        this.currentUser.set(null);
        this.router.navigate(['/auth/login']);
      },
    });
  }

  loadUser() {
    this.authService.me().subscribe({
      next: (user) => this.currentUser.set(user),
    });
  }
}
