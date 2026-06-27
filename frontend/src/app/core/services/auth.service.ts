import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { User } from '../models/user.model';

interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);

  register(name: string, email: string, password: string, password_confirmation: string): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/register', { name, email, password, password_confirmation });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('auth/login', { email, password });
  }

  logout(): Observable<void> {
    return this.api.post<void>('auth/logout');
  }

  me(): Observable<User> {
    return this.api.get<User>('auth/me');
  }

  getToken(): string | null {
    return localStorage.getItem('tf.token');
  }

  saveToken(token: string): void {
    localStorage.setItem('tf.token', token);
  }

  removeToken(): void {
    localStorage.removeItem('tf.token');
  }
}
