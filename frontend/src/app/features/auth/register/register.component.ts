import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthState } from '../../../core/state/auth.state';
import { ToastService } from '../../../core/services/toast.service';
import { ApiError } from '../../../core/api/api-error';

@Component({
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="w-full">
      <!-- Header -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-text mb-2">Create your account</h2>
        <p class="text-sm text-text-muted">Get started with TaskFlow in seconds</p>
      </div>

      <!-- Error Alert -->
      @if (error()) {
        <div class="mb-6 flex items-start gap-3 p-4 rounded-lg bg-danger-soft border border-danger/20 text-danger text-sm animate-scale-in">
          <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 0016 8zm3.707-9.293a1 1 0 010 1.414L9 14.414 7.707 13.121a1 1 0 011.414-1.414L8 11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          <span>{{ error() }}</span>
        </div>
      }

      <!-- Form -->
      <form (ngSubmit)="onSubmit()" class="space-y-6" novalidate>
        <!-- Name Field -->
        <div>
          <label for="name" class="block text-sm font-medium text-text mb-2">Full name</label>
          <div class="relative">
            <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg class="w-5 h-5 text-text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <input
              id="name"
              type="text"
              [(ngModel)]="name"
              name="name"
              required
              autocomplete="name"
              class="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-surface dark:bg-surface-2 text-text placeholder:text-text-subtle focus:outline-none focus:shadow-focus transition-all duration-200"
              placeholder="John Doe"
            />
          </div>
        </div>

        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-text mb-2">Email address</label>
          <div class="relative">
            <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg class="w-5 h-5 text-text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <input
              id="email"
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              autocomplete="email"
              class="w-full pl-11 pr-4 py-3 rounded-lg border border-border bg-surface dark:bg-surface-2 text-text placeholder:text-text-subtle focus:outline-none focus:shadow-focus transition-all duration-200"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-text mb-2">Password</label>
          <div class="relative">
            <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg class="w-5 h-5 text-text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <input
              id="password"
              [type]="showPassword() ? 'text' : 'password'"
              [(ngModel)]="password"
              name="password"
              required
              autocomplete="new-password"
              (input)="validatePassword()"
              class="w-full pl-11 pr-11 py-3 rounded-lg border border-border bg-surface dark:bg-surface-2 text-text placeholder:text-text-subtle focus:outline-none focus:shadow-focus transition-all duration-200"
              placeholder="••••••••"
            />
            <button
              type="button"
              (click)="togglePassword()"
              class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-subtle hover:text-text transition-colors"
              [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
            >
              @if (showPassword()) {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-9s4-9 11-9c1.353 0 2.687.27 3.875.75M6.73 6.73A5.99 5.99 0 0012 5c3.314 0 6 2.686 6 3 0 .36-.086.701-.239.99M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              } @else {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              }
            </button>
          </div>

          <!-- Password Requirements -->
          @if (password()) {
            <div class="mt-2 space-y-1">
              <div class="flex items-center gap-2 text-xs">
                <svg class="w-3 h-3 {{ passwordValid() ? 'text-success' : 'text-text-subtle' }}" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                <span class="{{ passwordValid() ? 'text-success' : 'text-text-subtle' }}">
                  At least 8 characters
                </span>
              </div>
            </div>
          }
        </div>

        <!-- Confirm Password Field -->
        <div>
          <label for="passwordConfirmation" class="block text-sm font-medium text-text mb-2">Confirm password</label>
          <div class="relative">
            <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg class="w-5 h-5 text-text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <input
              id="passwordConfirmation"
              [type]="showConfirmPassword() ? 'text' : 'password'"
              [(ngModel)]="passwordConfirmation"
              name="password_confirmation"
              required
              autocomplete="new-password"
              (input)="validatePassword()"
              class="w-full pl-11 pr-11 py-3 rounded-lg border border-border bg-surface dark:bg-surface-2 text-text placeholder:text-text-subtle focus:outline-none focus:shadow-focus transition-all duration-200 {{ passwordsMatch() && passwordConfirmation() ? 'border-success dark:border-success' : '' }}"
              placeholder="••••••••"
            />
            <button
              type="button"
              (click)="toggleConfirmPassword()"
              class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-subtle hover:text-text transition-colors"
              [attr.aria-label]="showConfirmPassword() ? 'Hide password' : 'Show password'"
            >
              @if (showConfirmPassword()) {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-9s4-9 11-9c1.353 0 2.687.27 3.875.75M6.73 6.73A5.99 5.99 0 0012 5c3.314 0 6 2.686 6 3 0 .36-.086.701-.239.99M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              } @else {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              }
            </button>

            <!-- Password Match Indicator -->
            @if (passwordConfirmation() && !passwordsMatch()) {
              <p class="mt-1 text-xs text-danger">Passwords do not match</p>
            }
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          [disabled]="submitting() || !passwordValid() || !passwordsMatch()"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-accent text-accent-fg font-medium hover:bg-accent-hover focus:outline-none focus:shadow-focus transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          @if (submitting()) {
            <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          }
          <span>{{ submitting() ? 'Creating account...' : 'Create account' }}</span>
        </button>
      </form>

      <!-- Sign In Link -->
      <p class="mt-8 text-center text-sm text-text-muted">
        Already have an account?
        <a routerLink="/auth/login" class="font-medium text-accent hover:underline transition-colors">Sign in</a>
      </p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  private authState = inject(AuthState);
  private router = inject(Router);
  private toast = inject(ToastService);

  protected name = signal('');
  protected email = signal('');
  protected password = signal('');
  protected passwordConfirmation = signal('');
  protected showPassword = signal(false);
  protected showConfirmPassword = signal(false);
  protected submitting = signal(false);
  protected error = signal('');

  // Computed for validation
  protected passwordValid = computed(() => this.password().length >= 8);
  protected passwordsMatch = computed(() => this.password() === this.passwordConfirmation() || !this.passwordConfirmation());

  protected togglePassword() {
    this.showPassword.update(v => !v);
  }

  protected toggleConfirmPassword() {
    this.showConfirmPassword.update(v => !v);
  }

  protected validatePassword() {
    // Trigger computed update
  }

  protected onSubmit() {
    if (!this.passwordValid() || !this.passwordsMatch()) {
      this.error.set('Please ensure all fields are valid');
      return;
    }

    this.submitting.set(true);
    this.error.set('');

    this.authState.register(this.name(), this.email(), this.password(), this.passwordConfirmation()).subscribe({
      next: () => {
        this.toast.show('Account created successfully! Please sign in.');
        this.router.navigate(['/auth/login']);
      },
      error: (err: unknown) => {
        this.error.set(this.getErrorMessage(err));
        this.submitting.set(false);
      },
      complete: () => this.submitting.set(false),
    });
  }

  private getErrorMessage(err: unknown): string {
    if (err instanceof ApiError) {
      return err.toToastMessage();
    }
    if (err instanceof Error) {
      return err.message;
    }
    return 'An unexpected error occurred';
  }
}
